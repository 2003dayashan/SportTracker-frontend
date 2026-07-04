import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { createQuest, updateQuest, deleteQuest, fetchQuests, fetchPendingSubmissions, approveSubmission, ServiceType, QuestSubmission, Quest } from "./api";
import { toast } from "sonner";

type Props = {
  currentUser: any;
  onBack: () => void;
};

export default function GuildMasterPanel({ onBack }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(100);
  const [serviceType, setServiceType] = useState<ServiceType>("ESPORT");
  
  const [pending, setPending] = useState<QuestSubmission[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [allQuests, setAllQuests] = useState<Quest[]>([]);
  const [questsPage, setQuestsPage] = useState(0);
  const [questsTotalPages, setQuestsTotalPages] = useState(1);
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);

  useEffect(() => {
    loadPending();
  }, [page]);

  useEffect(() => {
    loadAllQuests();
  }, [questsPage]);

  const loadAllQuests = async () => {
    try {
      const res = await fetchQuests(questsPage, 5);
      setAllQuests(res.content);
      setQuestsTotalPages(res.totalPages);
    } catch (e) {
      console.error(e);
    }
  };

  const loadPending = async () => {
    try {
      const res = await fetchPendingSubmissions(page, 5);
      setPending(res.content);
      setTotalPages(res.totalPages);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuestId) {
        await updateQuest(editingQuestId, { title, description, points, serviceType });
        toast.success("Quest updated successfully!");
        setEditingQuestId(null);
      } else {
        await createQuest({ title, description, points, serviceType });
        toast.success("Quest created successfully!");
      }
      setTitle("");
      setDescription("");
      setPoints(100);
      loadAllQuests();
    } catch (err) {
      toast.error(editingQuestId ? "Failed to update quest" : "Failed to create quest");
    }
  };

  const handleEdit = (q: Quest) => {
    setEditingQuestId(q.id);
    setTitle(q.title);
    setDescription(q.description);
    setPoints(q.points);
    setServiceType(q.serviceType);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quest?")) return;
    try {
      await deleteQuest(id);
      toast.success("Quest deleted!");
      loadAllQuests();
    } catch (e) {
      toast.error("Failed to delete quest");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveSubmission(id);
      toast.success("Submission Approved!");
      loadPending();
    } catch (e) {
      toast.error("Approval failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2b2b] text-[#efe9da] p-6 lg:p-10 font-['Space_Grotesk']">
      <header className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full border-2 border-[#efe9da] px-4 py-2 text-sm hover:-translate-x-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="font-['Bebas_Neue'] text-3xl pr-24 lg:pr-32">GUILD MASTER PANEL</div>
      </header>

      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
        <div>
          <h2 className="font-['Bebas_Neue'] text-5xl mb-8">{editingQuestId ? "Edit Quest" : "Post a New Quest"}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-bold">Quest Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-transparent border-2 border-[#efe9da] rounded-xl p-3 outline-none focus:bg-[#3b3b3b]" />
            </div>
            <div>
              <label className="block mb-2 font-bold">Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-transparent border-2 border-[#efe9da] rounded-xl p-3 outline-none focus:bg-[#3b3b3b]" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-bold">Points</label>
                <input type="number" required value={points} onChange={e => setPoints(Number(e.target.value))} className="w-full bg-transparent border-2 border-[#efe9da] rounded-xl p-3 outline-none focus:bg-[#3b3b3b]" />
              </div>
              <div>
                <label className="block mb-2 font-bold">Service Type</label>
                <select value={serviceType} onChange={e => setServiceType(e.target.value as ServiceType)} className="w-full bg-transparent border-2 border-[#efe9da] rounded-xl p-3 outline-none focus:bg-[#3b3b3b]">
                  <option value="ESPORT" className="text-black">ESPORT</option>
                  <option value="SPORT" className="text-black">SPORT</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button type="submit" className="flex-1 rounded-full border-2 border-[#efe9da] bg-[#efe9da] text-[#2b2b2b] p-4 font-bold hover:bg-transparent hover:text-[#efe9da] transition-colors">
                {editingQuestId ? "SAVE CHANGES" : "POST QUEST"}
              </button>
              {editingQuestId && (
                <button type="button" onClick={() => {
                  setEditingQuestId(null);
                  setTitle("");
                  setDescription("");
                  setPoints(100);
                }} className="flex-1 rounded-full border-2 border-red-500 text-red-500 p-4 font-bold hover:bg-red-500 hover:text-white transition-colors">
                  CANCEL
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div>
          <h2 className="font-['Bebas_Neue'] text-5xl mb-8">Pending Approvals</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {pending.length === 0 && (
              <p className="opacity-70 font-['Caveat'] text-2xl -rotate-2">No pending submissions right now.</p>
            )}
            {pending.map(sub => (
              <div key={sub.id} className="border-2 border-[#efe9da] rounded-[2rem] p-5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#3b3b3b]">
                <div>
                  <h3 className="font-bold">{sub.questTitle}</h3>
                  <p className="opacity-70 text-sm">Submitted by: {sub.username}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-['Bebas_Neue'] text-2xl">{sub.points} PTS</span>
                  <button onClick={() => handleApprove(sub.id)} className="rounded-full bg-green-500 text-white p-2 hover:scale-110 transition-transform">
                    <CheckCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border-2 border-[#efe9da] rounded-full font-bold uppercase disabled:opacity-50 text-sm"
              >
                Previous
              </button>
              <span className="font-bold text-sm">Page {page + 1} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 border-2 border-[#efe9da] rounded-full font-bold uppercase disabled:opacity-50 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t-2 border-[#efe9da] pt-12">
        <h2 className="font-['Bebas_Neue'] text-5xl mb-8">Manage Quests</h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {allQuests.length === 0 && (
            <p className="opacity-70 font-['Caveat'] text-2xl -rotate-2">No active quests found.</p>
          )}
          {allQuests.map(q => (
            <div key={q.id} className="border-2 border-[#efe9da] rounded-[2rem] p-5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#3b3b3b]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-60 border-2 border-[#efe9da] rounded-full px-2 py-1 mr-2">{q.serviceType}</span>
                <span className="font-bold text-lg">{q.title}</span>
                <p className="opacity-70 text-sm mt-2">{q.description.slice(0, 100)}...</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-['Bebas_Neue'] text-2xl">{q.points} PTS</span>
                <button onClick={() => handleEdit(q)} className="rounded-full border-2 border-[#efe9da] px-4 py-2 hover:bg-[#efe9da] hover:text-[#2b2b2b] transition-colors font-bold text-sm">
                  EDIT
                </button>
                <button onClick={() => handleDelete(q.id)} className="rounded-full border-2 border-red-500 text-red-500 px-4 py-2 hover:bg-red-500 hover:text-white transition-colors font-bold text-sm">
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {questsTotalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button 
              onClick={() => setQuestsPage(p => Math.max(0, p - 1))}
              disabled={questsPage === 0}
              className="px-4 py-2 border-2 border-[#efe9da] rounded-full font-bold uppercase disabled:opacity-50 text-sm"
            >
              Previous
            </button>
            <span className="font-bold text-sm">Page {questsPage + 1} of {questsTotalPages}</span>
            <button 
              onClick={() => setQuestsPage(p => Math.min(questsTotalPages - 1, p + 1))}
              disabled={questsPage >= questsTotalPages - 1}
              className="px-4 py-2 border-2 border-[#efe9da] rounded-full font-bold uppercase disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
