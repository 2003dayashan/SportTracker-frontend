import React, { useState } from 'react';

interface ChatMessage {
  username: string;
  text: string;
  isPrimary?: boolean;
}

const Home: React.FC = () => {
  const [contractAccepted, setContractAccepted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { username: 'CYBER_PUNK', text: 'Just cleared Night Crawler on Hard. Insane.', isPrimary: true },
    { username: 'GHOST_USER', text: 'Anyone looking for a squad for Season 01?' },
    { username: 'SL_MOD', text: 'New patch coming in 2 hours. Prep up.', isPrimary: true }
  ]);
  const [newMsg, setNewMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setMessages([...messages, { username: 'YOU', text: newMsg.trim() }]);
    setNewMsg('');
  };

  return (
    <div className="space-y-12 pb-12 select-none subpixel-antialiased">
      {/* PLAYER STATUS BANNER */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-7xl md:text-8xl leading-none text-on-surface tracking-tight font-black">LEVEL 42</span>
          </div>
          <div className="relative h-4 w-full bg-surface-container-high border border-outline-variant/30">
            <div className="absolute top-0 left-0 h-full bg-primary-container red-inner-glow" style={{ width: '78%', opacity: 0.9 }}>
              <div className="absolute right-0 top-0 h-full w-4 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between font-mono text-[10px] uppercase font-bold text-on-surface-variant">
            <span className="text-primary font-black">XP: 145,200 / 180,000</span>
            <span className="text-on-surface-variant">TIER: ELITE STRIKER</span>
          </div>
        </div>
        <div className="md:col-span-4 bg-primary-container/10 p-6 border border-primary-container/30 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary-container/20 -rotate-45 translate-x-8 -translate-y-8"></div>
          <p className="font-mono text-[10px] text-primary mb-1 uppercase font-bold">STREAK</p>
          <p className="font-display text-4xl leading-none text-white font-bold">12 DAYS</p>
          <p className="font-sans text-xs text-on-surface-variant mt-2 font-medium">+15% XP MULTIPLIER ACTIVE</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* QUEST BOARD (Main Grid) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-baseline justify-between border-b border-outline-variant/30 pb-3">
            <h2 className="font-display text-5xl text-on-surface uppercase tracking-tight font-bold">QUEST BOARD</h2>
            <p className="font-mono text-[10px] text-primary uppercase font-bold">REFRESHES IN: 04:22:19</p>
          </div>

          {/* CONTRACT BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* High Risk Contract 1 */}
            <div className="md:col-span-2 group relative overflow-hidden bg-surface-container border-2 border-primary p-1 hover:scale-[1.01] transition-all duration-300">
              <div className="flex flex-col md:flex-row h-auto md:h-64">
                <div className="w-full md:w-1/2 relative h-48 md:h-full">
                  <img 
                    className="w-full h-full object-cover grayscale contrast-125" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU2IurrgaCOwKuO0FCWLh06ULbcog0IwJr7pydVIsnw3xy77D2d5b9MjZSba6lXp1j2xSAHEYNXc5wTPvCg9nn1jU7bqAT8-RZnQr0ESri7z69mW9nwp91ELcqxo8Bu8lD8l-RzjklUYVwlV5xzl9DtMMmwwrYtsC2SoxUuzWQW2si5aFpvBvDGFjF0o7XY02vdprF5g1m76fzZmZ2OFeyLTwPEn578azQf5iX2oUTSEOEQhKZf7lGGJeejCDCN_FeCySCDrIpIqk" 
                    alt="Night Crawler"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-container"></div>
                  <div className="absolute top-4 left-4 bg-primary px-3 py-1 text-black font-mono text-[9px] font-black">HIGH RISK</div>
                </div>
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center space-y-4">
                  <h3 className="font-display text-4xl text-primary leading-none font-bold uppercase tracking-tight">NIGHT CRAWLER</h3>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed font-medium">Infiltrate the lower sectors without being detected. Eliminate 5 targets using only the hidden blade.</p>
                  <div className="flex gap-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] text-on-surface-variant font-bold">REWARD</span>
                      <span className="font-display text-xl text-primary font-bold">8,000 SC</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] text-on-surface-variant font-bold">XP</span>
                      <span className="font-display text-xl text-primary font-bold">2,500</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setContractAccepted(!contractAccepted)}
                    className={`w-full py-3.5 font-display hover:bg-[#a23d36] transition-colors relative font-extrabold text-sm tracking-widest ${contractAccepted ? 'bg-primary text-black' : 'bg-primary-container text-white'}`}
                  >
                    {contractAccepted ? 'ACTIVE CONTRACT' : 'ACCEPT CONTRACT'}
                  </button>
                </div>
              </div>
            </div>

            {/* Contract 2 */}
            <div className="bg-surface-container border border-outline-variant p-6 space-y-4 group hover:border-primary/50 transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-40 bg-black relative overflow-hidden border border-outline-variant/30">
                  <img 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3Lsraax4smDSjtEAbgyBJbrLGOYvXK4lsHwUoBNQJ7FrzUdfo3EgYAGF6_JQzzSL8IRwrnh-T-ZxpIHi2ExKb9W2wgdn4Qg7Ya28WIu7-gOwF_xLKDvE_eNW9ababVrqbt7fYLvnb5Clv6NIa-4tGpRRipzotdjBdCIiMhAIh1rSpUVjp11mqmxGG_uPQ9l98HP5V3Y07pYnL7smd4bt6Ii7R_9DDY8KZs1V2SPDv9JyTmWweHEs_DWqa4QH1GjGVfVYH3weZye0" 
                    alt="Silent Strike"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-primary opacity-40">target</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-3xl text-on-surface font-bold uppercase tracking-tight">SILENT STRIKE</h3>
                  <p className="font-sans text-xs text-on-surface-variant mt-2 font-medium leading-relaxed">Win 3 matches without losing a single life.</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
                <span className="font-display text-xl text-primary font-bold">4,500 SC</span>
                <button className="font-mono text-[10px] hover:text-primary transition-colors font-bold tracking-wider">DETAILS</button>
              </div>
            </div>

            {/* Contract 3 */}
            <div className="bg-surface-container border border-outline-variant p-6 space-y-4 group hover:border-primary/50 transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-40 bg-black relative overflow-hidden border border-outline-variant/30">
                  <img 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2flndGoqJEMn1pFa80SkGZ_uI2zUGXQDq4sVyQ6-_gxXylpDNsmT9mnqm5TZpWvf3X2goCMsoyl7F5w5g9a8OybTHuQfgjfx0jNDjJ_E0_gVSRFLJlTp434UYyTqWfgxdsTKDIKcf8hTwVhfgaIX_svhgFgYAmU5zQv3v3wXMRg0OkxqSIe2ShNcJ1SK4jr4NgWeGBnbC8MeBEqJAgeSbCU_wFgvuOiES2r2N957IB1Jg7BDMkTF-vbOzVKfoU9s8Bs-F20Kv6fI" 
                    alt="Ink Spill"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-primary opacity-40">warning</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-3xl text-on-surface font-bold uppercase tracking-tight">INK SPILL</h3>
                  <p className="font-sans text-xs text-on-surface-variant mt-2 font-medium leading-relaxed">Deal 50,000 total damage in any tournament mode.</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
                <span className="font-display text-xl text-primary font-bold">6,200 SC</span>
                <button className="font-mono text-[10px] hover:text-primary transition-colors font-bold tracking-wider">DETAILS</button>
              </div>
            </div>
          </div>

          {/* LATEST REPLAYS */}
          <div className="space-y-6 pt-12 text-left">
            <h2 className="font-display text-3xl text-on-surface uppercase tracking-tight font-bold border-l-4 border-primary pl-4 leading-none">LATEST REPLAYS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="aspect-video bg-surface-container-high border border-outline-variant relative group cursor-pointer overflow-hidden">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp5F6cyhSYAqZ8KaFizjwRFWXsQluh5oHMi23zXade65XZXcS1z0d6k7Aaing_Rf-AyWGpRqsaRzC4jWQ-PT5CsnxpTx4uUsfrdbPbtSFvdAylwwFr1Uaug318Y8VDjZIyJFm_RRfudqbVaXH6H2H0vT_kfTfO4phyW2ip6dLgjmkHcwOPr9r6vdfr9zKKjyU2HaFXgxWqefoUjx9-g79l7ygwsJql7TlodjjW_zeIgQ8o_w94Bs4FTuW_4j55y54wsqycC8vdp3U" 
                  alt="Replay 1"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-5xl text-white">play_circle</span>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold">03:42</div>
              </div>
              <div className="aspect-video bg-surface-container-high border border-outline-variant relative group cursor-pointer overflow-hidden">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLOYX6xbvJ_bVqd5kQ_osIsf3Gv88jHawGqTrdbjbNXroR1mk5_cUwcsth7BVi2s15rHFiFt33ki6ghsoBoeO1BFWIIOzYX5wGvTrE3TqzwQwMUEPal9ewYTTj0d_J12DFZeczt3Xpj6SXyacaTk-8WR41EGjsYZCrNtIpRvbwLCYoBjveKG-cZ9gu7SbzQZYhxCQz8k6RreCcSe8MH8un8d8XpjUTtEiFmMVHSt6H2U2DfpFUbUeaijELaeBAWvzSW8VWUSXOGhA" 
                  alt="Replay 2"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-5xl text-white">play_circle</span>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold">01:15</div>
              </div>
              <div className="aspect-video bg-surface-container-high border border-outline-variant relative group cursor-pointer overflow-hidden">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_xBT7A2SRTZJlDbQ81Zsu2sQnDz3M9N-8yhuBcRQ6talK1_UIPNYZSUL5Y4jemd0f6UEO7mG32GqzS6PCekNGXVgziDzQpwbNVHX2onemvHgO2PyD29GoqX1T-XLICPDI4MpgiSyNas2GcvPwkWteDW7WJWN4aPEzEqb7WC9grtgFb8Zu80nP1xZNn6vwgyy7Ma7oQlfv0rhp4xEZPp8eNh5gFNL75tx02QU4EQxGZPPom6NSZLWxOWI7qqGhoIZ1ck-kjavMyis" 
                  alt="Replay 3"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-5xl text-white">play_circle</span>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold">02:30</div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR (Leaderboard & Chat) */}
        <div className="lg:col-span-4 space-y-8 text-left">
          {/* TOP STRIKERS LEADERBOARD */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 red-inner-glow">
            <h3 className="font-display text-3xl text-primary mb-6 tracking-wide border-b border-primary/20 pb-2 font-bold uppercase">TOP STRIKERS</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl text-primary w-6 leading-none">01</span>
                  <div className="w-8 h-8 bg-surface-container-highest rounded border border-primary/30"></div>
                  <span className="font-mono text-xs font-bold group-hover:text-primary transition-colors">V0ID_WALKER</span>
                </div>
                <span className="font-mono text-xs text-on-surface-variant font-bold">24.5K</span>
              </div>
              <div className="ink-scratch-divider opacity-30"></div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl text-on-surface-variant w-6 leading-none">02</span>
                  <div className="w-8 h-8 bg-surface-container-highest rounded border border-outline-variant/30"></div>
                  <span className="font-mono text-xs font-bold group-hover:text-primary transition-colors">REAPER_88</span>
                </div>
                <span className="font-mono text-xs text-on-surface-variant font-bold">22.1K</span>
              </div>
              <div className="ink-scratch-divider opacity-30"></div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl text-on-surface-variant w-6 leading-none">03</span>
                  <div className="w-8 h-8 bg-surface-container-highest rounded border border-outline-variant/30"></div>
                  <span className="font-mono text-xs font-bold group-hover:text-primary transition-colors">INK_DRIP</span>
                </div>
                <span className="font-mono text-xs text-on-surface-variant font-bold">21.8K</span>
              </div>
              <div className="ink-scratch-divider opacity-30"></div>
              <div className="flex items-center justify-between group bg-primary-container/10 p-2 -mx-2">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl text-primary w-6 leading-none font-bold">42</span>
                  <div className="w-8 h-8 bg-primary rounded border border-primary"></div>
                  <span className="font-mono text-xs text-primary font-black">YOU</span>
                </div>
                <span className="font-mono text-xs text-primary font-bold">15.4K</span>
              </div>
            </div>
            <button className="w-full mt-8 py-3.5 border border-primary text-primary font-display text-sm tracking-wider font-extrabold hover:bg-primary hover:text-black transition-all">VIEW FULL RANKINGS</button>
          </div>

          {/* LIVE FEED / CHATTER */}
          <div className="bg-surface-container border border-outline-variant p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <h3 className="font-display text-xl text-on-surface-variant font-bold tracking-wider">GLOBAL CHATTER</h3>
            </div>
            <div className="space-y-3 font-mono text-[11px] h-40 overflow-y-auto pr-1">
              {messages.map((m, idx) => (
                <p key={idx}>
                  <span className={`font-black ${m.isPrimary || m.username === 'YOU' ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {m.username}:
                  </span>{' '}
                  <span className="text-on-surface">{m.text}</span>
                </p>
              ))}
            </div>
            <form onSubmit={handleSend} className="pt-4 border-t border-outline-variant/30">
              <input 
                type="text" 
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                className="w-full bg-surface-container-lowest border-b border-primary/50 text-xs py-2 focus:ring-0 focus:border-primary font-mono outline-none uppercase font-bold" 
                placeholder="TYPE MESSAGE..."
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

