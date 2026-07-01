import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { createQuest, fetchPendingSubmissions, approveSubmission, ServiceType, QuestSubmission } from "./api";
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

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const subs = await fetchPendingSubmissions();
      setPending(subs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createQuest({ title, description, points, serviceType });
      toast.success("Quest created successfully!");
      setTitle("");
      setDescription("");
      setPoints(100);
    } catch (err) {
      toast.error("Failed to create quest");
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
        <div className="font-['Bebas_Neue'] text-3xl">GUILD MASTER PANEL</div>
      </header>

      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div>
          <h2 className="font-['Bebas_Neue'] text-5xl mb-8">Post a New Quest</h2>
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
            <button type="submit" className="w-full rounded-full border-2 border-[#efe9da] bg-[#efe9da] text-[#2b2b2b] p-4 font-bold hover:bg-transparent hover:text-[#efe9da] transition-colors mt-4">
              POST QUEST
            </button>
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
        </div>
      </div>
    </div>
  );
}
