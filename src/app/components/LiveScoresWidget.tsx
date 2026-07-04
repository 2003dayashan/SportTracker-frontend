import React, { useEffect, useState } from "react";
// Since Fixture type might be locally defined in football pages, let's redefine it here or import it.
// We'll define a minimal interface to avoid cyclic or missing imports if it's not exported.
interface Fixture {
  id: string;
  leagueName: string;
  matchday: number;
  homeClubName: string;
  awayClubName: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  kickoffAt: string;
}

export default function LiveScoresWidget() {
  const [liveFixtures, setLiveFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveScores = async () => {
      try {
        const res = await fetch("/api/football/fixtures");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const live = data.filter((f: Fixture) => f.status === "LIVE");
        setLiveFixtures(live);
      } catch (err) {
        console.error("Live scores error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveScores();
    const interval = setInterval(fetchLiveScores, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  if (loading && liveFixtures.length === 0) return <div className="h-16 animate-pulse bg-[#f7f0df]/50 rounded-xl"></div>;

  return (
    <div className="border-2 border-[#2b2b2b] rounded-[1.5rem] p-5 bg-[#f7f0df] shadow-[4px_4px_0_0_rgba(43,43,43,0.22)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <h3 className="font-['Bebas_Neue'] text-3xl tracking-wide">LIVE FOOTBALL</h3>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-[#2b2b2b]/60">Auto Updates</div>
      </div>
      
      {liveFixtures.length === 0 ? (
        <div className="text-center py-6">
          <p className="font-['Space_Grotesk'] text-sm font-bold text-[#2b2b2b]/60 italic">No live matches right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {liveFixtures.map((f) => (
            <div key={f.id} className="flex flex-col rounded-xl border-2 border-[#2b2b2b]/20 p-3 bg-[#efe9da] transition-colors hover:border-[#2b2b2b]/40">
              <div className="text-[10px] text-center font-bold tracking-widest opacity-60 mb-2 uppercase">
                {f.leagueName} • MD {f.matchday}
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex-1 font-bold truncate text-sm text-right pr-4">{f.homeClubName}</div>
                <div className="text-center font-['Bebas_Neue'] text-4xl text-red-600 bg-[#2b2b2b]/5 px-4 py-1 rounded-lg">
                  {f.homeScore ?? 0} - {f.awayScore ?? 0}
                </div>
                <div className="flex-1 font-bold truncate text-sm text-left pl-4">{f.awayClubName}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
