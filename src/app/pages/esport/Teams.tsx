import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TeamApi, TournamentApi, type Team, type TeamRequest, type Tournament } from '../../../lib/esportApi';

const inputStyle = { backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)', color: 'var(--e-text)' };

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

interface TeamsProps {
  isAdmin?: boolean;
}

const Teams: React.FC<TeamsProps> = ({ isAdmin = false }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [tournamentId, setTournamentId] = useState('');

  const tournamentName = (id?: string) => tournaments.find((t) => t.id === id)?.name ?? 'UNASSIGNED';

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [teamList, tPage] = await Promise.all([TeamApi.list(), TournamentApi.list({ size: 50 })]);
      setTeams(teamList);
      setTournaments(tPage.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const body: TeamRequest = { name: name.toUpperCase(), logoUrl: logoUrl || undefined, tournamentId: tournamentId || undefined };
    try {
      await TeamApi.create(body);
      setName('');
      setLogoUrl('');
      setTournamentId('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team?')) return;
    try {
      await TeamApi.remove(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team');
    }
  };

  return (
    <div className="space-y-8 font-sans select-none subpixel-antialiased" style={{ color: 'var(--e-text)' }}>

      {/* HEADER */}
      <div className="border-b pb-4 flex justify-between items-end" style={{ borderColor: 'var(--e-border)' }}>
        <div>
          <h2 className="text-3xl font-black tracking-wider uppercase" style={{ color: 'var(--e-text)' }}>TEAM HUB</h2>
          <p className="text-xs font-mono mt-1 tracking-wide uppercase" style={{ color: 'var(--e-text-muted)' }}>
            [ REGISTER, MANAGE AND COORDINATE YOUR COMPETITIVE TEAMS ]
          </p>
        </div>
        <div className="text-right">
          <span className="block text-[9px] font-mono font-black uppercase" style={{ color: 'var(--e-text-dim)' }}>TOTAL TEAMS</span>
          <span className="text-2xl font-black" style={{ color: 'var(--e-text)' }}>{teams.length}</span>
        </div>
      </div>

      {error && (
        <div className="text-xs font-mono p-3 border rounded-sm" style={{ borderColor: 'var(--e-accent)', color: 'var(--e-accent)' }}>{error}</div>
      )}

      {/* CREATE FORM */}
      {isAdmin && (
        <div className="border p-6 rounded-sm relative overflow-hidden" style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}>
          <div className="absolute top-0 left-0 w-[3px] h-full" style={{ backgroundColor: 'var(--e-accent)' }}></div>
          <h4 className="text-[11px] font-mono font-black tracking-widest uppercase mb-6" style={{ color: 'var(--e-accent)' }}>// 01. REGISTER NEW TEAM</h4>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text" placeholder="TEAM NAME" value={name} onChange={(e) => setName(e.target.value)}
              className="border p-3 text-xs rounded-sm focus:outline-none uppercase font-bold tracking-wider" style={inputStyle}
            />
            <input
              type="text" placeholder="LOGO URL (OPTIONAL)" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
              className="border p-3 text-xs rounded-sm focus:outline-none font-bold tracking-wider" style={inputStyle}
            />
            <select value={tournamentId} onChange={(e) => setTournamentId(e.target.value)} className="border p-3 text-xs rounded-sm focus:outline-none font-bold uppercase tracking-wider" style={inputStyle}>
              <option value="">NO TOURNAMENT</option>
              {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button type="submit" className="font-black text-xs py-3 tracking-widest uppercase transition-all rounded-sm" style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}>
              CREATE TEAM
            </button>
          </form>
        </div>
      )}

      {/* TEAMS GRID */}
      {loading ? (
        <div className="text-xs font-mono" style={{ color: 'var(--e-text-dim)' }}>Loading teams...</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={gridVariants}
          initial="hidden"
          animate="show"
        >
          {teams.map((team) => (
            <motion.div
              key={team.id}
              variants={cardVariants}
              whileHover={{ y: -4, borderColor: 'var(--e-accent)' }}
              className="border p-5 rounded-sm group transition-colors"
              style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-black uppercase tracking-wide" style={{ color: 'var(--e-text)' }}>{team.name}</h4>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm" style={{ color: 'var(--e-success)', backgroundColor: 'rgba(34,197,94,0.1)' }}>● ACTIVE</span>
              </div>

              <div className="space-y-3 font-mono text-[10px]">
                <div className="flex justify-between border-b pb-1" style={{ borderColor: 'var(--e-border)' }}>
                  <span className="uppercase font-bold" style={{ color: 'var(--e-text-dim)' }}>ROSTER SIZE</span>
                  <span className="font-bold" style={{ color: 'var(--e-text)' }}>{team.playerIds?.length ?? 0} PLAYERS</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase font-bold" style={{ color: 'var(--e-text-dim)' }}>TOURNAMENT</span>
                  <span className="font-bold" style={{ color: 'var(--e-text-muted)' }}>{tournamentName(team.tournamentId)}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button className="flex-1 border py-2 text-[10px] font-black uppercase transition-all rounded-sm" style={{ borderColor: 'var(--e-border)', color: 'var(--e-text)' }}>
                  VIEW ROSTER
                </button>
                {isAdmin && (
                  <button onClick={() => handleDelete(team.id)} className="px-3 border text-[10px] uppercase font-black transition-all rounded-sm" style={{ borderColor: 'var(--e-border)', color: 'var(--e-accent)' }}>
                    X
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {teams.length === 0 && <div className="text-xs font-mono col-span-full text-center py-8" style={{ color: 'var(--e-text-dim)' }}>No teams registered yet.</div>}
        </motion.div>
      )}
    </div>
  );
};

export default Teams;
