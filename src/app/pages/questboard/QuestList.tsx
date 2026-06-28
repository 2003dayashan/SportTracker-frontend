import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { fetchQuests, fetchCategories, type Quest, type Category } from "./api";

// Dummy data for demonstration if backend fails
const DUMMY_QUESTS: Quest[] = [
  {
    id: "1",
    title: "Slay the Code Dragon",
    description: "The legacy codebase has grown into a monstrosity. We need a brave soul to refactor the core module and vanquish the bugs.",
    status: "OPEN",
    difficulty: "HARD",
    rewardXp: 1500,
    deadline: new Date().toISOString(),
    categoryId: "c1",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Gather the Lost Logs",
    description: "Our server crashed and the error logs are scattered across the realm. Aggregate them into a single dashboard.",
    status: "OPEN",
    difficulty: "EASY",
    rewardXp: 300,
    deadline: new Date().toISOString(),
    categoryId: "c2",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Design the Guild Crest",
    description: "The adventurers' guild needs a new logo. Create an aesthetic, hand-drawn vector crest for our doors.",
    status: "CLAIMED",
    difficulty: "MEDIUM",
    rewardXp: 800,
    deadline: new Date().toISOString(),
    categoryId: "c3",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export interface QuestListProps {
  onBack: () => void;
  onQuestClick: (id: string) => void;
}

export default function QuestList({ onBack, onQuestClick }: QuestListProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(false);
      try {
        const [questsData, categoriesData] = await Promise.all([
          fetchQuests(selectedCategory || undefined),
          fetchCategories().catch(() => []) // Fallback categories
        ]);
        setQuests(questsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Backend failed, using dummy data.", err);
        setError(true);
        // Fallback to dummy data for aesthetic demonstration
        setQuests(selectedCategory ? DUMMY_QUESTS.filter(q => q.categoryId === selectedCategory) : DUMMY_QUESTS);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCategory]);

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] overflow-hidden selection:bg-[#d9b45f] selection:text-[#2b2b2b]">
      {/* Dynamic Background Pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(45deg, #2b2b2b 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      
      {/* Decorative Blob */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#d9b45f]/20 rounded-full blur-3xl pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col min-h-screen">
        {/* Navigation & Header Area */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 rounded-full border-[3px] border-[#2b2b2b] bg-[#f7f0df] px-6 py-3 font-['Space_Grotesk'] font-bold text-sm uppercase tracking-widest shadow-[4px_4px_0_0_rgba(43,43,43,0.8)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(43,43,43,0.8)] transition-all"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" strokeWidth={3} /> Return to Guild
          </button>
          
          <div className="text-right">
            <h1 className="font-['Bebas_Neue'] text-[clamp(3rem,6vw,5rem)] leading-[0.85] tracking-tight drop-shadow-[3px_3px_0_rgba(217,180,95,1)]">
              ACTIVE CONTRACTS
            </h1>
            <p className="font-['Space_Grotesk'] text-lg font-bold opacity-75 mt-2">
              Prove your worth, claim the bounties.
            </p>
          </div>
        </header>

        {/* Filter System */}
        <div className="mb-12 flex flex-wrap gap-4 items-center bg-[#f7f0df] p-4 rounded-3xl border-2 border-[#2b2b2b] shadow-[4px_4px_0_rgba(43,43,43,0.2)]">
          <span className="font-['Bebas_Neue'] text-2xl px-2 opacity-60 mr-2">FILTERS:</span>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2.5 rounded-full border-2 border-[#2b2b2b] font-['Space_Grotesk'] font-bold text-sm tracking-widest transition-all ${
              selectedCategory === null
                ? "bg-[#2b2b2b] text-[#f3eee1] shadow-[3px_3px_0_#d9b45f] -translate-y-0.5"
                : "bg-[#efe9da] hover:bg-[#2b2b2b]/5"
            }`}
          >
            ALL CONTRACTS
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full border-2 border-[#2b2b2b] font-['Space_Grotesk'] font-bold text-sm tracking-widest transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#2b2b2b] text-[#f3eee1] shadow-[3px_3px_0_#d9b45f] -translate-y-0.5"
                  : "bg-[#efe9da] hover:bg-[#2b2b2b]/5"
              }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Status Indicators */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3 bg-[#ffb347]/20 border-2 border-[#ffb347] text-[#9c5700] p-4 rounded-2xl font-['Space_Grotesk'] font-bold text-sm shadow-[4px_4px_0_rgba(255,179,71,0.4)]">
            <AlertCircle className="h-5 w-5" />
            Backend connection failed. Displaying simulated guild board for demonstration.
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-[#2b2b2b]" />
                <span className="font-['Bebas_Neue'] text-2xl tracking-widest animate-pulse">Unrolling scrolls...</span>
              </div>
            </div>
          ) : quests.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center border-4 border-dashed border-[#2b2b2b]/20 rounded-[3rem] p-12 text-center bg-[#f7f0df]/50">
              <Sparkles className="h-20 w-20 text-[#d9b45f] mb-6 drop-shadow-[2px_2px_0_#2b2b2b]" />
              <h3 className="font-['Bebas_Neue'] text-5xl text-[#2b2b2b]">THE BOARD IS EMPTY</h3>
              <p className="font-['Space_Grotesk'] text-lg text-[#2b2b2b]/60 mt-4 max-w-md">
                No active contracts match your current filters. Return later or check another category.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12">
              <AnimatePresence>
                {quests.map((quest, index) => {
                  const isHard = quest.difficulty === 'HARD' || quest.difficulty === 'LEGENDARY';
                  return (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                      onClick={() => onQuestClick(quest.id)}
                      className={`group cursor-pointer relative flex flex-col rounded-[2rem] border-[3px] border-[#2b2b2b] p-6 transition-all ${
                        isHard ? 'bg-[#2b2b2b] text-[#f7f0df]' : 'bg-[#f7f0df] text-[#2b2b2b]'
                      }`}
                      style={{
                        boxShadow: isHard ? '8px 8px 0 #d9b45f' : '8px 8px 0 rgba(43,43,43,0.2)',
                      }}
                      whileHover={{ y: -8, x: -4, rotate: (index % 2 === 0 ? 1 : -1) }}
                    >
                      {/* Ribbon / Badge */}
                      <div className="absolute -top-4 -right-4 bg-[#d9b45f] border-[3px] border-[#2b2b2b] text-[#2b2b2b] font-['Bebas_Neue'] text-2xl px-4 py-1 rounded-xl shadow-[4px_4px_0_#2b2b2b] rotate-6 group-hover:scale-110 transition-transform z-10">
                        +{quest.rewardXp} XP
                      </div>

                      <div className="flex items-center gap-3 mb-6 mt-2">
                        <span className={`px-3 py-1 rounded-md border-2 text-[11px] font-['Space_Grotesk'] font-bold uppercase tracking-widest ${
                          isHard ? 'border-[#f7f0df] bg-[#2b2b2b]' : 'border-[#2b2b2b] bg-[#efe9da]'
                        }`}>
                          {quest.difficulty}
                        </span>
                        <span className={`h-2 w-2 rounded-full ${quest.status === 'OPEN' ? 'bg-green-500' : 'bg-orange-500'}`} />
                        <span className="font-['Space_Grotesk'] text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
                          {quest.status}
                        </span>
                      </div>
                      
                      <h3 className="font-['Bebas_Neue'] text-4xl leading-[1.05] mb-4 flex-1">
                        {quest.title}
                      </h3>
                      
                      <p className={`font-['Space_Grotesk'] text-sm leading-relaxed line-clamp-3 mb-8 ${isHard ? 'opacity-80' : 'opacity-70'}`}>
                        {quest.description}
                      </p>

                      <div className={`mt-auto pt-4 border-t-[3px] flex items-center justify-between font-['Space_Grotesk'] font-bold uppercase text-xs tracking-widest ${
                        isHard ? 'border-[#f7f0df]/20' : 'border-[#2b2b2b]/10'
                      }`}>
                        <span>View Details</span>
                        <span className="text-xl leading-none">→</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
