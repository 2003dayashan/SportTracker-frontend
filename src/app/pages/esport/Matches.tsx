import React, { useState } from 'react';

interface MatchItem {
  id: string;
  type: 'live' | 'upcoming' | 'completed' | 'scheduled';
  timeText: string;
  map: string;
  team1Name: string;
  team1Score?: number;
  team1Icon: string;
  team2Name: string;
  team2Score?: number;
  team2Icon: string;
  hasReminder?: boolean;
}

const Matches: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [matches, setMatches] = useState<MatchItem[]>([
    {
      id: 'STK-001',
      type: 'completed',
      timeText: 'STK-001 | COMPLETED',
      map: 'DOCKLANDS',
      team1Name: 'TITANS',
      team1Score: 1,
      team1Icon: 'star',
      team2Name: 'PHANTOM',
      team2Score: 2,
      team2Icon: 'rocket_launch'
    },
    {
      id: 'STK-002',
      type: 'upcoming',
      timeText: 'STK-002 | TOMORROW @ 20:00',
      map: 'SECTOR 7',
      team1Name: 'NOVA',
      team1Icon: 'diamond',
      team2Name: 'STRIKE',
      team2Icon: 'bolt',
      hasReminder: false
    },
    {
      id: 'STK-003',
      type: 'scheduled',
      timeText: 'STK-003 | SCHEDULED (2 DAYS)',
      map: 'CORE DEPOT',
      team1Name: 'EMBER',
      team1Icon: 'local_fire_department',
      team2Name: 'FROST',
      team2Icon: 'ac_unit'
    },
    {
      id: 'STK-004',
      type: 'upcoming',
      timeText: 'STK-004 | TOMORROW @ 22:30',
      map: 'THE VOID',
      team1Name: 'REAPERS',
      team1Icon: 'skull',
      team2Name: 'MINDSET',
      team2Icon: 'psychology',
      hasReminder: false
    }
  ]);

  const toggleReminder = (id: string) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, hasReminder: !m.hasReminder } : m));
  };

  const filteredMatches = matches.filter(m => {
    if (activeTab === 'all') return true;
    if (activeTab === 'live') return m.type === 'live';
    if (activeTab === 'upcoming') return m.type === 'upcoming' || m.type === 'scheduled';
    if (activeTab === 'completed') return m.type === 'completed';
    return true;
  });

  return (
    <div className="space-y-12 select-none subpixel-antialiased text-left">
      {/* FEATURED LIVE MATCH */}
      <section className="mb-12">
        <div className="relative w-full aspect-video rough-ink-border overflow-hidden bg-surface-container-lowest group">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms] grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMG4RpnbD8nwpoRtEVB0Y7oQROcs0Y8wStGxEr4KPN65UTbt79sLovcWcQU7H8Tw5pik2b4u2zXur98hxbTFM69AtNh_ylUAF49RR7J2sMVQ8nL-dTiMjPitjxBx3sqbVxvE6hBLDvMGBiWcjEoxlaMpXmxGLkilVspaM0Ouz0Cr4FP46WWKSlSq3MX3uLeKOu_GR5mna_s3shQrFzYqYI3SsZpJ40Bvi5QOpmcF7sI0ZYvVVuoYt26IXThr5l-ruOm9jODfBkq2w" 
              alt="Live Match"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--e-bg)] via-transparent to-transparent"></div>
          </div>
          {/* Overlay Details */}
          <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-between z-10">
            <div className="flex justify-between items-start">
              <div className="bg-primary text-black font-mono text-[9px] font-black px-3 py-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                LIVE NOW
              </div>
              <div className="flex gap-4">
                <span className="bg-[var(--e-card-bg)]/80 backdrop-blur-md px-3 py-1.5 font-mono text-[9px] font-bold flex items-center gap-2 border border-[var(--e-border)]/40 text-[var(--e-text)]">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  12.4K VIEWERS
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <h1 className="font-display text-4xl md:text-6xl text-primary uppercase leading-none max-w-xl font-bold tracking-tight">GRAND FINALS: VANGUARD vs SYNDICATE</h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center border border-[var(--e-accent)]">
                      <span className="material-symbols-outlined text-primary">security</span>
                    </div>
                    <span className="font-display text-3xl md:text-4xl font-bold text-white leading-none">12</span>
                  </div>
                  <span className="text-primary font-display text-2xl font-bold">—</span>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-3xl md:text-4xl font-bold text-white leading-none">09</span>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center border border-[var(--e-accent)]">
                      <span className="material-symbols-outlined text-primary">shield</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <button className="bg-primary text-black px-6 py-3.5 font-display text-sm tracking-wider flex items-center gap-3 hover:scale-95 transition-transform font-extrabold">
                    <span className="material-symbols-outlined text-base">play_arrow</span>
                    WATCH BROADCAST
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">CURRENT MAP</p>
                  <p className="font-display text-3xl text-on-surface font-bold tracking-tight leading-none mt-1">SECTOR 7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER TABS */}
      <div className="flex items-center justify-between mb-8 border-b border-[var(--e-border)]/40">
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-1">
          <button 
            onClick={() => setActiveTab('all')}
            className={`pb-4 font-display text-sm tracking-widest transition-all font-bold ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-[var(--e-text-muted)] hover:text-primary'}`}
          >
            ALL MATCHES
          </button>
          <button 
            onClick={() => setActiveTab('live')}
            className={`pb-4 font-display text-sm tracking-widest transition-all font-bold ${activeTab === 'live' ? 'text-primary border-b-2 border-primary' : 'text-[var(--e-text-muted)] hover:text-primary'}`}
          >
            LIVE
          </button>
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 font-display text-sm tracking-widest transition-all font-bold ${activeTab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-[var(--e-text-muted)] hover:text-primary'}`}
          >
            UPCOMING
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`pb-4 font-display text-sm tracking-widest transition-all font-bold ${activeTab === 'completed' ? 'text-primary border-b-2 border-primary' : 'text-[var(--e-text-muted)] hover:text-primary'}`}
          >
            RESULTS
          </button>
        </div>
        <div className="flex items-center gap-4 pb-4">
          <span className="material-symbols-outlined text-[var(--e-text-muted)] cursor-pointer hover:text-primary">search</span>
          <span className="material-symbols-outlined text-[var(--e-text-muted)] cursor-pointer hover:text-primary">filter_list</span>
        </div>
      </div>

      {/* MATCH LIST (GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map((m, idx) => (
          <div key={idx} className="bg-[var(--e-card-bg)] border border-[var(--e-border)] p-6 group hover:shadow-[inset_0_0_20px_rgba(130,38,33,0.15)] transition-all flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className={`text-[9px] font-mono uppercase font-bold tracking-widest ${m.type === 'upcoming' ? 'text-primary' : 'text-[var(--e-text-muted)]'}`}>{m.timeText}</span>
                <span className="bg-[var(--e-card-bg-2)] border border-[var(--e-border)] px-2.5 py-1 font-mono text-[9px] font-bold text-[var(--e-text)]">{m.map}</span>
              </div>
              <div className="flex items-center justify-between mb-8">
                <div className="text-center space-y-2 w-24">
                  <div className="w-16 h-16 bg-[var(--e-surface-container-low)] p-2 border border-[var(--e-border)] flex items-center justify-center mx-auto grayscale group-hover:grayscale-0 transition-all">
                    <span className="material-symbols-outlined text-primary text-3xl">{m.team1Icon}</span>
                  </div>
                  <p className="font-display text-xl font-bold tracking-wider text-[var(--e-text)]">{m.team1Name}</p>
                </div>
                <div className="text-center">
                  {m.type === 'completed' ? (
                    <div className="flex items-center">
                      <span className="font-display text-4xl text-[var(--e-text)] opacity-30 font-bold leading-none">{m.team1Score}</span>
                      <span className="mx-3 text-primary opacity-30 font-display text-xl font-bold leading-none">:</span>
                      <span className="font-display text-4xl text-primary font-bold leading-none">{m.team2Score}</span>
                    </div>
                  ) : (
                    <p className="font-display text-2xl text-primary opacity-40 font-bold tracking-wide">VS</p>
                  )}
                </div>
                <div className="text-center space-y-2 w-24">
                  <div className="w-16 h-16 bg-[var(--e-surface-container-low)] p-2 border border-[var(--e-border)] flex items-center justify-center mx-auto grayscale group-hover:grayscale-0 transition-all">
                    <span className="material-symbols-outlined text-primary text-3xl">{m.team2Icon}</span>
                  </div>
                  <p className="font-display text-xl font-bold tracking-wider text-[var(--e-text)]">{m.team2Name}</p>
                </div>
              </div>
            </div>
            {m.type === 'completed' ? (
              <div className="flex gap-2">
                <button className="flex-1 bg-[var(--e-card-bg-2)] border border-[var(--e-border)] py-2.5 font-display text-xs font-extrabold hover:bg-[var(--e-surface-container-high)] transition-colors text-[var(--e-text)] tracking-wider">MATCH REPLAY</button>
                <button className="flex-1 bg-[var(--e-card-bg-2)] border border-[var(--e-border)] py-2.5 font-display text-xs font-extrabold hover:bg-[var(--e-surface-container-high)] transition-colors text-[var(--e-text)] tracking-wider">STATISTICS</button>
              </div>
            ) : m.type === 'upcoming' ? (
              <button 
                onClick={() => toggleReminder(m.id)}
                className={`w-full border py-3.5 font-display text-sm tracking-wider flex items-center justify-center gap-3 transition-all ${m.hasReminder ? 'bg-primary border-primary text-black font-extrabold' : 'bg-primary-container/20 border-primary-container text-primary hover:bg-primary-container font-extrabold'}`}
              >
                <span className="material-symbols-outlined text-base">{m.hasReminder ? 'check_circle' : 'notifications'}</span>
                {m.hasReminder ? 'REMINDER SET' : 'SET REMINDER'}
              </button>
            ) : (
              <button className="w-full bg-[var(--e-card-bg-2)] border border-[var(--e-border)] py-3.5 font-display text-sm tracking-wider text-[var(--e-text)] hover:bg-[var(--e-surface-container-high)] transition-colors font-extrabold">VIEW PRE-MATCH DATA</button>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-12 text-center py-12 relative overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 h-px bg-outline-variant ink-scratch"></div>
        <button className="relative bg-[var(--e-bg)] px-8 font-display text-sm text-primary hover:tracking-widest transition-all uppercase font-extrabold">SHOWING {filteredMatches.length} OF 32 MATCHES — LOAD MORE</button>
      </div>
    </div>
  );
};

export default Matches;

