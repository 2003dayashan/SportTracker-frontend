import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface Fixture {
  id: string;
  leagueId: string;
  homeClubId: string;
  awayClubId: string;
  homeClubName: string;
  awayClubName: string;
  homeScore?: number;
  awayScore?: number;
  status: "SCHEDULED" | "LIVE" | "FINISHED";
  kickoffAt: string;
  leagueName: string;
  matchday: number;
}

export interface Club {
  id: string;
  name: string;
  leagueId: string;
}

export interface League {
  id: string;
  name: string;
}

export interface FixturesProps {
  leagueId?: string;
  isAdmin: boolean;
  onBack: () => void;
  onFixtureClick: (fixtureId: string) => void;
}

type TabStatus = "ALL" | "SCHEDULED" | "LIVE" | "FINISHED";

export default function Fixtures({
  leagueId,
  isAdmin,
  onBack,
  onFixtureClick,
}: FixturesProps) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabStatus>("ALL");

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLeagueId, setCreateLeagueId] = useState(leagueId || "");
  const [createHomeClubId, setCreateHomeClubId] = useState("");
  const [createAwayClubId, setCreateAwayClubId] = useState("");
  const [createStatus, setCreateStatus] = useState<"SCHEDULED" | "LIVE" | "FINISHED">("SCHEDULED");
  const [createKickoffAt, setCreateKickoffAt] = useState("");
  const [createMatchday, setCreateMatchday] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  // Edit Modal State
  const [editFixture, setEditFixture] = useState<Fixture | null>(null);
  const [editLeagueId, setEditLeagueId] = useState("");
  const [editHomeClubId, setEditHomeClubId] = useState("");
  const [editAwayClubId, setEditAwayClubId] = useState("");
  const [editStatus, setEditStatus] = useState<"SCHEDULED" | "LIVE" | "FINISHED">("SCHEDULED");
  const [editKickoffAt, setEditKickoffAt] = useState("");
  const [editMatchday, setEditMatchday] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Delete Confirm State
  const [deleteFixture, setDeleteFixture] = useState<Fixture | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFixtures = async () => {
    try {
      const [fixturesRes, clubsRes, leaguesRes] = await Promise.all([
        fetch("/api/football/fixtures"),
        fetch("/api/football/clubs"),
        fetch("/api/football/leagues"),
      ]);

      if (!fixturesRes.ok || !clubsRes.ok || !leaguesRes.ok) {
        throw new Error("Failed to load data.");
      }

      const fixturesData = await fixturesRes.json();
      const clubsData = await clubsRes.json();
      const leaguesData = await leaguesRes.json();

      setClubs(clubsData);
      setLeagues(leaguesData);

      const mappedFixtures = fixturesData.map((f: any) => {
        const homeClub = clubsData.find((c: Club) => c.id === f.homeClubId);
        const awayClub = clubsData.find((c: Club) => c.id === f.awayClubId);
        const league = leaguesData.find((l: League) => l.id === f.leagueId);

        return {
          ...f,
          homeClubName: homeClub ? homeClub.name : "Unknown",
          awayClubName: awayClub ? awayClub.name : "Unknown",
          leagueName: league ? league.name : "Unknown",
        };
      });

      // Filter client side
      const filteredData = leagueId
        ? mappedFixtures.filter((f: Fixture) => f.leagueId === leagueId)
        : mappedFixtures;

      setFixtures(filteredData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();

    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchFixtures();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [leagueId]);

  const handleCreateFixture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createLeagueId) { showToast("Please select a league.", "error"); return; }
    if (!createHomeClubId) { showToast("Please select a home club.", "error"); return; }
    if (!createAwayClubId) { showToast("Please select an away club.", "error"); return; }
    if (createHomeClubId === createAwayClubId) { showToast("Home and Away clubs must be different.", "error"); return; }

    setIsCreating(true);
    try {
      const res = await fetch("/api/football/fixtures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          leagueId: createLeagueId,
          homeClubId: createHomeClubId,
          awayClubId: createAwayClubId,
          status: createStatus,
          kickoffAt: createKickoffAt ? `${createKickoffAt}:00` : null,
          matchday: createMatchday,
        }),
      });

      if (!res.ok) throw new Error("Failed to create fixture");

      setCreateHomeClubId("");
      setCreateAwayClubId("");
      setCreateStatus("SCHEDULED");
      setCreateKickoffAt("");
      setCreateMatchday(1);
      setIsCreateOpen(false);
      fetchFixtures();
      showToast("Fixture created successfully!");
    } catch {
      showToast("Error creating fixture.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditFixture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFixture) return;
    if (!editLeagueId) { showToast("Please select a league.", "error"); return; }
    if (!editHomeClubId) { showToast("Please select a home club.", "error"); return; }
    if (!editAwayClubId) { showToast("Please select an away club.", "error"); return; }
    if (editHomeClubId === editAwayClubId) { showToast("Home and Away clubs must be different.", "error"); return; }

    setIsEditing(true);
    try {
      const res = await fetch(`/api/football/fixtures/${editFixture.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          leagueId: editLeagueId,
          homeClubId: editHomeClubId,
          awayClubId: editAwayClubId,
          status: editStatus,
          kickoffAt: editKickoffAt ? `${editKickoffAt}:00` : null,
          matchday: editMatchday,
        }),
      });

      if (!res.ok) throw new Error("Failed to update fixture");

      setEditFixture(null);
      fetchFixtures();
      showToast("Fixture updated successfully!");
    } catch {
      showToast("Error updating fixture.", "error");
    } finally {
      setIsEditing(false);
    }
  };

  const openEdit = (fixture: Fixture) => {
    setEditFixture(fixture);
    setEditLeagueId(fixture.leagueId);
    setEditHomeClubId(fixture.homeClubId);
    setEditAwayClubId(fixture.awayClubId);
    setEditStatus(fixture.status);
    setEditKickoffAt(fixture.kickoffAt ? fixture.kickoffAt.slice(0, 16) : "");
    setEditMatchday(fixture.matchday);
  };

  const handleDeleteFixture = async () => {
    if (!deleteFixture) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/football/fixtures/${deleteFixture.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete fixture");
      setDeleteFixture(null);
      fetchFixtures();
      showToast("Fixture deleted successfully!");
    } catch {
      showToast("Error deleting fixture.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFixtures = fixtures.filter((f) =>
    activeTab === "ALL" ? true : f.status === activeTab
  );

  const liveFixtures = filteredFixtures.filter((f) => f.status === "LIVE");
  const otherFixtures = filteredFixtures.filter((f) => f.status !== "LIVE");

  const tabs: TabStatus[] = ["ALL", "SCHEDULED", "LIVE", "FINISHED"];

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] font-['Space_Grotesk'] selection:bg-[#d9b45f] selection:text-[#2b2b2b] pb-24">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{
          backgroundImage: "radial-gradient(#2b2b2b 2px, transparent 2px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#2b2b2b] bg-transparent hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors shrink-0"
              aria-label="Go back"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex flex-col">
              <h1 className="font-['Bebas_Neue'] text-5xl tracking-wide leading-none">
                FIXTURES
              </h1>
              <span className="font-['Caveat'] text-lg opacity-80 -rotate-1 mt-1">
                auto-refreshes every 30s
              </span>
            </div>
          </div>

          <div className="w-12 md:w-auto">
            {isAdmin && (
              <button
                onClick={() => {
                  setCreateLeagueId(leagueId || "");
                  setIsCreateOpen(true);
                }}
                className="hidden md:block rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] px-6 py-2.5 text-sm font-bold tracking-widest uppercase hover:bg-transparent hover:text-[#2b2b2b] transition-colors"
              >
                + Create Fixture
              </button>
            )}
          </div>
        </header>

        {isAdmin && (
          <div className="md:hidden mb-6">
            <button
              onClick={() => {
                setCreateLeagueId(leagueId || "");
                setIsCreateOpen(true);
              }}
              className="w-full rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-transparent hover:text-[#2b2b2b] transition-colors"
            >
              + Create Fixture
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full border-2 border-[#2b2b2b] text-sm font-bold tracking-widest uppercase transition-colors ${
                activeTab === tab
                  ? "bg-[#2b2b2b] text-[#f3eee1]"
                  : "bg-transparent text-[#2b2b2b] hover:bg-[#f7f0df]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading & Error States */}
        {loading && fixtures.length === 0 ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full h-24 bg-[#e4d8bd] animate-pulse rounded-[1.5rem] border-2 border-[#2b2b2b]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <button
              onClick={fetchFixtures}
              className="px-6 py-2 rounded-full border-2 border-[#2b2b2b] hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors font-bold uppercase tracking-widest text-sm"
            >
              Retry
            </button>
          </div>
        ) : filteredFixtures.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 flex flex-col items-center"
          >
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="#2b2b2b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mb-6 opacity-60">
              <rect x="10" y="20" width="80" height="60" rx="4" />
              <line x1="10" y1="50" x2="90" y2="50" />
              <circle cx="50" cy="50" r="10" />
            </svg>
            <p className="font-['Caveat'] text-3xl text-[#2b2b2b] -rotate-2">
              No fixtures found...
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Pinned LIVE Section */}
            {liveFixtures.length > 0 && (
              <div>
                <h2 className="font-['Caveat'] text-2xl mb-4 ml-2">🟢 LIVE NOW</h2>
                <div className="flex flex-col gap-4">
                  {liveFixtures.map((fixture, index) => (
                    <FixtureRow
                      key={fixture.id}
                      fixture={fixture}
                      index={index}
                      isAdmin={isAdmin}
                      onClick={() => onFixtureClick(fixture.id)}
                      onEdit={openEdit}
                      onDelete={(f) => setDeleteFixture(f)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Fixtures */}
            {otherFixtures.length > 0 && (
              <div>
                {liveFixtures.length > 0 && <hr className="border-t-2 border-[#2b2b2b] border-dashed opacity-20 mb-8" />}
                <div className="flex flex-col gap-4">
                  {otherFixtures.map((fixture, index) => (
                    <FixtureRow
                      key={fixture.id}
                      fixture={fixture}
                      index={index + liveFixtures.length}
                      isAdmin={isAdmin}
                      onClick={() => onFixtureClick(fixture.id)}
                      onEdit={openEdit}
                      onDelete={(f) => setDeleteFixture(f)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl border-2 border-[#2b2b2b] font-bold text-sm tracking-wide uppercase shadow-[4px_4px_0_rgba(43,43,43,1)] ${
              toast.type === "success" ? "bg-[#e2f0d9] text-[#2b2b2b]" : "bg-[#f8cbad] text-[#2b2b2b]"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b2b2b]/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateOpen(false)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2.5rem] shadow-[8px_8px_0_rgba(43,43,43,1)] p-8 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide mb-6 text-center">Create Fixture</h2>
              <form onSubmit={handleCreateFixture} className="flex flex-col gap-4">
                
                {/* League Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">League</label>
                  <select
                    required
                    value={createLeagueId}
                    onChange={(e) => {
                      setCreateLeagueId(e.target.value);
                      setCreateHomeClubId("");
                      setCreateAwayClubId("");
                    }}
                    className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                  >
                    <option value="" disabled>Select League...</option>
                    {leagues.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                {/* Clubs Selection (Filtered by League) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Home Club</label>
                    <select
                      required
                      disabled={!createLeagueId}
                      value={createHomeClubId}
                      onChange={(e) => setCreateHomeClubId(e.target.value)}
                      className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold disabled:opacity-50"
                    >
                      <option value="" disabled>Select Home...</option>
                      {clubs
                        .filter((c) => c.leagueId === createLeagueId)
                        .map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Away Club</label>
                    <select
                      required
                      disabled={!createLeagueId}
                      value={createAwayClubId}
                      onChange={(e) => setCreateAwayClubId(e.target.value)}
                      className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold disabled:opacity-50"
                    >
                      <option value="" disabled>Select Away...</option>
                      {clubs
                        .filter((c) => c.leagueId === createLeagueId && c.id !== createHomeClubId)
                        .map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Status & Matchday */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Status</label>
                    <select
                      required
                      value={createStatus}
                      onChange={(e) => setCreateStatus(e.target.value as any)}
                      className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="LIVE">Live</option>
                      <option value="FINISHED">Finished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Matchday</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={createMatchday}
                      onChange={(e) => setCreateMatchday(Number(e.target.value))}
                      className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                    />
                  </div>
                </div>

                {/* Kickoff At */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Kickoff Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={createKickoffAt}
                    onChange={(e) => setCreateKickoffAt(e.target.value)}
                    className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 rounded-full border-2 border-[#2b2b2b] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] py-3 text-sm font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-transparent hover:text-[#2b2b2b] transition-colors"
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editFixture && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b2b2b]/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditFixture(null)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2.5rem] shadow-[8px_8px_0_rgba(43,43,43,1)] p-8 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide mb-6 text-center">Edit Fixture</h2>
              <form onSubmit={handleEditFixture} className="flex flex-col gap-4">
                
                {/* League Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">League</label>
                  <select
                    required
                    value={editLeagueId}
                    onChange={(e) => {
                      setEditLeagueId(e.target.value);
                      setEditHomeClubId("");
                      setEditAwayClubId("");
                    }}
                    className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                  >
                    <option value="" disabled>Select League...</option>
                    {leagues.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                {/* Clubs Selection (Filtered by League) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Home Club</label>
                    <select
                      required
                      disabled={!editLeagueId}
                      value={editHomeClubId}
                      onChange={(e) => setEditHomeClubId(e.target.value)}
                      className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold disabled:opacity-50"
                    >
                      <option value="" disabled>Select Home...</option>
                      {clubs
                        .filter((c) => c.leagueId === editLeagueId)
                        .map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Away Club</label>
                    <select
                      required
                      disabled={!editLeagueId}
                      value={editAwayClubId}
                      onChange={(e) => setEditAwayClubId(e.target.value)}
                      className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold disabled:opacity-50"
                    >
                      <option value="" disabled>Select Away...</option>
                      {clubs
                        .filter((c) => c.leagueId === editLeagueId && c.id !== editHomeClubId)
                        .map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Status & Matchday */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Status</label>
                    <select
                      required
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="LIVE">Live</option>
                      <option value="FINISHED">Finished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Matchday</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editMatchday}
                      onChange={(e) => setEditMatchday(Number(e.target.value))}
                      className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                    />
                  </div>
                </div>

                {/* Kickoff At */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Kickoff Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={editKickoffAt}
                    onChange={(e) => setEditKickoffAt(e.target.value)}
                    className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditFixture(null)}
                    className="flex-1 rounded-full border-2 border-[#2b2b2b] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEditing}
                    className="flex-1 rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] py-3 text-sm font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-transparent hover:text-[#2b2b2b] transition-colors"
                  >
                    {isEditing ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteFixture && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b2b2b]/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteFixture(null)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[8px_8px_0_rgba(43,43,43,1)] p-8 text-center"
            >
              <p className="font-['Bebas_Neue'] text-3xl mb-2">Delete Fixture?</p>
              <p className="font-['Caveat'] text-xl mb-6 opacity-70">
                "{deleteFixture.homeClubName} vs {deleteFixture.awayClubName}" will be permanently removed.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteFixture(null)}
                  className="flex-1 rounded-full border-2 border-[#2b2b2b] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteFixture}
                  disabled={isDeleting}
                  className="flex-1 rounded-full border-2 border-red-400 bg-red-400 text-white py-3 text-sm font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-transparent hover:text-red-500 transition-colors"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-component for the individual fixture row
function FixtureRow({
  fixture,
  index,
  isAdmin,
  onClick,
  onEdit,
  onDelete,
}: {
  fixture: Fixture;
  index: number;
  isAdmin: boolean;
  onClick: () => void;
  onEdit: (fixture: Fixture) => void;
  onDelete: (fixture: Fixture) => void;
}) {
  const isLive = fixture.status === "LIVE";

  const getStatusBadge = () => {
    switch (fixture.status) {
      case "LIVE":
        return (
          <div className="flex items-center gap-2 rounded-full border-2 border-[#2f7a4d] bg-[#2f7a4d]/10 text-[#2f7a4d] px-3 py-1 text-xs font-bold uppercase tracking-widest shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2f7a4d] animate-pulse" />
            LIVE
          </div>
        );
      case "FINISHED":
        return (
          <div className="rounded-full bg-[#2b2b2b]/15 text-[#2b2b2b] px-3 py-1.5 text-xs font-bold uppercase tracking-widest shrink-0">
            FT
          </div>
        );
      case "SCHEDULED":
      default:
        return (
          <div className="rounded-full border-2 border-[#2b2b2b] bg-transparent text-[#2b2b2b] px-3 py-1.5 text-xs font-bold uppercase tracking-widest shrink-0">
            {new Date(fixture.kickoffAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5), ease: "easeOut" }}
      onClick={onClick}
      className={`group flex flex-col md:flex-row items-center justify-between gap-4 w-full border-2 border-[#2b2b2b] rounded-[1.5rem] p-4 sm:p-5 transition-all duration-200 cursor-pointer hover:bg-[#f7f0df] relative overflow-hidden bg-transparent ${
        isLive ? "border-l-4 border-l-[#2f7a4d]" : ""
      }`}
    >
      {/* Left: Matchday Badge */}
      <div className="hidden md:flex shrink-0 w-16 items-center justify-center">
        <div className="rounded-full border-2 border-[#2b2b2b] px-2 py-1 text-xs font-bold uppercase">
          MD {fixture.matchday}
        </div>
      </div>

      {/* Center: Teams & Score */}
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
        <div className="flex items-center justify-center gap-4 w-full max-w-lg mx-auto">
          <div className="flex-1 text-right font-bold md:text-lg uppercase tracking-wide truncate">
            {fixture.homeClubName}
          </div>
          
          <div className="shrink-0 flex items-center justify-center bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-xl px-4 py-2 min-w-[5rem] group-hover:bg-[#efe9da] transition-colors">
            <span className="font-['Bebas_Neue'] text-3xl leading-none mt-1">
              {fixture.homeScore ?? "?"} - {fixture.awayScore ?? "?"}
            </span>
          </div>
          
          <div className="flex-1 text-left font-bold md:text-lg uppercase tracking-wide truncate">
            {fixture.awayClubName}
          </div>
        </div>
        
        {/* League Info Below */}
        <div className="mt-2 font-['Caveat'] text-sm opacity-60 flex items-center gap-2">
          <span>{fixture.leagueName}</span>
          <span className="md:hidden opacity-50">&bull; MD {fixture.matchday}</span>
        </div>
      </div>

      {/* Right: Status / Time & Admin Actions */}
      <div className="shrink-0 flex items-center gap-3 justify-end md:w-[280px] mt-2 md:mt-0">
        {getStatusBadge()}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(fixture);
              }}
              className="rounded-full border-2 border-[#d9b45f] bg-[#d9b45f]/10 text-[#2b2b2b] hover:bg-[#d9b45f] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 shrink-0"
            >
              ✏️ Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(fixture);
              }}
              className="rounded-full border-2 border-red-400 bg-red-400/10 text-red-500 hover:bg-red-400 hover:text-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 shrink-0"
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}