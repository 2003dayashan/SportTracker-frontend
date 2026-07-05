import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TournamentApi, StandingsApi, type Tournament, type StandingDto } from '../../../lib/esportApi';

const podiumContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const podiumItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const rowContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const rowItem = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

interface LeaderboardProps {
  tournamentId?: string;
}

const podiumAvatars = ['🥷', '💀', '🤖'];

const Leaderboard: React.FC<LeaderboardProps> = ({ tournamentId }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedId, setSelectedId] = useState(tournamentId ?? '');
  const [standings, setStandings] = useState<StandingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const tPage = await TournamentApi.list({ size: 50 });
        setTournaments(tPage.content);
        if (!tournamentId && tPage.content.length > 0) {
          setSelectedId(tPage.content[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tournaments');
      } finally {
        setLoading(false);
      }
    })();
  }, [tournamentId]);

  useEffect(() => {
    if (!selectedId) return;
    setStandingsLoading(true);
    StandingsApi.get(selectedId)
      .then(setStandings)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load standings'))
      .finally(() => setStandingsLoading(false));
  }, [selectedId]);

  const sorted = [...standings].sort((a, b) => b.points - a.points);
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const winRate = (s: StandingDto) => (s.played > 0 ? `${((s.wins / s.played) * 100).toFixed(1)}%` : 'N/A');

  // Order for visual podium: [2nd, 1st, 3rd]
  const podiumOrdered = [podium[1], podium[0], podium[2]].filter(Boolean) as StandingDto[];

  return (
    <div className="space-y-8 font-sans select-none subpixel-antialiased" style={{ color: 'var(--e-text)' }}>

      {/* TOP SUB-HEADER */}
      <div className="border px-4 py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-mono rounded-sm" style={{ backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)' }}>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--e-accent)' }}></span>
          <span className="font-black tracking-wider uppercase" style={{ color: 'var(--e-text)' }}>STANDINGS</span>
        </div>

        {!tournamentId && (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="border p-2 text-xs rounded-sm font-bold uppercase tracking-wider"
            style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)', color: 'var(--e-text)' }}
          >
            {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        )}
      </div>

      {error && (
        <div className="text-xs font-mono p-3 border rounded-sm" style={{ borderColor: 'var(--e-accent)', color: 'var(--e-accent)' }}>{error}</div>
      )}

      {loading || standingsLoading ? (
        <div className="text-xs font-mono" style={{ color: 'var(--e-text-dim)' }}>Loading standings...</div>
      ) : standings.length === 0 ? (
        <div className="text-xs font-mono py-8 text-center" style={{ color: 'var(--e-text-dim)' }}>No standings recorded for this tournament yet.</div>
      ) : (
        <>
          {/* PODIUM */}
          <motion.div
            className="flex flex-col md:flex-row justify-center items-end gap-6 pt-6"
            variants={podiumContainer}
            initial="hidden"
            animate="show"
          >
            {podiumOrdered.map((team, idx) => {
              const rank = sorted.indexOf(team) + 1;
              const isMain = rank === 1;
              return (
                <motion.div
                  key={team.teamId}
                  variants={podiumItem}
                  whileHover={{ y: -6 }}
                  className="w-full md:w-[260px] border rounded-sm p-6 text-center relative transition-colors duration-300"
                  style={
                    isMain
                      ? { backgroundColor: 'var(--e-card)', borderColor: 'var(--e-accent)', boxShadow: '0 0 20px rgba(255,70,85,0.12)' }
                      : { backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }
                  }
                >
                  <span
                    className="absolute top-3 left-1/2 transform -translate-x-1/2 font-mono font-black text-[10px] px-2 py-0.5 rounded-sm"
                    style={isMain ? { backgroundColor: 'var(--e-accent)', color: '#000' } : { backgroundColor: 'var(--e-bg)', color: 'var(--e-text-muted)', border: '1px solid var(--e-border)' }}
                  >
                    #{rank}
                  </span>

                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mt-4 mb-4 border-2"
                    style={{ backgroundColor: 'var(--e-bg)', borderColor: isMain ? 'var(--e-accent)' : 'var(--e-border)' }}
                  >
                    {podiumAvatars[idx] ?? '🎮'}
                  </div>

                  <h3 className="text-base font-black tracking-wide uppercase mb-3" style={{ color: 'var(--e-text)' }}>{team.teamName}</h3>

                  <div className="grid grid-cols-2 gap-2 border p-2.5 rounded-sm font-mono text-[10px]" style={{ backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)' }}>
                    <div>
                      <span className="block font-black uppercase" style={{ color: 'var(--e-text-dim)' }}>WIN RATE</span>
                      <span className="font-bold" style={{ color: isMain ? 'var(--e-accent)' : 'var(--e-text)' }}>{winRate(team)}</span>
                    </div>
                    <div className="border-l" style={{ borderColor: 'var(--e-border)' }}>
                      <span className="block font-black uppercase" style={{ color: 'var(--e-text-dim)' }}>POINTS</span>
                      <span className="font-bold" style={{ color: 'var(--e-text)' }}>{team.points}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* TABLE */}
          {rest.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b pb-3 gap-4" style={{ borderColor: 'var(--e-border)' }}>
                <div>
                  <h2 className="text-2xl font-black tracking-wider uppercase" style={{ color: 'var(--e-text)' }}>CHALLENGERS</h2>
                  <p className="text-[10px] font-mono tracking-wide uppercase mt-0.5" style={{ color: 'var(--e-text-muted)' }}>
                    RANKED TEAMS | LIVE STANDINGS
                  </p>
                </div>
              </div>

              <motion.div className="space-y-3" variants={rowContainer} initial="hidden" animate="show">
                {rest.map((row) => {
                  const rank = sorted.indexOf(row) + 1;
                  return (
                    <motion.div
                      key={row.teamId}
                      variants={rowItem}
                      whileHover={{ x: 4, borderColor: 'var(--e-accent)' }}
                      className="border p-4 rounded-sm flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors"
                      style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
                    >
                      <div className="flex items-center gap-6 w-full sm:w-auto justify-start">
                        <span className="font-mono font-black text-sm w-6" style={{ color: 'var(--e-text-dim)' }}>{String(rank).padStart(2, '0')}</span>
                        <span className="text-xs font-black tracking-wide uppercase" style={{ color: 'var(--e-text)' }}>{row.teamName}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-6 sm:gap-12 font-mono text-center sm:text-right text-[11px] w-full sm:w-auto">
                        <div>
                          <span className="block text-[9px] font-black tracking-wider uppercase mb-0.5" style={{ color: 'var(--e-text-dim)' }}>W / L</span>
                          <span className="font-bold" style={{ color: 'var(--e-text)' }}>{row.wins} / {row.losses}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-black tracking-wider uppercase mb-0.5" style={{ color: 'var(--e-text-dim)' }}>PLAYED</span>
                          <span className="font-bold" style={{ color: 'var(--e-text)' }}>{row.played}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-black tracking-wider uppercase mb-0.5" style={{ color: 'var(--e-text-dim)' }}>POINTS</span>
                          <span className="font-black text-xs tracking-wide" style={{ color: 'var(--e-text)' }}>{row.points}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
