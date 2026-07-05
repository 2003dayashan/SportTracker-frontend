import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TournamentApi,
  TeamApi,
  PlayerApi,
  type Tournament,
  type Team,
  type Player,
} from '../../../lib/esportApi';

type Tab = 'tournaments' | 'teams' | 'players';

const TABS: { id: Tab; label: string }[] = [
  { id: 'tournaments', label: 'TOURNAMENTS' },
  { id: 'teams', label: 'TEAMS' },
  { id: 'players', label: 'PLAYERS' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('tournaments');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Focus the input with cmd/ctrl+k, matching the "CMD + K" hint in the UI
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('void-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setTournaments([]);
      setTeams([]);
      setPlayers([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    const handle = setTimeout(async () => {
      try {
        const [t, tm, p] = await Promise.all([
          TournamentApi.search(q),
          TeamApi.search(q),
          PlayerApi.search(q),
        ]);
        if (!cancelled) {
          setTournaments(t);
          setTeams(tm);
          setPlayers(p);
          setHasSearched(true);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Query failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300); // debounce

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query]);

  const counts = useMemo(
    () => ({
      tournaments: tournaments.length,
      teams: teams.length,
      players: players.length,
    }),
    [tournaments, teams, players],
  );

  return (
    <div className="space-y-8 font-sans" style={{ color: 'var(--e-text)' }}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-black tracking-tighter uppercase" style={{ color: 'var(--e-accent)' }}>
          THE VOID
        </h1>
        <p className="text-[10px] tracking-[0.3em] uppercase mt-1" style={{ color: 'var(--e-text-muted)' }}>
          Query tournaments, squads &amp; operators across the league
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center gap-3 rounded-sm border px-4 py-3"
        style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--e-text-muted)" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          id="void-search-input"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="QUERY THE VOID..."
          className="flex-1 bg-transparent text-sm font-mono uppercase tracking-wide focus:outline-none placeholder:opacity-50"
          style={{ color: 'var(--e-text)' }}
        />
        <kbd
          className="hidden sm:inline-block text-[10px] font-mono font-bold px-2 py-1 rounded-sm border"
          style={{ borderColor: 'var(--e-border)', color: 'var(--e-text-dim)' }}
        >
          CMD + K
        </kbd>
      </motion.div>

      <div className="flex items-center gap-6 border-b" style={{ borderColor: 'var(--e-border)' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="relative pb-3 text-xs font-black tracking-widest uppercase transition-colors"
            style={{ color: tab === t.id ? 'var(--e-accent)' : 'var(--e-text-muted)' }}
          >
            {t.label}
            {hasSearched && counts[t.id] > 0 && (
              <span className="ml-1.5 opacity-60">({counts[t.id]})</span>
            )}
            {tab === t.id && (
              <motion.div
                layoutId="void-tab-underline"
                className="absolute left-0 right-0 -bottom-[1px] h-[2px]"
                style={{ backgroundColor: 'var(--e-accent)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="text-xs font-mono p-3 border rounded-sm" style={{ borderColor: 'var(--e-accent)', color: 'var(--e-accent)' }}>
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!query.trim() ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-24 text-xs font-mono uppercase tracking-widest"
            style={{ color: 'var(--e-text-dim)' }}
          >
            Start typing to search the league database...
          </motion.div>
        ) : loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-24 text-xs font-mono uppercase tracking-widest"
            style={{ color: 'var(--e-text-muted)' }}
          >
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              Scanning the void...
            </motion.span>
          </motion.div>
        ) : (
          <motion.div key={tab} variants={container} initial="hidden" animate="show" className="space-y-3">
            {tab === 'tournaments' &&
              (tournaments.length === 0 ? (
                <EmptyState label="No tournaments found" />
              ) : (
                tournaments.map((t) => (
                  <motion.div
                    key={t.id}
                    variants={item}
                    whileHover={{ x: 4, borderColor: 'var(--e-accent)' }}
                    className="flex items-center justify-between rounded-sm border p-4 transition-colors"
                    style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
                  >
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wide">{t.name}</h4>
                      <p className="text-[10px] font-mono uppercase mt-1" style={{ color: 'var(--e-text-muted)' }}>
                        {t.game} • {t.format.replace('_', ' ')} • {t.teamIds.length}/{t.maxTeams} TEAMS
                      </p>
                    </div>
                    <span
                      className="text-[9px] font-mono font-black px-2 py-1 rounded-sm tracking-wider"
                      style={{ backgroundColor: 'var(--e-accent-soft)', color: 'var(--e-accent)' }}
                    >
                      {t.status}
                    </span>
                  </motion.div>
                ))
              ))}

            {tab === 'teams' &&
              (teams.length === 0 ? (
                <EmptyState label="No squads found" />
              ) : (
                teams.map((t) => (
                  <motion.div
                    key={t.id}
                    variants={item}
                    whileHover={{ x: 4, borderColor: 'var(--e-accent)' }}
                    className="flex items-center gap-4 rounded-sm border p-4 transition-colors"
                    style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
                  >
                    <div
                      className="h-10 w-10 rounded-sm border flex items-center justify-center text-xs font-black"
                      style={{ borderColor: 'var(--e-border)', color: 'var(--e-accent)' }}
                    >
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wide">{t.name}</h4>
                      <p className="text-[10px] font-mono uppercase mt-1" style={{ color: 'var(--e-text-muted)' }}>
                        {t.playerIds.length} OPERATORS ENLISTED
                      </p>
                    </div>
                  </motion.div>
                ))
              ))}

            {tab === 'players' &&
              (players.length === 0 ? (
                <EmptyState label="No operators found" />
              ) : (
                players.map((p) => (
                  <motion.div
                    key={p.id}
                    variants={item}
                    whileHover={{ x: 4, borderColor: 'var(--e-accent)' }}
                    className="flex items-center justify-between rounded-sm border p-4 transition-colors"
                    style={{ backgroundColor: 'var(--e-card)', borderColor: 'var(--e-border)' }}
                  >
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wide">{p.username}</h4>
                      <p className="text-[10px] font-mono uppercase mt-1" style={{ color: 'var(--e-text-muted)' }}>
                        {p.role || 'UNASSIGNED ROLE'}
                      </p>
                    </div>
                    <span className="text-[9px] font-mono uppercase" style={{ color: 'var(--e-text-dim)' }}>
                      ID: {p.id.slice(0, 8)}
                    </span>
                  </motion.div>
                ))
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EmptyState: React.FC<{ label: string }> = ({ label }) => (
  <div
    className="text-center py-16 text-xs font-mono uppercase tracking-widest rounded-sm border"
    style={{ borderColor: 'var(--e-border)', color: 'var(--e-text-dim)' }}
  >
    {label}
  </div>
);

export default Search;

