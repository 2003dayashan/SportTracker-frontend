import React, { useEffect, useState } from 'react';

interface Engagement {
  id: string;
  tournament: string;
  matchup: string;
  status: string;
  load: string;
  isInProgress: boolean;
}

interface VitalityLog {
  timestamp: string;
  text: string;
}

const Dashboard: React.FC = () => {
  const [engagements, setEngagements] = useState<Engagement[]>([
    { id: '#ST-2091', tournament: 'CHAMPIONS CLASH S01', matchup: 'VOID vs SPECTRE', status: 'IN-PROGRESS', load: '88%', isInProgress: true },
    { id: '#ST-2104', tournament: 'NEON UNDERGROUND', matchup: 'RAZOR vs GHOST', status: 'IN-PROGRESS', load: '94%', isInProgress: true },
    { id: '#ST-2105', tournament: 'PIT MASTER INVITATIONAL', matchup: 'TITAN vs COLOSSUS', status: 'QUEUED', load: '2%', isInProgress: false },
    { id: '#ST-2106', tournament: 'CHAMPIONS CLASH S01', matchup: 'REAPER vs SOUL', status: 'QUEUED', load: '0%', isInProgress: false },
    { id: '#ST-2107', tournament: 'IRON LEAGUE OPEN', matchup: 'STORM vs LIGHTNING', status: 'IN-PROGRESS', load: '76%', isInProgress: true }
  ]);

  const [logs, setLogs] = useState<VitalityLog[]>([
    { timestamp: '09:53:55', text: 'PACKET_LOSS: 0.002%' },
    { timestamp: '09:53:58', text: 'USER_COMMAND_RECEIVED: AUTH_TOKEN' },
    { timestamp: '09:54:01', text: 'PACKET_LOSS: 0.002%' },
    { timestamp: '09:54:04', text: 'THREAT_LEVEL: MINIMAL' },
    { timestamp: '09:54:07', text: 'SYMMETRIC_ENCRYPTION_ACTIVE' },
    { timestamp: '07:36:35', text: 'SYMMETRIC_ENCRYPTION_ACTIVE' }
  ]);

  const logTemplates = [
    'THREAT_LEVEL: MINIMAL',
    'PACKET_LOSS: 0.002%',
    'SYMMETRIC_ENCRYPTION_ACTIVE',
    'USER_COMMAND_RECEIVED: AUTH_TOKEN',
    'DASHBOARD_SYNC_COMPLETE',
    'HEARTBEAT_SIGNAL: OK'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString('en-GB', { hour12: false });
      const randomText = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      setLogs(prevLogs => {
        const updated = [...prevLogs, { timestamp: timeStr, text: randomText }];
        if (updated.length > 8) updated.shift(); // keep it clean
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const syncFeed = () => {
    // Randomize some loads to show live feedback sync
    setEngagements(prev => prev.map(item => {
      if (item.isInProgress) {
        const val = Math.floor(Math.random() * 25) + 70;
        return { ...item, load: `${val}%` };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-8 select-none subpixel-antialiased text-left">
      {/* HEADER */}
      <div className="border-b border-[var(--e-border)] pb-4 flex justify-between items-baseline">
        <h1 className="font-display text-5xl text-on-surface uppercase tracking-tight font-black flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-[var(--e-accent)] rounded-full inline-block"></span>
          SYSTEM OVERRIDE
        </h1>
        <p className="font-mono text-[10px] text-[var(--e-text-muted)] tracking-widest uppercase">ADMIN COMMAND CENTER</p>
      </div>

      {/* SUMMARY CARDS ROW */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CARD 1 */}
        <div className="bg-[var(--e-card-bg)] border border-[var(--e-border)] p-6 red-inner-glow group cursor-default">
          <div className="flex justify-between items-start mb-2">
            <div className="font-display text-xl text-primary font-bold tracking-wider">TOURNAMENTS</div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">trending_up</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="font-display text-5xl font-extrabold leading-none text-on-surface">128</div>
            <div className="w-12 h-12">
              <div className="w-full h-full relative flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#353534" strokeWidth="4"></circle>
                  <circle className="drop-shadow-[0_0_4px_#ffb4ab]" cx="18" cy="18" fill="transparent" r="15.915" stroke="#ffb4ab" strokeDasharray="70 30" strokeDashoffset="25" strokeWidth="4"></circle>
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#822621" strokeDasharray="20 80" stroke-dashoffset="95" strokeWidth="4"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-surface-container-lowest border border-outline-variant/30"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[9px] text-on-surface-variant mt-3 font-mono font-bold">SIGNAL_STRENGTH: 98%</div>
        </div>

        {/* CARD 2 */}
        <div className="bg-[var(--e-card-bg)] border border-[var(--e-border)] p-6 red-inner-glow group cursor-default">
          <div className="flex justify-between items-start mb-2">
            <div className="font-display text-xl text-primary font-bold tracking-wider">TEAMS</div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">group</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="font-display text-5xl font-extrabold leading-none text-on-surface">1.4K</div>
            <div className="w-12 h-12">
              <div className="w-full h-full relative flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#353534" strokeWidth="4"></circle>
                  <circle className="drop-shadow-[0_0_4px_#ffb4ab]" cx="18" cy="18" fill="transparent" r="15.915" stroke="#ffb4ab" strokeDasharray="45 55" stroke-dashoffset="25" stroke-width="4"></circle>
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#822621" strokeDasharray="40 60" stroke-dashoffset="80" stroke-width="4"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-surface-container-lowest border border-outline-variant/30"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[9px] text-on-surface-variant mt-3 font-mono font-bold">RECRUITMENT_RATE: ACTIVE</div>
        </div>

        {/* CARD 3 */}
        <div className="bg-[var(--e-card-bg)] border border-[var(--e-border)] p-6 red-inner-glow group cursor-default">
          <div className="flex justify-between items-start mb-2">
            <div className="font-display text-xl text-primary font-bold tracking-wider">PLAYERS</div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">person_pin</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="font-display text-5xl font-extrabold leading-none text-on-surface">24.8K</div>
            <div className="w-12 h-12">
              <div className="w-full h-full relative flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#353534" strokeWidth="4"></circle>
                  <circle className="drop-shadow-[0_0_4px_#ffb4ab]" cx="18" cy="18" fill="transparent" r="15.915" stroke="#ffb4ab" strokeDasharray="85 15" stroke-dashoffset="25" stroke-width="4"></circle>
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#822621" strokeDasharray="10 90" stroke-dashoffset="110" stroke-width="4"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-surface-container-lowest border border-outline-variant/30"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[9px] text-on-surface-variant mt-3 font-mono font-bold">RETENTION_PULSE: STABLE</div>
        </div>

        {/* CARD 4 */}
        <div className="bg-[var(--e-card-bg)] border border-[var(--e-border)] p-6 red-inner-glow group cursor-default">
          <div className="flex justify-between items-start mb-2">
            <div className="font-display text-xl text-primary font-bold tracking-wider">MATCHES</div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">bolt</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="font-display text-5xl font-extrabold leading-none text-on-surface">412</div>
            <div className="w-12 h-12">
              <div className="w-full h-full relative flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#353534" strokeWidth="4"></circle>
                  <circle className="drop-shadow-[0_0_4px_#ffb4ab]" cx="18" cy="18" fill="transparent" r="15.915" stroke="#ffb4ab" stroke-dasharray="60 40" stroke-dashoffset="25" stroke-width="4"></circle>
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#822621" strokeDasharray="30 70" stroke-dashoffset="85" stroke-width="4"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-surface-container-lowest border border-outline-variant/30"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[9px] text-on-surface-variant mt-3 font-mono font-bold">LATENCY: 12MS</div>
        </div>
      </section>

      {/* MAIN DATA AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LIVE ENGAGEMENTS TABLE */}
        <section className="col-span-12 lg:col-span-8 bg-[var(--e-card-bg)] border border-[var(--e-border)] p-6 md:p-8 min-h-[500px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display text-4xl text-primary tracking-tight font-bold">LIVE ENGAGEMENTS</h3>
              </div>
              <button 
                onClick={syncFeed}
                className="bg-primary-container text-on-primary-container px-4 md:px-6 py-2 font-display tracking-widest text-sm hover:scale-95 flex items-center gap-2 border-b-2 border-primary font-extrabold"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                SYNC FEED
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="text-[var(--e-text-dim)] border-b border-[var(--e-border)]">
                    <th className="py-4 px-2 font-display text-sm tracking-wider">ID</th>
                    <th className="py-4 px-2 font-display text-sm tracking-wider">TOURNAMENT</th>
                    <th className="py-4 px-2 font-display text-sm tracking-wider">MATCHUP</th>
                    <th className="py-4 px-2 font-display text-sm tracking-wider">STATUS</th>
                    <th className="py-4 px-2 font-display text-sm tracking-wider text-right">LOAD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--e-border)]/35">
                  {engagements.map((e, idx) => (
                    <tr key={idx} className="hover:bg-[var(--e-surface-container-high)]/40 transition-colors cursor-pointer group">
                      <td className="py-4 px-2 text-primary font-bold">{e.id}</td>
                      <td className="py-4 px-2 font-semibold text-[var(--e-text)]">{e.tournament}</td>
                      <td className="py-4 px-2 font-bold text-[var(--e-text)]">{e.matchup}</td>
                      <td className="py-4 px-2">
                        {e.isInProgress ? (
                          <span className="flex items-center gap-2 font-bold text-[var(--e-text)]">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            IN-PROGRESS
                          </span>
                        ) : (
                          <span className="text-[var(--e-text-muted)] italic font-semibold">QUEUED</span>
                        )}
                      </td>
                      <td className={`py-4 px-2 text-right font-bold ${e.isInProgress ? 'text-primary' : 'text-[var(--e-text-muted)]'}`}>{e.load}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-[var(--e-border)]/40 flex justify-between items-center text-[9px] text-[var(--e-text-muted)] font-mono font-bold">
            <span>DATA_INTEGRITY: OPTIMAL</span>
            <div className="flex gap-4">
              <span>PAGE: 01 / 14</span>
              <span className="flex gap-1.5">
                <span className="material-symbols-outlined text-xs cursor-pointer hover:text-primary">arrow_back_ios</span>
                <span className="material-symbols-outlined text-xs cursor-pointer hover:text-primary">arrow_forward_ios</span>
              </span>
            </div>
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="col-span-12 lg:col-span-4 space-y-8">
          {/* SYSTEM VITALITY */}
          <section className="bg-[var(--e-card-bg)] border border-[var(--e-border)] p-6 min-h-[280px] flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl text-primary mb-4 flex items-center gap-2 font-bold tracking-wider">
                <span className="material-symbols-outlined text-sm">terminal</span>
                SYSTEM VITALITY
              </h3>
              <div className="space-y-3 font-mono text-[10px] h-48 overflow-y-auto pr-2 custom-scrollbar font-bold">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-primary">[{log.timestamp}]</span>
                    <span className="text-on-surface">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--e-border)]/45">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[var(--e-text-muted)] font-bold">UPTIME: 142D 04H 21M</span>
                <div className="flex h-2 w-24 bg-surface-container-highest">
                  <div className="bg-primary w-4/5 animate-pulse"></div>
                </div>
              </div>
            </div>
          </section>

          {/* TACTICAL OVERLAY */}
          <section className="bg-[var(--e-card-bg)] border border-[var(--e-border)] p-6 min-h-[280px] relative overflow-hidden group">
            <div className="absolute inset-0 tactical-mesh"></div>
            <div className="relative z-10 text-left">
              <h3 className="font-display text-2xl text-primary mb-4 flex items-center gap-2 font-bold tracking-wider">
                <span className="material-symbols-outlined text-sm">hub</span>
                TACTICAL OVERLAY
              </h3>
              <div className="aspect-square w-full border border-primary/20 relative flex items-center justify-center bg-black/40">
                <div className="absolute w-full h-px bg-primary/20 top-1/2 -translate-y-1/2"></div>
                <div className="absolute h-full w-px bg-primary/20 left-1/2 -translate-x-1/2"></div>
                <div className="w-24 h-24 border border-primary rounded-full animate-ping absolute opacity-20"></div>
                <div className="w-12 h-12 border border-primary rounded-full animate-pulse absolute opacity-40"></div>
                
                {/* Network Nodes Simulation */}
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#ffb4ab] animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#ffb4ab] animate-pulse"></div>
                <div className="absolute top-2/3 left-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#ffb4ab] animate-pulse"></div>
                <span className="font-mono text-[9px] text-primary absolute bottom-2 right-2 font-bold uppercase">LOCATING_TARGETS...</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-primary-container text-on-primary-container text-[9px] px-2.5 py-1 font-mono font-bold">REGION_US_EAST</span>
                <span className="bg-surface-container-highest text-on-surface-variant text-[9px] px-2.5 py-1 font-mono font-bold">GRID_B12</span>
                <span className="bg-surface-container-highest text-on-surface-variant text-[9px] px-2.5 py-1 font-mono font-bold">ACTIVE_SCAN</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;

