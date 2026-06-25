import React, { useState, useEffect } from "react";

export interface Standing {
  position: number;
  clubName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface StandingsProps {
  leagueId: string;
  leagueName: string;
  onBack: () => void;
}

export default function Standings({ leagueId, leagueName, onBack }: StandingsProps) {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/football/standings/${leagueId}`);
        if (!response.ok) throw new Error("Failed to load standings.");
        const data = await response.json();
        setStandings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [leagueId]);

  const handleExportCSV = () => {
    if (standings.length === 0) return;

    const headers = ["Position", "Club", "Played", "Won", "Drawn", "Lost", "GF", "GA", "GD", "Points"];
    const csvRows = standings.map((s) =>
      [
        s.position,
        `"${s.clubName}"`, // Encapsulate in quotes in case of commas in name
        s.played,
        s.won,
        s.drawn,
        s.lost,
        s.goalsFor,
        s.goalsAgainst,
        s.goalDifference,
        s.points,
      ].join(",")
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${leagueName.replace(/\s+/g, '_').toLowerCase()}_standings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] font-['Space_Grotesk'] selection:bg-[#d9b45f] selection:text-[#2b2b2b] pb-24">
      {/* Background Dot Grid for continuity */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{
          backgroundImage: "radial-gradient(#2b2b2b 2px, transparent 2px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#2b2b2b] bg-transparent hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors shrink-0"
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center flex-1">
            <h1 className="font-['Bebas_Neue'] text-4xl md:text-5xl tracking-wide uppercase leading-none">
              {leagueName} STANDINGS
            </h1>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={standings.length === 0}
            className="rounded-full border-2 border-[#2b2b2b] bg-transparent text-[#2b2b2b] px-6 py-2.5 text-sm font-bold tracking-widest uppercase hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            Export CSV
          </button>
        </header>

        {/* Loading / Error States */}
        {loading ? (
          <div className="w-full h-96 bg-[#e4d8bd] animate-pulse rounded-[2rem] border-2 border-[#2b2b2b] shadow-[8px_8px_0_rgba(43,43,43,0.18)]" />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="rounded-full border-2 border-[#2b2b2b] bg-transparent px-6 py-2 font-bold hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors">
              Retry
            </button>
          </div>
        ) : standings.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
             <p className="font-['Caveat'] text-3xl text-[#2b2b2b] -rotate-2">
              No standings available yet...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Table Card */}
            <div className="bg-[#f7f0df] rounded-[2rem] border-2 border-[#2b2b2b] shadow-[8px_8px_0_rgba(43,43,43,0.18)] overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#2b2b2b] text-[#f3eee1] text-xs font-bold uppercase tracking-widest">
                    <th className="py-4 pl-6 pr-4 w-16 text-center">#</th>
                    <th className="py-4 px-4 w-full">Club</th>
                    <th className="py-4 px-3 text-center">P</th>
                    <th className="py-4 px-3 text-center">W</th>
                    <th className="py-4 px-3 text-center">D</th>
                    <th className="py-4 px-3 text-center">L</th>
                    <th className="py-4 px-3 text-center opacity-70">GF</th>
                    <th className="py-4 px-3 text-center opacity-70">GA</th>
                    <th className="py-4 px-3 text-center">GD</th>
                    <th className="py-4 pl-3 pr-6 text-center">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, index) => {
                    const isFirst = index === 0;
                    const isTop4 = index > 0 && index < 4;
                    const rowBg = index % 2 === 0 ? "bg-[#f7f0df]" : "bg-[#efe9da]";
                    
                    let borderLeftClass = "border-l-4 border-transparent";
                    if (isFirst) borderLeftClass = "border-l-4 border-[#d9b45f]";
                    if (isTop4) borderLeftClass = "border-l-4 border-[#2f7a4d]";

                    return (
                      <tr
                        key={row.clubName}
                        className={`${rowBg} ${borderLeftClass} border-b border-[#2b2b2b]/15 transition-colors hover:bg-[#e4d8bd] group`}
                      >
                        <td className="py-4 pl-5 pr-4 text-center font-bold text-sm">
                          <div className="flex items-center justify-center gap-1.5">
                            {row.position}
                            {isFirst && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d9b45f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 -mt-0.5">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                <path d="M4 22h16" />
                                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-base whitespace-nowrap">
                          {row.clubName}
                        </td>
                        <td className="py-4 px-3 text-center">{row.played}</td>
                        <td className="py-4 px-3 text-center">{row.won}</td>
                        <td className="py-4 px-3 text-center">{row.drawn}</td>
                        <td className="py-4 px-3 text-center">{row.lost}</td>
                        <td className="py-4 px-3 text-center opacity-70">{row.goalsFor}</td>
                        <td className="py-4 px-3 text-center opacity-70">{row.goalsAgainst}</td>
                        <td className="py-4 px-3 text-center font-bold">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                        <td className={`py-4 pl-3 pr-6 text-center font-['Bebas_Neue'] text-2xl tracking-wide ${isFirst ? 'text-[#d9b45f]' : 'text-[#2b2b2b]'}`}>
                          {row.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend & Footer Info */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
              <div className="flex items-center gap-3 font-['Caveat'] text-lg">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#d9b45f] bg-[#f7f0df]">
                  <span>🏆</span> Champions
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#2f7a4d] bg-[#f7f0df]">
                  <span className="text-[#2f7a4d] font-sans font-bold">↑</span> Top 4
                </div>
              </div>
              
              <div className="font-['Caveat'] text-lg italic opacity-60">
                last updated just now — standings refresh on match end
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}