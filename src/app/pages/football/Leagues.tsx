import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface League {
  id: string;
  name: string;
  country: string;
  season: string;
  logoUrl?: string;
}

export interface LeaguesProps {
  isAdmin: boolean;
  onBack: () => void;
  onViewStandings: (leagueId: string, leagueName: string) => void;
  onViewFixtures: (leagueId: string) => void;
}

export default function Leagues({
  isAdmin,
  onBack,
  onViewStandings,
  onViewFixtures,
}: LeaguesProps) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newSeason, setNewSeason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [editLeague, setEditLeague] = useState<League | null>(null);
  const [editName, setEditName] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editSeason, setEditSeason] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // Delete Confirm State
  const [deleteLeague, setDeleteLeague] = useState<League | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLeagues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/football/leagues");
      if (!response.ok) throw new Error("Failed to load leagues.");
      setLeagues(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeagues(); }, []);

  // CREATE
  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/football/leagues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newName, country: newCountry, season: newSeason }),
      });
      if (!res.ok) throw new Error("Failed to create league");
      setNewName(""); setNewCountry(""); setNewSeason("");
      setIsModalOpen(false);
      fetchLeagues();
      showToast("League created!");
    } catch {
      showToast("Error creating league.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // EDIT — open modal
  const openEdit = (league: League) => {
    setEditLeague(league);
    setEditName(league.name);
    setEditCountry(league.country);
    setEditSeason(league.season);
  };

  // UPDATE
  const handleEditLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLeague) return;
    setIsEditSubmitting(true);
    try {
      const res = await fetch(`/api/football/leagues/${editLeague.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: editName, country: editCountry, season: editSeason }),
      });
      if (!res.ok) throw new Error("Failed to update league");
      setEditLeague(null);
      fetchLeagues();
      showToast("League updated!");
    } catch {
      showToast("Error updating league.", "error");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // DELETE
  const handleDeleteLeague = async () => {
    if (!deleteLeague) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/football/leagues/${deleteLeague.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete league");
      setDeleteLeague(null);
      fetchLeagues();
      showToast("League deleted!");
    } catch {
      showToast("Error deleting league.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredLeagues = leagues.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] font-['Space_Grotesk'] pb-24">
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{ backgroundImage: "radial-gradient(#2b2b2b 2px, transparent 2px)", backgroundSize: "32px 32px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <button onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#2b2b2b] bg-transparent hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="font-['Bebas_Neue'] text-5xl tracking-wide absolute left-1/2 -translate-x-1/2">LEAGUES</h1>

          <div className="w-12 md:w-auto">
            {isAdmin && (
              <button onClick={() => setIsModalOpen(true)}
                className="hidden md:block rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] px-6 py-2.5 text-sm font-bold tracking-widest uppercase hover:bg-transparent hover:text-[#2b2b2b] transition-colors">
                + Create League
              </button>
            )}
          </div>
        </header>

        {isAdmin && (
          <div className="md:hidden mb-6">
            <button onClick={() => setIsModalOpen(true)}
              className="w-full rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-transparent hover:text-[#2b2b2b] transition-colors">
              + Create League
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-10 max-w-xl mx-auto relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search leagues..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border-2 border-[#2b2b2b] bg-[#f7f0df] py-3 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold placeholder:font-normal placeholder:text-[#2b2b2b]/50" />
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#e4d8bd] animate-pulse border-2 border-[#2b2b2b] rounded-[2rem] h-48" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <button onClick={fetchLeagues} className="rounded-full border-2 border-[#2b2b2b] px-6 py-2 font-bold hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">Try Again</button>
          </div>
        ) : filteredLeagues.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-['Caveat'] text-3xl -rotate-2">No leagues found yet...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeagues.map((league) => (
              <motion.div key={league.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="group flex flex-col justify-between bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[6px_6px_0_rgba(43,43,43,0.2)] p-6 transition-all duration-300 hover:-rotate-1 hover:shadow-[8px_8px_0_rgba(43,43,43,0.2)]">
                <div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d9b45f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                  <h3 className="font-['Bebas_Neue'] text-3xl tracking-wide leading-none mb-2">{league.name}</h3>
                  <p className="text-sm opacity-70 font-bold uppercase tracking-wider">{league.country} · {league.season}</p>
                </div>

                {/* Nav Buttons */}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => onViewStandings(league.id, league.name)}
                    className="flex-1 rounded-full border-2 border-[#2b2b2b] py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">
                    Standings
                  </button>
                  <button onClick={() => onViewFixtures(league.id)}
                    className="flex-1 rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] py-2 text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-[#2b2b2b] transition-colors">
                    Fixtures
                  </button>
                </div>

                {/* Admin Edit/Delete */}
                {isAdmin && (
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => openEdit(league)}
                      className="flex-1 rounded-full border-2 border-[#d9b45f] text-[#2b2b2b] py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#d9b45f] transition-colors">
                      ✏️ Edit
                    </button>
                    <button onClick={() => setDeleteLeague(league)}
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
            className="w-full max-w-md bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[8px_8px_0_rgba(43,43,43,0.2)] p-8">
            <h2 className="font-['Bebas_Neue'] text-4xl mb-6 text-center">Create League</h2>
            <form onSubmit={handleCreateLeague} className="flex flex-col gap-4">
              {[
                { label: "League Name", val: newName, set: setNewName, ph: "e.g. Premier League" },
                { label: "Country", val: newCountry, set: setNewCountry, ph: "e.g. England" },
                { label: "Season", val: newSeason, set: setNewSeason, ph: "e.g. 2026/27" },
              ].map(({ label, val, set, ph }) => (
                <div key={label}>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">{label}</label>
                  <input type="text" required value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                    className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold" />
                </div>
              ))}
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full border-2 border-[#2b2b2b] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] py-3 text-sm font-bold uppercase tracking-widest disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editLeague && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[8px_8px_0_rgba(43,43,43,0.2)] p-8">
            <h2 className="font-['Bebas_Neue'] text-4xl mb-6 text-center">Edit League</h2>
            <form onSubmit={handleEditLeague} className="flex flex-col gap-4">
              {[
                { label: "League Name", val: editName, set: setEditName },
                { label: "Country", val: editCountry, set: setEditCountry },
                { label: "Season", val: editSeason, set: setEditSeason },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">{label}</label>
                  <input type="text" required value={val} onChange={(e) => set(e.target.value)}
                    className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold" />
                </div>
              ))}
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setEditLeague(null)}
                  className="flex-1 rounded-full border-2 border-[#2b2b2b] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">Cancel</button>
                <button type="submit" disabled={isEditSubmitting}
                  className="flex-1 rounded-full border-2 border-[#d9b45f] bg-[#d9b45f] text-[#2b2b2b] py-3 text-sm font-bold uppercase tracking-widest disabled:opacity-50">
                  {isEditSubmitting ? "Saving..." : "Update"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteLeague && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[8px_8px_0_rgba(43,43,43,0.2)] p-8 text-center">
            <p className="font-['Bebas_Neue'] text-3xl mb-2">Delete League?</p>
            <p className="font-['Caveat'] text-xl mb-6 opacity-70">"{deleteLeague.name}" will be permanently removed.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteLeague(null)}
                className="flex-1 rounded-full border-2 border-[#2b2b2b] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">Cancel</button>
              <button onClick={handleDeleteLeague} disabled={isDeleting}
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
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full border-2 border-[#2b2b2b] font-bold uppercase tracking-widest text-sm ${
              toast.type === "success" ? "bg-[#2f7a4d] text-white" : "bg-red-500 text-white"}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}