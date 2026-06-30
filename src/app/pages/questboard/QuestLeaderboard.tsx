import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Loader2, Trophy, Star, Medal } from "lucide-react";
import { fetchLeaderboard, type User } from "./api";

export interface QuestLeaderboardProps {
  onBack: () => void;
}

export default function QuestLeaderboard({ onBack }: QuestLeaderboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] overflow-hidden selection:bg-[#d9b45f] selection:text-[#2b2b2b]">
      {/* Background Pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(#2b2b2b 2px, transparent 2px)`,
          backgroundSize: "24px 24px",
        }}
      />
      
      {/* Decorative Light Blob */}
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[60vw] h-[40vw] bg-[#d9b45f]/10 rounded-[100%] blur-[120px] pointer-events-none" />

      <main className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 py-10 flex flex-col min-h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="group flex items-center justify-center h-12 w-12 rounded-full border-[3px] border-[#2b2b2b] bg-[#f7f0df] shadow-[4px_4px_0_0_rgba(43,43,43,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(43,43,43,1)] transition-all"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" strokeWidth={3} />
            </button>
            <div>
              <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide drop-shadow-[2px_2px_0_#d9b45f] flex items-center gap-4">
                HALL OF FAME <Trophy className="h-10 w-10 text-[#d9b45f]" />
              </h1>
              <p className="font-['Space_Grotesk'] text-sm uppercase tracking-widest font-bold opacity-60">Top Adventurers by XP</p>
            </div>
          </div>
        </header>

        <section className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-[#2b2b2b]" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 bg-[#f7f0df]/50 rounded-[2.5rem] border-[3px] border-dashed border-[#2b2b2b]/20">
              <Star className="h-16 w-16 text-[#2b2b2b]/30 mx-auto mb-4" />
              <p className="font-['Space_Grotesk'] text-xl font-bold opacity-60">No brave souls have entered the Hall yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {users.map((user, index) => {
                  const isTop3 = index < 3;
                  const rankColors = [
                    "bg-[#d9b45f] text-[#2b2b2b] border-[#2b2b2b]", // Gold
                    "bg-[#e2e8f0] text-[#2b2b2b] border-[#2b2b2b]", // Silver
                    "bg-[#cd7f32] text-[#f7f0df] border-[#2b2b2b]"  // Bronze
                  ];
                  const colorClass = isTop3 ? rankColors[index] : "bg-[#f7f0df] border-[#2b2b2b]";
                  
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-6 rounded-[2rem] border-[3px] shadow-[6px_6px_0_rgba(43,43,43,0.15)] hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(43,43,43,0.2)] transition-all ${colorClass}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`flex items-center justify-center h-14 w-14 rounded-full border-[3px] border-[#2b2b2b] bg-[#2b2b2b] text-[#f7f0df] font-['Bebas_Neue'] text-3xl shadow-[3px_3px_0_rgba(43,43,43,0.3)]`}>
                          {isTop3 ? <Medal className="h-6 w-6" /> : `#${index + 1}`}
                        </div>
                        <div>
                          <h3 className="font-['Bebas_Neue'] text-3xl tracking-wide">{user.username}</h3>
                          <p className="font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest opacity-80">Rank {user.level || Math.floor((user.xp || 0) / 1000) + 1}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-['Bebas_Neue'] text-4xl">{user.xp || 0}</p>
                        <p className="font-['Space_Grotesk'] text-[10px] font-bold uppercase tracking-widest opacity-70">Total XP</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
