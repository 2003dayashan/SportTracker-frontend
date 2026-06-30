import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Loader2, Upload, CheckCircle, ShieldAlert, FileText, Zap } from "lucide-react";
import { fetchQuestById, claimQuest, submitQuest, type Quest, type User } from "./api";

// Dummy data for demonstration if backend fails
const DUMMY_QUEST: Quest = {
  id: "1",
  title: "Slay the Code Dragon",
  description: "The legacy codebase has grown into a monstrosity. We need a brave soul to refactor the core module, vanquish the ancient bugs, and restore peace to the main branch.\n\nRequirements:\n- 100% test coverage\n- Zero lint errors\n- Migration to React 18+",
  status: "OPEN",
  difficulty: "LEGENDARY",
  rewardXp: 1500,
  deadline: new Date().toISOString(),
  categoryId: "c1",
  createdBy: "Guildmaster Alan",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export interface QuestDetailProps {
  questId: string;
  onBack: () => void;
  isLoggedIn: boolean;
  currentUser?: User | null;
}

export default function QuestDetail({ questId, onBack, isLoggedIn, currentUser }: QuestDetailProps) {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [proofText, setProofText] = useState("");

  useEffect(() => {
    const loadQuest = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await fetchQuestById(questId);
        setQuest(data);
      } catch (err) {
        console.error("Failed to load quest, using dummy data.", err);
        setError(true);
        // Delay slightly for dramatic effect
        setTimeout(() => setQuest(DUMMY_QUEST), 500);
      } finally {
        setLoading(false);
      }
    };
    loadQuest();
  }, [questId]);

  const handleClaim = async () => {
    if (!isLoggedIn) {
      alert("Please log in to claim quests.");
      return;
    }
    setActionLoading(true);
    try {
      const updated = await claimQuest(questId);
      setQuest(updated);
    } catch (err) {
      // Dummy flow if backend fails
      if (error) {
        setTimeout(() => {
          setQuest(q => q ? { ...q, status: "CLAIMED" } : q);
          setActionLoading(false);
        }, 1000);
      } else {
        alert(err instanceof Error ? err.message : "Failed to claim");
        setActionLoading(false);
      }
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofText.trim()) {
      alert("Proof description is required.");
      return;
    }
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("proofText", proofText);
      if (file) {
        formData.append("file", file);
      }
      await submitQuest(questId, formData);
      setQuest(q => q ? { ...q, status: "SUBMITTED" } : q);
      setFile(null);
      setProofText("");
    } catch (err) {
      // Dummy flow if backend fails
      if (error) {
        setTimeout(() => {
          setQuest(q => q ? { ...q, status: "SUBMITTED" } : q);
          setActionLoading(false);
          setFile(null);
        }, 1500);
      } else {
        alert(err instanceof Error ? err.message : "Failed to submit proof");
        setActionLoading(false);
      }
    }
  };

  if (loading || (!quest && !error)) {
    return (
      <div className="min-h-screen bg-[#efe9da] flex flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-[#2b2b2b] mb-4" />
        <span className="font-['Bebas_Neue'] text-3xl tracking-widest animate-pulse text-[#2b2b2b]">Translating Ancient Runes...</span>
      </div>
    );
  }

  if (!quest) return null; // Should not happen with dummy data fallback

  const isHard = quest.difficulty === 'HARD' || quest.difficulty === 'LEGENDARY';

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] overflow-hidden selection:bg-[#d9b45f]">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.08]" style={{ backgroundImage: `radial-gradient(#2b2b2b 2px, transparent 2px)`, backgroundSize: "32px 32px" }} />
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#d9b45f]/20 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-3 rounded-full border-[3px] border-[#2b2b2b] bg-[#f7f0df] px-6 py-2.5 font-['Space_Grotesk'] font-bold text-sm uppercase tracking-widest shadow-[4px_4px_0_0_rgba(43,43,43,0.6)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(43,43,43,0.8)] transition-all"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" strokeWidth={3} /> Return
          </button>
          
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 opacity-40" strokeWidth={1.5} />
            <span className="font-['Bebas_Neue'] text-4xl tracking-wide uppercase opacity-40 mt-1">
              CONTRACT DETAILS
            </span>
          </div>
        </nav>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-center gap-3 bg-[#ffb347]/20 border-2 border-[#ffb347] text-[#9c5700] p-4 rounded-2xl font-['Space_Grotesk'] font-bold text-sm">
            <AlertCircle className="h-5 w-5" />
            Displaying simulated contract (Backend connection unavailable)
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90 }}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12"
        >
          {/* Left Column: Contract Paper */}
          <div className="flex-[3] relative">
            {/* The Parchment */}
            <div className={`relative rounded-[3rem] border-4 border-[#2b2b2b] p-10 md:p-14 shadow-[16px_16px_0_rgba(43,43,43,0.15)] ${isHard ? 'bg-[#2b2b2b] text-[#f7f0df]' : 'bg-[#f7f0df] text-[#2b2b2b]'}`}>
              {/* Corner Screws/Rivets */}
              <div className={`absolute top-6 left-6 h-4 w-4 rounded-full border-2 ${isHard ? 'border-[#f7f0df] bg-[#2b2b2b]' : 'border-[#2b2b2b] bg-[#f7f0df]'}`} />
              <div className={`absolute top-6 right-6 h-4 w-4 rounded-full border-2 ${isHard ? 'border-[#f7f0df] bg-[#2b2b2b]' : 'border-[#2b2b2b] bg-[#f7f0df]'}`} />
              
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className={`px-4 py-1.5 rounded-lg border-[3px] text-sm font-['Space_Grotesk'] font-bold uppercase tracking-widest ${
                  quest.difficulty === 'EASY' ? 'border-[#2b2b2b] bg-[#c1e1c1] text-[#2b2b2b]' :
                  quest.difficulty === 'MEDIUM' ? 'border-[#2b2b2b] bg-[#fdfd96] text-[#2b2b2b]' :
                  quest.difficulty === 'HARD' ? 'border-[#f7f0df] bg-[#ffb347] text-[#2b2b2b]' : 'border-[#f7f0df] bg-[#ff6961] text-[#f7f0df]'
                }`}>
                  {quest.difficulty} RANK
                </span>
                <span className={`font-['Space_Grotesk'] font-bold uppercase tracking-widest text-sm px-4 py-1.5 rounded-full border-2 border-dashed ${isHard ? 'border-[#f7f0df]/40' : 'border-[#2b2b2b]/40'}`}>
                  STATUS: {quest.status}
                </span>
              </div>

              <h1 className="font-['Bebas_Neue'] text-[clamp(4rem,7vw,7rem)] leading-[0.85] mb-12 uppercase drop-shadow-[2px_2px_0_rgba(217,180,95,0.4)]">
                {quest.title}
              </h1>

              <div className="relative">
                <FileText className={`absolute -left-6 -top-6 h-24 w-24 opacity-5 ${isHard ? 'text-[#f7f0df]' : 'text-[#2b2b2b]'}`} />
                <div className={`prose prose-xl max-w-none font-['Space_Grotesk'] leading-relaxed ${isHard ? 'text-[#f7f0df]/80' : 'text-[#2b2b2b]/80'}`}>
                  <p className="whitespace-pre-wrap">{quest.description}</p>
                </div>
              </div>

              <div className={`mt-16 pt-8 border-t-[3px] flex flex-wrap gap-12 font-['Space_Grotesk'] uppercase tracking-widest ${isHard ? 'border-[#f7f0df]/20' : 'border-[#2b2b2b]/10'}`}>
                <div>
                  <p className="text-xs font-bold opacity-50 mb-1">Posted By</p>
                  <p className="font-bold text-lg">{quest.createdBy || 'Unknown Client'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold opacity-50 mb-1">Time Limit</p>
                  <p className="font-bold text-lg">{new Date(quest.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="flex-[1.2] flex flex-col gap-6">
            {/* Reward Card */}
            <div className="bg-[#2b2b2b] text-[#f7f0df] border-[3px] border-[#2b2b2b] rounded-[2.5rem] p-8 text-center shadow-[8px_8px_0_rgba(217,180,95,1)] relative overflow-hidden">
              <Zap className="absolute -right-4 -top-4 h-32 w-32 text-[#d9b45f] opacity-20" />
              <p className="font-['Space_Grotesk'] text-sm font-bold tracking-widest uppercase mb-4 opacity-70">BOUNTY REWARD</p>
              <p className="font-['Bebas_Neue'] text-7xl text-[#d9b45f] drop-shadow-[2px_2px_0_#000]">
                +{quest.rewardXp}
              </p>
              <p className="font-['Space_Grotesk'] text-xl font-bold uppercase tracking-widest mt-2">Exp. Points</p>
            </div>

            {/* Action Card */}
            <div className="flex-1 bg-[#efe9da] border-[3px] border-dashed border-[#2b2b2b]/40 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center gap-6 relative">
              
              {quest.status === "OPEN" && (
                <AnimatePresence mode="wait">
                  <motion.div key="open" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center">
                    <p className="font-['Space_Grotesk'] text-lg font-bold mb-6">Will you accept this contract?</p>
                    <button
                      onClick={handleClaim}
                      disabled={actionLoading}
                      className="w-full relative overflow-hidden group rounded-full border-[3px] border-[#2b2b2b] bg-[#d9b45f] text-[#2b2b2b] px-6 py-5 font-['Bebas_Neue'] text-3xl uppercase tracking-wider shadow-[6px_6px_0_#2b2b2b] hover:-translate-y-1 hover:shadow-[8px_8px_0_#2b2b2b] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-[#2b2b2b] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                      <span className="relative z-10 flex items-center gap-3 group-hover:text-[#f7f0df] transition-colors duration-300">
                        {actionLoading ? <Loader2 className="animate-spin h-6 w-6" /> : "SIGN CONTRACT"}
                      </span>
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}

              {quest.status === "CLAIMED" && (
                <AnimatePresence mode="wait">
                  <motion.div key="claimed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
                    <form onSubmit={handleSubmitProof} className="flex flex-col gap-4">
                      <p className="font-['Space_Grotesk'] text-xl font-bold uppercase tracking-widest">Submit Proof</p>
                      
                      <textarea
                        value={proofText}
                        onChange={(e) => setProofText(e.target.value)}
                        placeholder="Describe how you completed this quest..."
                        required
                        className="w-full rounded-2xl border-[3px] border-[#2b2b2b] bg-[#f7f0df] p-4 font-['Space_Grotesk'] min-h-[100px] outline-none focus:border-[#d9b45f] transition-colors resize-none"
                      />

                      <label className="group relative border-[3px] border-[#2b2b2b] bg-[#f7f0df] rounded-2xl p-6 cursor-pointer hover:bg-[#d9b45f]/10 transition-colors flex flex-col items-center justify-center text-center shadow-[4px_4px_0_rgba(43,43,43,0.1)] hover:shadow-[6px_6px_0_rgba(43,43,43,0.3)]">
                        <Upload className="h-8 w-8 mb-2 opacity-80 group-hover:scale-110 transition-transform group-hover:text-[#d9b45f]" strokeWidth={2} />
                        <span className="font-['Space_Grotesk'] text-xs font-bold tracking-wide">
                          {file ? file.name : "ATTACH FILE (OPTIONAL)"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          accept="*/*"
                        />
                      </label>

                      <button
                        type="submit"
                        disabled={!proofText.trim() || actionLoading}
                        className="w-full mt-2 rounded-full border-[3px] border-[#2b2b2b] bg-[#2b2b2b] text-[#f7f0df] px-6 py-4 font-['Space_Grotesk'] font-bold uppercase tracking-widest shadow-[6px_6px_0_#d9b45f] hover:-translate-y-1 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 transition-all flex items-center justify-center"
                      >
                        {actionLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "UPLOAD PROOF"}
                      </button>
                    </form>
                  </motion.div>
                </AnimatePresence>
              )}

              {(quest.status === "SUBMITTED" || quest.status === "COMPLETED") && (
                <AnimatePresence mode="wait">
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full text-center py-8">
                    <CheckCircle className="h-20 w-20 mx-auto text-[#d9b45f] mb-6 drop-shadow-[2px_2px_0_#2b2b2b]" strokeWidth={2} />
                    <p className="font-['Bebas_Neue'] text-5xl">
                      {quest.status === "COMPLETED" ? "QUEST CLEARED!" : "PROOF SUBMITTED"}
                    </p>
                    {quest.status === "SUBMITTED" && (
                      <p className="font-['Space_Grotesk'] text-sm font-bold opacity-70 mt-4 max-w-xs mx-auto uppercase tracking-widest">
                        Awaiting Guildmaster Assessment.
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
