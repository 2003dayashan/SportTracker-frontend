import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import FanFigure from "../../components/FanFigure";
import FanKitPanel from "../../components/FanKitPanel";
import FanCountryCard from "../../components/FanCountryCard";
import { WORLD_CUP_COUNTRIES } from "../../data/worldCupCountries";

export interface FootballHomeProps {
  isLoggedIn: boolean;
  onLeagues: () => void;
  onClubs: () => void;
  onFixtures: () => void;
  onStandings: () => void;
  onWorldCup: () => void;
  onBackToDoors: () => void;   
  onLogout: () => void;  
}

export default function FootballHome({
  isLoggedIn,
  onLeagues,
  onClubs,
  onFixtures,
  onStandings,
  onWorldCup,
  onBackToDoors,
  onLogout,
}: FootballHomeProps) {
  const [kitPanelOpen, setKitPanelOpen] = useState(false);
  const [fanColors, setFanColors] = useState({ primary: "#2b2b2b", secondary: "#efe9da" });
  const [fanName, setFanName] = useState("");
  const [fanCountryCode, setFanCountryCode] = useState<string | null>(null);

  const [stats, setStats] = useState({
    leaguesCount: 0,
    clubsCount: 0,
    fixturesCount: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leaguesRes, clubsRes, fixturesRes] = await Promise.all([
          fetch("/api/football/leagues"),
          fetch("/api/football/clubs"),
          fetch("/api/football/fixtures"),
        ]);

        const leaguesData = leaguesRes.ok ? await leaguesRes.json() : [];
        const clubsData = clubsRes.ok ? await clubsRes.json() : [];
        const fixturesData = fixturesRes.ok ? await fixturesRes.json() : [];

        setStats({
          leaguesCount: Array.isArray(leaguesData) ? leaguesData.length : 0,
          clubsCount: Array.isArray(clubsData) ? clubsData.length : 0,
          fixturesCount: Array.isArray(fixturesData) ? fixturesData.length : 0,
        });
      } catch (err) {
        console.error("Failed to fetch football stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();

    // Auto-refresh every 30 seconds
    const intervalId = setInterval(fetchStats, 30000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/football/fan-profile/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((profileData) => {
        if (!profileData) return;
        if (profileData.countryCode) {
          const country = WORLD_CUP_COUNTRIES.find(
            (c) => c.code === profileData.countryCode
          );
          if (country) {
            setFanColors({ primary: country.primary, secondary: country.secondary });
          }
          setFanCountryCode(profileData.countryCode);
        }
        if (profileData.displayName) setFanName(profileData.displayName);
      })
      .catch(() => {});
  }, [isLoggedIn, kitPanelOpen]);

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, #2b2b2b 1px, transparent 1px),
                            linear-gradient(to bottom, #2b2b2b 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col min-h-screen">

        {/* ── NAV ── */}
        <nav className="flex items-center justify-between mb-10">
          <div className="font-['Bebas_Neue'] text-3xl tracking-wide">FOOTBALL TRACKER</div>
          <div className="flex items-center gap-4">
            {/* Page nav links */}
            <div className="hidden md:flex gap-8 font-['Space_Grotesk'] font-bold text-sm tracking-widest mr-4">
              <button onClick={onLeagues}   className="hover:text-[#d9b45f] transition-colors">LEAGUES</button>
              <button onClick={onClubs}     className="hover:text-[#d9b45f] transition-colors">CLUBS</button>
              <button onClick={onFixtures}  className="hover:text-[#d9b45f] transition-colors">FIXTURES</button>
              <button onClick={onStandings} className="hover:text-[#d9b45f] transition-colors">STANDINGS</button>
              <button onClick={onWorldCup}  className="hover:text-[#d9b45f] transition-colors">WORLD CUP</button>
            </div>

            {/* Back to Doors */}
            <button
              onClick={onBackToDoors}
              className="rounded-full border-2 border-[#2b2b2b] bg-transparent
                        px-5 py-2 font-['Space_Grotesk'] font-bold text-xs
                        uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1]
                        transition-all flex items-center gap-2 mr-24 lg:mr-32"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Doors
            </button>
          </div>
        </nav>

        {/* ── HERO — 3-column grid ── */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_1fr] gap-6 items-start mb-10">

          {/* LEFT — heading + buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col justify-center pt-8"
          >
            <div className="relative inline-block mb-14">
              <h1
                className="font-['Bebas_Neue'] leading-[0.85] tracking-tight whitespace-pre-line"
                style={{ fontSize: "clamp(56px, 7vw, 108px)" }}
              >
                FOOTBALL{"\n"}TRACKER
              </h1>
              <span className="absolute -bottom-6 right-0 font-['Caveat'] -rotate-2 text-2xl opacity-80">
                where doodles go pro.
              </span>
            </div>

            <div className="flex flex-col gap-3 font-['Space_Grotesk'] font-bold uppercase tracking-wider text-sm">
              <button
                onClick={onLeagues}
                className="rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1]
                           px-8 py-3 hover:bg-transparent hover:text-[#2b2b2b] transition-all w-fit"
              >
                View Leagues
              </button>
              <button
                onClick={onFixtures}
                className="rounded-full border-2 border-[#2b2b2b] bg-transparent
                           px-8 py-3 hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-all w-fit"
              >
                See Fixtures
              </button>
              <button
                onClick={() => setKitPanelOpen(true)}
                className="rounded-full border-2 border-[#d9b45f] bg-transparent
                           px-8 py-3 hover:bg-[#d9b45f] transition-all w-fit"
              >
                🌍 Customize Fan Kit
              </button>
            </div>
          </motion.div>

          {/* CENTER — analytics card (tall) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="w-full"
          >
            {isLoggedIn && fanCountryCode ? (
              <FanCountryCard countryCode={fanCountryCode} />
            ) : (
              /* Placeholder card when not logged in / no country set */
              <div className="bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem]
                              shadow-[6px_6px_0_rgba(43,43,43,0.2)] p-8 flex flex-col
                              items-center justify-center text-center min-h-[320px] gap-4">
                <span className="text-6xl">⚽</span>
                <p className="font-['Bebas_Neue'] text-2xl text-[#2b2b2b]">YOUR NATION AWAITS</p>
                <p className="font-['Caveat'] text-lg opacity-60">
                  Sign in &amp; pick your World Cup team
                </p>
                <p className="font-['Caveat'] text-base opacity-40">
                  to see live standings &amp; match stats here
                </p>
              </div>
            )}
          </motion.div>

          {/* RIGHT — fan figure */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className="flex justify-center items-start pt-4"
          >
            <FanFigure
              primaryColor={fanColors.primary}
              secondaryColor={fanColors.secondary}
              name={fanName || undefined}
            />
          </motion.div>
        </main>

        {/* ── STATS STRIP — bottom ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard emoji="🏆" number={statsLoading ? "..." : stats.leaguesCount.toString()} label="LEAGUES" onClick={onLeagues} />
          <StatCard emoji="🛡️" number={statsLoading ? "..." : stats.clubsCount.toString()} label="CLUBS"   onClick={onClubs} />
          <StatCard emoji="📅" number={statsLoading ? "..." : stats.fixturesCount.toString()} label="FIXTURES" onClick={onFixtures} />
        </div>

        {/* ── FOOTER ── */}
        <footer className="mt-auto border-t-2 border-[#2b2b2b] py-8 flex flex-col md:flex-row
                           items-center justify-between font-['Space_Grotesk'] text-sm font-bold
                           uppercase tracking-widest">
          <div>© 2026 Football Tracker</div>
          <div className="mt-4 md:mt-0 text-[#d9b45f]">SEASON 01 · LIVE</div>
        </footer>
      </div>

      <FanKitPanel
        open={kitPanelOpen}
        isLoggedIn={isLoggedIn}
        onClose={() => setKitPanelOpen(false)}
      />
    </div>
  );
}

function StatCard({
  emoji, number, label, onClick,
}: {
  emoji: string; number: string; label: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem]
                 shadow-[6px_6px_0_rgba(43,43,43,0.2)] px-8 py-10
                 flex flex-col items-center justify-center text-center
                 transform transition-all duration-300 hover:-translate-y-1
                 hover:shadow-[8px_8px_0_rgba(43,43,43,0.2)] w-full"
    >
      <span className="text-3xl mb-2">{emoji}</span>
      <div className="font-['Bebas_Neue'] text-6xl text-[#2b2b2b] mb-1">{number}</div>
      <div className="font-['Space_Grotesk'] text-sm tracking-widest font-bold text-[#d9b45f]">
        {label}
      </div>
    </button>
  );
}