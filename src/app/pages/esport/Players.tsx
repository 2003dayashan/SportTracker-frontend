import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PlayerApi, TeamApi, type Player, type PlayerRequest, type Team } from '../../../lib/esportApi';

const inputStyle = { backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)', color: 'var(--e-text)' };

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

interface PlayersProps {
  isAdmin?: boolean;
}

const Players: React.FC<PlayersProps> = ({ isAdmin = false }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Entry Fragger');
  const [teamId, setTeamId] = useState('');

  const teamName = (id?: string) => teams.find((t) => t.id === id)?.name ?? 'UNASSIGNED';
  const statVal = (p: Player, key: string) => {
    const v = p.stats?.[key];
    return v === undefined || v === null || v === '' ? 'N/A' : String(v);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [playerList, teamList] = await Promise.all([PlayerApi.list(), TeamApi.list()]);
      setPlayers(playerList);
      setTeams(teamList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    const body: PlayerRequest = { username, role, teamId: teamId || undefined };
    try {
      await PlayerApi.create(body);
      setUsername('');
      setRole('Entry Fragger');
      setTeamId('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create player');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this player?')) return;
    try {
      await PlayerApi.remove(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete player');
    }
  };

  return (
    <div className="space-y-8 font-sans select-none subpixel-antialiased" style={{ color: 'var(--e-text)' }}>

      {/* HEADER */}
      <div className="border-b pb-4 flex justify-between items-end" style={{ borderColor: 'var(--e-border)' }}>
        <div>
          <h2 className="text-3xl font-black tracking-wider uppercase" style={{ color: 'var(--e-text)' }}>PLAYER ROSTER</h2>
          <p className="text-xs font-mono mt-1 tracking-wide uppercase" style={{ color: 'var(--e-text-muted)' }}>
            [ REGISTER AND MONITOR INDIVIDUAL PRO PLAYERS ]
          </p>
        </div>
        <div className="text-right font-mono">
          <span className="block text-[9px] font-black uppercase tracking-wider" style={{ color: 'var(--e-text-dim)' }}>ACTIVE PLAYERS</span>
          <span className="text-2xl font-black" style={{ color: 'var(--e-text)' }}>{players.length}</span>
        </div>
      </div>

      {error && (
        <div className="text-xs font-mono p-3 border rounded-sm" style={{ borderColor: 'var(--e-accent)', color: 'var(--e-accent)' }}>{error}</div>
      )}

      {/* CREATE FORM */}
      {isAdmin && (
        <div className="border p-6 rounded-sm relative overflow-hidden" style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}>
          <div className="absolute top-0 left-0 w-[3px] h-full" style={{ backgroundColor: 'var(--e-accent)' }}></div>
          <h4 className="text-[11px] font-mono font-black tracking-widest uppercase mb-6" style={{ color: 'var(--e-accent)' }}>// 01. ADD NEW PLAYER</h4>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>GAMER TAG</label>
              <input type="text" placeholder="e.g., GHOST_PROTO" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none uppercase font-bold tracking-wider" style={inputStyle} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>IN-GAME ROLE</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none uppercase font-bold tracking-wider" style={inputStyle}>
                <option>Entry Fragger</option>
                <option>Flanker / Scout</option>
                <option>Support / Anchor</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>TEAM</label>
              <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none uppercase font-bold tracking-wider" style={inputStyle}>
                <option value="">UNASSIGNED</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <button type="submit" className="font-black text-xs py-3.5 tracking-widest uppercase transition-all rounded-sm" style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}>
              REGISTER PLAYER
            </button>
          </form>
        </div>
      )}

      {/* GRID */}
      {loading ? (
        <div className="text-xs font-mono" style={{ color: 'var(--e-text-dim)' }}>Loading players...</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={gridVariants}
          initial="hidden"
          animate="show"
        >
          {players.map((player) => (
            <motion.div
              key={player.id}
              variants={cardVariants}
              whileHover={{ y: -4, borderColor: 'var(--e-accent)' }}
              className="border p-5 rounded-sm group transition-colors"
              style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-wider block" style={{ color: 'var(--e-accent)' }}>{teamName(player.teamId)}</span>
                  <h4 className="text-xl font-black uppercase tracking-wide mt-0.5" style={{ color: 'var(--e-text)' }}>{player.username}</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 font-mono text-[11px] mt-6 pt-4 border-t" style={{ borderColor: 'var(--e-bg)' }}>
                <div>
                  <span className="block text-[9px] font-black tracking-wider uppercase" style={{ color: 'var(--e-text-dim)' }}>IN-GAME ROLE</span>
                  <span className="font-bold" style={{ color: 'var(--e-text)' }}>{player.role}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black tracking-wider uppercase" style={{ color: 'var(--e-text-dim)' }}>K/D RATIO</span>
                  <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--e-text)' }}>{statVal(player, 'kd')}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black tracking-wider uppercase" style={{ color: 'var(--e-text-dim)' }}>CURRENT RANK</span>
                  <span className="font-black" style={{ color: 'var(--e-warning)' }}>{statVal(player, 'rank')}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black tracking-wider uppercase" style={{ color: 'var(--e-text-dim)' }}>PLAYER ID</span>
                  <span className="font-bold truncate" style={{ color: 'var(--e-text-muted)' }} title={player.id}>{player.id.slice(0, 8)}...</span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button className="flex-1 border py-2 text-[10px] font-black uppercase transition-all rounded-sm" style={{ borderColor: 'var(--e-border)', color: 'var(--e-text)' }}>
                  VIEW STATS
                </button>
                {isAdmin && (
                  <button onClick={() => handleDelete(player.id)} className="px-3 border text-[10px] font-black uppercase transition-all rounded-sm" style={{ borderColor: 'var(--e-border)', color: 'var(--e-accent)' }}>
                    X
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {players.length === 0 && <div className="text-xs font-mono col-span-full text-center py-8" style={{ color: 'var(--e-text-dim)' }}>No players registered yet.</div>}
        </motion.div>
      )}
    </div>
  );
};

export default Players;
