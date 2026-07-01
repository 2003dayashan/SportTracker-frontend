// src/pages/esport/Sidebar.tsx
import React from 'react';

export type EsportPage =
  | 'esport-home'
  | 'esport-dashboard'
  | 'esport-tournaments'
  | 'esport-teams'
  | 'esport-players'
  | 'esport-matches'
  | 'esport-brackets'
  | 'esport-leaderboard'
  | 'esport-profile';

interface SidebarProps {
  currentPage: EsportPage;
  onNavigate: (page: EsportPage) => void;
  onExit: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onExit }) => {
  const menuItems: { name: string; path: EsportPage }[] = [
    { name: 'HOME', path: 'esport-home' },
    { name: 'DASHBOARD', path: 'esport-dashboard' },
    { name: 'TOURNAMENT', path: 'esport-tournaments' },
    { name: 'TEAMS', path: 'esport-teams' },
    { name: 'PLAYERS', path: 'esport-players' },
    { name: 'MATCHES', path: 'esport-matches' },
    { name: 'BRACKETS', path: 'esport-brackets' },
    { name: 'LEADERBOARD', path: 'esport-leaderboard' },
    { name: 'PROFILE', path: 'esport-profile' },
  ];

  return (
    <div className="w-64 bg-[var(--e-nav-bg)] border-r border-[var(--e-border)] flex flex-col justify-between p-6 shrink-0">
      <div>
        <div className="mb-10 cursor-pointer" onClick={() => onNavigate('esport-home')}>
          <h1 className="text-3xl font-black tracking-tighter text-[var(--e-accent)]">STICK LEAGUE</h1>
          <p className="text-[10px] tracking-[0.3em] text-[var(--e-text-muted)]">UNDERGROUND PRO</p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPage === item.path;
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.path)}
                className={`w-full text-left px-4 py-3 text-xs font-bold tracking-widest transition-all ${
                  isActive
                    ? 'bg-[var(--e-accent)]/10 text-[var(--e-accent)] border-l-4 border-[var(--e-accent)]'
                    : 'text-[var(--e-text-muted)] hover:text-[var(--e-text-strong)] hover:bg-[var(--e-card-bg)]'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div
        className="bg-[var(--e-card-bg)] p-3 rounded border border-[var(--e-border)] flex items-center gap-3 cursor-pointer hover:border-[var(--e-accent)]/40 transition-all"
        onClick={onExit}
      >
        <div className="bg-[var(--e-accent)] text-black font-bold text-xs p-1 px-2 rounded">SL</div>
        <div>
          <p className="text-[10px] font-bold text-[var(--e-text-strong)] tracking-wider">EXIT ARENA</p>
          <p className="text-[9px] text-[var(--e-text-muted)]">v.2.0.4-BETA</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;