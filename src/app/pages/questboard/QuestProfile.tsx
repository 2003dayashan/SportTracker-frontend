import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Loader2, Star, Shield, Trophy, CheckCircle, Clock } from "lucide-react";
import { fetchQuests, type Quest, type User } from "./api";

export interface QuestProfileProps {
  isLoggedIn: boolean;
  currentUser?: User | null;
  onBack: () => void;
}

export default function QuestProfile({ isLoggedIn, currentUser, onBack }: QuestProfileProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const response = await fetchQuests();
        // Filter quests claimed by or created by this user if needed
        // For simplicity, we just look for quests that have claimedBy == currentUser.id
        // or just show a subset if backend doesn't support full filtering
        const userQuests = (response.content || []).filter(q => 
          q.claimedBy === currentUser.id || 
          q.status === 'COMPLETED' || 
          q.status === 'SUBMITTED'
        );
        setQuests(userQuests);
      } catch (err) {
        console.error("Failed to load quests for profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isLoggedIn, currentUser]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#efe9da] flex flex-col items-center justify-center p-6 text-center">
        <Shield className="h-16 w-16 text-[#2b2b2b] mb-4 opacity-50" />
        <h1 className="font-['Bebas_Neue'] text-4xl mb-4">ACCESS DENIED</h1>
        <p className="font-['Space_Grotesk'] text-lg opacity-70 mb-8">You must be logged in to view your Adventurer Profile.</p>
        <button onClick={onBack} className="rounded-full border-2 border-[#2b2b2b] px-6 py-2 font-['Space_Grotesk'] font-bold uppercase tracking-widest bg-[#2b2b2b] text-[#f7f0df]">Go Back</button>
      </div>
    );
  }

  const level = currentUser?.level || Math.floor((currentUser?.xp || 0) / 1000) + 1;
  const xp = currentUser?.xp || 0;
  const nextLevelXp = level * 1000;
  const progressPercent = Math.min(100, Math.max(0, (xp / nextLevelXp) * 100));

  const activeQuests = quests.filter(q => q.status === 'CLAIMED' || q.status === 'SUBMITTED');
  const completedQuests = quests.filter(q => q.status === 'COMPLETED');

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] overflow-hidden selection:bg-[#d9b45f] selection:text-[#2b2b2b]">
      <div className="pointer-events-none fixed inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#2b2b2b 2px, transparent 2px)`, backgroundSize: "24px 24px" }} />
      
      <main className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 py-10 flex flex-col min-h-screen">
        <header className="flex items-center justify-between gap-6 mb-12">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 rounded-full border-[3px] border-[#2b2b2b] bg-[#f7f0df] px-6 py-2.5 font-['Space_Grotesk'] font-bold text-sm uppercase tracking-widest shadow-[4px_4px_0_0_rgba(43,43,43,0.8)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(43,43,43,0.8)] transition-all"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" strokeWidth={3} /> Return
          </button>
          
          <h1 className="font-['Bebas_Neue'] text-5xl tracking-wide opacity-80">
            ADVENTURER PROFILE
          </h1>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-1 md:col-span-2 bg-[#2b2b2b] text-[#f7f0df] rounded-[2.5rem] p-8 md:p-10 border-[3px] border-[#2b2b2b] shadow-[8px_8px_0_#d9b45f] relative overflow-hidden">
            <Star className="absolute -right-10 -bottom-10 h-64 w-64 text-[#d9b45f] opacity-10" />
            <div className="relative z-10">
              <p className="font-['Space_Grotesk'] text-sm font-bold tracking-widest uppercase mb-1 opacity-70">RANK {level}</p>
              <h2 className="font-['Bebas_Neue'] text-6xl md:text-7xl mb-8 tracking-wide drop-shadow-[2px_2px_0_#000]">
                {currentUser?.username || "Adventurer"}
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest">
                  <span>Experience</span>
                  <span className="text-[#d9b45f]">{xp} / {nextLevelXp} XP</span>
                </div>
                <div className="h-4 w-full bg-[#f7f0df]/20 rounded-full overflow-hidden border-2 border-[#1a1a1a]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#d9b45f]" 
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#f7f0df] rounded-[2.5rem] p-8 border-[3px] border-[#2b2b2b] shadow-[8px_8px_0_rgba(43,43,43,0.15)] flex flex-col justify-center items-center text-center">
            <Trophy className="h-16 w-16 text-[#d9b45f] mb-4" />
            <p className="font-['Bebas_Neue'] text-5xl">{completedQuests.length}</p>
            <p className="font-['Space_Grotesk'] text-sm font-bold tracking-widest uppercase mt-2 opacity-70">Quests Cleared</p>
          </motion.div>
        </section>

        {/* Quests Section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="font-['Bebas_Neue'] text-4xl">ACTIVE & COMPLETED CONTRACTS</h3>
            <div className="h-1 flex-1 bg-[#2b2b2b]/10 rounded-full" />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-[#2b2b2b]" />
            </div>
          ) : quests.length === 0 ? (
            <div className="text-center py-16 bg-[#f7f0df]/50 rounded-[2rem] border-4 border-dashed border-[#2b2b2b]/20">
              <Shield className="h-16 w-16 text-[#2b2b2b]/30 mx-auto mb-4" />
              <p className="font-['Space_Grotesk'] text-lg font-bold opacity-60">You have no active or completed quests.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {quests.map((q, i) => (
                  <motion.div 
                    key={q.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#f7f0df] p-6 rounded-[2rem] border-[3px] border-[#2b2b2b] shadow-[4px_4px_0_rgba(43,43,43,0.15)] hover:shadow-[6px_6px_0_rgba(43,43,43,0.2)] transition-shadow"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${q.status === 'COMPLETED' ? 'bg-[#d9b45f]' : q.status === 'SUBMITTED' ? 'bg-orange-500' : 'bg-green-500'}`} />
                        <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-[0.2em] opacity-70">
                          {q.status}
                        </span>
                      </div>
                      <h4 className="font-['Bebas_Neue'] text-3xl">{q.title}</h4>
                      <p className="font-['Space_Grotesk'] text-sm opacity-70 line-clamp-1 max-w-xl mt-1">{q.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="font-['Bebas_Neue'] text-2xl text-[#d9b45f]">+{q.rewardXp} XP</p>
                        <p className="font-['Space_Grotesk'] text-[10px] font-bold uppercase tracking-widest opacity-60">Reward</p>
                      </div>
                      <div className={`p-3 rounded-xl border-2 border-[#2b2b2b] ${q.status === 'COMPLETED' ? 'bg-[#2b2b2b] text-[#f7f0df]' : 'bg-[#efe9da]'}`}>
                        {q.status === 'COMPLETED' ? <CheckCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
