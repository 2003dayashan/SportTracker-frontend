// src/pages/esport/Tournaments.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { type EsportPage } from './Sidebar';

// If your Spring Boot backend runs on a different origin/port than the
// frontend dev server, set this via a Vite env var (VITE_API_BASE_URL).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// NOTE: same assumption as before — TournamentStatus enum wasn't in your
// uploaded files. Update these to match your actual enum values.
const STATUS_OPTIONS = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
const LIVE_STATUS = 'ONGOING'; // status value treated as "live" in the UI

const FORMAT_OPTIONS: { value: 'SINGLE_ELIMINATION' | 'ROUND_ROBIN'; label: string }[] = [
  { value: 'SINGLE_ELIMINATION', label: 'SINGLE ELIMINATION' },
  { value: 'ROUND_ROBIN', label: 'ROUND ROBIN' },
];

const FORMAT_LABELS: Record<string, string> = {
  SINGLE_ELIMINATION: 'SINGLE ELIMINATION',
  ROUND_ROBIN: 'ROUND ROBIN',
};

const DEFAULT_LOGO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuABVb0-s2YT8_Sn3yR1iArSu8tO6O6IFIr3Gvrd3SFcQP5soSnX-bO0GACiVY1-h5hdC89XbOKu1BEyK8r3ZCARPajoppK1UAX4pYZWOqiE-ciLC1ChKmAFpnGGCPfKK6KKNkQInfOlHfyH3ZMQI6WXJbobXXsgGtEHikmoO-PTiEEEV8QPayAyJgGvw9dklQcyUeziM3XLIdm0pnCE_j8CByOnXMbuGPUWFiiFWCpS3wkIxZ_Xr3nRO7ftrVP9n7eES2_QhnWpUjc';

