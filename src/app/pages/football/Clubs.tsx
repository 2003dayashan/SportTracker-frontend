import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClubName, setNewClubName] = useState("");
  const [newStadiumName, setNewStadiumName] = useState("");
  const [newFoundedYear, setNewFoundedYear] = useState<number | "">("");
  const [newLeagueId, setNewLeagueId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clubsRes, leaguesRes] = await Promise.all([
        fetch("/api/football/clubs"),
        fetch("/api/football/leagues"),
      ]);

      if (!clubsRes.ok || !leaguesRes.ok) {
        throw new Error("Failed to load data.");
      }

      const clubsData = await clubsRes.json();
      const leaguesData = await leaguesRes.json();

      setClubs(clubsData);
      setLeagues(leaguesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeagueId) {
      alert("Please select a league.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/football/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClubName,
          stadiumName: newStadiumName,
          foundedYear: Number(newFoundedYear),
          leagueId: newLeagueId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create club");

      // Reset form and refresh list
      setNewClubName("");
      setNewStadiumName("");
      setNewFoundedYear("");
      setNewLeagueId("");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Error creating club. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredClubs =
    selectedLeague === "all"
      ? clubs
      : clubs.filter((club) => club.leagueId === selectedLeague);

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] font-['Space_Grotesk'] selection:bg-[#d9b45f] selection:text-[#2b2b2b] pb-24">
      {/* Background Dot Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{
          backgroundImage: "radial-gradient(#2b2b2b 2px, transparent 2px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 relative">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#2b2b2b] bg-transparent hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors z-10"
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 font-['Bebas_Neue'] text-5xl tracking-wide w-full text-center pointer-events-none">
            CLUBS
          </h1>

          <div className="w-12 md:w-auto z-10 flex justify-end">
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden md:block rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] px-6 py-2.5 text-sm font-bold tracking-widest uppercase hover:bg-transparent hover:text-[#2b2b2b] transition-colors whitespace-nowrap"
              >
                + Add Club
              </button>
            )}
          </div>
        </header>

        {/* Mobile Add Button */}
        {isAdmin && (
          <div className="md:hidden mb-6 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-transparent hover:text-[#2b2b2b] transition-colors"
            >
              + Add Club
            </button>
          </div>
        )}

        {/* Filter Row */}
        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-xs">
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full appearance-none rounded-full border-2 border-[#2b2b2b] bg-[#f7f0df] px-6 py-3 pr-10 font-bold focus:outline-none focus:ring-2 focus:ring-[#d9b45f] cursor-pointer"
            >
              <option value="all">All Leagues</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2b2b2b]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#e4d8bd] animate-pulse border-2 border-[#2b2b2b] rounded-[2rem] shadow-[6px_6px_0_rgba(43,43,43,0.2)] h-64"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="font-['Space_Grotesk'] text-red-600 font-bold mb-4">{error}</p>
            <button onClick={fetchData} className="rounded-full border-2 border-[#2b2b2b] bg-transparent px-6 py-2 font-bold hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">
              Try Again
            </button>
          </div>
        ) : filteredClubs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 flex flex-col items-center"
          >
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="#2b2b2b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mb-6 opacity-60">
              <path d="M20 80 L50 20 L80 80 Z" strokeDasharray="6 6" />
              <circle cx="50" cy="50" r="15" fill="#efe9da" />
            </svg>
            <p className="font-['Caveat'] text-3xl text-[#2b2b2b] -rotate-2">
              No clubs found here yet...
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                className="flex flex-col items-center text-center bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[6px_6px_0_rgba(43,43,43,0.2)] p-8 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(43,43,43,0.2)]"
              >
                {/* Badge Container */}
                <div className="w-[80px] h-[80px] rounded-full border-2 border-[#2b2b2b] bg-[#efe9da] flex items-center justify-center mb-6 overflow-hidden relative">
                  {club.badgeUrl ? (
                    <img src={club.badgeUrl} alt={`${club.name} badge`} className="w-full h-full object-cover" />
                  ) : (
                    <svg width="50" height="50" viewBox="0 0 60 60" fill="none" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="30" cy="30" r="28" strokeDasharray="4 4" opacity="0.5" />
                      <path d="M20 18H40V30C40 40 30 46 30 46C30 46 20 40 20 30V18Z" />
                      <path d="M30 18V46" opacity="0.3" />
                      <path d="M20 25H40" opacity="0.3" />
                    </svg>
                  )}
                </div>

                <h3 className="font-['Bebas_Neue'] text-3xl tracking-wide leading-none mb-3">
                  {club.name}
                </h3>
                
                <div className="flex items-center justify-center gap-2 mb-4 text-[#2b2b2b] opacity-80">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16l-2 2" />
                    <path d="M14 2v20" />
                    <path d="M10 2v20" />
                    <path d="M18 10h-4" />
                    <path d="M18 14h-4" />
                  </svg>
                  <span className="font-['Space_Grotesk'] text-sm font-bold tracking-wide">
                    {club.stadiumName}
                  </span>
                </div>

                <p className="font-['Caveat'] text-2xl italic text-[#d9b45f]">
                  Est. {club.foundedYear}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[8px_8px_0_rgba(43,43,43,0.2)] p-8 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-['Bebas_Neue'] text-4xl mb-6 text-center">Add New Club</h2>
            <form onSubmit={handleCreateClub} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Club Name</label>
                <input
                  type="text"
                  required
                  value={newClubName}
                  onChange={(e) => setNewClubName(e.target.value)}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                  placeholder="e.g. Dream FC"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Stadium Name</label>
                <input
                  type="text"
                  required
                  value={newStadiumName}
                  onChange={(e) => setNewStadiumName(e.target.value)}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                  placeholder="e.g. Doodle Park"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Founded Year</label>
                <input
                  type="number"
                  required
                  min="1800"
                  max="2030"
                  value={newFoundedYear}
                  onChange={(e) => setNewFoundedYear(e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                  placeholder="e.g. 1905"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">League</label>
                <select
                  required
                  value={newLeagueId}
                  onChange={(e) => setNewLeagueId(e.target.value)}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold appearance-none"
                >
                  <option value="" disabled>Select League...</option>
                  {leagues.map((league) => (
                    <option key={league.id} value={league.id}>
                      {league.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full border-2 border-[#2b2b2b] bg-transparent py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newLeagueId}
                  className="flex-1 rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] py-3 text-sm font-bold uppercase tracking-widest hover:bg-transparent hover:text-[#2b2b2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save Club"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}