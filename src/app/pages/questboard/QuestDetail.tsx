import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { fetchQuestById, fetchMyProgress, claimQuest, submitQuest, Quest, QuestSubmission } from "./api";
import { toast } from "sonner";

type Props = {
  questId: string;
  isLoggedIn: boolean;
  currentUser: any;
  onBack: () => void;
};

export default function QuestDetail({ questId, isLoggedIn, currentUser, onBack }: Props) {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [submission, setSubmission] = useState<QuestSubmission | null>(null);

  useEffect(() => {
    loadData();
  }, [questId]);

  const loadData = async () => {
    try {
      const q = await fetchQuestById(questId);
      setQuest(q);
      
      if (isLoggedIn) {
        const progress = await fetchMyProgress();
        setSubmission(progress.submissions.find(s => s.questId === questId) || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClaim = async () => {
    if (!isLoggedIn) return toast.error("Please log in to claim quests");
    try {
      await claimQuest(questId);
      toast.success("Quest Claimed!");
      loadData();
    } catch (e) {
      toast.error("Failed to claim quest");
    }
  };

  const handleSubmit = async () => {
    try {
      await submitQuest(questId);
      toast.success("Quest Submitted for Review!");
      loadData();
    } catch (e) {
      toast.error("Failed to submit quest");
    }
  };

  if (!quest) return <div className="p-10 text-center font-['Caveat'] text-2xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#efe9da] text-[#2b2b2b] p-6 lg:p-10 font-['Space_Grotesk']">
      <header className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full border-2 border-[#2b2b2b] bg-[#efe9da] px-4 py-2 text-sm shadow-[3px_3px_0_0_rgba(43,43,43,0.35)] hover:-translate-x-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </header>

      <div className="max-w-2xl mx-auto rounded-[2rem] border-[3px] border-[#2b2b2b] bg-[#f7f0df] p-10 shadow-[12px_12px_0_rgba(43,43,43,0.22)] -rotate-1">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest opacity-60 border-2 border-[#2b2b2b] rounded-full px-3 py-1">{quest.serviceType}</span>
            <h1 className="font-['Bebas_Neue'] text-6xl mt-4 leading-none">{quest.title}</h1>
          </div>
          <div className="text-right bg-[#2b2b2b] text-[#f7f0df] p-4 rounded-2xl border-2 border-[#2b2b2b] rotate-3">
            <div className="font-['Bebas_Neue'] text-5xl">{quest.points}</div>
            <div className="text-xs uppercase font-bold tracking-wider">Points</div>
          </div>
        </div>
        
        <p className="text-xl mb-8 opacity-90">{quest.description}</p>
        
        <div className="border-t-2 border-[#2b2b2b] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-lg">
            Status: {submission ? submission.status : "UNCLAIMED"}
          </span>
          
          <div className="flex gap-4">
            {!submission && (
              <button onClick={handleClaim} className="rounded-full bg-[#2b2b2b] text-[#f3eee1] px-6 py-3 font-bold hover:scale-105 transition-transform shadow-[4px_4px_0_0_rgba(43,43,43,0.4)]">
                Claim Quest
              </button>
            )}
            {submission?.status === "CLAIMED" && (
              <button onClick={handleSubmit} className="rounded-full bg-blue-600 border-2 border-[#2b2b2b] text-[#f3eee1] px-6 py-3 font-bold hover:scale-105 transition-transform shadow-[4px_4px_0_0_rgba(43,43,43,0.4)]">
                Submit Proof
              </button>
            )}
            {submission?.status === "SUBMITTED" && (
              <button disabled className="rounded-full bg-gray-400 border-2 border-[#2b2b2b] text-white px-6 py-3 font-bold opacity-70 cursor-not-allowed">
                Under Review
              </button>
            )}
            {submission?.status === "APPROVED" && (
              <button disabled className="rounded-full bg-green-600 border-2 border-[#2b2b2b] text-white px-6 py-3 font-bold opacity-70 cursor-not-allowed">
                Approved
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
