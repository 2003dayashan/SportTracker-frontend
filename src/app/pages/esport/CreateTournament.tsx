// src/pages/esport/CreateTournament.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface TacticalEnvironment {
  id: string;
  name: string;
  tag: string;
  image: string;
}

interface CreateTournamentProps {
  onCreated?: () => void;
}

const ENVIRONMENTS: TacticalEnvironment[] = [
  {
    id: 'the-vault',
    name: 'THE VAULT',
    tag: 'INDUSTRIAL SECTOR',
    image:
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'apex-roof',
    name: 'APEX ROOF',
    tag: 'URBAN FRINGE',
    image:
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'track-09',
    name: 'TRACK 09',
    tag: 'TRANSIT HUB',
    image:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop',
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const CreateTournament: React.FC<CreateTournamentProps> = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [participantLimit, setParticipantLimit] = useState(16);
  const [startDate, setStartDate] = useState('');
  const [prizePool, setPrizePool] = useState(5000);
  const [selectedEnvs, setSelectedEnvs] = useState<string[]>(['the-vault', 'track-09']);
  const [hardcoreMode, setHardcoreMode] = useState(true);
  const [spectatorMode, setSpectatorMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleEnv = (id: string) => {
    setSelectedEnvs((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Tournament name is required.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`"${name.toUpperCase()}" INITIALIZED — ${selectedEnvs.length} arenas locked`);
      onCreated?.();
    }, 700);
  };

  return (
    <div className="space-y-10 select-none subpixel-antialiased text-left max-w-4xl">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="font-display text-6xl uppercase tracking-tight font-black text-on-surface leading-none">
          INITIALIZE TOURNAMENT
        </h1>
        <p className="text-[var(--e-text-muted)] mt-3 max-w-xl">
          Define the parameters of your clandestine operation. High stakes, ruthless
          competition, ink-stained glory.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* 01 — CORE PARAMETERS */}
        <motion.section variants={sectionVariants} initial="hidden" animate="show">
          <SectionTitle step="01" title="CORE PARAMETERS" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="TOURNAMENT NAME">
              <input
                type="text"
                placeholder="e.g. THE UNDERGROUND OPEN"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border border-[var(--e-border)] p-3.5 text-on-surface outline-none focus:border-primary transition-colors placeholder:text-[var(--e-text-dim)]"
              />
            </Field>
            <Field label="PARTICIPANT LIMIT" suffix="SLOTS">
              <input
                type="number"
                min={2}
                value={participantLimit}
                onChange={(e) => setParticipantLimit(Number(e.target.value))}
                className="w-full bg-transparent border border-[var(--e-border)] p-3.5 text-on-surface outline-none focus:border-primary transition-colors"
              />
            </Field>
            <Field label="START DATE & TIME">
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent border border-[var(--e-border)] p-3.5 text-on-surface outline-none focus:border-primary transition-colors [color-scheme:dark]"
              />
            </Field>
            <Field label="PRIZE POOL (STK)" prefixSymbol>
              <input
                type="number"
                min={0}
                value={prizePool}
                onChange={(e) => setPrizePool(Number(e.target.value))}
                className="w-full bg-transparent border border-[var(--e-border)] p-3.5 pl-9 text-on-surface outline-none focus:border-primary transition-colors"
              />
            </Field>
          </div>
        </motion.section>

        {/* 02 — TACTICAL ENVIRONMENTS */}
        <motion.section variants={sectionVariants} initial="hidden" animate="show" transition={{ delay: 0.05 }}>
          <SectionTitle step="02" title="TACTICAL ENVIRONMENTS" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ENVIRONMENTS.map((env) => {
              const active = selectedEnvs.includes(env.id);
              return (
                <motion.button
                  type="button"
                  key={env.id}
                  onClick={() => toggleEnv(env.id)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative text-left border overflow-hidden group transition-colors ${
                    active ? 'border-primary' : 'border-[var(--e-border)]'
                  }`}
                >
                  <div className="aspect-video w-full overflow-hidden bg-black/40 grayscale">
                    <motion.img
                      src={env.image}
                      alt={env.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between bg-[var(--e-card-bg)]">
                    <div>
                      <div className="font-display font-bold text-on-surface tracking-wide">{env.name}</div>
                      <div className="text-[10px] text-[var(--e-text-muted)] uppercase tracking-widest mt-0.5">
                        {env.tag}
                      </div>
                    </div>
                    <span
                      className={`h-5 w-5 flex items-center justify-center border shrink-0 transition-colors ${
                        active
                          ? 'bg-primary border-primary text-black'
                          : 'border-[var(--e-border)] text-transparent'
                      }`}
                    >
                      <AnimatePresence>
                        {active && (
                          <motion.svg
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* 03 — ENGAGEMENT PROTOCOLS */}
        <motion.section variants={sectionVariants} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
          <SectionTitle step="03" title="ENGAGEMENT PROTOCOLS" />
          <div className="border border-[var(--e-border)] divide-y divide-[var(--e-border)]/50 bg-[var(--e-card-bg)]">
            <ProtocolRow
              title="HARDCORE MODE"
              description="Permadeath rules apply. Eliminated squads are locked out for the season."
              checked={hardcoreMode}
              onChange={setHardcoreMode}
            />
            <ProtocolRow
              title="SPECTATOR BROADCAST"
              description="Enable public live-viewing and betting on this bracket."
              checked={spectatorMode}
              onChange={setSpectatorMode}
            />
          </div>
        </motion.section>

        {/* SUBMIT */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.15 }}
          className="flex justify-end gap-4 pt-2"
        >
          <button
            type="button"
            className="px-6 py-3.5 border border-[var(--e-border)] text-on-surface hover:bg-[var(--e-card-bg-2)] transition-colors font-display text-sm font-extrabold tracking-wider"
          >
            DISCARD
          </button>
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.97 }}
            className="px-8 py-3.5 bg-primary text-black font-extrabold hover:bg-primary/95 transition-colors font-display text-sm tracking-wider disabled:opacity-60 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-black/40 border-t-black animate-spin" />
                DEPLOYING...
              </>
            ) : (
              'LAUNCH TOURNAMENT'
            )}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

const SectionTitle: React.FC<{ step: string; title: string }> = ({ step, title }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="bg-primary text-black font-display font-black text-sm px-2.5 py-1">{step}</span>
    <h2 className="font-display text-xl tracking-wider text-on-surface font-bold">{title}</h2>
  </div>
);

const Field: React.FC<{
  label: string;
  suffix?: string;
  prefixSymbol?: boolean;
  children: React.ReactNode;
}> = ({ label, suffix, prefixSymbol, children }) => (
  <div>
    <label className="block text-[10px] font-bold text-[var(--e-text-muted)] uppercase tracking-widest mb-2 font-mono">
      {label}
    </label>
    <div className="relative flex items-center">
      {prefixSymbol && (
        <span className="absolute left-3 text-[var(--e-text-muted)] font-bold pointer-events-none">$</span>
      )}
      {children}
      {suffix && (
        <span className="absolute right-3 text-[10px] font-bold text-[var(--e-text-muted)] uppercase tracking-widest pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const ProtocolRow: React.FC<{
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ title, description, checked, onChange }) => (
  <div className="flex items-center justify-between gap-6 p-5">
    <div>
      <div className="font-display font-bold text-on-surface tracking-wide text-sm">{title}</div>
      <p className="text-[11px] text-[var(--e-text-muted)] mt-1 max-w-md">{description}</p>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-[var(--e-surface-container-highest)]'
      }`}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-black shadow-md"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  </div>
);

export default CreateTournament;

