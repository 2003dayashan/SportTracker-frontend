// src/pages/esport/TopNav.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useEsportTheme } from './EsportThemeContext';

const TopNav: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const { theme, toggleTheme } = useEsportTheme();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    alert(`Searching for "${searchQuery}" in category: ${searchCategory.toUpperCase()}`);
  };

  return (
    <header className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-8 py-4 bg-[var(--e-nav-bg)] border-b border-[var(--e-border)] gap-4 shrink-0">

      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center bg-[var(--e-card-bg-2)] border border-[var(--e-border)] rounded overflow-hidden max-w-md w-full focus-within:border-[var(--e-accent)] transition-all"
      >
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="bg-[var(--e-card-bg)] text-[var(--e-text-muted)] text-[10px] font-bold uppercase tracking-wider px-3 py-2 border-r border-[var(--e-border)] focus:outline-none cursor-pointer"
        >
          <option value="all">ALL</option>
          <option value="tournaments">TOURNAMENTS</option>
          <option value="teams">TEAMS</option>
          <option value="players">PLAYERS</option>
        </select>

        <input
          type="text"
          placeholder="SEARCH TOURNAMENTS, TEAMS, PLAYERS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-xs text-[var(--e-text)] px-4 py-2 w-full focus:outline-none placeholder-[var(--e-text-dim)]"
        />

        <button
          type="submit"
          className="bg-[var(--e-border)] hover:bg-[var(--e-accent)] text-[var(--e-text-muted)] hover:text-black px-4 transition-all text-xs font-bold"
        >
          GO
        </button>
      </form>

      <div className="flex items-center justify-between md:justify-end gap-6 font-mono">
        <div className="text-xs tracking-widest text-[var(--e-text-muted)]">
          REGION: <span className="text-[var(--e-accent)] font-bold">DARK_SUB_01</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] text-green-500 flex items-center gap-1.5 font-bold tracking-widest">
            <span className="h-2 w-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
            SESSION: ACTIVE
          </span>

          {/* Dark / Light toggle — esport section only */}
          <motion.button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9, rotate: 25 }}
            className="h-8 w-8 rounded-full border border-[var(--e-border)] bg-[var(--e-card-bg-2)] flex items-center justify-center overflow-hidden hover:border-[var(--e-accent)] transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.svg
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--e-text-muted)" strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="moon"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--e-text-muted)" strokeWidth="2"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="h-8 w-8 rounded-full border border-[var(--e-accent)] bg-[var(--e-card-bg)] flex items-center justify-center cursor-pointer hover:scale-105 transition-all overflow-hidden">
            <span className="text-[10px] font-black text-[var(--e-accent)]">42</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