// Shape returned by GET /api/tournaments (matches Tournament.java)
interface BackendTournament {
  id: string;
  name: string;
  game: string;
  format: 'SINGLE_ELIMINATION' | 'ROUND_ROBIN';
  status: string;
  startDate: string;
  endDate: string;
  maxTeams: number;
  teamIds: string[];
  organizerId: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

interface TournamentsProps {
  isAdmin?: boolean;
  onNavigate?: (page: EsportPage) => void;
}

// datetime-local inputs need "YYYY-MM-DDTHH:mm" — this strips seconds/zone.
// Displays the value in the browser's local time; adjust here if you need
// to preserve the exact server-side zone instead.
const toDatetimeLocalValue = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const Tournaments: React.FC<TournamentsProps> = ({ isAdmin = false, onNavigate }) => {
  const [tournaments, setTournaments] = useState<BackendTournament[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit form state (mirrors TournamentRequest.java)
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [format, setFormat] = useState<'SINGLE_ELIMINATION' | 'ROUND_ROBIN'>('SINGLE_ELIMINATION');
  const [status, setStatus] = useState('UPCOMING');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxTeams, setMaxTeams] = useState(16);

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/tournaments?size=50`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Failed to load tournaments (status ${res.status})`);
      }
      const data: PageResponse<BackendTournament> = await res.json();
      setTournaments(data.content ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load tournaments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const goToCreateTournament = () => {
    onNavigate?.('esport-create-tournament');
  };

  const openEditModal = (t: BackendTournament) => {
    setName(t.name);
    setGame(t.game);
    setFormat(t.format);
    setStatus(t.status);
    setStartDate(toDatetimeLocalValue(t.startDate));
    setEndDate(toDatetimeLocalValue(t.endDate));
    setMaxTeams(t.maxTeams);
    setEditingId(t.id);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    if (!name.trim() || !game.trim() || !startDate || !endDate) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (maxTeams < 2) {
      toast.error('Max teams must be at least 2.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/tournaments/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          game,
          format,
          status,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          maxTeams,
        }),
      });

      if (!res.ok) {
        let message = `Failed to update tournament (status ${res.status})`;
        try {
          const errBody = await res.json();
          message = errBody?.message ?? message;
        } catch {
          // ignore non-JSON error body
        }
        throw new Error(message);
      }

      toast.success('Tournament updated.');
      setShowModal(false);
      setEditingId(null);
      await fetchTournaments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update tournament.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this tournament?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/tournaments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete tournament (status ${res.status})`);
      }

      toast.success('Tournament deleted.');
      setTournaments((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete tournament.');
    }
  };

  const liveCount = tournaments.filter((t) => t.status === LIVE_STATUS).length;

  return (
    <div className="space-y-12 select-none subpixel-antialiased text-left">
      {/* STATS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--e-card-bg)] border border-[var(--e-border)] p-6 group cursor-default">
          <div className="flex justify-between items-start mb-2">
            <span className="font-display text-xl text-primary font-bold tracking-wider">TOURNAMENTS LIVE</span>
            <span className="material-symbols-outlined text-[var(--e-accent)] text-lg">emoji_events</span>
          </div>
          <h3 className="font-display text-5xl font-extrabold text-on-surface mb-1 leading-none">
            {liveCount.toString().padStart(2, '0')}
          </h3>
          <div className="mt-4 h-1.5 bg-surface-variant w-full relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-primary w-2/3"></div>
          </div>
        </div>

        <div className="bg-[var(--e-card-bg)] border border-[var(--e-border)] p-6 group cursor-default">
          <div className="flex justify-between items-start mb-2">
            <span className="font-display text-xl text-primary font-bold tracking-wider">TOTAL PRIZE POOL</span>
            <span className="material-symbols-outlined text-[var(--e-accent)] text-lg">payments</span>
          </div>
          <h3 className="font-display text-5xl font-extrabold text-on-surface mb-1 leading-none">$25,400.00</h3>
          <div className="mt-4 h-1.5 bg-surface-variant w-full relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-primary w-full opacity-50"></div>
          </div>
        </div>

        <div className="bg-[var(--e-card-bg)] border border-[var(--e-border)] p-6 group cursor-default">
          <div className="flex justify-between items-start mb-2">
            <span className="font-display text-xl text-primary font-bold tracking-wider">VERIFIED TEAMS</span>
            <span className="material-symbols-outlined text-[var(--e-accent)] text-lg">groups</span>
          </div>
          <h3 className="font-display text-5xl font-extrabold text-on-surface mb-1 leading-none">128</h3>
          <div className="mt-4 h-1.5 bg-surface-variant w-full relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-primary w-1/4"></div>
          </div>
        </div>
      </section>

      {/* LIVE EVENTS TABLE */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6 border-b border-[var(--e-border)]/40 pb-4">
          <div>
            <h2 className="font-display text-4xl text-on-surface uppercase tracking-tight font-black">LIVE EVENTS</h2>
            <p className="font-mono text-[9px] text-[var(--e-text-muted)] font-bold uppercase mt-1">ACTIVE TOURNAMENT MONITORING</p>
          </div>
          {isAdmin && (
            <button
              onClick={goToCreateTournament}
              className="bg-primary text-black px-6 py-3 font-display tracking-wider text-sm flex items-center gap-2 hover:scale-95 transition-transform font-extrabold"
            >
              <span className="material-symbols-outlined text-sm">add</span>CREATE TOURNAMENT
            </button>
          )}
        </div>
        <div className="bg-[var(--e-card-bg)] border border-[var(--e-border)] relative overflow-hidden">
          <div className="noise-overlay absolute inset-0 pointer-events-none"></div>
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="bg-[var(--e-card-bg-2)] border-b border-[var(--e-border)]">
              <tr>
                <th className="p-6 font-display text-sm tracking-wider text-primary">NAME</th>
                <th className="p-6 font-display text-sm tracking-wider text-primary">MODE</th>
                <th className="p-6 font-display text-sm tracking-wider text-primary">TEAMS</th>
                <th className="p-6 font-display text-sm tracking-wider text-primary">STATUS</th>
                {isAdmin && <th className="p-6 font-display text-sm tracking-wider text-primary text-right">ACTIONS</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--e-border)]/35">
              {loading && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="p-6 text-center text-[var(--e-text-muted)] font-mono text-xs">
                    LOADING TOURNAMENTS...
                  </td>
                </tr>
              )}

              {!loading && tournaments.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="p-6 text-center text-[var(--e-text-muted)] font-mono text-xs">
                    NO TOURNAMENTS FOUND
                  </td>
                </tr>
              )}

              {!loading && tournaments.map((t) => {
                const isLive = t.status === LIVE_STATUS;
                const teamsCount = `${t.teamIds?.length ?? 0} / ${t.maxTeams}`;
                const modeLabel = `${t.game} • ${FORMAT_LABELS[t.format] ?? t.format}`;

                return (
                  <tr key={t.id} className="hover:bg-[var(--e-surface-container-low)]/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black border border-primary p-1">
                          <img className="w-full h-full object-cover" src={DEFAULT_LOGO} alt={t.name} />
                        </div>
                        <div>
                          <p className="font-display text-2xl text-on-surface uppercase leading-none font-bold">{t.name}</p>
                          <p className="font-mono text-[9px] text-[var(--e-text-dim)] font-bold mt-1">ID: {t.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="font-mono text-[10px] px-2.5 py-1 bg-[var(--e-card-bg-2)] border border-[var(--e-border)] font-bold text-[var(--e-text)]">{modeLabel}</span>
                    </td>
                    <td className="p-6">
                      <p className="font-mono text-xs font-bold text-on-surface">{teamsCount}</p>
                    </td>
                    <td className="p-6">
                      <div className={`flex items-center gap-2 font-bold ${isLive ? 'text-primary' : 'text-[var(--e-text-muted)]'}`}>
                        {isLive ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="font-mono text-xs uppercase">{t.status}</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span className="font-mono text-xs uppercase">{t.status}</span>
                          </>
                        )}
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(t)}
                            className="p-2 hover:bg-secondary-container transition-colors material-symbols-outlined text-[var(--e-text-muted)] hover:text-primary text-base"
                          >
                            edit
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-2 hover:bg-error-container transition-colors material-symbols-outlined text-[var(--e-text-muted)] hover:text-primary text-base"
                          >
                            delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ASYMMETRIC ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-[var(--e-card-bg)] border border-[var(--e-border)] p-8 relative overflow-hidden h-[400px] flex flex-col justify-between">
          <div className="absolute inset-0 noise-overlay pointer-events-none"></div>
          <div className="relative z-10 w-full">
            <div className="flex justify-between items-center mb-8 border-b border-[var(--e-border)]/40 pb-3">
              <h2 className="font-display text-3xl text-on-surface uppercase font-bold tracking-tight">ENGAGEMENT TRENDS</h2>
              <div className="flex gap-4 font-mono font-bold text-[9px] text-[var(--e-text-muted)]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-primary"></span> VIEWS</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[var(--e-text-dim)]"></span> BETS</span>
              </div>
            </div>
            {/* Chart grid */}
            <div className="w-full h-56 flex items-end gap-4 px-4 pt-4">
              <div className="w-full bg-primary-container/20 h-24 border-t-2 border-primary relative group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">12K</div>
              </div>
              <div className="w-full bg-primary-container/20 h-44 border-t-2 border-primary relative group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">22K</div>
              </div>
              <div className="w-full bg-primary-container/20 h-28 border-t-2 border-primary relative group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">14K</div>
              </div>
              <div className="w-full bg-primary-container/20 h-52 border-t-2 border-primary relative group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">26K</div>
              </div>
              <div className="w-full bg-primary-container/20 h-36 border-t-2 border-primary relative group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">18K</div>
              </div>
              <div className="w-full bg-primary-container/20 h-60 border-t-2 border-primary relative group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">30K</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-8 font-display text-7xl opacity-5 select-none font-bold">DATA_FEED_V4</div>
        </div>

        <div className="lg:col-span-4 bg-[var(--e-card-bg)] border border-[var(--e-border)] p-8 space-y-6">
          <h2 className="font-display text-3xl text-primary uppercase font-bold tracking-tight border-b border-[var(--e-border)]/45 pb-2 leading-none">RECENT ALERTS</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[var(--e-card-bg-2)] border-l-4 border-primary">
              <p className="font-mono text-[9px] text-primary mb-1 font-bold">SECURITY BREACH ATTEMPT</p>
              <p className="font-sans text-xs text-[var(--e-text-muted)] leading-relaxed font-semibold">Unauthorized tournament modification request blocked for ID: SL-2026-A1.</p>
            </div>
            <div className="p-4 bg-[var(--e-card-bg-2)] border-l-4 border-[var(--e-text-dim)]">
              <p className="font-mono text-[9px] text-[var(--e-text-dim)] mb-1 font-bold">SYSTEM MAINTENANCE</p>
              <p className="font-sans text-xs text-[var(--e-text-muted)] leading-relaxed font-semibold">Scheduled database optimization starting in 2 hours.</p>
            </div>
            <div className="p-4 bg-[var(--e-card-bg-2)] border-l-4 border-[var(--e-accent)]">
              <p className="font-mono text-[9px] text-[var(--e-accent)] mb-1 font-bold">NEW TEAM VERIFIED</p>
              <p className="font-sans text-xs text-[var(--e-text-muted)] leading-relaxed font-semibold">Team 'V0ID_WALKERS' has completed verification.</p>
            </div>
          </div>
          <button className="w-full border border-[var(--e-border)] py-3.5 font-display text-sm tracking-wider hover:bg-[var(--e-card-bg-2)] transition-colors uppercase font-extrabold">VIEW ALL LOGS</button>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[var(--e-card-bg)] border-2 border-primary p-8 max-w-md w-full relative text-left">
            <h3 className="font-display text-3xl text-primary mb-6 uppercase tracking-wider font-bold">
              Edit Tournament
            </h3>
            <form onSubmit={handleSave} className="space-y-4 font-mono text-xs font-bold">
              <div>
                <label className="block text-[var(--e-text-muted)] uppercase mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--e-card-bg-2)] border border-[var(--e-border)] p-3 text-on-surface uppercase outline-none focus:border-primary font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--e-text-muted)] uppercase mb-1">Game</label>
                <input
                  type="text"
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  placeholder="e.g. APEX PROTOCOL"
                  className="w-full bg-[var(--e-card-bg-2)] border border-[var(--e-border)] p-3 text-on-surface uppercase outline-none focus:border-primary font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--e-text-muted)] uppercase mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as 'SINGLE_ELIMINATION' | 'ROUND_ROBIN')}
                    className="w-full bg-[var(--e-card-bg-2)] border border-[var(--e-border)] p-3 text-on-surface outline-none focus:border-primary font-bold"
                  >
                    {FORMAT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--e-text-muted)] uppercase mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[var(--e-card-bg-2)] border border-[var(--e-border)] p-3 text-on-surface outline-none focus:border-primary font-bold"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--e-text-muted)] uppercase mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[var(--e-card-bg-2)] border border-[var(--e-border)] p-3 text-on-surface outline-none focus:border-primary font-bold [color-scheme:dark]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[var(--e-text-muted)] uppercase mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[var(--e-card-bg-2)] border border-[var(--e-border)] p-3 text-on-surface outline-none focus:border-primary font-bold [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[var(--e-text-muted)] uppercase mb-1">Max Teams</label>
                <input
                  type="number"
                  min={2}
                  value={maxTeams}
                  onChange={(e) => setMaxTeams(Number(e.target.value))}
                  className="w-full bg-[var(--e-card-bg-2)] border border-[var(--e-border)] p-3 text-on-surface outline-none focus:border-primary font-bold"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4 border-t border-[var(--e-border)]/45">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingId(null); }}
                  className="flex-1 py-3.5 border border-[var(--e-border)] text-on-surface hover:bg-[var(--e-card-bg-2)] transition-colors font-display text-sm font-extrabold tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3.5 bg-primary text-black font-extrabold hover:bg-primary/95 transition-colors font-display text-sm tracking-wider disabled:opacity-60"
                >
                  {saving ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournaments;