import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { fetchQuests, fetchQuestsByService, fetchMyProgress, Quest, QuestSubmission, ServiceType } from "./api";
import { toast } from "sonner";

type Props = {
  onBack: () => void;
  onQuestClick: (id: string) => void;
};

export default function QuestList({ onBack, onQuestClick }: Props) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [submissions, setSubmissions] = useState<QuestSubmission[]>([]);
  const [filter, setFilter] = useState<ServiceType | "ALL">("ALL");

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      if (filter === "ALL") {
        setQuests(await fetchQuests());
      } else {
        setQuests(await fetchQuestsByService(filter));
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
        <div className="font-['Bebas_Neue'] text-3xl">ACTIVE QUESTS</div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-8 justify-center">
          {["ALL", "ESPORT", "SPORT"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
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
              <div 
                key={q.id} 
                onClick={() => onQuestClick(q.id)}
                className="group cursor-pointer flex flex-col md:flex-row items-center justify-between rounded-[2rem] border-[3px] border-[#2b2b2b] bg-[#f7f0df] p-6 shadow-[8px_8px_0_0_rgba(43,43,43,0.22)] hover:shadow-[4px_4px_0_0_rgba(43,43,43,0.22)] hover:translate-y-1 transition-all"
              >
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">{q.serviceType}</span>
                  <h3 className="font-['Bebas_Neue'] text-3xl mt-1">{q.title}</h3>
                  <p className="opacity-80 mt-2">{q.description}</p>
                </div>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                  <div className="text-center">
                    <span className="block font-['Bebas_Neue'] text-4xl">{q.points}</span>
                    <span className="text-xs uppercase tracking-widest font-bold">PTS</span>
                  </div>
                  
                  <div className="text-sm font-bold w-24 text-center">
                    {!status && <span className="opacity-50">UNCLAIMED</span>}
                    {status === "CLAIMED" && <span className="text-orange-500">CLAIMED</span>}
                    {status === "SUBMITTED" && <span className="text-blue-500">PENDING</span>}
                    {status === "APPROVED" && <span className="text-green-600">APPROVED</span>}
                    {status === "REJECTED" && <span className="text-red-500">REJECTED</span>}
                  </div>
                </div>
              </div>
            );
          })}
          {quests.length === 0 && (
            <div className="text-center py-20 font-['Caveat'] text-4xl opacity-50 -rotate-2">
              No quests available right now. Check back later!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
