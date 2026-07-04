import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import EnhancedQuestCard from "../../components/EnhancedQuestCard";
import { fetchQuests, fetchQuestsByService, fetchMyProgress, Quest, QuestSubmission, ServiceType } from "./api";
import { toast } from "sonner";

type Props = {
  onBack: () => void;
  onQuestClick: (id: string) => void;
};

export default function QuestList({ onBack, onQuestClick }: Props) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [submissions, setSubmissions] = useState<QuestSubmission[]>([]);
  const [filter, setFilter] = useState<ServiceType | "ALL" | "LIVE_EVENTS">("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [filter, page]);

  const loadData = async () => {
    try {
      if (filter === "ALL") {
        const res = await fetchQuests(page, 5);
        setQuests(res.content);
        setTotalPages(res.totalPages);
      } else if (filter === "LIVE_EVENTS") {
        // For live events, fetch all and filter since the backend doesn't have a specific endpoint yet
        // In a real app, you'd add a dedicated endpoint to paginate this properly
        const res = await fetchQuests(0, 100);
        const live = res.content.filter(q => q.isLiveEventRelated);
        setQuests(live);
        setTotalPages(1);
      } else {
        const res = await fetchQuestsByService(filter as ServiceType, page, 5);
        setQuests(res.content);
        setTotalPages(res.totalPages);
      }
      
      try {
        const progress = await fetchMyProgress();
        setSubmissions(progress.submissions);
      } catch (e) {
        // User might not be logged in
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatus = (questId: string) => {
    return submissions.find(s => s.questId === questId)?.status;
  };

  return (
    <div className="min-h-screen bg-[#efe9da] text-[#2b2b2b] p-6 lg:p-10 font-['Space_Grotesk']">
      <header className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full border-2 border-[#2b2b2b] bg-[#efe9da] px-4 py-2 font-['Space_Grotesk'] text-sm shadow-[3px_3px_0_0_rgba(43,43,43,0.35)] hover:-translate-x-1 transition-transform">
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} /> Back
        </button>
        <div className="font-['Bebas_Neue'] text-3xl pr-24 lg:pr-32">ACTIVE QUESTS</div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {["ALL", "ESPORT", "SPORT", "LIVE_EVENTS"].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f as any); setPage(0); }}
              className={`rounded-full border-2 border-[#2b2b2b] px-6 py-2 font-bold uppercase transition-all ${filter === f ? "bg-[#2b2b2b] text-[#efe9da]" : "bg-transparent"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-6">
          {quests.map((q) => {
            const status = getStatus(q.id);
            return (
              <EnhancedQuestCard 
                key={q.id} 
                quest={q} 
                status={status} 
                onClick={onQuestClick} 
              />
            );
          })}
          {quests.length === 0 && (
            <div className="text-center py-20 font-['Caveat'] text-4xl opacity-50 -rotate-2">
              No quests available right now. Check back later!
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 border-2 border-[#2b2b2b] rounded-full font-bold uppercase disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-bold">Page {page + 1} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 border-2 border-[#2b2b2b] rounded-full font-bold uppercase disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
