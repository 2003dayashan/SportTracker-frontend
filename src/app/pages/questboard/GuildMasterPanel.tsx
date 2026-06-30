import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle, XCircle, ShieldAlert, Loader2 } from "lucide-react";
import { fetchQuests, fetchCategories, createQuest, updateQuest, deleteQuest, createCategory, approveSubmission, fetchPendingSubmissions, type Quest, type Category, type User, type QuestSubmission } from "./api";

export interface GuildMasterPanelProps {
  currentUser?: User | null;
  onBack: () => void;
}

type Tab = "quests" | "submissions" | "categories";

export default function GuildMasterPanel({ currentUser, onBack }: GuildMasterPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("quests");
  
  // Data State
  const [quests, setQuests] = useState<Quest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submissions, setSubmissions] = useState<QuestSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State - Quest
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [questForm, setQuestForm] = useState<Partial<Quest>>({ title: "", description: "", difficulty: "EASY", rewardXp: 100, deadline: "", categoryId: "" });
  
  // Edit State
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  // Form State - Category
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({ name: "", description: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const [questsData, catsData, subsData] = await Promise.all([
        fetchQuests().catch(() => ({ content: [] as Quest[], last: true })),
        fetchCategories().catch(() => []),
        fetchPendingSubmissions().catch(() => [])
      ]);
      setQuests(questsData.content || questsData as unknown as Quest[]);
      setCategories(catsData);
      setSubmissions(subsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createQuest(questForm);
      setShowQuestForm(false);
      loadData();
    } catch (err) {
      alert("Failed to create quest: " + (err instanceof Error ? err.message : ""));
    }
  };

  const handleDeleteQuest = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this quest?")) return;
    try {
      await deleteQuest(id);
      loadData();
    } catch (err) {
      alert("Failed to delete quest: " + (err instanceof Error ? err.message : ""));
    }
  };

  const handleUpdateQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuest) return;
    try {
      await updateQuest(editingQuest.id, questForm);
      setEditingQuest(null);
      setShowQuestForm(false);
      setQuestForm({ title: "", description: "", difficulty: "EASY", rewardXp: 100, deadline: "", categoryId: "" });
      loadData();
    } catch (err) {
      alert("Failed to update quest: " + (err instanceof Error ? err.message : ""));
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory(categoryForm);
      setShowCategoryForm(false);
      loadData();
    } catch (err) {
      alert("Failed to create category: " + (err instanceof Error ? err.message : ""));
    }
  };

  const handleReviewSubmission = async (submissionId: string, approved: boolean) => {
    try {
      await approveSubmission(submissionId, approved);
      loadData();
    } catch (err) {
      alert("Failed to review submission.");
      console.error(err);
    }
  };

  const userRole = (currentUser?.role || "").toUpperCase();
  const isPrivileged = userRole === "GUILD_MASTER" || userRole === "ADMIN" || userRole.includes("GUILD") || userRole.includes("ADMIN") || userRole.includes("MASTER");

  if (!isPrivileged) {
    return (
      <div className="min-h-screen bg-[#efe9da] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="font-['Bebas_Neue'] text-4xl mb-4">RESTRICTED AREA</h1>
        <p className="font-['Space_Grotesk'] text-lg opacity-70 mb-8">Only Guild Masters may enter this office.</p>
        <button onClick={onBack} className="rounded-full border-2 border-[#2b2b2b] px-6 py-2 font-['Space_Grotesk'] font-bold bg-[#2b2b2b] text-[#f7f0df]">Go Back</button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] overflow-hidden selection:bg-[#2b2b2b] selection:text-[#efe9da]">
      <div className="pointer-events-none fixed inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(45deg, #2b2b2b 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
      
      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-10 flex flex-col min-h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="group flex items-center justify-center h-12 w-12 rounded-full border-[3px] border-[#2b2b2b] bg-[#f7f0df] shadow-[4px_4px_0_0_rgba(43,43,43,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(43,43,43,1)] transition-all"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" strokeWidth={3} />
            </button>
            <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide drop-shadow-[2px_2px_0_#d9b45f]">
              GUILD MASTER OFFICE
            </h1>
          </div>
        </header>

        {/* Custom Tabs */}
        <div className="flex flex-wrap gap-4 mb-10">
          {[
            { id: "quests", label: "Manage Quests" },
            { id: "submissions", label: `Review Submissions (${submissions.length})` },
            { id: "categories", label: "Categories" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-8 py-3 rounded-full border-[3px] border-[#2b2b2b] font-['Bebas_Neue'] text-2xl tracking-widest transition-all ${
                activeTab === tab.id 
                  ? "bg-[#2b2b2b] text-[#f7f0df] shadow-[4px_4px_0_#d9b45f] -translate-y-1" 
                  : "bg-[#f7f0df] text-[#2b2b2b] hover:bg-[#d9b45f]/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-[#f7f0df] border-[4px] border-[#2b2b2b] rounded-[2.5rem] p-8 shadow-[12px_12px_0_rgba(43,43,43,1)] relative overflow-hidden">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-[#2b2b2b]" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* QUESTS TAB */}
              {activeTab === "quests" && (
                <motion.div key="quests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-8 border-b-2 border-[#2b2b2b]/10 pb-4">
                    <h2 className="font-['Bebas_Neue'] text-4xl">All Quests</h2>
                    <button 
                      onClick={() => {
                        setShowQuestForm(!showQuestForm);
                        if (showQuestForm) {
                          setEditingQuest(null);
                          setQuestForm({ title: "", description: "", difficulty: "EASY", rewardXp: 100, deadline: "", categoryId: "" });
                        }
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#d9b45f] border-2 border-[#2b2b2b] rounded-full font-['Space_Grotesk'] font-bold text-sm uppercase tracking-widest shadow-[3px_3px_0_#2b2b2b] hover:-translate-y-0.5 transition-transform"
                    >
                      {showQuestForm ? <ArrowLeft className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {showQuestForm ? "Back to List" : "Draft New Quest"}
                    </button>
                  </div>

                  {showQuestForm ? (
                    <form onSubmit={editingQuest ? handleUpdateQuest : handleCreateQuest} className="max-w-2xl mx-auto space-y-6">
                      {editingQuest && (
                        <div className="bg-[#d9b45f]/20 border-2 border-[#d9b45f] rounded-xl p-4 mb-2">
                          <p className="font-['Space_Grotesk'] font-bold text-sm uppercase tracking-widest">✏️ Editing Quest: {editingQuest.title}</p>
                        </div>
                      )}
                      <div>
                        <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest mb-2">Title</label>
                        <input type="text" required value={questForm.title} onChange={e => setQuestForm({...questForm, title: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#2b2b2b] bg-[#efe9da] outline-none focus:border-[#d9b45f] font-['Space_Grotesk']" />
                      </div>
                      <div>
                        <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest mb-2">Description</label>
                        <textarea required value={questForm.description} onChange={e => setQuestForm({...questForm, description: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#2b2b2b] bg-[#efe9da] outline-none focus:border-[#d9b45f] min-h-[120px] font-['Space_Grotesk'] resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest mb-2">Difficulty</label>
                          <select value={questForm.difficulty} onChange={e => setQuestForm({...questForm, difficulty: e.target.value as any})} className="w-full p-4 rounded-xl border-2 border-[#2b2b2b] bg-[#efe9da] outline-none focus:border-[#d9b45f] font-['Space_Grotesk']">
                            <option value="EASY">EASY</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HARD">HARD</option>
                            <option value="LEGENDARY">LEGENDARY</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest mb-2">Reward XP</label>
                          <input type="number" required value={questForm.rewardXp} onChange={e => setQuestForm({...questForm, rewardXp: parseInt(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-[#2b2b2b] bg-[#efe9da] outline-none focus:border-[#d9b45f] font-['Space_Grotesk']" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest mb-2">Deadline</label>
                          <input type="date" required value={questForm.deadline} onChange={e => setQuestForm({...questForm, deadline: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#2b2b2b] bg-[#efe9da] outline-none focus:border-[#d9b45f] font-['Space_Grotesk']" />
                        </div>
                        <div>
                          <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest mb-2">Category</label>
                          <select required value={questForm.categoryId} onChange={e => setQuestForm({...questForm, categoryId: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#2b2b2b] bg-[#efe9da] outline-none focus:border-[#d9b45f] font-['Space_Grotesk']">
                            <option value="" disabled>Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="w-full py-4 mt-4 bg-[#2b2b2b] text-[#f7f0df] rounded-xl border-2 border-[#2b2b2b] font-['Space_Grotesk'] font-bold uppercase tracking-widest shadow-[4px_4px_0_#d9b45f] hover:-translate-y-1 transition-transform">
                        {editingQuest ? "Update Contract" : "Post Contract to Board"}
                      </button>
                    </form>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-['Space_Grotesk']">
                        <thead>
                          <tr className="border-b-[3px] border-[#2b2b2b]">
                            <th className="py-4 px-4 font-bold uppercase text-sm tracking-widest">Title</th>
                            <th className="py-4 px-4 font-bold uppercase text-sm tracking-widest">Status</th>
                            <th className="py-4 px-4 font-bold uppercase text-sm tracking-widest">Difficulty</th>
                            <th className="py-4 px-4 font-bold uppercase text-sm tracking-widest">XP</th>
                            <th className="py-4 px-4 font-bold uppercase text-sm tracking-widest text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quests.map(q => (
                            <tr key={q.id} className="border-b-2 border-[#2b2b2b]/10 hover:bg-[#d9b45f]/10 transition-colors">
                              <td className="py-4 px-4 font-bold max-w-[200px] truncate">{q.title}</td>
                              <td className="py-4 px-4 text-xs font-bold uppercase tracking-widest"><span className="bg-[#efe9da] border-2 border-[#2b2b2b] px-2 py-1 rounded-md">{q.status}</span></td>
                              <td className="py-4 px-4 text-sm opacity-80">{q.difficulty}</td>
                              <td className="py-4 px-4 font-bold text-[#d9b45f]">{q.rewardXp}</td>
                              <td className="py-4 px-4 text-right">
                                <button onClick={() => {
                                  setEditingQuest(q);
                                  setQuestForm({
                                    title: q.title,
                                    description: q.description,
                                    difficulty: q.difficulty,
                                    rewardXp: q.rewardXp,
                                    deadline: q.deadline ? q.deadline.split('T')[0] : '',
                                    categoryId: q.categoryId
                                  });
                                  setShowQuestForm(true);
                                }} className="p-2 text-[#d9b45f] hover:bg-[#d9b45f]/20 rounded-md transition-colors mr-1"><Edit className="h-5 w-5" /></button>
                                <button onClick={() => handleDeleteQuest(q.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-colors"><Trash2 className="h-5 w-5" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SUBMISSIONS TAB */}
              {activeTab === "submissions" && (
                <motion.div key="submissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="font-['Bebas_Neue'] text-4xl mb-8 border-b-2 border-[#2b2b2b]/10 pb-4">Pending Approvals</h2>
                  {submissions.length === 0 ? (
                    <div className="text-center py-16 opacity-50">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                      <p className="font-['Space_Grotesk'] text-lg font-bold">No pending submissions.</p>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {submissions.map(s => {
                        const questTitle = quests.find(q => q.id === s.questId)?.title || "Unknown Quest";
                        return (
                          <div key={s.id} className="bg-[#efe9da] p-6 rounded-2xl border-[3px] border-[#2b2b2b] flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex-1 w-full overflow-hidden">
                              <p className="font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Quest: {questTitle}</p>
                              <h4 className="font-['Bebas_Neue'] text-2xl mb-2 truncate">Submission #{s.id.slice(-6)}</h4>
                              <p className="font-['Space_Grotesk'] text-sm opacity-80 mb-2">User ID: {s.userId}</p>
                              <div className="bg-[#f7f0df] border-l-4 border-[#d9b45f] p-3 rounded text-sm italic font-['Space_Grotesk'] overflow-hidden">
                                {s.proofText ? `"${s.proofText}"` : "No text proof provided."}
                                {s.proofFileUrl && <div className="mt-2 text-blue-600 underline cursor-pointer">View Attached Proof File</div>}
                              </div>
                            </div>
                            <div className="flex gap-3 shrink-0">
                              <button onClick={() => handleReviewSubmission(s.id, false)} className="flex items-center gap-2 px-4 py-2 border-2 border-[#2b2b2b] rounded-lg text-red-600 hover:bg-red-50 font-bold font-['Space_Grotesk'] text-sm uppercase tracking-widest transition-colors">
                                <XCircle className="h-4 w-4" /> Reject
                              </button>
                              <button onClick={() => handleReviewSubmission(s.id, true)} className="flex items-center gap-2 px-4 py-2 border-2 border-[#2b2b2b] rounded-lg bg-[#2b2b2b] text-[#f7f0df] hover:bg-[#d9b45f] hover:text-[#2b2b2b] font-bold font-['Space_Grotesk'] text-sm uppercase tracking-widest transition-colors shadow-[3px_3px_0_#d9b45f] hover:shadow-none translate-y-[-2px] hover:translate-y-0">
                                <CheckCircle className="h-4 w-4" /> Approve
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* CATEGORIES TAB */}
              {activeTab === "categories" && (
                <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-8 border-b-2 border-[#2b2b2b]/10 pb-4">
                    <h2 className="font-['Bebas_Neue'] text-4xl">Categories</h2>
                    <button 
                      onClick={() => setShowCategoryForm(!showCategoryForm)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#d9b45f] border-2 border-[#2b2b2b] rounded-full font-['Space_Grotesk'] font-bold text-sm uppercase tracking-widest shadow-[3px_3px_0_#2b2b2b] hover:-translate-y-0.5 transition-transform"
                    >
                      {showCategoryForm ? <ArrowLeft className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {showCategoryForm ? "Back to List" : "New Category"}
                    </button>
                  </div>

                  {showCategoryForm ? (
                    <form onSubmit={handleCreateCategory} className="max-w-xl mx-auto space-y-6">
                      <div>
                        <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest mb-2">Category Name</label>
                        <input type="text" required value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#2b2b2b] bg-[#efe9da] outline-none focus:border-[#d9b45f] font-['Space_Grotesk']" />
                      </div>
                      <div>
                        <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest mb-2">Description</label>
                        <textarea required value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#2b2b2b] bg-[#efe9da] outline-none focus:border-[#d9b45f] min-h-[100px] font-['Space_Grotesk'] resize-none" />
                      </div>
                      <button type="submit" className="w-full py-4 mt-4 bg-[#2b2b2b] text-[#f7f0df] rounded-xl border-2 border-[#2b2b2b] font-['Space_Grotesk'] font-bold uppercase tracking-widest shadow-[4px_4px_0_#d9b45f] hover:-translate-y-1 transition-transform">
                        Save Category
                      </button>
                    </form>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categories.map(c => (
                        <div key={c.id} className="bg-[#efe9da] border-[3px] border-[#2b2b2b] p-6 rounded-2xl shadow-[4px_4px_0_rgba(43,43,43,0.15)] hover:shadow-[6px_6px_0_rgba(43,43,43,0.25)] transition-shadow">
                          <h4 className="font-['Bebas_Neue'] text-3xl mb-2">{c.name}</h4>
                          <p className="font-['Space_Grotesk'] text-sm opacity-80">{c.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
