import React, { useState } from 'react';

interface TournamentItem {
  id: string;
  name: string;
  mode: string;
  teamsCount: string;
  status: string;
  logo: string;
  isLive: boolean;
}

interface TournamentsProps {
  isAdmin?: boolean;
}

const Tournaments: React.FC<TournamentsProps> = ({ isAdmin = false }) => {
  const [tournaments, setTournaments] = useState<TournamentItem[]>([
    {
      id: 'SL-2026-A1',
      name: 'SHADOW PROTOCOL',
      mode: '5V5 BATTLE ROYALE',
      teamsCount: '32 / 32',
      status: 'SEMIS ROUND 2',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABVb0-s2YT8_Sn3yR1iArSu8tO6O6IFIr3Gvrd3SFcQP5soSnX-bO0GACiVY1-h5hdC89XbOKu1BEyK8r3ZCARPajoppK1UAX4pYZWOqiE-ciLC1ChKmAFpnGGCPfKK6KKNkQInfOlHfyH3ZMQI6WXJbobXXsgGtEHikmoO-PTiEEEV8QPayAyJgGvw9dklQcyUeziM3XLIdm0pnCE_j8CByOnXMbuGPUWFiiFWCpS3wkIxZ_Xr3nRO7ftrVP9n7eES2_QhnWpUjc',
      isLive: true
    },
    {
      id: 'SL-2026-B4',
      name: 'UNDERGROUND CUP',
      mode: '1V1 DUELS',
      teamsCount: '64 / 64',
      status: 'STARTING IN 12H',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSk5GpMB0RfStDXa2cTPmJIZpV5p6hQh9F0QX71E_t_IcFc1sX4EzePxVcabx_F6FuAOm4NQpgZ-CMT7o7D59td_5dAJeVOtVyss--YZSpraclYl0KNNdmGRL5KStph_6Y9V6WjGJL99o57No3LfBORaYeWyYKFElO0NFc6NZZ5ShPhBW_aVAvTvQxjJSb-gWTWleb3kxabKSY0ApKjqJMxuC_1wtiglBMRAqlITbqgRIDrEU_4R9ImMUGLZOuaeOwYfYyk1p9VY8',
      isLive: false
    },
    {
      id: 'SL-2026-C2',
      name: 'CRIMSON LEAGUE',
      mode: 'KING OF HILL',
      teamsCount: '16 / 16',
      status: 'FINAL MATCH',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLx8NGkr01xnU4T8pTi07jtXwTn7290WJNhmB6X0-MqWxGjnmdm4xDWXSMOmPLm1hKIFKyNQCZjguPVSbqqHWiAWEtMm5k9QAo7RnL31eyZATklDY8Ix7gGzgqvduFs0u1oItSnAMQqZJ6gJQfTQooEpNUlXp2KOpXaq8NRiZ3CBFAcdguWdUnHZieFveEVW9FTHKBG_WGwr6DWadjIq8p2QzD_eHP3mCJ3OdiZj-JbLswAdUdgSyJ-xNDiRD0pVL6x_YVu6Hqak4',
      isLive: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [mode, setMode] = useState('');
  const [teamsCount, setTeamsCount] = useState('16 / 16');
  const [status, setStatus] = useState('');
  const [isLive, setIsLive] = useState(false);

  const openCreateModal = () => {
    setName('');
    setMode('');
    setTeamsCount('16 / 16');
    setStatus('REGISTERING');
    setIsLive(false);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (t: TournamentItem) => {
    setName(t.name);
    setMode(t.mode);
    setTeamsCount(t.teamsCount);
    setStatus(t.status);
    setIsLive(t.isLive);
    setEditingId(t.id);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      // Update
      setTournaments(prev => prev.map(t => t.id === editingId ? {
        ...t,
        name: name.toUpperCase(),
        mode: mode.toUpperCase(),
        teamsCount,
        status: status.toUpperCase(),
        isLive
      } : t));
    } else {
      // Create
      const newId = `SL-2026-${Math.random().toString(36).substr(2, 2).toUpperCase()}${Math.floor(Math.random() * 9) + 1}`;
      const newT: TournamentItem = {
        id: newId,
        name: name.toUpperCase(),
        mode: mode.toUpperCase(),
        teamsCount,
        status: status.toUpperCase(),
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABVb0-s2YT8_Sn3yR1iArSu8tO6O6IFIr3Gvrd3SFcQP5soSnX-bO0GACiVY1-h5hdC89XbOKu1BEyK8r3ZCARPajoppK1UAX4pYZWOqiE-ciLC1ChKmAFpnGGCPfKK6KKNkQInfOlHfyH3ZMQI6WXJbobXXsgGtEHikmoO-PTiEEEV8QPayAyJgGvw9dklQcyUeziM3XLIdm0pnCE_j8CByOnXMbuGPUWFiiFWCpS3wkIxZ_Xr3nRO7ftrVP9n7eES2_QhnWpUjc',
        isLive: isLive
      };
      setTournaments([...tournaments, newT]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this tournament?')) {
      setTournaments(prev => prev.filter(t => t.id !== id));
    }
  };

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
            {tournaments.filter(t => t.isLive).length.toString().padStart(2, '0')}
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
              onClick={openCreateModal}
              className="bg-primary text-black px-6 py-3 font-display tracking-wider text-sm flex items-center gap-2 hover:scale-95 transition-transform font-extrabold"
            >
              <span className="material-symbols-outlined text-sm">add</span>CREATE TOURNAMENT
            </button>
          )}
        </div>
        <div className="bg-[var(--e-card-bg)] border border-[var(--e-border)] relative overflow-hidden">
          <div className="noise-overlay absolute inset-0"></div>
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
              {tournaments.map((t, idx) => (
                <tr key={idx} className="hover:bg-[var(--e-surface-container-low)]/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black border border-primary p-1">
                        <img className="w-full h-full object-cover" src={t.logo} alt={t.name} />
                      </div>
                      <div>
                        <p className="font-display text-2xl text-on-surface uppercase leading-none font-bold">{t.name}</p>
                        <p className="font-mono text-[9px] text-[var(--e-text-dim)] font-bold mt-1">ID: {t.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="font-mono text-[10px] px-2.5 py-1 bg-[var(--e-card-bg-2)] border border-[var(--e-border)] font-bold text-[var(--e-text)]">{t.mode}</span>
                  </td>
                  <td className="p-6">
                    <p className="font-mono text-xs font-bold text-on-surface">{t.teamsCount}</p>
                  </td>
                  <td className="p-6">
                    <div className={`flex items-center gap-2 font-bold ${t.isLive ? 'text-primary' : 'text-[var(--e-text-muted)]'}`}>
                      {t.isLive ? (
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
              ))}
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

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[var(--e-card-bg)] border-2 border-primary p-8 max-w-md w-full relative text-left">
            <h3 className="font-display text-3xl text-primary mb-6 uppercase tracking-wider font-bold">
              {editingId ? 'Edit Tournament' : 'Create Tournament'}
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
                <label className="block text-[var(--e-text-muted)] uppercase mb-1">Mode</label>
                <input 
                  type="text" 
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  placeholder="e.g. 5V5 BATTLE ROYALE"
                  className="w-full bg-[var(--e-card-bg-2)] border border-[var(--e-border)] p-3 text-on-surface uppercase outline-none focus:border-primary font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--e-text-muted)] uppercase mb-1">Teams</label>
                  <input 
                    type="text" 
                    value={teamsCount}
                    onChange={(e) => setTeamsCount(e.target.value)}
                    className="w-full bg-[var(--e-card-bg-2)] border border-[var(--e-border)] p-3 text-on-surface outline-none focus:border-primary font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[var(--e-text-muted)] uppercase mb-1">Status</label>
                  <input 
                    type="text" 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[var(--e-card-bg-2)] border border-[var(--e-border)] p-3 text-on-surface uppercase outline-none focus:border-primary font-bold"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isLive"
                  checked={isLive}
                  onChange={(e) => setIsLive(e.target.checked)}
                  className="bg-[var(--e-card-bg-2)] border border-[var(--e-border)] text-primary focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isLive" className="text-[var(--e-text-muted)] uppercase cursor-pointer">Live Tournament</label>
              </div>
              <div className="flex gap-4 pt-4 border-t border-[var(--e-border)]/45">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 border border-[var(--e-border)] text-on-surface hover:bg-[var(--e-card-bg-2)] transition-colors font-display text-sm font-extrabold tracking-wider"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3.5 bg-primary text-black font-extrabold hover:bg-primary/95 transition-colors font-display text-sm tracking-wider"
                >
                  SAVE
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

