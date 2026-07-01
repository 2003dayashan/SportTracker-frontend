import React, { useEffect, useState } from 'react';
import { TournamentApi, DashboardApi, type Tournament, type DashboardStats } from '../../../lib/esportApi';

const Home: React.FC = () => {
  const [liveTournaments, setLiveTournaments] = useState<Tournament[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [tournamentsPage, dashboardStats] = await Promise.all([
          TournamentApi.list({ status: 'ONGOING', size: 5 }),
          DashboardApi.stats(),
        ]);
        if (!cancelled) {
          setLiveTournaments(tournamentsPage.content);
          setStats(dashboardStats);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load home data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const featuredTournament = liveTournaments[0];

  return (
    <div className="space-y-10 font-sans select-none subpixel-antialiased" style={{ color: 'var(--e-text)' }}>

      {/* 1. HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">

        <div className="lg:col-span-7 space-y-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border"
            style={{ backgroundColor: 'var(--e-accent-soft)', borderColor: 'var(--e-accent)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--e-accent)' }}></span>
            <span className="text-[10px] font-mono font-black tracking-widest uppercase" style={{ color: 'var(--e-accent)' }}>
              SEASON 04 ACTIVE
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none" style={{ color: 'var(--e-text)' }}>
            STICK <span style={{ color: 'var(--e-accent)' }}>LEAGUE</span>
          </h1>

          <p className="text-xs leading-relaxed max-w-xl font-normal" style={{ color: 'var(--e-text-muted)' }}>
            Where doodles go pro. The ultimate arena for minimalist mechanics, raw skill, and high-stakes precision. No visual clutter, just pure competitive execution.
          </p>

          <div className="flex gap-4 pt-2 font-sans">
            <button
              className="font-black text-xs px-6 py-3 tracking-widest transition-all rounded-sm uppercase"
              style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--e-accent-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--e-accent)')}
            >
              JOIN LEAGUE
            </button>
            <button
              className="bg-transparent font-black text-xs px-6 py-3 tracking-widest border transition-all rounded-sm uppercase"
              style={{ color: 'var(--e-text)', borderColor: 'var(--e-border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--e-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--e-border)')}
            >
              WATCH MATCHES
            </button>
          </div>
        </div>

        <div
          className="lg:col-span-5 border p-6 rounded-sm relative overflow-hidden group transition-all"
          style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
        >
          <div className="absolute top-2 left-3 font-mono text-[9px] tracking-widest uppercase" style={{ color: 'var(--e-text-muted)' }}>
            TARGET_LOCK_ENGAGED
          </div>
          <div
            className="h-[240px] border rounded-sm flex items-center justify-center relative mt-4"
            style={{ backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)' }}
          >
            <div
              className="w-36 h-36 rounded-full border-2 border-dashed flex items-center justify-center animate-spin [animation-duration:25s]"
              style={{ borderColor: 'var(--e-accent-soft)' }}
            >
              <div className="w-24 h-24 rounded-full border border-double" style={{ borderColor: 'var(--e-accent)', opacity: 0.4 }}></div>
            </div>
            <div className="absolute font-mono font-black text-md tracking-widest uppercase" style={{ color: 'var(--e-text)' }}>
              [ 🕹️ ]
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-xs font-mono p-3 border rounded-sm" style={{ borderColor: 'var(--e-accent)', color: 'var(--e-accent)' }}>
          {error}
        </div>
      )}

      {/* 2. QUICK STATUS HUD TICKER */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 border p-4 rounded-sm font-mono text-[11px] tracking-wide"
        style={{ backgroundColor: 'var(--e-bg-alt)', borderColor: 'var(--e-border)' }}
      >
        <div className="border-r last:border-0 pr-2" style={{ borderColor: 'var(--e-border)' }}>
          <span className="block font-black text-[9px] tracking-wider" style={{ color: 'var(--e-text-dim)' }}>TOTAL TOURNAMENTS</span>
          <span className="font-bold text-sm" style={{ color: 'var(--e-text)' }}>
            {loading ? '...' : stats?.tournaments ?? 0}
          </span>
        </div>
        <div className="border-r last:border-0 pr-2 md:pl-2" style={{ borderColor: 'var(--e-border)' }}>
          <span className="block font-black text-[9px] tracking-wider" style={{ color: 'var(--e-accent)' }}>● LIVE TOURNAMENTS</span>
          <span className="font-bold text-sm" style={{ color: 'var(--e-accent)' }}>
            {loading ? '...' : `${liveTournaments.length} ONGOING`}
          </span>
        </div>
        <div className="border-r last:border-0 pr-2 md:pl-2" style={{ borderColor: 'var(--e-border)' }}>
          <span className="block font-black text-[9px] tracking-wider" style={{ color: 'var(--e-text-dim)' }}>TOTAL PLAYERS</span>
          <span className="font-bold text-sm" style={{ color: 'var(--e-text)' }}>
            {loading ? '...' : `${stats?.players ?? 0} REGISTERED`}
          </span>
        </div>
        <div className="md:pl-2">
          <span className="block font-black text-[9px] tracking-wider" style={{ color: 'var(--e-text-dim)' }}>TOTAL TEAMS</span>
          <span className="font-bold text-sm" style={{ color: 'var(--e-success)' }}>
            {loading ? '...' : stats?.teams ?? 0}
          </span>
        </div>
      </div>

      {/* 3. LIVE ECOSYSTEM GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b pb-2" style={{ borderColor: 'var(--e-border)' }}>
          <h3 className="text-xl font-black tracking-wider uppercase" style={{ color: 'var(--e-text)' }}>LIVE ECOSYSTEM</h3>
          <button
            className="text-[10px] font-mono font-black transition-colors tracking-widest uppercase"
            style={{ color: 'var(--e-text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--e-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--e-text-muted)')}
          >
            VIEW ALL DATA →
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Streaming Display Card */}
          <div
            className="lg:col-span-8 border p-6 rounded-sm flex flex-col justify-between relative group transition-all"
            style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
          >
            <span
              className="absolute top-4 left-4 font-mono font-black text-[9px] px-2 py-0.5 rounded-sm tracking-wider"
              style={{ backgroundColor: 'var(--e-accent)', color: '#000' }}
            >
              {featuredTournament ? '● LIVE TOURNAMENT' : '○ NO LIVE TOURNAMENT'}
            </span>
            <div
              className="h-48 flex items-center justify-center border rounded-sm my-6 relative overflow-hidden"
              style={{ backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)' }}
            >
              <h2 className="text-3xl font-black tracking-widest uppercase group-hover:scale-105 transition-transform duration-300 text-center px-4" style={{ color: 'var(--e-text)' }}>
                {featuredTournament ? featuredTournament.name : 'AWAITING NEXT MATCH'}
              </h2>
              <div className="absolute bottom-3 text-[10px] font-mono font-bold tracking-wider uppercase" style={{ color: 'var(--e-text-muted)' }}>
                {featuredTournament ? `${featuredTournament.game} • ${featuredTournament.teamIds.length}/${featuredTournament.maxTeams} TEAMS` : 'STAY TUNED'}
              </div>
            </div>
          </div>

          {/* Right Information Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {liveTournaments.slice(0, 2).map((t) => (
              <div
                key={t.id}
                className="border p-4 rounded-sm flex gap-4 items-center group transition-all"
                style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
              >
                <div
                  className="w-16 h-14 border flex items-center justify-center text-md rounded-sm"
                  style={{ backgroundColor: 'var(--e-bg)', borderColor: 'var(--e-border)' }}
                >
                  ⚔️
                </div>
                <div>
                  <span className="text-[9px] font-mono font-black tracking-wider block" style={{ color: 'var(--e-accent)' }}>ONGOING</span>
                  <h4 className="text-xs font-black uppercase tracking-wide" style={{ color: 'var(--e-text)' }}>{t.name}</h4>
                  <p className="text-[10px] mt-0.5 font-normal line-clamp-1" style={{ color: 'var(--e-text-muted)' }}>{t.game}</p>
                </div>
              </div>
            ))}

            {liveTournaments.length === 0 && !loading && (
              <div
                className="border p-4 rounded-sm text-center text-[10px] font-mono uppercase tracking-wider"
                style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)', color: 'var(--e-text-dim)' }}
              >
                No ongoing tournaments right now
              </div>
            )}

            {/* Season Rewards Promo Card */}
            <div
              className="p-4 rounded-sm flex justify-between items-center group transition-all cursor-pointer border"
              style={{ backgroundColor: 'var(--e-accent-soft)', borderColor: 'var(--e-accent)' }}
            >
              <div>
                <span className="text-[9px] font-mono font-black tracking-wider block" style={{ color: 'var(--e-accent)' }}>SEASON REWARDS</span>
                <h4 className="text-xs font-black uppercase tracking-wide" style={{ color: 'var(--e-text)' }}>UNLOCK THE OBSIDIAN CORE</h4>
              </div>
              <span className="text-sm font-bold group-hover:translate-x-1 transition-transform" style={{ color: 'var(--e-text)' }}>→</span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;