import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

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
  leagueId?: string; // Included to support pre-filtering
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
  isAdmin, // Passed in but unused in this specific view per requirements, ready for future admin actions
  onBack,
  onFixtureClick,
}: FixturesProps) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabStatus>("ALL");

  const fetchFixtures = async () => {
    try {
      // If the API supports query params, apply it. Otherwise, we filter client-side.
      const url = leagueId
        ? `/api/football/fixtures?leagueId=${leagueId}`
        : "/api/football/fixtures";

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to load fixtures.");
      const data = await response.json();
      
      // Client-side fallback filter if API doesn't filter by leagueId
      const filteredData = leagueId 
        ? data.filter((f: Fixture) => f.leagueId === leagueId)
        : data;

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

  const filteredFixtures = fixtures.filter((f) =>
    activeTab === "ALL" ? true : f.status === activeTab
  );

  const liveFixtures = filteredFixtures.filter((f) => f.status === "LIVE");
  const otherFixtures = filteredFixtures.filter((f) => f.status !== "LIVE");

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
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
        </header>

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
                    <FixtureRow key={fixture.id} fixture={fixture} index={index} onClick={() => onFixtureClick(fixture.id)} />
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
                    <FixtureRow key={fixture.id} fixture={fixture} index={index + liveFixtures.length} onClick={() => onFixtureClick(fixture.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for the individual fixture row
function FixtureRow({ fixture, index, onClick }: { fixture: Fixture; index: number; onClick: () => void }) {
  const isLive = fixture.status === "LIVE";
  const isFinished = fixture.status === "FINISHED";

  const getStatusBadge = () => {
    switch (fixture.status) {
      case "LIVE":
        return (
          <div className="flex items-center gap-2 rounded-full border-2 border-[#2f7a4d] bg-[#2f7a4d]/10 text-[#2f7a4d] px-3 py-1 text-xs font-bold uppercase tracking-widest shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#2f7a4d] animate-pulse" />
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
          <div className="rounded-full border-2 border-[#2b2b2b] bg-transparent text-[#2b2b2b] px-3 py-1 text-xs font-bold uppercase tracking-widest shrink-0">
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

      {/* Right: Status / Time */}
      <div className="shrink-0 flex justify-end md:w-32 mt-2 md:mt-0">
        {getStatusBadge()}
      </div>
    </motion.div>
  );
}