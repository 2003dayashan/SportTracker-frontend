import React, { useEffect, useState } from 'react';
import { TournamentApi, TeamApi, BracketApi, type Tournament, type Team, type Match } from '../../../lib/esportApi';

interface BracketsProps {
  tournamentId?: string;
}

const Brackets: React.FC<BracketsProps> = ({ tournamentId }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedId, setSelectedId] = useState(tournamentId ?? '');
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const teamName = (id: string) => teams.find((t) => t.id === id)?.name ?? id;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [tPage, teamList] = await Promise.all([TournamentApi.list({ size: 50 }), TeamApi.list()]);
        setTournaments(tPage.content);
        setTeams(teamList);
        if (!tournamentId && tPage.content.length > 0) {
          setSelectedId(tPage.content[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bracket data');
      } finally {
        setLoading(false);
      }
    })();
  }, [tournamentId]);

  useEffect(() => {
    if (!selectedId) return;
    setMatchesLoading(true);
    BracketApi.get(selectedId)
      .then(setMatches)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load bracket'))
      .finally(() => setMatchesLoading(false));
  }, [selectedId]);

  // Split matches: last scheduled match = final, rest = earlier rounds.
  const sorted = [...matches].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const finalMatch = sorted.length > 0 ? sorted[sorted.length - 1] : null;
  const earlierMatches = finalMatch ? sorted.slice(0, -1) : [];

  const scoreDisplay = (m: Match, side: 'A' | 'B') => {
    if (m.status === 'SCHEDULED') return '-';
    return side === 'A' ? m.scoreA : m.scoreB;
  };
  const isWinner = (m: Match, teamId: string) => m.status === 'COMPLETED' && m.winnerId === teamId;

  return (
    <div className="space-y-8 font-sans select-none subpixel-antialiased" style={{ color: 'var(--e-text)' }}>

      {/* HEADER */}
      <div className="border-b pb-4" style={{ borderColor: 'var(--e-border)' }}>
        <h2 className="text-3xl font-black tracking-wider uppercase" style={{ color: 'var(--e-text)' }}>TOURNAMENT BRACKETS</h2>
        <p className="text-xs font-mono mt-1 tracking-wide uppercase" style={{ color: 'var(--e-text-muted)' }}>
          [ TRACK MATCH PROGRESSION AND SEE WHO IS WINNING ]
        </p>
      </div>

      {error && (
        <div className="text-xs font-mono p-3 border rounded-sm" style={{ borderColor: 'var(--e-accent)', color: 'var(--e-accent)' }}>{error}</div>
      )}

      {!tournamentId && (
        <div className="space-y-1.5 max-w-sm">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>TOURNAMENT</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full border p-3 text-xs rounded-sm focus:outline-none font-bold uppercase tracking-wider"
            style={{ backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)', color: 'var(--e-text)' }}
          >
            {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      )}

      {/* BRACKET */}
      <div className="border p-8 rounded-sm overflow-x-auto" style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}>
        {loading || matchesLoading ? (
          <div className="text-xs font-mono" style={{ color: 'var(--e-text-dim)' }}>Loading bracket...</div>
        ) : matches.length === 0 ? (
          <div className="text-xs font-mono py-6 text-center" style={{ color: 'var(--e-text-dim)' }}>No matches scheduled for this tournament yet.</div>
        ) : (
          <div className="flex items-start min-w-[700px] justify-start gap-12 relative">

            {/* EARLIER ROUNDS */}
            {earlierMatches.length > 0 && (
              <div className="w-[280px] flex flex-col gap-6 relative z-10">
                <div className="text-[11px] font-mono font-black tracking-widest uppercase border-b pb-1 mb-2" style={{ color: 'var(--e-accent)', borderColor: 'var(--e-border)' }}>
                  // 01. MATCHES
                </div>

                {earlierMatches.map((match) => (
                  <div key={match.id} className="border rounded-sm transition-all overflow-hidden" style={{ backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)' }}>
                    <div
                      className="flex justify-between items-center px-4 py-2.5 border-b"
                      style={{ borderColor: 'var(--e-card)', backgroundColor: isWinner(match, match.teamAId) ? 'var(--e-accent-soft)' : 'transparent' }}
                    >
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: isWinner(match, match.teamAId) ? 'var(--e-accent)' : 'var(--e-text-muted)' }}>
                        {teamName(match.teamAId)}
                      </span>
                      <span className="font-mono text-xs font-black px-2" style={{ color: isWinner(match, match.teamAId) ? 'var(--e-accent)' : 'var(--e-text-dim)' }}>
                        {scoreDisplay(match, 'A')}
                      </span>
                    </div>
                    <div
                      className="flex justify-between items-center px-4 py-2.5"
                      style={{ backgroundColor: isWinner(match, match.teamBId) ? 'var(--e-accent-soft)' : 'transparent' }}
                    >
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: isWinner(match, match.teamBId) ? 'var(--e-accent)' : 'var(--e-text-muted)' }}>
                        {teamName(match.teamBId)}
                      </span>
                      <span className="font-mono text-xs font-black px-2" style={{ color: isWinner(match, match.teamBId) ? 'var(--e-accent)' : 'var(--e-text-dim)' }}>
                        {scoreDisplay(match, 'B')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FINAL */}
            {finalMatch && (
              <div className="w-[280px] flex flex-col justify-center relative z-10 pt-8">
                <div className="text-[11px] font-mono font-black tracking-widest uppercase border-b pb-1 mb-6" style={{ color: 'var(--e-warning)', borderColor: 'var(--e-border)' }}>
                  // 02. {earlierMatches.length > 0 ? 'GRAND FINAL' : 'MATCH'}
                </div>

                <div
                  className="border-2 rounded-sm overflow-hidden relative"
                  style={{ backgroundColor: 'var(--e-bg)', borderColor: finalMatch.status !== 'SCHEDULED' ? 'var(--e-accent)' : 'var(--e-border)' }}
                >
                  <div className="font-mono font-black text-[9px] tracking-widest px-2 py-0.5 uppercase text-center" style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}>
                    {finalMatch.status === 'SCHEDULED' ? 'MATCH NOT STARTED YET' : finalMatch.status}
                  </div>

                  <div className="flex justify-between items-center px-4 py-3 border-b" style={{ borderColor: 'var(--e-card)' }}>
                    <span className="text-xs font-black tracking-wide uppercase" style={{ color: 'var(--e-text)' }}>{teamName(finalMatch.teamAId)}</span>
                    <span className="font-mono text-xs font-black px-2 rounded-sm" style={{ color: 'var(--e-text-muted)', backgroundColor: 'var(--e-card)' }}>
                      {scoreDisplay(finalMatch, 'A')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-xs font-black tracking-wide uppercase" style={{ color: 'var(--e-text)' }}>{teamName(finalMatch.teamBId)}</span>
                    <span className="font-mono text-xs font-black px-2 rounded-sm" style={{ color: 'var(--e-text-muted)', backgroundColor: 'var(--e-card)' }}>
                      {scoreDisplay(finalMatch, 'B')}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
};

export default Brackets;