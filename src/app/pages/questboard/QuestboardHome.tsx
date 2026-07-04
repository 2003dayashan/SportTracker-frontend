import React from "react";
import { User } from "./api";
import { ArrowLeft, Trophy, Users, Zap, ClipboardList } from "lucide-react";

type Props = {
  onBack: () => void;
  onBrowseQuests: () => void;
  onDashboard: () => void;
  onMyProgress: () => void;
  onLeaderboard: () => void;
  onAdminPanel: () => void;
  currentUser: User | null;
};

export default function QuestboardHome({ onBack, onDashboard, onBrowseQuests, onMyProgress, onLeaderboard, onAdminPanel, currentUser }: Props) {
  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "GUILD_MASTER";

  return (
    <div className="min-h-screen bg-[#efe9da] text-[#2b2b2b] p-6 lg:p-10 font-['Space_Grotesk'] relative overflow-hidden">
      {/* Background pattern */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(#2b2b2b_1px,transparent_1px),linear-gradient(90deg,#2b2b2b_1px,transparent_1px)] [background-size:46px_46px]" />
      
      <header className="flex items-center justify-between mb-12 relative z-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border-2 border-[#2b2b2b] bg-[#efe9da] px-4 py-2 font-['Space_Grotesk'] text-sm shadow-[3px_3px_0_0_rgba(43,43,43,0.35)] hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} /> Back
        </button>
        <div className="font-['Bebas_Neue'] text-3xl pr-24 lg:pr-32">QUEST BOARD</div>
      </header>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="font-['Bebas_Neue'] text-[80px] leading-none mb-4">CHOOSE YOUR PATH</h1>
          <p className="font-['Caveat'] text-3xl -rotate-2">Will you conquer the pitch or the arena?</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <button onClick={onBrowseQuests} className="group relative rounded-[2rem] border-[3px] border-[#2b2b2b] bg-[#f7f0df] p-8 text-left shadow-[8px_8px_0_0_rgba(43,43,43,0.22)] hover:shadow-[4px_4px_0_0_rgba(43,43,43,0.22)] hover:translate-y-1 hover:translate-x-1 transition-all">
            <ClipboardList className="h-12 w-12 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="font-['Bebas_Neue'] text-4xl mb-2">Browse Quests</h2>
            <p className="opacity-80">Find challenges across Esport and Football.</p>
          </button>

          <button onClick={onDashboard} className="group relative rounded-[2rem] border-[3px] border-[#2b2b2b] bg-[#f7f0df] p-8 text-left shadow-[8px_8px_0_0_rgba(43,43,43,0.22)] hover:shadow-[4px_4px_0_0_rgba(43,43,43,0.22)] hover:translate-y-1 hover:translate-x-1 transition-all">
            <Zap className="h-12 w-12 mb-4 group-hover:scale-110 transition-transform text-orange-500" />
            <h2 className="font-['Bebas_Neue'] text-4xl mb-2">Live Dashboard</h2>
            <p className="opacity-80">Track live scores and your personal progress.</p>
          </button>
          
          <button onClick={onMyProgress} className="group relative rounded-[2rem] border-[3px] border-[#2b2b2b] bg-[#f7f0df] p-8 text-left shadow-[8px_8px_0_0_rgba(43,43,43,0.22)] hover:shadow-[4px_4px_0_0_rgba(43,43,43,0.22)] hover:translate-y-1 hover:translate-x-1 transition-all">
            <Trophy className="h-12 w-12 mb-4 group-hover:scale-110 transition-transform text-yellow-500" />
            <h2 className="font-['Bebas_Neue'] text-4xl mb-2">My Submissions</h2>
            <p className="opacity-80">Track your completed quests and points.</p>
          </button>

          <button onClick={onLeaderboard} className="group relative rounded-[2rem] border-[3px] border-[#2b2b2b] bg-[#f7f0df] p-8 text-left shadow-[8px_8px_0_0_rgba(43,43,43,0.22)] hover:shadow-[4px_4px_0_0_rgba(43,43,43,0.22)] hover:translate-y-1 hover:translate-x-1 transition-all md:col-span-2 lg:col-span-1">
            <Trophy className="h-12 w-12 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="font-['Bebas_Neue'] text-4xl mb-2">Leaderboard</h2>
            <p className="opacity-80">See who rules the realm.</p>
          </button>

          {isAdmin && (
            <button onClick={onAdminPanel} className="group relative rounded-[2rem] border-[3px] border-[#2b2b2b] bg-[#2b2b2b] text-[#efe9da] p-8 text-left shadow-[8px_8px_0_0_rgba(43,43,43,0.22)] hover:shadow-[4px_4px_0_0_rgba(43,43,43,0.22)] hover:translate-y-1 hover:translate-x-1 transition-all">
              <Users className="h-12 w-12 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="font-['Bebas_Neue'] text-4xl mb-2">Guild Master Panel</h2>
              <p className="opacity-80">Create and manage quests for the community.</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
