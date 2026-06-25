import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

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
  onViewStandings: (leagueId: string) => void;
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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newSeason, setNewSeason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeagues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/football/leagues");
      if (!response.ok) throw new Error("Failed to load leagues.");
      const data = await response.json();
      setLeagues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/football/leagues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          country: newCountry,
          season: newSeason,
        }),
      });

      if (!response.ok) throw new Error("Failed to create league");

      // Reset form and refresh list
      setNewName("");
      setNewCountry("");
      setNewSeason("");
      setIsModalOpen(false);
      fetchLeagues();
    } catch (err) {
      alert("Error creating league. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLeagues = leagues.filter((league) =>
    league.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#2b2b2b] bg-transparent hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors"
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="font-['Bebas_Neue'] text-5xl tracking-wide absolute left-1/2 -translate-x-1/2">
            LEAGUES
          </h1>

          <div className="w-12 md:w-auto">
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden md:block rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] px-6 py-2.5 text-sm font-bold tracking-widest uppercase hover:bg-transparent hover:text-[#2b2b2b] transition-colors"
              >
                + Create League
              </button>
            )}
          </div>
        </header>

        {/* Mobile Create Button */}
        {isAdmin && (
          <div className="md:hidden mb-6 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-transparent hover:text-[#2b2b2b] transition-colors"
            >
              + Create League
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-10 max-w-xl mx-auto relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2b2b2b] opacity-50" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search leagues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border-2 border-[#2b2b2b] bg-[#f7f0df] py-3 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] focus:border-[#2b2b2b] transition-all font-bold placeholder:font-normal placeholder:text-[#2b2b2b]/50"
          />
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#e4d8bd] animate-pulse border-2 border-[#2b2b2b] rounded-[2rem] shadow-[6px_6px_0_rgba(43,43,43,0.2)] h-48"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="font-['Space_Grotesk'] text-red-600 font-bold mb-4">{error}</p>
            <button onClick={fetchLeagues} className="rounded-full border-2 border-[#2b2b2b] bg-transparent px-6 py-2 font-bold hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">
              Try Again
            </button>
          </div>
        ) : filteredLeagues.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 flex flex-col items-center"
          >
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="#2b2b2b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mb-6 opacity-60">
              <circle cx="50" cy="50" r="40" />
              <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" strokeWidth="2" opacity="0.5" />
              <path d="M35 50 L50 35 L65 50 L50 65 Z" fill="#efe9da" strokeWidth="3" />
            </svg>
            <p className="font-['Caveat'] text-3xl text-[#2b2b2b] -rotate-2">
              No leagues found yet...
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredLeagues.map((league) => (
              <div
                key={league.id}
                className="group flex flex-col justify-between bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[6px_6px_0_rgba(43,43,43,0.2)] p-6 transition-all duration-300 hover:-rotate-1 hover:shadow-[8px_8px_0_rgba(43,43,43,0.2)]"
              >
                <div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d9b45f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                  
                  <h3 className="font-['Bebas_Neue'] text-3xl tracking-wide leading-none mb-2">
                    {league.name}
                  </h3>
                  <p className="font-['Space_Grotesk'] text-sm opacity-70 font-bold uppercase tracking-wider">
                    {league.country} &bull; {league.season}
                  </p>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => onViewStandings(league.id)}
                    className="flex-1 rounded-full border-2 border-[#2b2b2b] bg-transparent text-[#2b2b2b] py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors"
                  >
                    Standings
                  </button>
                  <button
                    onClick={() => onViewFixtures(league.id)}
                    className="flex-1 rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] py-2 text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-[#2b2b2b] transition-colors"
                  >
                    Fixtures
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem] shadow-[8px_8px_0_rgba(43,43,43,0.2)] p-8"
          >
            <h2 className="font-['Bebas_Neue'] text-4xl mb-6 text-center">Create League</h2>
            <form onSubmit={handleCreateLeague} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">League Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                  placeholder="e.g. Premier League"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Country</label>
                <input
                  type="text"
                  required
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                  placeholder="e.g. England"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Season</label>
                <input
                  type="text"
                  required
                  value={newSeason}
                  onChange={(e) => setNewSeason(e.target.value)}
                  className="w-full rounded-full border-2 border-[#2b2b2b] bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9b45f] font-bold"
                  placeholder="e.g. 2026/27"
                />
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
                  disabled={isSubmitting}
                  className="flex-1 rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] py-3 text-sm font-bold uppercase tracking-widest hover:bg-transparent hover:text-[#2b2b2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}