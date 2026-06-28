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
}

export default function FootballHome({
  isLoggedIn,
  onLeagues,
  onClubs,
  onFixtures,
  onStandings,
  onWorldCup,
}: FootballHomeProps) {
  const [kitPanelOpen, setKitPanelOpen] = useState(false);
  const [fanColors, setFanColors] = useState({ primary: "#2b2b2b", secondary: "#efe9da" });
  const [fanName, setFanName] = useState("");
  const [fanCountryCode, setFanCountryCode] = useState<string | null>(null);

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
        if (profileData.displayName) {
          setFanName(profileData.displayName);
        }
      })
      .catch(() => {});
  }, [isLoggedIn, kitPanelOpen]);

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] overflow-hidden selection:bg-[#d9b45f] selection:text-[#2b2b2b]">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, #2b2b2b 1px, transparent 1px), linear-gradient(to bottom, #2b2b2b 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col min-h-screen">
        {/* Nav */}
        <nav className="flex items-center justify-between mb-16">
          <div className="font-['Bebas_Neue'] text-3xl tracking-wide">FOOTBALL TRACKER</div>
          <div className="hidden md:flex gap-8 font-['Space_Grotesk'] font-bold text-sm tracking-widest">
            <button onClick={onLeagues} className="hover:text-[#d9b45f] transition-colors">LEAGUES</button>
            <button onClick={onClubs} className="hover:text-[#d9b45f] transition-colors">CLUBS</button>
            <button onClick={onFixtures} className="hover:text-[#d9b45f] transition-colors">FIXTURES</button>
            <button onClick={onStandings} className="hover:text-[#d9b45f] transition-colors">STANDINGS</button>
            <button onClick={onWorldCup} className="hover:text-[#d9b45f] transition-colors">WORLD CUP</button>
          </div>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col lg:flex-row items-center gap-16 lg:gap-8 mb-16 mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 w-full"
          >
            <div className="relative inline-block">
              <h1
                className="font-['Bebas_Neue'] leading-[0.85] tracking-tight whitespace-pre-line text-[#2b2b2b]"
                style={{ fontSize: "clamp(64px, 9vw, 120px)" }}
              >
                FOOTBALL{"\n"}TRACKER
              </h1>
              <span className="absolute -bottom-4 right-0 lg:-right-12 font-['Caveat'] -rotate-2 text-2xl md:text-3xl text-[#2b2b2b]">
                where doodles go pro.
              </span>
            </div>

            <div className="mt-14 flex flex-wrap gap-4 font-['Space_Grotesk'] font-bold uppercase tracking-wider text-sm md:text-base">
              <button
                onClick={onLeagues}
                className="rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] px-8 py-3 hover:bg-transparent hover:text-[#2b2b2b] transition-all"
              >
                View Leagues
              </button>
              <button
                onClick={onFixtures}
                className="rounded-full border-2 border-[#2b2b2b] bg-transparent px-8 py-3 hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-all"
              >
                See Fixtures
              </button>
              <button
                onClick={() => setKitPanelOpen(true)}
                className="rounded-full border-2 border-[#d9b45f] bg-transparent px-8 py-3 hover:bg-[#d9b45f] transition-all"
              >
                🌍 Customize Fan Kit
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full flex justify-center lg:justify-end items-center"
          >
            <FanFigure
              primaryColor={fanColors.primary}
              secondaryColor={fanColors.secondary}
              name={fanName || undefined}
            />
          </motion.div>
        </main>

        {/* Stats strip + Fan card */}
        <div
          className={`grid gap-6 mb-12 ${
            isLoggedIn && fanCountryCode
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 md:grid-cols-3"
          }`}
        >
          <StatCard number="12" label="LEAGUES" />
          <StatCard number="48" label="CLUBS" />
          <StatCard number="320" label="FIXTURES" />
          {isLoggedIn && fanCountryCode && (
            <FanCountryCard countryCode={fanCountryCode} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t-2 border-[#2b2b2b] py-8 flex flex-col md:flex-row items-center justify-between font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest">
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

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[6px_6px_0_rgba(43,43,43,0.2)] px-8 py-10 flex flex-col items-center justify-center text-center transform transition-transform duration-300 hover:-translate-y-1">
      <div className="font-['Bebas_Neue'] text-6xl text-[#2b2b2b] mb-1">{number}</div>
      <div className="font-['Space_Grotesk'] text-sm md:text-base tracking-widest font-bold text-[#d9b45f]">
        {label}
      </div>
    </div>
  );
}