import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface Fixture {
  id: string;
  homeClubName: string;
  awayClubName: string;
  homeScore?: number;
  awayScore?: number;
  status: "SCHEDULED" | "LIVE" | "FINISHED";
  kickoffAt: string;
  leagueName: string;
  matchday: number;
}

export interface FixtureDetailProps {
  fixtureId: string;
  isAdmin: boolean;
  onBack: () => void;
}

export default function FixtureDetail({
  fixtureId,
  isAdmin,
  onBack,
}: FixtureDetailProps) {
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin Form State
  const [homeScoreInput, setHomeScoreInput] = useState<number | "">("");
  const [awayScoreInput, setAwayScoreInput] = useState<number | "">("");
  const [statusInput, setStatusInput] = useState<"LIVE" | "FINISHED">("LIVE");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const fetchFixture = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/football/fixtures/${fixtureId}`);
      if (!response.ok) throw new Error("Failed to load fixture details.");
      const data: Fixture = await response.json();
      setFixture(data);

      // Pre-fill admin form if data exists
      if (data.homeScore !== undefined) setHomeScoreInput(data.homeScore);
      if (data.awayScore !== undefined) setAwayScoreInput(data.awayScore);
      if (data.status === "LIVE" || data.status === "FINISHED") {
        setStatusInput(data.status);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixture();
  }, [fixtureId]);

  const handleUpdateScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fixture) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/football/fixtures/${fixtureId}/score`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeScore: homeScoreInput === "" ? 0 : Number(homeScoreInput),
          awayScore: awayScoreInput === "" ? 0 : Number(awayScoreInput),
          status: statusInput,
        }),
      });

      if (!response.ok) throw new Error("Failed to update score");

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      // Refresh data to reflect the new state
      fetchFixture();
    } catch (err) {
      alert("Error updating score. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: Fixture["status"]) => {
    switch (status) {
      case "LIVE":
        return (
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#2f7a4d] bg-[#2f7a4d]/10 text-[#2f7a4d] px-4 py-1.5 text-sm font-bold uppercase tracking-widest mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2f7a4d] animate-pulse" />
            LIVE NOW
          </div>
        );
      case "FINISHED":
        return (
          <div className="inline-flex items-center rounded-full bg-[#2b2b2b]/15 text-[#2b2b2b] px-4 py-1.5 text-sm font-bold uppercase tracking-widest mt-2">
            FULL TIME
          </div>
        );
      case "SCHEDULED":
      default:
        return (
          <div className="inline-flex items-center rounded-full border-2 border-[#2b2b2b] bg-transparent text-[#2b2b2b] px-4 py-1.5 text-sm font-bold uppercase tracking-widest mt-2">
            SCHEDULED
          </div>
        );
    }
  };

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

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#2b2b2b] bg-transparent hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors shrink-0"
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          {fixture && (
            <div className="text-center">
              <h1 className="font-['Bebas_Neue'] text-3xl md:text-4xl tracking-wide uppercase">
                {fixture.leagueName}
              </h1>
              <p className="font-['Caveat'] text-lg opacity-80 -rotate-1 mt-0.5 text-[#d9b45f]">
                Matchday {fixture.matchday}
              </p>
            </div>
          )}
          
          <div className="w-12" /> {/* Spacer for centering */}
        </header>

        {loading ? (
          <div className="w-full h-80 bg-[#e4d8bd] animate-pulse rounded-[2rem] border-2 border-[#2b2b2b] shadow-[10px_10px_0_rgba(43,43,43,0.2)]" />
        ) : error || !fixture ? (
          <div className="text-center py-20">
            <p className="text-red-600 font-bold mb-4">{error || "Fixture not found"}</p>
            <button onClick={onBack} className="rounded-full border-2 border-[#2b2b2b] bg-transparent px-6 py-2 font-bold hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">
              Go Back
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-10">
            
            {/* MAIN SCOREBOARD CARD */}
            <div className="bg-[#f7f0df] rounded-[2rem] border-2 border-[#2b2b2b] shadow-[10px_10px_0_rgba(43,43,43,0.2)] rotate-[-0.5deg] p-8 md:p-12 relative overflow-hidden transition-transform hover:rotate-0 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
                
                {/* Left: Home Team */}
                <div className="flex flex-col items-center">
                  <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl lg:text-6xl tracking-wide leading-none mb-2 break-words w-full">
                    {fixture.homeClubName}
                  </h2>
                  <span className="font-['Caveat'] text-2xl text-[#d9b45f] -rotate-2">HOME</span>
                </div>

                {/* Center: Score & Status */}
                <div className="flex flex-col items-center justify-center relative min-h-[160px]">
                  {fixture.status === "SCHEDULED" ? (
                    <div className="flex flex-col items-center mb-4">
                      {/* VS Hand-drawn Doodle */}
                      <svg width="180" height="90" viewBox="0 0 200 100" fill="none" stroke="#2b2b2b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                        {/* Left Player */}
                        <circle cx="40" cy="30" r="15" />
                        <path d="M40 45 L40 75 M40 75 L25 95 M40 75 L60 90" />
                        <path d="M40 55 L55 60 L75 50" /> {/* Pointing arm */}
                        
                        {/* Right Player */}
                        <circle cx="160" cy="30" r="15" />
                        <path d="M160 45 L160 75 M160 75 L175 95 M160 75 L140 90" />
                        <path d="M160 55 L145 60 L125 50" /> {/* Pointing arm */}
                        
                        {/* Football */}
                        <circle cx="100" cy="80" r="12" fill="#efe9da" />
                        <path d="M93 75 L107 85 M95 87 L105 73" strokeWidth="2" />
                        
                        {/* "VS" text doodle */}
                        <path d="M85 20 L95 40 L100 20 M105 25 C105 20 115 20 115 25 C115 30 105 35 105 40 C105 45 115 45 115 40" strokeWidth="4" />
                      </svg>
                      <div className="font-['Bebas_Neue'] text-5xl opacity-40 mt-2">? — ?</div>
                    </div>
                  ) : (
                    <div className="font-['Bebas_Neue'] text-[clamp(72px,12vw,128px)] leading-[0.8] mb-4 text-[#2b2b2b] tracking-tight">
                      {fixture.homeScore ?? 0} <span className="text-[#d9b45f] text-[clamp(48px,8vw,80px)] opacity-50">—</span> {fixture.awayScore ?? 0}
                    </div>
                  )}
                  {getStatusBadge(fixture.status)}
                </div>

                {/* Right: Away Team */}
                <div className="flex flex-col items-center">
                  <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl lg:text-6xl tracking-wide leading-none mb-2 break-words w-full">
                    {fixture.awayClubName}
                  </h2>
                  <span className="font-['Caveat'] text-2xl text-[#d9b45f] 2">AWAY</span>
                </div>
              </div>
            </div>

            {/* MATCH INFO STRIP */}
            <div className="flex flex-wrap justify-center gap-4 text-sm font-bold uppercase tracking-widest text-[#2b2b2b]">
              <div className="flex items-center gap-2 border-2 border-[#2b2b2b] bg-[#f7f0df] rounded-full px-5 py-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {new Date(fixture.kickoffAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center gap-2 border-2 border-[#2b2b2b] bg-[#f7f0df] rounded-full px-5 py-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d9b45f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
                {fixture.leagueName}
              </div>
              <div className="flex items-center gap-2 border-2 border-[#2b2b2b] bg-[#f7f0df] rounded-full px-5 py-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 M2 12a14.5 14.5 0 0 0 20 0 M12 2a14.5 14.5 0 0 1 0 20 M2 12a14.5 14.5 0 0 1 20 0" strokeDasharray="2 4" />
                </svg>
                Matchday {fixture.matchday}
              </div>
            </div>

            {/* ADMIN SCORE UPDATE FORM */}
            {isAdmin && (fixture.status === "LIVE" || fixture.status === "FINISHED") && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-[#f7f0df] rounded-[2rem] border-2 border-[#2b2b2b] p-8 max-w-lg mx-auto w-full"
              >
                <h3 className="font-['Bebas_Neue'] text-3xl mb-6 text-center tracking-wide">
                  UPDATE SCORE
                </h3>
                <form onSubmit={handleUpdateScore} className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Home Score</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={homeScoreInput}
                        onChange={(e) => setHomeScoreInput(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full rounded-2xl border-2 border-[#2b2b2b] bg-transparent px-4 py-3 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#d9b45f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Away Score</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={awayScoreInput}
                        onChange={(e) => setAwayScoreInput(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full rounded-2xl border-2 border-[#2b2b2b] bg-transparent px-4 py-3 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#d9b45f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-2">Status</label>
                    <div className="relative">
                      <select
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value as "LIVE" | "FINISHED")}
                        className="w-full appearance-none rounded-2xl border-2 border-[#2b2b2b] bg-transparent px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-[#d9b45f] cursor-pointer"
                      >
                        <option value="LIVE">LIVE</option>
                        <option value="FINISHED">FINISHED</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2b2b2b]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] text-[#f3eee1] py-4 text-sm font-bold uppercase tracking-widest hover:bg-transparent hover:text-[#2b2b2b] transition-colors disabled:opacity-50 mt-2"
                  >
                    {isUpdating ? "Saving..." : "Update Score"}
                  </button>
                </form>
              </motion.div>
            )}

          </motion.div>
        )}
      </div>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#2f7a4d] text-[#f7f0df] px-6 py-3 rounded-full border-2 border-[#2b2b2b] shadow-[0_4px_0_#2b2b2b] font-bold uppercase tracking-widest text-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Score updated!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}