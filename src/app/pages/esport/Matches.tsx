import React, { useEffect, useState } from 'react';
import { TournamentApi, TeamApi, BracketApi, MatchApi, type Tournament, type Team, type Match } from '../../../lib/esportApi';

const inputStyle = { backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)', color: 'var(--e-text)' };

const Matches: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');

  const [scoreDraft, setScoreDraft] = useState<Record<string, { scoreA: string; scoreB: string }>>({});
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);

  const teamName = (id: string) => teams.find((t) => t.id === id)?.name ?? id;

  const loadBaseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tPage, teamList] = await Promise.all([TournamentApi.list({ size: 50 }), TeamApi.list()]);
      setTournaments(tPage.content);
      setTeams(teamList);
      if (tPage.content.length > 0) {
        setSelectedTournamentId(tPage.content[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async (tournamentId: string) => {
    if (!tournamentId) {
      setMatches([]);
      return;
    }
    setMatchesLoading(true);
    try {
      const data = await BracketApi.get(tournamentId);
      setMatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matches');
    } finally {
      setMatchesLoading(false);
    }
  };

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    if (selectedTournamentId) loadMatches(selectedTournamentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTournamentId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournamentId || !teamAId || !teamBId || !matchDate || !matchTime || teamAId === teamBId) return;
    try {
      const scheduledAt = new Date(`${matchDate}T${matchTime}`).toISOString();
      await MatchApi.create({
        tournamentId: selectedTournamentId,
        teamAId,
        teamBId,
        scoreA: 0,
        scoreB: 0,
        winnerId: null,
        status: 'SCHEDULED',
        scheduledAt,
        completedAt: null,
      });
      setTeamAId('');
      setTeamBId('');
      setMatchDate('');
      setMatchTime('');
      await loadMatches(selectedTournamentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create match fixture');
    }
  };

  const startScoreEdit = (m: Match) => {
    setEditingScoreId(m.id);
    setScoreDraft((d) => ({ ...d, [m.id]: { scoreA: String(m.scoreA), scoreB: String(m.scoreB) } }));
  };

  const saveScore = async (id: string) => {
    const draft = scoreDraft[id];
    if (!draft) return;
    try {
      await MatchApi.updateScore(id, { scoreA: Number(draft.scoreA) || 0, scoreB: Number(draft.scoreB) || 0 });
      setEditingScoreId(null);
      await loadMatches(selectedTournamentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update score');
    }
  };

  return (
    <div className="space-y-8 font-sans select-none subpixel-antialiased" style={{ color: 'var(--e-text)' }}>

      {/* HEADER */}
      <div className="border-b pb-4" style={{ borderColor: 'var(--e-border)' }}>
        <h2 className="text-3xl font-black tracking-wider uppercase" style={{ color: 'var(--e-text)' }}>MATCH SCHEDULE</h2>
        <p className="text-xs font-mono mt-1 tracking-wide uppercase" style={{ color: 'var(--e-text-muted)' }}>
          [ SCHEDULE, VENUE SELECT, AND POST NEW MATCH FIXTURES ]
        </p>
      </div>

      {error && (
        <div className="text-xs font-mono p-3 border rounded-sm" style={{ borderColor: 'var(--e-accent)', color: 'var(--e-accent)' }}>{error}</div>
      )}

      {/* TOURNAMENT SELECT */}
      <div className="space-y-1.5 max-w-sm">
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>TOURNAMENT</label>
        <select value={selectedTournamentId} onChange={(e) => setSelectedTournamentId(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none font-bold uppercase tracking-wider" style={inputStyle}>
          <option value="">Select tournament</option>
          {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* CREATE FORM */}
      <div className="border p-6 rounded-sm relative overflow-hidden" style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}>
        <div className="absolute top-0 left-0 w-[3px] h-full" style={{ backgroundColor: 'var(--e-accent)' }}></div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono font-black tracking-widest uppercase" style={{ color: 'var(--e-accent)' }}>// 01. TEAMS SELECTION</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>TEAM A</label>
                <select value={teamAId} onChange={(e) => setTeamAId(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none uppercase font-bold tracking-wider" style={inputStyle}>
                  <option value="">Select</option>
                  {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>TEAM B</label>
                <select value={teamBId} onChange={(e) => setTeamBId(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none uppercase font-bold tracking-wider" style={inputStyle}>
                  <option value="">Select</option>
                  {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t" style={{ borderColor: 'var(--e-border)' }}>
            <h4 className="text-[11px] font-mono font-black tracking-widest uppercase" style={{ color: 'var(--e-accent)' }}>// 02. DATE & TIME</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>MATCH DATE</label>
                <input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none font-mono font-bold" style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>START TIME</label>
                <input type="time" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none font-mono font-bold" style={inputStyle} />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full font-black text-xs py-3.5 tracking-widest uppercase transition-all rounded-sm" style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}>
            CREATE MATCH FIXTURE
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono font-black tracking-wider uppercase" style={{ color: 'var(--e-text)' }}>// FIXTURES</h3>

        {matchesLoading ? (
          <div className="text-xs font-mono" style={{ color: 'var(--e-text-dim)' }}>Loading matches...</div>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="border p-5 rounded-sm group transition-all flex flex-col md:flex-row justify-between items-center gap-4" style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}>
              <div className="text-center md:text-left">
                <h4 className="text-base font-black tracking-wide uppercase" style={{ color: 'var(--e-text)' }}>
                  {teamName(match.teamAId)} <span className="font-mono px-2" style={{ color: 'var(--e-accent)' }}>VS</span> {teamName(match.teamBId)}
                </h4>
                <span className="text-[10px] font-mono font-bold block mt-1 uppercase" style={{ color: 'var(--e-text-dim)' }}>
                  STATUS: <span style={{ color: 'var(--e-text-muted)' }}>{match.status}</span>
                </span>
              </div>

              <div className="flex gap-6 font-mono text-center md:text-right items-center">
                <div>
                  <span className="block text-[9px] font-black tracking-wider uppercase" style={{ color: 'var(--e-text-dim)' }}>SCHEDULED</span>
                  <span className="font-bold text-xs" style={{ color: 'var(--e-text-muted)' }}>{new Date(match.scheduledAt).toLocaleString()}</span>
                </div>

                {editingScoreId === match.id ? (
                  <div className="flex items-center gap-2 border-l pl-6" style={{ borderColor: 'var(--e-border)' }}>
                    <input
                      type="number"
                      value={scoreDraft[match.id]?.scoreA ?? '0'}
                      onChange={(e) => setScoreDraft((d) => ({ ...d, [match.id]: { ...d[match.id], scoreA: e.target.value } }))}
                      className="w-14 border p-2 text-xs rounded-sm text-center"
                      style={inputStyle}
                    />
                    <span style={{ color: 'var(--e-text-dim)' }}>-</span>
                    <input
                      type="number"
                      value={scoreDraft[match.id]?.scoreB ?? '0'}
                      onChange={(e) => setScoreDraft((d) => ({ ...d, [match.id]: { ...d[match.id], scoreB: e.target.value } }))}
                      className="w-14 border p-2 text-xs rounded-sm text-center"
                      style={inputStyle}
                    />
                    <button onClick={() => saveScore(match.id)} className="text-[10px] font-black uppercase px-3 py-2 rounded-sm" style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}>
                      SAVE
                    </button>
                  </div>
                ) : (
                  <div className="border-l pl-6 flex items-center gap-4" style={{ borderColor: 'var(--e-border)' }}>
                    <div>
                      <span className="block text-[9px] font-black tracking-wider uppercase" style={{ color: 'var(--e-text-dim)' }}>SCORE</span>
                      <span className="font-bold text-sm" style={{ color: 'var(--e-text)' }}>{match.scoreA} - {match.scoreB}</span>
                    </div>
                    <button onClick={() => startScoreEdit(match)} className="text-[10px] font-black uppercase px-3 py-2 border rounded-sm" style={{ borderColor: 'var(--e-border)', color: 'var(--e-text)' }}>
                      UPDATE
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {!matchesLoading && matches.length === 0 && (
          <div className="text-xs font-mono text-center py-8" style={{ color: 'var(--e-text-dim)' }}>No fixtures scheduled for this tournament yet.</div>
        )}
      </div>
    </div>
  );
};

export default Matches;