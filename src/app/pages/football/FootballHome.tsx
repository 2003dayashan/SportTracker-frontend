import React from "react";
import { motion } from "motion/react";

export interface FootballHomeProps {
  onLeagues: () => void;
  onClubs: () => void;
  onFixtures: () => void;
  onStandings: () => void;
  onWorldCup: () => void;
}

export default function FootballHome({
  onLeagues,
  onClubs,
  onFixtures,
  onStandings,
  onWorldCup,
}: FootballHomeProps) {
  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] overflow-hidden selection:bg-[#d9b45f] selection:text-[#2b2b2b]">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, #2b2b2b 1px, transparent 1px), linear-gradient(to bottom, #2b2b2b 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <nav className="flex items-center justify-between mb-16">
          <div className="font-['Bebas_Neue'] text-3xl tracking-wide">
            FOOTBALL TRACKER
          </div>
          <div className="hidden md:flex gap-8 font-['Space_Grotesk'] font-bold text-sm tracking-widest">
            <button onClick={onLeagues} className="hover:text-[#d9b45f] transition-colors">LEAGUES</button>
            <button onClick={onClubs} className="hover:text-[#d9b45f] transition-colors">CLUBS</button>
            <button onClick={onFixtures} className="hover:text-[#d9b45f] transition-colors">FIXTURES</button>
            <button onClick={onStandings} className="hover:text-[#d9b45f] transition-colors">STANDINGS</button>
            <button onClick={onWorldCup} className="hover:text-[#d9b45f] transition-colors">WORLD CUP</button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col lg:flex-row items-center gap-16 lg:gap-8 mb-16 mt-8 lg:mt-0">
          {/* Left: Typography & Actions */}
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
                className="rounded-full border-2 border-[#2b2b2b] bg-transparent text-[#2b2b2b] px-8 py-3 hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-all"
              >
                See Fixtures
              </button>
            </div>
          </motion.div>

          {/* Right: SVG Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full flex justify-center lg:justify-end items-center"
          >
            <svg
              viewBox="0 0 400 380"
              className="w-full max-w-lg h-auto drop-shadow-sm"
              fill="none"
              stroke="#2b2b2b"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Goal Post Background */}
              <path d="M40,320 L40,120 L220,120 L220,320" strokeWidth="6" strokeDasharray="8,6" opacity="0.4" />
              <path d="M40,120 L90,70 L270,70 L220,120" strokeWidth="4" opacity="0.4" />
              <path d="M270,70 L270,270 L220,320" strokeWidth="4" opacity="0.4" />
              
              {/* Goal Netting Subtleties */}
              <path d="M40,170 L220,170 M40,220 L220,220 M40,270 L220,270" strokeWidth="2" opacity="0.2" />
              <path d="M100,120 L100,320 M160,120 L160,320" strokeWidth="2" opacity="0.2" />

              {/* Action Stick Figure */}
              <circle cx="280" cy="180" r="22" /> {/* Head */}
              <path d="M280,202 Q270,240 285,280" /> {/* Spine */}
              
              {/* Arms */}
              <path d="M280,215 Q230,220 240,250" /> 
              <path d="M280,215 Q330,190 340,160" /> 
              
              {/* Legs */}
              <path d="M285,280 Q250,330 255,360" /> {/* Planted leg */}
              <path d="M285,280 Q280,330 220,290" /> {/* Kicking leg */}

              {/* The Football */}
              <circle cx="180" cy="275" r="16" />
              <path d="M168,268 L192,282 M173,287 L187,263 M168,282 L192,268" strokeWidth="2" />
              
              {/* Motion Impact Lines */}
              <path d="M210,295 L225,310 M215,275 L235,285 M205,310 L220,325" strokeWidth="3" />

              {/* Floating Trophy Doodle */}
              <g transform="translate(320, 40) rotate(15)">
                {/* Accent gold shadow/glow on trophy base */}
                <path d="M5,15 C5,15 35,45 35,70 C35,95 5,95 5,95 L65,95 C65,95 35,95 35,70 C35,45 65,15 65,15 Z" fill="#d9b45f" opacity="0.2" stroke="none" />
                
                {/* Trophy lines */}
                <path d="M10,20 C10,20 35,45 35,70 C35,95 10,95 10,95 L60,95 C60,95 35,95 35,70 C35,45 60,20 60,20 Z" />
                <path d="M25,95 L25,120 L45,120 L45,95" />
                <path d="M15,120 L55,120" strokeWidth="6" />
                
                {/* Trophy Handles */}
                <path d="M15,35 C-10,35 -10,65 22,65 M55,35 C80,35 80,65 48,65" strokeWidth="4" />
                
                {/* Sparkles */}
                <path d="M-10,-5 L0,5 L10,-5 L0,-15 Z" fill="#d9b45f" stroke="none" />
                <path d="M80,0 L85,5 L90,0 L85,-5 Z" fill="#d9b45f" stroke="none" />
              </g>
            </svg>
          </motion.div>
        </main>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard number="12" label="LEAGUES" />
          <StatCard number="48" label="CLUBS" />
          <StatCard number="320" label="FIXTURES" />
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t-2 border-[#2b2b2b] py-8 flex flex-col md:flex-row items-center justify-between font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest">
          <div>© 2026 Football Tracker</div>
          <div className="mt-4 md:mt-0 text-[#d9b45f]">SEASON 01 · LIVE</div>
        </footer>
      </div>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[6px_6px_0_rgba(43,43,43,0.2)] px-8 py-10 flex flex-col items-center justify-center text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(43,43,43,0.2)]">
      <div className="font-['Bebas_Neue'] text-6xl text-[#2b2b2b] mb-1">{number}</div>
      <div className="font-['Space_Grotesk'] text-sm md:text-base tracking-widest font-bold text-[#d9b45f]">
        {label}
      </div>
    </div>
  );
}