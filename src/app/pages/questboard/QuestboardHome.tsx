import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle, List, Trophy, Zap } from "lucide-react";

export interface QuestboardHomeProps {
  onBack: () => void;
  onBrowseQuests: () => void;
  onMyProgress: () => void;
}

export default function QuestboardHome({
  onBack,
  onBrowseQuests,
  onMyProgress,
}: QuestboardHomeProps) {
  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] overflow-hidden selection:bg-[#2b2b2b] selection:text-[#efe9da]">
      {/* Subtle Grid Background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(45deg, #2b2b2b 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      
      {/* Decorative Blob */}
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] bg-[#d9b45f]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-[#2b2b2b]/5 rounded-full blur-[80px] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto flex flex-col min-h-screen px-6 py-8 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#2b2b2b] bg-[#efe9da]/80 px-4 py-2 font-['Space_Grotesk'] text-sm shadow-[3px_3px_0_0_rgba(43,43,43,0.35)] hover:-translate-x-0.5 hover:shadow-[4px_4px_0_0_rgba(43,43,43,0.35)] transition-all"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} /> Back
          </button>
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#2b2b2b] bg-[#efe9da]/70">
              <Trophy className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="font-['Bebas_Neue'] text-[26px] tracking-[0.04em]">QUEST BOARD</span>
          </div>
          <div className="w-24" /> {/* Spacer */}
        </header>

        <section className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="rounded-full border-2 border-[#2b2b2b] bg-[#f7f0df] px-3 py-1 font-['Space_Grotesk'] text-[11px] uppercase tracking-[0.22em]">
              Door 02 · Quest Board
            </span>
            <h1 className="mt-6 font-['Bebas_Neue'] text-[clamp(58px,10vw,126px)] leading-[0.88] tracking-[0.015em]">
              THE ADVENTURERS'
              <br />
              GUILD
            </h1>
            <p className="mt-5 max-w-xl font-['Space_Grotesk'] text-lg leading-8 opacity-80">
              Pick up contracts, complete challenges, and earn XP to climb the ranks. The realm awaits your bravery!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: -1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="rounded-[2.5rem] border-[4px] border-[#2b2b2b] bg-[#f7f0df] p-8 shadow-[12px_12px_0_rgba(43,43,43,1)] relative"
          >
            {/* Corner Decorative Pins */}
            <div className="absolute top-6 left-6 h-3 w-3 rounded-full border-2 border-[#2b2b2b] bg-[#d9b45f]" />
            <div className="absolute top-6 right-6 h-3 w-3 rounded-full border-2 border-[#2b2b2b] bg-[#d9b45f]" />
            
            <div className="grid gap-4 sm:grid-cols-3 mt-4">
              <div className="min-h-36 rounded-3xl border-[3px] border-[#2b2b2b] bg-[#efe9da] p-4 flex flex-col items-center justify-center text-center shadow-[4px_4px_0_#d9b45f]">
                <List className="mb-4 h-8 w-8 text-[#2b2b2b]" />
                <p className="font-['Bebas_Neue'] text-3xl leading-none">Browse Quests</p>
              </div>
              <div className="min-h-36 rounded-3xl border-[3px] border-[#2b2b2b] bg-[#efe9da] p-4 flex flex-col items-center justify-center text-center shadow-[4px_4px_0_#d9b45f]">
                <CheckCircle className="mb-4 h-8 w-8 text-[#2b2b2b]" />
                <p className="font-['Bebas_Neue'] text-3xl leading-none">Submit Proof</p>
              </div>
              <div className="min-h-36 rounded-3xl border-[3px] border-[#2b2b2b] bg-[#efe9da] p-4 flex flex-col items-center justify-center text-center shadow-[4px_4px_0_#d9b45f]">
                <Zap className="mb-4 h-8 w-8 text-[#2b2b2b]" />
                <p className="font-['Bebas_Neue'] text-3xl leading-none">Earn XP</p>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <button
                onClick={onBrowseQuests}
                className="group relative overflow-hidden flex w-full items-center justify-between rounded-full border-[3px] border-[#2b2b2b] bg-[#d9b45f] text-[#2b2b2b] px-6 py-5 font-['Bebas_Neue'] text-3xl transition-transform hover:-translate-y-1 shadow-[6px_6px_0_rgba(43,43,43,1)]"
              >
                <div className="absolute inset-0 bg-[#2b2b2b] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-3 group-hover:text-[#f7f0df] transition-colors duration-300 tracking-wider">
                  01 · ENTER QUEST BOARD
                </span>
                <span className="relative z-10 group-hover:text-[#f7f0df] transition-colors duration-300">→</span>
              </button>
              
              <button
                onClick={onMyProgress}
                className="flex w-full items-center justify-between rounded-full border-[3px] border-[#2b2b2b] bg-[#efe9da] px-6 py-5 font-['Bebas_Neue'] text-2xl transition-transform hover:-translate-y-0.5"
              >
                <span className="tracking-wider text-[#2b2b2b]/60">02 · MY PROGRESS (LOCKED)</span>
                <span className="opacity-60">→</span>
              </button>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
