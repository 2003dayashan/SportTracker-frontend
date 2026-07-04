import React from 'react';

const Brackets: React.FC = () => {
  return (
    <div className="space-y-16 pb-12 select-none subpixel-antialiased text-left">
      {/* Tournament Header */}
      <section className="text-center">
        <div className="inline-block px-4 py-1.5 bg-primary-container text-on-primary-container font-mono text-[9px] font-bold mb-4 uppercase tracking-widest">SEASON 01 // LIVE NOW</div>
        <h1 className="font-display text-7xl md:text-8xl text-on-background uppercase tracking-tight mb-2 font-black leading-none">UNDERGROUND ELITE</h1>
        <p className="font-sans text-xs md:text-sm text-[var(--e-text-muted)] max-w-2xl mx-auto leading-relaxed font-semibold">
          The world's most aggressive stick-fighting circuit. Witness the final 8 warriors carve their names into the digital asphalt.
        </p>
      </section>

      {/* Bracket Stage */}
      <section className="relative overflow-x-auto pb-12">
        <div className="flex gap-8 md:gap-16 min-w-[1000px] justify-between items-stretch">
          {/* Quarter Finals */}
          <div className="flex-1 flex flex-col gap-12">
            <h3 className="font-display text-xl text-primary tracking-widest text-center mb-2 uppercase font-bold">Quarter Finals</h3>
            {/* Match 1 */}
            <div className="relative">
              <div className="bg-[var(--e-card-bg)] border-2 border-[var(--e-border)] p-4 flex flex-col gap-2 relative z-10 cursor-pointer hover:bg-red-950/20 hover:border-primary/50 transition-all duration-300">
                <div className="flex justify-between items-center opacity-50 font-mono text-[9px] font-bold"><span>#01</span> <span>02:00 PM</span></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-primary tracking-wide">S1NISTER</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text)]">2</span>
                </div>
                <div className="ink-scratch my-1"></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)] tracking-wide">HEX_DUMP</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)]">0</span>
                </div>
              </div>
              <div className="absolute top-1/2 -right-8 w-8 h-[2px] bg-[var(--e-border)]"></div>
            </div>
            {/* Match 2 */}
            <div className="relative">
              <div className="bg-[var(--e-card-bg)] border-2 border-[var(--e-border)] p-4 flex flex-col gap-2 relative z-10 cursor-pointer hover:bg-red-950/20 hover:border-primary/50 transition-all duration-300">
                <div className="flex justify-between items-center opacity-50 font-mono text-[9px] font-bold"><span>#02</span> <span>03:30 PM</span></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-primary tracking-wide">RAW_GRIT</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text)]">2</span>
                </div>
                <div className="ink-scratch my-1"></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)] tracking-wide">VOID_WALKER</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)]">1</span>
                </div>
              </div>
              <div className="absolute top-1/2 -right-8 w-8 h-[2px] bg-[var(--e-border)]"></div>
            </div>
            {/* Match 3 */}
            <div className="relative">
              <div className="bg-[var(--e-card-bg)] border-2 border-[var(--e-border)] p-4 flex flex-col gap-2 relative z-10 cursor-pointer hover:bg-red-950/20 hover:border-primary/50 transition-all duration-300">
                <div className="flex justify-between items-center opacity-50 font-mono text-[9px] font-bold"><span>#03</span> <span>05:00 PM</span></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)] tracking-wide">STATIC_X</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)]">1</span>
                </div>
                <div className="ink-scratch my-1"></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-primary tracking-wide">PHANTOM</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text)]">2</span>
                </div>
              </div>
              <div className="absolute top-1/2 -right-8 w-8 h-[2px] bg-[var(--e-border)]"></div>
            </div>
            {/* Match 4 */}
            <div className="relative">
              <div className="bg-[var(--e-card-bg)] border-2 border-[var(--e-border)] p-4 flex flex-col gap-2 relative z-10 cursor-pointer hover:bg-red-950/20 hover:border-primary/50 transition-all duration-300">
                <div className="flex justify-between items-center opacity-50 font-mono text-[9px] font-bold"><span>#04</span> <span>06:30 PM</span></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)] tracking-wide">KINETIC</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)]">0</span>
                </div>
                <div className="ink-scratch my-1"></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-primary tracking-wide">BROKEN_CODE</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text)]">2</span>
                </div>
              </div>
              <div className="absolute top-1/2 -right-8 w-8 h-[2px] bg-[var(--e-border)]"></div>
            </div>
          </div>

          {/* Semi Finals */}
          <div className="flex-1 flex flex-col justify-around">
            <h3 className="font-display text-xl text-primary tracking-widest text-center mb-2 uppercase font-bold">Semi Finals</h3>
            {/* Semi 1 */}
            <div className="relative">
              <div className="absolute -left-8 top-1/2 -translate-y-[calc(50%+4rem)] w-8 h-32 border-t-2 border-r-2 border-[var(--e-border)]"></div>
              <div className="absolute -left-8 top-1/2 translate-y-[calc(50%-4rem)] w-8 h-32 border-b-2 border-r-2 border-[var(--e-border)]"></div>
              <div className="bg-[var(--e-card-bg)] border-2 border-[var(--e-accent)]/30 p-6 flex flex-col gap-3 relative z-10 cursor-pointer hover:bg-red-950/20 hover:border-primary/50 transition-all duration-300">
                <div className="flex justify-between items-center opacity-50 font-mono text-[9px] font-bold"><span>SF1</span> <span>09:00 PM</span></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-primary tracking-wide">S1NISTER</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text)]">--</span>
                </div>
                <div className="ink-scratch my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)] tracking-wide">RAW_GRIT</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)]">--</span>
                </div>
              </div>
              <div className="absolute top-1/2 -right-8 w-8 h-[2px] bg-[var(--e-border)]"></div>
            </div>
            {/* Semi 2 */}
            <div className="relative">
              <div className="absolute -left-8 top-1/2 -translate-y-[calc(50%+4rem)] w-8 h-32 border-t-2 border-r-2 border-[var(--e-border)]"></div>
              <div className="absolute -left-8 top-1/2 translate-y-[calc(50%-4rem)] w-8 h-32 border-b-2 border-r-2 border-[var(--e-border)]"></div>
              <div className="bg-[var(--e-card-bg)] border-2 border-[var(--e-accent)]/30 p-6 flex flex-col gap-3 relative z-10 cursor-pointer hover:bg-red-950/20 hover:border-primary/50 transition-all duration-300">
                <div className="flex justify-between items-center opacity-50 font-mono text-[9px] font-bold"><span>SF2</span> <span>10:30 PM</span></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)] tracking-wide">PHANTOM</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)]">--</span>
                </div>
                <div className="ink-scratch my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)] tracking-wide">BROKEN_CODE</span>
                  <span className="font-display text-2xl font-bold text-[var(--e-text-muted)]">--</span>
                </div>
              </div>
              <div className="absolute top-1/2 -right-8 w-8 h-[2px] bg-[var(--e-border)]"></div>
            </div>
          </div>

          {/* Finals */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-display text-xl text-primary tracking-widest text-center mb-8 uppercase font-bold">The Finals</h3>
            <div className="relative p-1 bg-gradient-to-br from-primary-container to-surface">
              <div className="absolute -left-8 top-1/2 -translate-y-[calc(50%+8rem)] w-8 h-64 border-t-2 border-r-2 border-[var(--e-border)]"></div>
              <div className="absolute -left-8 top-1/2 translate-y-[calc(50%-8rem)] w-8 h-64 border-b-2 border-r-2 border-[var(--e-border)]"></div>
              <div className="bg-[var(--e-card-bg-2)] border-2 border-primary p-8 flex flex-col gap-6 relative z-10 shadow-[0_0_40px_rgba(130,38,33,0.2)]">
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-5xl">emoji_events</span>
                  <span className="font-display text-2xl text-primary font-bold tracking-widest">GRAND FINAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-display text-4xl font-extrabold text-[var(--e-text)] uppercase leading-none">TBD</span>
                  <span className="font-mono text-xs px-3 py-1 bg-[var(--e-card-bg)] border border-[var(--e-border)] font-bold text-primary">VS</span>
                  <span className="font-display text-4xl font-extrabold text-[var(--e-text)] uppercase leading-none">TBD</span>
                </div>
                <div className="text-center font-mono text-[9px] font-bold text-[var(--e-text-muted)] italic">SUNDAY MIDNIGHT // INDUSTRIAL ZONE 4</div>
                <button className="w-full bg-primary text-black font-display py-4 text-xl tracking-wider hover:scale-[0.98] active:scale-[0.95] transition-transform uppercase font-extrabold">GET ACCESS</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Match Highlights & Leaderboard CTA */}
      <section className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Highlights */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-4 border-b border-[var(--e-border)]/40 pb-3">
            <h2 className="font-display text-4xl text-on-background uppercase font-bold tracking-tight">Recent Violence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group cursor-pointer">
              <div className="relative aspect-video overflow-hidden border border-[var(--e-border)] mb-4">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsTzOa-kUlzIfOqCfrUEqAm5g1JvzdJ1mYuR69AVfWgJzqnwLSSo7WehdPvFCLRy9yAtJndQcRQYMmEb7JPWhCrxYESwNK7pmHnv2eAKTfwHG7EiF7m79-QhDKytsaeOHgM9lWiurskpdIx34XjmGeWh9xnhsFP-aeV9iQxiUFJ_SbJOt54Ey2R4oHRQCoNeswh9Py295JuP-Dz9dfSIyCU9IM03YOEM7THeFR_ag481SThqlJEntXVjmtQiGE5JTvnPAu2ZSaXjI" 
                  alt="Match replay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--e-bg)] to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">play_circle</span>
                  <span className="font-mono text-[9px] text-white font-bold uppercase tracking-wider">REPLAY: S1N vs HEX</span>
                </div>
              </div>
              <h4 className="font-display text-2xl text-on-surface uppercase group-hover:text-primary transition-colors font-bold tracking-tight">THE SHATTERED PROTOCOL</h4>
              <p className="font-sans text-xs text-[var(--e-text-muted)] mt-2 leading-relaxed font-semibold">
                S1NISTER executes a flawless 3-hit combo to secure the first quarter-final victory.
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="relative aspect-video overflow-hidden border border-[var(--e-border)] mb-4">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6q88prQ8zw4cY98VTop73t-viS1h0-dG9GFMS540hMHrSG-v5EVW_3nmVgfG-9CcjiatYNv52c1OFUxIPTcMEJH9K0zVBd8yxZ3jWbNzpCfJNLLZbNcTe8AE8TZMmflGEH7PIXXXRjFFyg9cgjvMdshGie8XyPLHdEXk_0_m-q09LQW1NgLbux9suDfLvMoRm6Um9xhmoo22L01Fu6mPWOJf-2uDYGguDpqkldqj9q1JAw6kKeiXtmXazPAoZTtnNKZd7zXV1W_0" 
                  alt="Match replay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--e-bg)] to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">play_circle</span>
                  <span className="font-mono text-[9px] text-white font-bold uppercase tracking-wider">REPLAY: RAW vs VOID</span>
                </div>
              </div>
              <h4 className="font-display text-2xl text-on-surface uppercase group-hover:text-primary transition-colors font-bold tracking-tight">ABSOLUTE CARNAGE</h4>
              <p className="font-sans text-xs text-[var(--e-text-muted)] mt-2 leading-relaxed font-semibold">
                RAW_GRIT survives with 1% health to pull off a stunning comeback against VOID_WALKER.
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboard CTA */}
        <div className="bg-[var(--e-card-bg)] border border-[var(--e-border)] p-8 flex flex-col items-center text-center justify-between min-h-[400px]">
          <span className="material-symbols-outlined text-primary text-6xl">leaderboard</span>
          <h3 className="font-display text-3xl text-on-background uppercase font-bold tracking-tight mt-4">Global Killboard</h3>
          <p className="font-sans text-xs text-[var(--e-text-muted)] leading-relaxed font-semibold">
            Think you can survive the pit? Review the stats of the elite and climb the ladder of the Underground League.
          </p>
          <div className="w-full space-y-4 my-6 text-left font-mono text-xs">
            <div className="flex justify-between items-center px-4 py-2.5 bg-[var(--e-card-bg-2)] border border-[var(--e-border)] font-bold">
              <span className="font-display text-lg text-primary tracking-wider">01 S1NISTER</span>
              <span className="font-mono text-xs text-on-surface">1,402 K</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 bg-[var(--e-card-bg-2)] border border-[var(--e-border)] font-bold">
              <span className="font-display text-lg text-[var(--e-text-muted)] tracking-wider">02 PHANTOM</span>
              <span className="font-mono text-xs text-on-surface">1,288 K</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 bg-[var(--e-card-bg-2)] border border-[var(--e-border)] font-bold">
              <span className="font-display text-lg text-[var(--e-text-muted)] tracking-wider">03 RAW_GRIT</span>
              <span className="font-mono text-xs text-on-surface">1,150 K</span>
            </div>
          </div>
          <button className="w-full border-2 border-primary text-primary font-display py-3 hover:bg-primary/10 transition-colors uppercase font-extrabold text-sm tracking-wider">VIEW FULL RANKINGS</button>
        </div>
      </section>
    </div>
  );
};

export default Brackets;

