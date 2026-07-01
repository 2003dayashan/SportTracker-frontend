import React, { useEffect, useState } from 'react';
import {
  TournamentApi,
  TeamApi,
  PlayerApi,
  MatchApi,
  DashboardApi,
  type Tournament,
  type TournamentRequest,
  type TournamentStatus,
  type Team,
  type TeamRequest,
  type Player,
  type PlayerRequest,
  type Match,
  type DashboardStats,
} from '../../../lib/esportApi';

// Shared style helpers
const cardStyle = { backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)' };
const panelStyle = { backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' };
const inputStyle = { backgroundColor: 'var(--e-input-bg)', borderColor: 'var(--e-border)', color: 'var(--e-text)' };

// ==========================================
// 1. TOURNAMENTS PANEL (CRUD)
// ==========================================
const TournamentPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [format, setFormat] = useState<'SINGLE_ELIMINATION' | 'ROUND_ROBIN'>('SINGLE_ELIMINATION');
  const [maxTeams, setMaxTeams] = useState('8');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await TournamentApi.list({ size: 50 });
      setTournaments(page.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setName('');
    setGame('');
    setFormat('SINGLE_ELIMINATION');
    setMaxTeams('8');
    setStartDate('');
    setEndDate('');
    setEditId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !game || !startDate || !endDate) return;
    const body: TournamentRequest = {
      name: name.toUpperCase(),
      game,
      format,
      status: 'UPCOMING',
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      maxTeams: Number(maxTeams) || 8,
    };
    try {
      if (editId !== null) {
        await TournamentApi.update(editId, body);
      } else {
        await TournamentApi.create(body);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tournament');
    }
  };

  const cycleStatus = async (t: Tournament) => {
    const next: TournamentStatus = t.status === 'UPCOMING' ? 'ONGOING' : t.status === 'ONGOING' ? 'COMPLETED' : 'UPCOMING';
    try {
      await TournamentApi.update(t.id, {
        name: t.name,
        game: t.game,
        format: t.format,
        status: next,
        startDate: t.startDate,
        endDate: t.endDate,
        maxTeams: t.maxTeams,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tournament?')) return;
    try {
      await TournamentApi.remove(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tournament');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <button onClick={onBack} className="text-xs font-mono hover:underline" style={{ color: 'var(--e-accent)' }}>← BACK TO DASHBOARD</button>
      <div className="p-6 border rounded-sm" style={cardStyle}>
        <h3 className="text-xl font-black uppercase mb-4" style={{ color: 'var(--e-text)' }}>🏆 TOURNAMENT MANAGER</h3>
        {error && <div className="mb-4 text-xs font-mono" style={{ color: 'var(--e-accent)' }}>{error}</div>}
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 border font-mono text-xs" style={panelStyle}>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>TOURNAMENT NAME</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="border p-2 outline-none" style={inputStyle} placeholder="E.g., STICK CHAMPIONSHIP" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>GAME TITLE</label>
            <input type="text" value={game} onChange={e => setGame(e.target.value)} className="border p-2 outline-none" style={inputStyle} placeholder="E.g., Valorant" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>FORMAT</label>
            <select value={format} onChange={e => setFormat(e.target.value as 'SINGLE_ELIMINATION' | 'ROUND_ROBIN')} className="border p-2 outline-none" style={inputStyle}>
              <option value="SINGLE_ELIMINATION">KNOCKOUT</option>
              <option value="ROUND_ROBIN">LEAGUE</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>MAX TEAMS</label>
            <input type="number" min={2} value={maxTeams} onChange={e => setMaxTeams(e.target.value)} className="border p-2 outline-none" style={inputStyle} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>START DATE</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 outline-none" style={inputStyle} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>END DATE</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 outline-none" style={inputStyle} />
          </div>
          <div className="flex items-end sm:col-span-3">
            <button type="submit" className="w-full font-black p-2 transition-colors uppercase" style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}>
              {editId !== null ? 'UPDATE EVENT' : 'CREATE EVENT'}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-xs font-mono" style={{ color: 'var(--e-text-dim)' }}>Loading tournaments...</div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            {tournaments.map(t => (
              <div key={t.id} className="border p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3" style={panelStyle}>
                <div>
                  <h4 className="font-black uppercase" style={{ color: 'var(--e-text)' }}>{t.name}</h4>
                  <span className="text-[10px]" style={{ color: 'var(--e-text-dim)' }}>
                    GAME: <span style={{ color: 'var(--e-text-muted)' }}>{t.game}</span> · {t.teamIds.length}/{t.maxTeams} TEAMS
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => cycleStatus(t)}
                    className="px-2 py-0.5 text-[10px] font-bold border"
                    style={
                      t.status === 'ONGOING'
                        ? { backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--e-success)', borderColor: 'var(--e-success)' }
                        : t.status === 'COMPLETED'
                        ? { backgroundColor: 'var(--e-bg)', color: 'var(--e-text-dim)', borderColor: 'var(--e-border)' }
                        : { backgroundColor: 'rgba(234,179,8,0.1)', color: 'var(--e-warning)', borderColor: 'var(--e-warning)' }
                    }
                  >
                    {t.status}
                  </button>
                  <button
                    onClick={() => {
                      setEditId(t.id);
                      setName(t.name);
                      setGame(t.game);
                      setFormat(t.format);
                      setMaxTeams(String(t.maxTeams));
                      setStartDate(t.startDate?.slice(0, 10) ?? '');
                      setEndDate(t.endDate?.slice(0, 10) ?? '');
                    }}
                    className="font-bold hover:opacity-80"
                    style={{ color: '#60A5FA' }}
                  >
                    EDIT
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="font-bold hover:opacity-80" style={{ color: 'var(--e-accent)' }}>DELETE</button>
                </div>
              </div>
            ))}
            {tournaments.length === 0 && <div style={{ color: 'var(--e-text-dim)' }}>No tournaments yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. MATCHES PANEL (CRUD)
// ==========================================
const MatchesPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tournamentId, setTournamentId] = useState('');
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const teamName = (id: string) => teams.find(t => t.id === id)?.name ?? id;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tPage, teamList] = await Promise.all([TournamentApi.list({ size: 50 }), TeamApi.list()]);
      setTournaments(tPage.content);
      setTeams(teamList);
      // Fetch matches per tournament via the bracket endpoint (no list-all endpoint exists)
      const results = await Promise.all(
        tPage.content.map(t =>
          fetch(`${(import.meta as any).env.VITE_API_URL || 'http://localhost:8080'}/api/tournaments/${t.id}/bracket`, { credentials: 'include' })
            .then(r => (r.ok ? r.json() : []))
            .catch(() => [])
        )
      );
      setMatches(results.flat());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId || !teamAId || !teamBId || !scheduledAt || teamAId === teamBId) return;
    try {
      await MatchApi.create({
        tournamentId,
        teamAId,
        teamBId,
        scoreA: 0,
        scoreB: 0,
        winnerId: null,
        status: 'SCHEDULED',
        scheduledAt: new Date(scheduledAt).toISOString(),
        completedAt: null,
      });
      setTournamentId('');
      setTeamAId('');
      setTeamBId('');
      setScheduledAt('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create match');
    }
  };

  const toggleLive = async (m: Match) => {
    try {
      await MatchApi.updateScore(m.id, { scoreA: m.scoreA, scoreB: m.scoreB });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update match');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <button onClick={onBack} className="text-xs font-mono hover:underline" style={{ color: 'var(--e-accent)' }}>← BACK TO DASHBOARD</button>
      <div className="p-6 border rounded-sm" style={cardStyle}>
        <h3 className="text-xl font-black uppercase mb-4" style={{ color: 'var(--e-text)' }}>⚔️ MATCH SCHEDULER</h3>
        {error && <div className="mb-4 text-xs font-mono" style={{ color: 'var(--e-accent)' }}>{error}</div>}
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 p-4 border font-mono text-xs" style={panelStyle}>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>TOURNAMENT</label>
            <select value={tournamentId} onChange={e => setTournamentId(e.target.value)} className="border p-2 outline-none" style={inputStyle}>
              <option value="">Select</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>TEAM A</label>
            <select value={teamAId} onChange={e => setTeamAId(e.target.value)} className="border p-2 outline-none" style={inputStyle}>
              <option value="">Select</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>TEAM B</label>
            <select value={teamBId} onChange={e => setTeamBId(e.target.value)} className="border p-2 outline-none" style={inputStyle}>
              <option value="">Select</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>SCHEDULE TIME</label>
            <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="border p-2 outline-none" style={inputStyle} />
          </div>
          <div className="flex items-end sm:col-span-4">
            <button type="submit" className="w-full font-black p-2 transition-colors uppercase" style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}>
              SCHEDULE MATCH
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-xs font-mono" style={{ color: 'var(--e-text-dim)' }}>Loading matches...</div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            {matches.map(m => (
              <div key={m.id} className="border p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3" style={panelStyle}>
                <div>
                  <h4 className="font-black uppercase" style={{ color: 'var(--e-text)' }}>{teamName(m.teamAId)} VS {teamName(m.teamBId)}</h4>
                  <span className="text-[10px]" style={{ color: 'var(--e-text-dim)' }}>
                    TIME: <span style={{ color: 'var(--e-text-muted)' }}>{new Date(m.scheduledAt).toLocaleString()}</span> · SCORE: {m.scoreA} - {m.scoreB}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold border"
                    style={
                      m.status === 'LIVE'
                        ? { backgroundColor: 'rgba(255,70,85,0.1)', color: 'var(--e-accent)', borderColor: 'var(--e-accent)' }
                        : m.status === 'COMPLETED'
                        ? { backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--e-success)', borderColor: 'var(--e-success)' }
                        : { backgroundColor: 'var(--e-bg)', color: 'var(--e-text-dim)', borderColor: 'var(--e-border)' }
                    }
                  >
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
            {matches.length === 0 && <div style={{ color: 'var(--e-text-dim)' }}>No matches yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. TEAMS PANEL (CRUD)
// ==========================================
const TeamsPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [teamName, setTeamName] = useState('');
  const [tournamentId, setTournamentId] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

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

  const resetForm = () => {
    setTeamName('');
    setTournamentId('');
    setLogoUrl('');
    setEditId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;
    const body: TeamRequest = { name: teamName.toUpperCase(), tournamentId: tournamentId || undefined, logoUrl: logoUrl || undefined };
    try {
      if (editId !== null) {
        await TeamApi.update(editId, body);
      } else {
        await TeamApi.create(body);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save team');
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
    <div className="space-y-6 animate-fadeIn">
      <button onClick={onBack} className="text-xs font-mono hover:underline" style={{ color: 'var(--e-accent)' }}>← BACK TO DASHBOARD</button>
      <div className="p-6 border rounded-sm" style={cardStyle}>
        <h3 className="text-xl font-black uppercase mb-4" style={{ color: 'var(--e-text)' }}>👥 TEAM ROSTER MANAGER</h3>
        {error && <div className="mb-4 text-xs font-mono" style={{ color: 'var(--e-accent)' }}>{error}</div>}
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 border font-mono text-xs" style={panelStyle}>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>TEAM SQUAD NAME</label>
            <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} className="border p-2 outline-none" style={inputStyle} placeholder="E.g., CYBER DRIFTERS" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>TOURNAMENT</label>
            <select value={tournamentId} onChange={e => setTournamentId(e.target.value)} className="border p-2 outline-none" style={inputStyle}>
              <option value="">Unassigned</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>LOGO URL</label>
            <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="border p-2 outline-none" style={inputStyle} placeholder="https://..." />
          </div>
          <div className="flex items-end sm:col-span-3">
            <button type="submit" className="w-full font-black p-2 transition-colors uppercase" style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}>
              {editId !== null ? 'UPDATE ROSTER' : 'REGISTER TEAM'}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-xs font-mono" style={{ color: 'var(--e-text-dim)' }}>Loading teams...</div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            {teams.map(t => (
              <div key={t.id} className="border p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3" style={panelStyle}>
                <div>
                  <h4 className="font-black uppercase" style={{ color: 'var(--e-text)' }}>{t.name}</h4>
                  <span className="text-[10px]" style={{ color: 'var(--e-text-dim)' }}>
                    SQUAD: <span style={{ color: 'var(--e-accent)' }}>{t.playerIds.length} PLAYERS</span>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setEditId(t.id);
                      setTeamName(t.name);
                      setTournamentId(t.tournamentId ?? '');
                      setLogoUrl(t.logoUrl ?? '');
                    }}
                    className="font-bold hover:opacity-80"
                    style={{ color: '#60A5FA' }}
                  >
                    EDIT
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="font-bold hover:opacity-80" style={{ color: 'var(--e-accent)' }}>DELETE</button>
                </div>
              </div>
            ))}
            {teams.length === 0 && <div style={{ color: 'var(--e-text-dim)' }}>No teams yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. PLAYERS PANEL (CRUD)
// ==========================================
const PlayersPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [teamId, setTeamId] = useState('');
  const [role, setRole] = useState('Entry Fragger');
  const [editId, setEditId] = useState<string | null>(null);

  const teamName = (id: string) => teams.find(t => t.id === id)?.name ?? '—';

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

  const resetForm = () => {
    setUsername('');
    setTeamId('');
    setRole('Entry Fragger');
    setEditId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    const body: PlayerRequest = { username, teamId: teamId || undefined, role };
    try {
      if (editId !== null) {
        await PlayerApi.update(editId, body);
      } else {
        await PlayerApi.create(body);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save player');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this player?')) return;
    try {
      await PlayerApi.remove(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete player');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <button onClick={onBack} className="text-xs font-mono hover:underline" style={{ color: 'var(--e-accent)' }}>← BACK TO DASHBOARD</button>
      <div className="p-6 border rounded-sm" style={cardStyle}>
        <h3 className="text-xl font-black uppercase mb-4" style={{ color: 'var(--e-text)' }}>👤 PLAYER ACCOUNT REGISTRY</h3>
        {error && <div className="mb-4 text-xs font-mono" style={{ color: 'var(--e-accent)' }}>{error}</div>}
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 p-4 border font-mono text-xs" style={panelStyle}>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>USERNAME</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="border p-2 outline-none" style={inputStyle} placeholder="E.g., Shroud" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>ROLE</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="border p-2 outline-none" style={inputStyle}>
              <option value="Entry Fragger">Entry Fragger</option>
              <option value="Flanker / Scout">Flanker / Scout</option>
              <option value="Support / Anchor">Support / Anchor</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-black" style={{ color: 'var(--e-text-dim)' }}>TEAM</label>
            <select value={teamId} onChange={e => setTeamId(e.target.value)} className="border p-2 outline-none" style={inputStyle}>
              <option value="">Unassigned</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full font-black p-2 transition-colors uppercase" style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}>
              {editId !== null ? 'UPDATE' : 'ADD PLAYER'}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-xs font-mono" style={{ color: 'var(--e-text-dim)' }}>Loading players...</div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            {players.map(p => (
              <div key={p.id} className="border p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3" style={panelStyle}>
                <div>
                  <h4 className="font-black uppercase" style={{ color: 'var(--e-text)' }}>
                    {p.username} <span className="text-xs font-normal" style={{ color: 'var(--e-text-dim)' }}>({p.role})</span>
                  </h4>
                  <span className="text-[10px]" style={{ color: 'var(--e-text-dim)' }}>
                    TEAM: <span style={{ color: 'var(--e-text-muted)' }}>{teamName(p.teamId)}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditId(p.id);
                      setUsername(p.username);
                      setTeamId(p.teamId ?? '');
                      setRole(p.role ?? 'Entry Fragger');
                    }}
                    className="font-bold hover:opacity-80"
                    style={{ color: '#60A5FA' }}
                  >
                    EDIT
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="font-bold hover:opacity-80" style={{ color: 'var(--e-accent)' }}>DELETE</button>
                </div>
              </div>
            ))}
            {players.length === 0 && <div style={{ color: 'var(--e-text-dim)' }}>No players yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. MAIN DASHBOARD OVERVIEW & ROUTER
// ==========================================
interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  stats: { label: string; value: string | number; highlight?: boolean }[];
  buttonText: string;
  onButtonClick: () => void;
}
const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, icon, stats, buttonText, onButtonClick }) => (
  <div className="border p-6 rounded-sm relative overflow-hidden flex flex-col justify-between transition-all group" style={panelStyle}>
    <div
      className="absolute top-0 left-0 w-[2px] h-full transition-colors"
      style={{ backgroundColor: 'var(--e-border)' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--e-accent)')}
    ></div>
    <div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-black tracking-wide uppercase" style={{ color: 'var(--e-text)' }}>{title}</h3>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-xs font-medium leading-relaxed mb-6" style={{ color: 'var(--e-text-muted)' }}>{description}</p>
      <div className="grid grid-cols-2 gap-4 border p-4 rounded-sm font-mono text-xs mb-6" style={cardStyle}>
        {stats.map((stat, idx) => (
          <div key={idx} className={idx === 1 ? 'border-l pl-4' : ''} style={idx === 1 ? { borderColor: 'var(--e-border)' } : undefined}>
            <span className="block text-[9px] font-black tracking-wider uppercase mb-1" style={{ color: 'var(--e-text-dim)' }}>{stat.label}</span>
            <span className="text-xl font-black" style={{ color: stat.highlight ? 'var(--e-accent)' : 'var(--e-text)' }}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
    <button
      onClick={onButtonClick}
      className="w-full border font-mono font-black text-[10px] py-3 tracking-widest uppercase transition-all rounded-sm flex items-center justify-center gap-2"
      style={{ backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)', color: 'var(--e-text)' }}
    >
      {buttonText} <span style={{ color: 'var(--e-accent)' }}>→</span>
    </button>
  </div>
);

const Dashboard: React.FC = () => {
  const [panel, setPanel] = useState<'MAIN' | 'TOURNAMENT' | 'MATCHES' | 'TEAMS' | 'PLAYERS'>('MAIN');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (panel !== 'MAIN') return;
    let cancelled = false;
    setStatsLoading(true);
    DashboardApi.stats()
      .then((s) => {
        if (!cancelled) setStats(s);
      })
      .catch(() => {
        if (!cancelled) setStats(null);
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [panel]);

  return (
    <div className="space-y-8 font-sans select-none subpixel-antialiased" style={{ color: 'var(--e-text)' }}>
      <div className="border-b pb-4 flex flex-col sm:flex-row justify-between sm:items-end gap-4" style={{ borderColor: 'var(--e-border)' }}>
        <div>
          <h2 className="text-3xl font-black tracking-wider uppercase" style={{ color: 'var(--e-text)' }}>
            ADMIN <span style={{ color: 'var(--e-accent)' }}>DASHBOARD</span>
          </h2>
          <p className="text-xs font-mono mt-1 tracking-wide uppercase" style={{ color: 'var(--e-text-muted)' }}>[ SYSTEM CONTROL HUB // {panel} ]</p>
        </div>
        <div
          className="flex items-center gap-2 border px-3 py-1.5 rounded-sm font-mono text-[10px] font-bold"
          style={{ backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)' }}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--e-success)' }}></span>
          <span className="uppercase" style={{ color: 'var(--e-success)' }}>SERVER ONLINE</span>
        </div>
      </div>

      {panel === 'MAIN' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCard
            title="MANAGE TOURNAMENTS"
            description="Create new events, update brackets, and set rule sheets easily."
            icon="🏆"
            stats={[{ label: 'TOTAL', value: statsLoading ? '...' : stats?.tournaments ?? 0 }, { label: 'TRACKED', value: 'LIVE' }]}
            buttonText="OPEN TOURNAMENT PANEL"
            onButtonClick={() => setPanel('TOURNAMENT')}
          />
          <DashboardCard
            title="MANAGE TEAMS"
            description="Register team squads, update team leaders, and approve rosters."
            icon="👥"
            stats={[{ label: 'TOTAL SQUADS', value: statsLoading ? '...' : stats?.teams ?? 0 }, { label: 'TRACKED', value: 'LIVE' }]}
            buttonText="OPEN TEAM PANEL"
            onButtonClick={() => setPanel('TEAMS')}
          />
          <DashboardCard
            title="MANAGE PLAYERS"
            description="View active players, verify profiles, and manage account restrictions."
            icon="👤"
            stats={[{ label: 'TOTAL PLAYERS', value: statsLoading ? '...' : stats?.players ?? 0 }, { label: 'TRACKED', value: 'LIVE' }]}
            buttonText="OPEN PLAYER PANEL"
            onButtonClick={() => setPanel('PLAYERS')}
          />
          <DashboardCard
            title="MANAGE MATCHES"
            description="Schedule new games, pick map venues, and monitor live match scores."
            icon="⚔️"
            stats={[{ label: 'TOTAL', value: statsLoading ? '...' : stats?.matches ?? 0 }, { label: 'TRACKED', value: 'LIVE', highlight: true }]}
            buttonText="OPEN MATCH PANEL"
            onButtonClick={() => setPanel('MATCHES')}
          />
        </div>
      )}

      {panel === 'TOURNAMENT' && <TournamentPanel onBack={() => setPanel('MAIN')} />}
      {panel === 'MATCHES' && <MatchesPanel onBack={() => setPanel('MAIN')} />}
      {panel === 'TEAMS' && <TeamsPanel onBack={() => setPanel('MAIN')} />}
      {panel === 'PLAYERS' && <PlayersPanel onBack={() => setPanel('MAIN')} />}
    </div>
  );
};

export default Dashboard;