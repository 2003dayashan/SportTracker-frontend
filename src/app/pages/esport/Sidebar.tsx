// src/pages/esport/Sidebar.tsx
import React from 'react';
import { motion } from 'motion/react';

export type EsportPage =
  | 'esport-home'
  | 'esport-dashboard'
  | 'esport-tournaments'
  | 'esport-teams'
  | 'esport-players'
  | 'esport-matches'
  | 'esport-brackets'
  | 'esport-leaderboard'
  | 'esport-profile'
  | 'esport-search';

interface SidebarProps {
  currentPage: EsportPage;
  onNavigate: (page: EsportPage) => void;
  onExit: () => void;
}

const menuContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

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
    { name: 'SEARCH', path: 'esport-search' },
  ];

  return (
    <div className="w-64 bg-[var(--e-nav-bg)] border-r border-[var(--e-border)] flex flex-col justify-between p-6 shrink-0 font-sans select-none">
      <div>
        {/* LOGO HEADER */}
        <motion.div
          className="mb-10 cursor-pointer text-left"
          onClick={() => onNavigate('esport-home')}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ x: 2 }}
        >
          <h1 className="text-5xl tracking-tighter text-[var(--e-accent)] font-display uppercase leading-none font-bold">
            STICK LEAGUE
          </h1>
          <p className="text-[10px] tracking-[0.37em] text-[var(--e-text-muted)] font-mono font-black mt-1 pl-0.5">
            UNDERGROUND PRO
          </p>
        </motion.div>

        {/* NAVIGATION LINKS */}
        <motion.nav className="space-y-1" variants={menuContainer} initial="hidden" animate="show">
          {menuItems.map((item) => {
            const isActive = currentPage === item.path;
            return (
              <motion.button
                key={item.name}
                variants={menuItemVariants}
                onClick={() => onNavigate(item.path)}
                whileHover={{ x: isActive ? 0 : 4 }}
                whileTap={{ scale: 0.97 }}
                className={`relative w-full text-left px-4 py-3.5 text-sm tracking-widest transition-all overflow-hidden flex items-center font-display border-l-4 ${
                  isActive 
                    ? 'bg-[var(--e-primary-container)] border-[var(--e-accent)] text-white font-extrabold' 
                    : 'border-transparent text-[var(--e-text-muted)] hover:text-[var(--e-accent)] hover:bg-[var(--e-surface-container-low)] font-medium'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
              </motion.button>
            );
          })}
        </motion.nav>
      </div>

      {/* USER CARD / LEAGUE VERSION */}
      <motion.div
        className="bg-[var(--e-card-bg-2)] p-4 border border-[var(--e-border)] flex items-center gap-3 cursor-pointer hover:border-[var(--e-accent)]/50 transition-colors"
        onClick={onExit}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="bg-[var(--e-accent)] text-black font-black text-xs p-1.5 px-2 rounded-sm font-display">
          SL
        </div>
        <div>
          <p className="text-[10px] font-black text-[var(--e-text)] tracking-wider font-mono">EXIT ARENA</p>
          <p className="text-[9px] text-[var(--e-text-muted)] font-mono">v.2.0.4-BETA</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;

