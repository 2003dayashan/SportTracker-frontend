import React, { useEffect, useState } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { fetchLeaderboard } from "./api";

type Props = {
  onBack: () => void;
};

export default function QuestLeaderboard({ onBack }: Props) {
  const [leaders, setLeaders] = useState<{userId: string, username: string, points: number}[]>([]);

  useEffect(() => {
    fetchLeaderboard().then(setLeaders).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#efe9da] text-[#2b2b2b] p-6 lg:p-10 font-['Space_Grotesk']">
      <header className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full border-2 border-[#2b2b2b] px-4 py-2 hover:-translate-x-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </header>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Trophy className="h-16 w-16 mx-auto mb-4" />
          <h1 className="font-['Bebas_Neue'] text-6xl">LEADERBOARD</h1>
          <p className="font-['Caveat'] text-2xl -rotate-1 mt-2">The best of the best.</p>
        </div>
        
        <div className="space-y-4">
          {leaders.length === 0 && <p className="text-center font-['Caveat'] text-2xl">No points awarded yet. Be the first!</p>}
          {leaders.map((leader, index) => (
            <div key={leader.userId} className="flex items-center justify-between p-4 rounded-xl border-2 border-[#2b2b2b] bg-[#f7f0df] shadow-[4px_4px_0_0_rgba(43,43,43,0.22)]">
              <div className="flex items-center gap-4">
                <div className="font-['Bebas_Neue'] text-3xl opacity-50 w-8">#{index + 1}</div>
                <div className="font-bold text-lg">{leader.username || "Unknown"}</div>
              </div>
              <div className="font-['Bebas_Neue'] text-2xl text-green-600">{leader.points} PTS</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
