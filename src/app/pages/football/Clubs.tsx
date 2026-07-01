import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface Club {
  id: string;
  name: string;
  stadiumName: string;
  foundedYear: number;
  badgeUrl?: string;
  leagueId: string;
}

export interface League {
  id: string;
  name: string;
}

export interface ClubsProps {
  isAdmin: boolean;
  onBack: () => void;
}

export default function Clubs({ isAdmin, onBack }: ClubsProps) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string>("all");

  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClubName, setNewClubName] = useState("");
  const [newStadiumName, setNewStadiumName] = useState("");
  const [newFoundedYear, setNewFoundedYear] = useState<number | "">("");
  const [newLeagueId, setNewLeagueId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal
  const [editClub, setEditClub] = useState<Club | null>(null);
  const [editName, setEditName] = useState("");
  const [editStadium, setEditStadium] = useState("");
  const [editYear, setEditYear] = useState<number | "">("");
  const [editLeagueId, setEditLeagueId] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // Delete
  const [deleteClub, setDeleteClub] = useState<Club | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clubsRes, leaguesRes] = await Promise.all([
        fetch("/api/football/clubs"),
        fetch("/api/football/leagues"),
      ]);
      if (!clubsRes.ok || !leaguesRes.ok) throw new Error("Failed to load data.");
      setClubs(await clubsRes.json());
      setLeagues(await leaguesRes.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // CREATE
  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeagueId) { showToast("Please select a league.", "error"); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/football/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newClubName, stadiumName: newStadiumName, foundedYear: Number(newFoundedYear), leagueId: newLeagueId }),
      });
      if (!res.ok) throw new Error("Failed to create club");
      setNewClubName(""); setNewStadiumName(""); setNewFoundedYear(""); setNewLeagueId("");
      setIsModalOpen(false);
      fetchData();
      showToast("Club created!");
    } catch { showToast("Error creating club.", "error"); }
    finally { setIsSubmitting(false); }
  };

  // EDIT — open modal
  const openEdit = (club: Club) => {
    setEditClub(club);
    setEditName(club.name);
    setEditStadium(club.stadiumName);
    setEditYear(club.foundedYear);
    setEditLeagueId(club.leagueId);
  };

  // UPDATE
  const handleEditClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClub) return;
    setIsEditSubmitting(true);
    try {
      const res = await fetch(`/api/football/clubs/${editClub.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: editName, stadiumName: editStadium, foundedYear: Number(editYear), leagueId: editLeagueId }),
      });
      if (!res.ok) throw new Error("Failed to update club");
      setEditClub(null);
      fetchData();
      showToast("Club updated!");
    } catch { showToast("Error updating club.", "error"); }
    finally { setIsEditSubmitting(false); }
  };

  // DELETE
  const handleDeleteClub = async () => {
    if (!deleteClub) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/football/clubs/${deleteClub.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete club");
      setDeleteClub(null);
      fetchData();
      showToast("Club deleted!");
    } catch { showToast("Error deleting club.", "error"); }
    finally { setIsDeleting(false); }
  };

  const filteredClubs = selectedLeague === "all" ? clubs : clubs.filter((c) => c.leagueId === selectedLeague);

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] font-['Space_Grotesk'] pb-24">
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{ backgroundImage: "radial-gradient(#2b2b2b 2px, transparent 2px)", backgroundSize: "32px 32px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 relative">
          <button onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#2b2b2b] bg-transparent hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 font-['Bebas_Neue'] text-5xl tracking-wide w-full text-center pointer-events-none">CLUBS</h1>
          <div className="w-12 md:w-auto z-10 flex justify-end">
            {isAdmin && (
              <button onClick={() => setIsModalOpen(true)}
                className="hidden md:block rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] px-6 py-2.5 text-sm font-bold tracking-widest uppercase hover:bg-transparent hover:text-[#2b2b2b] transition-colors">
                + Add Club
              </button>
            )}
          </div>
        </header>

        {isAdmin && (
          <div className="md:hidden mb-6">
            <button onClick={() => setIsModalOpen(true)}
              className="w-full rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-transparent hover:text-[#2b2b2b] transition-colors">
              + Add Club
            </button>
          </div>
        )}

        {/* Filter */}
        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-xs">
            <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full appearance-none rounded-full border-2 border-[#2b2b2b] bg-[#f7f0df] px-6 py-3 pr-10 font-bold focus:outline-none cursor-pointer">
              <option value="all">All Leagues</option>
              {leagues.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => <div key={i} className="bg-[#e4d8bd] animate-pulse border-2 border-[#2b2b2b] rounded-[2rem] h-64" />)}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <button onClick={fetchData} className="rounded-full border-2 border-[#2b2b2b] px-6 py-2 font-bold hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">Try Again</button>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-['Caveat'] text-3xl -rotate-2">No clubs found here yet...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club, index) => (
              <motion.div key={club.id}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex flex-col items-center text-center bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[6px_6px_0_rgba(43,43,43,0.2)] p-8 transition-transform duration-300 hover:-translate-y-1">

                {/* Badge */}
                <div className="w-[80px] h-[80px] rounded-full border-2 border-[#2b2b2b] bg-[#efe9da] flex items-center justify-center mb-6 overflow-hidden">
                  {club.badgeUrl ? (
                    <img src={club.badgeUrl} alt={`${club.name} badge`} className="w-full h-full object-cover" />
                  ) : (
                    <svg width="50" height="50" viewBox="0 0 60 60" fill="none" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 18H40V30C40 40 30 46 30 46C30 46 20 40 20 30V18Z" />
                    </svg>
                  )}
                </div>

                <h3 className="font-['Bebas_Neue'] text-3xl tracking-wide leading-none mb-3">{club.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-4 opacity-80">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16l-2 2" />
                  </svg>
                  <span className="text-sm font-bold tracking-wide">{club.stadiumName}</span>
                </div>
                <p className="font-['Caveat'] text-2xl italic text-[#d9b45f]">Est. {club.foundedYear}</p>

                {/* Admin Edit/Delete */}
                {isAdmin && (
                  <div className="flex gap-3 mt-5 w-full">
                    <button onClick={() => openEdit(club)}
                      className="flex-1 rounded-full border-2 border-[#d9b45f] py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#d9b45f] transition-colors">
                      ✏️ Edit
                    </button>
                    <button onClick={() => setDeleteClub(club)}
                      className="flex-1 rounded-full border-2 border-red-400 text-red-500 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-400 hover:text-white transition-colors">
                      🗑 Delete
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── CREATE MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[8px_8px_0_rgba(43,43,43,0.2)] p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-['Bebas_Neue'] text-4xl mb-6 text-center">Add New Club</h2>
            <form onSubmit={handleCreateClub} className="flex flex-col gap-4">
              {[
                { label: "Club Name", val: newClubName, set: setNewClubName, ph: "e.g. Dream FC", type: "text" },
                { label: "Stadium Name", val: newStadiumName, set: setNewStadiumName, ph: "e.g. Doodle Park", type: "text" },
              ].map(({ label, val, set, ph, type }) => (
                <div key={label}>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">{label}</label>
                  <input type={type} required value={val as string} onChange={(e) => set(e.target.value)} placeholder={ph}
                    className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Founded Year</label>
                <input type="number" required min="1800" max="2030" value={newFoundedYear}
                  onChange={(e) => setNewFoundedYear(e.target.value ? Number(e.target.value) : "")} placeholder="e.g. 1905"
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">League</label>
                <select required value={newLeagueId} onChange={(e) => setNewLeagueId(e.target.value)}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold appearance-none">
                  <option value="" disabled>Select League...</option>
                  {leagues.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full border-2 border-[#2b2b2b] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting || !newLeagueId}
                  className="flex-1 rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] py-3 text-sm font-bold uppercase tracking-widest disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Club"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[8px_8px_0_rgba(43,43,43,0.2)] p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-['Bebas_Neue'] text-4xl mb-6 text-center">Edit Club</h2>
            <form onSubmit={handleEditClub} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Club Name</label>
                <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Stadium Name</label>
                <input type="text" required value={editStadium} onChange={(e) => setEditStadium(e.target.value)}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Founded Year</label>
                <input type="number" required min="1800" max="2030" value={editYear}
                  onChange={(e) => setEditYear(e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">League</label>
                <select required value={editLeagueId} onChange={(e) => setEditLeagueId(e.target.value)}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold appearance-none">
                  {leagues.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setEditClub(null)}
                  className="flex-1 rounded-full border-2 border-[#2b2b2b] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">Cancel</button>
                <button type="submit" disabled={isEditSubmitting}
                  className="flex-1 rounded-full border-2 border-[#d9b45f] bg-[#d9b45f] text-[#2b2b2b] py-3 text-sm font-bold uppercase tracking-widest disabled:opacity-50">
                  {isEditSubmitting ? "Saving..." : "Update Club"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[8px_8px_0_rgba(43,43,43,0.2)] p-8 text-center">
            <p className="font-['Bebas_Neue'] text-3xl mb-2">Delete Club?</p>
            <p className="font-['Caveat'] text-xl mb-6 opacity-70">"{deleteClub.name}" will be permanently removed.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteClub(null)}
                className="flex-1 rounded-full border-2 border-[#2b2b2b] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">Cancel</button>
              <button onClick={handleDeleteClub} disabled={isDeleting}
                className="flex-1 rounded-full border-2 border-red-400 bg-red-400 text-white py-3 text-sm font-bold uppercase tracking-widest disabled:opacity-50">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full border-2 border-[#2b2b2b] font-bold uppercase tracking-widest text-sm shadow-[0_4px_0_#2b2b2b] ${
              toast.type === "success" ? "bg-[#2f7a4d] text-white" : "bg-red-500 text-white"}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}