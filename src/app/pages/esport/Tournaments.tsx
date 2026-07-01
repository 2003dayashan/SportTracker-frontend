import React, { useEffect, useState } from 'react';
import {
  TournamentApi,
  type Tournament,
  type TournamentRequest,
  type TournamentFormat,
  type TournamentStatus,
} from '../../../lib/esportApi';

type Tab = 'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED';

const tabToStatus: Record<Tab, TournamentStatus | undefined> = {
  ALL: undefined,
  LIVE: 'ONGOING',
  UPCOMING: 'UPCOMING',
  COMPLETED: 'COMPLETED',
};

const inputStyle = { backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)', color: 'var(--e-text)' };

const Tournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [activeTab, setActiveTab] = useState<Tab>('ALL');

  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [format, setFormat] = useState<TournamentFormat>('SINGLE_ELIMINATION');
  const [maxTeams, setMaxTeams] = useState('8');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await TournamentApi.list({ status: tabToStatus[activeTab], page, size: 6 });
      setTournaments(result.content);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  useEffect(() => {
    setPage(0);
  }, [activeTab]);

  const resetForm = () => {
    setName('');
    setGame('');
    setFormat('SINGLE_ELIMINATION');
    setMaxTeams('8');
    setStartDate('');
    setEndDate('');
    setEditId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
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
      if (editId) {
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

  const handleEdit = (t: Tournament) => {
    setEditId(t.id);
    setName(t.name);
    setGame(t.game);
    setFormat(t.format);
    setMaxTeams(String(t.maxTeams));
    setStartDate(t.startDate?.slice(0, 10) ?? '');
    setEndDate(t.endDate?.slice(0, 10) ?? '');
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

  const statusLabel = (s: TournamentStatus): Tab => (s === 'ONGOING' ? 'LIVE' : (s as Tab));

  return (
    <div className="space-y-8 font-sans select-none subpixel-antialiased" style={{ color: 'var(--e-text)' }}>

      {/* HEADER */}
      <div className="border-b pb-4" style={{ borderColor: 'var(--e-border)' }}>
        <h2 className="text-3xl font-black tracking-wider uppercase" style={{ color: 'var(--e-text)' }}>
          TOURNAMENTS <span style={{ color: 'var(--e-accent)' }}>HUB</span>
        </h2>
        <p className="text-xs font-mono mt-1 tracking-wide uppercase" style={{ color: 'var(--e-text-muted)' }}>
          [ SETUP, SCHEDULE AND DISPATCH NEW COMPETITIVE EVENTS ]
        </p>
      </div>

      {error && (
        <div className="text-xs font-mono p-3 border rounded-sm" style={{ borderColor: 'var(--e-accent)', color: 'var(--e-accent)' }}>
          {error}
        </div>
      )}

      {/* FORM */}
      <div
        className="border p-6 rounded-sm relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
        style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
      >
        <div className="absolute top-0 left-0 w-[3px] h-full" style={{ backgroundColor: 'var(--e-accent)' }}></div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono font-black tracking-widest uppercase" style={{ color: 'var(--e-accent)' }}>
              // 01. TOURNAMENT SETUP
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>TOURNAMENT NAME</label>
                <input type="text" placeholder="e.g., WINTER CUP 2026" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none uppercase tracking-wide font-semibold transition-all" style={inputStyle} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>GAME TITLE</label>
                <input type="text" placeholder="e.g., Valorant" value={game} onChange={(e) => setGame(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none uppercase tracking-wide font-semibold transition-all" style={inputStyle} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>MATCH FORMAT</label>
                <select value={format} onChange={(e) => setFormat(e.target.value as TournamentFormat)} className="w-full border p-3 text-xs rounded-sm focus:outline-none font-bold uppercase tracking-wide transition-all" style={inputStyle}>
                  <option value="SINGLE_ELIMINATION">KNOCKOUT (SINGLE ELIMINATION)</option>
                  <option value="ROUND_ROBIN">LEAGUE (POINTS SYSTEM)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>MAX TEAMS</label>
                <input type="number" min={2} value={maxTeams} onChange={(e) => setMaxTeams(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none font-mono font-bold transition-all" style={inputStyle} />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t" style={{ borderColor: 'var(--e-border)' }}>
            <h4 className="text-[11px] font-mono font-black tracking-widest uppercase" style={{ color: 'var(--e-accent)' }}>
              // 02. EVENT TIMELINE
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>START DATE</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none font-mono font-bold transition-all" style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--e-text-muted)' }}>END DATE</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border p-3 text-xs rounded-sm focus:outline-none font-mono font-bold transition-all" style={inputStyle} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 font-black text-xs py-3.5 tracking-widest transition-all rounded-sm uppercase" style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}>
              {editId ? 'UPDATE TOURNAMENT' : 'PUBLISH TOURNAMENT'}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="px-6 font-black text-xs py-3.5 tracking-widest transition-all rounded-sm uppercase border" style={{ borderColor: 'var(--e-border)', color: 'var(--e-text-muted)' }}>
                CANCEL
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABS */}
      <div className="flex border-b gap-6 text-[11px] font-mono font-black" style={{ borderColor: 'var(--e-border)' }}>
        {(['ALL', 'LIVE', 'UPCOMING', 'COMPLETED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="pb-3 border-b-2 transition-all tracking-widest"
            style={activeTab === tab ? { borderColor: 'var(--e-accent)', color: 'var(--e-accent)' } : { borderColor: 'transparent', color: 'var(--e-text-dim)' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-xs font-mono" style={{ color: 'var(--e-text-dim)' }}>Loading tournaments...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="border p-5 rounded-sm relative group transition-all duration-300"
                style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
              >
                <span
                  className="absolute top-4 right-4 text-[9px] font-mono font-black border px-2 py-0.5 rounded-sm tracking-wider"
                  style={
                    t.status === 'ONGOING'
                      ? { color: 'var(--e-success)', borderColor: 'var(--e-success)', backgroundColor: 'rgba(34,197,94,0.08)' }
                      : t.status === 'COMPLETED'
                      ? { color: 'var(--e-text-dim)', borderColor: 'var(--e-border)', backgroundColor: 'transparent' }
                      : { color: 'var(--e-warning)', borderColor: 'var(--e-warning)', backgroundColor: 'rgba(234,179,8,0.08)' }
                  }
                >
                  ● {statusLabel(t.status)}
                </span>

                <h4 className="text-xl font-black tracking-wide uppercase pr-24" style={{ color: 'var(--e-text)' }}>{t.name}</h4>

                <div className="mt-2 text-xs font-mono" style={{ color: 'var(--e-text-muted)' }}>
                  GAME: <span className="font-bold uppercase" style={{ color: 'var(--e-text)' }}>{t.game}</span>
                  <span className="mx-2" style={{ color: 'var(--e-text-dim)' }}>|</span>
                  FORMAT: <span className="font-bold uppercase" style={{ color: 'var(--e-text)' }}>{t.format === 'SINGLE_ELIMINATION' ? 'KNOCKOUT' : 'LEAGUE'}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs mt-5 pt-4 border-t font-mono" style={{ borderColor: 'var(--e-bg)' }}>
                  <div>
                    <span className="block text-[9px] font-black tracking-wider uppercase" style={{ color: 'var(--e-text-dim)' }}>START</span>
                    <span className="font-bold" style={{ color: 'var(--e-text-muted)' }}>{t.startDate?.slice(0, 10)}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black tracking-wider uppercase" style={{ color: 'var(--e-text-dim)' }}>END</span>
                    <span className="font-bold" style={{ color: 'var(--e-text-muted)' }}>{t.endDate?.slice(0, 10)}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black tracking-wider uppercase" style={{ color: 'var(--e-text-dim)' }}>TEAMS</span>
                    <span className="font-bold" style={{ color: 'var(--e-accent)' }}>{t.teamIds.length}/{t.maxTeams}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 text-[10px] font-mono font-black uppercase">
                  <button onClick={() => handleEdit(t)} className="hover:opacity-80" style={{ color: '#60A5FA' }}>EDIT</button>
                  <button onClick={() => handleDelete(t.id)} className="hover:opacity-80" style={{ color: 'var(--e-accent)' }}>DELETE</button>
                </div>
              </div>
            ))}
          </div>

          {tournaments.length === 0 && (
            <div className="text-xs font-mono text-center py-8" style={{ color: 'var(--e-text-dim)' }}>No tournaments found for this filter.</div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-4 font-mono text-xs">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-4 py-2 border rounded-sm disabled:opacity-30"
                style={{ borderColor: 'var(--e-border)', color: 'var(--e-text)' }}
              >
                PREV
              </button>
              <span className="px-2 py-2" style={{ color: 'var(--e-text-muted)' }}>PAGE {page + 1} / {totalPages}</span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border rounded-sm disabled:opacity-30"
                style={{ borderColor: 'var(--e-border)', color: 'var(--e-text)' }}
              >
                NEXT
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tournaments;