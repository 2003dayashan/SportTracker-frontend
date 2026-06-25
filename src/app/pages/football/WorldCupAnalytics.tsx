import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export interface WorldCupStanding {
  id: string;
  groupName: string;
  position: number;
  teamName: string;
  teamCrestUrl?: string;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface WorldCupMatch {
  id: string;
  groupName?: string;
  stage: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: string;
  kickoffAt: string;
}

export interface WorldCupAnalyticsProps {
  isAdmin: boolean;
  onBack: () => void;
}

type MatchTab = "ALL" | "LIVE" | "UPCOMING" | "FINISHED";

export default function WorldCupAnalytics({ isAdmin, onBack }: WorldCupAnalyticsProps) {
  const [standings, setStandings] = useState<WorldCupStanding[]>([]);
  const [matches, setMatches] = useState<WorldCupMatch[]>([]);
  const [liveMatches, setLiveMatches] = useState<WorldCupMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MatchTab>("ALL");
  const [chartActiveIndex, setChartActiveIndex] = useState(-1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const [standingsRes, matchesRes, liveRes] = await Promise.all([
        fetch("/api/football/worldcup/standings"),
        fetch("/api/football/worldcup/matches"),
        fetch("/api/football/worldcup/matches/live"),
      ]);

      if (!standingsRes.ok || !matchesRes.ok || !liveRes.ok) {
        throw new Error("Failed to load World Cup data.");
      }

      const [standingsData, matchesData, liveData] = await Promise.all([
        standingsRes.json(),
        matchesRes.json(),
        liveRes.json(),
      ]);

      setStandings(standingsData);
      setMatches(matchesData);
      setLiveMatches(liveData);
      setLastUpdated(new Date());
      setSecondsSinceUpdate(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/football/worldcup/sync", { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      await fetchData();
    } catch {
      alert("Manual sync failed. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const dataInterval = setInterval(fetchData, 30000);
    return () => clearInterval(dataInterval);
  }, [fetchData]);

  useEffect(() => {
    const tickInterval = setInterval(() => {
      if (lastUpdated) {
        setSecondsSinceUpdate(
          Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)
        );
      }
    }, 1000);
    return () => clearInterval(tickInterval);
  }, [lastUpdated]);

  const { sortedGroupNames, groupedStandings, chartData } = useMemo(() => {
    const groups: Record<string, WorldCupStanding[]> = {};
    standings.forEach((s) => {
      if (!groups[s.groupName]) groups[s.groupName] = [];
      groups[s.groupName].push(s);
    });
    const sortedNames = Object.keys(groups).sort();
    sortedNames.forEach((name) =>
      groups[name].sort((a, b) => a.position - b.position)
    );
    const aggregatedChart = sortedNames.map((name) => ({
      group: name.replace("Group ", ""),
      goals: groups[name].reduce((sum, team) => sum + team.goalsFor, 0),
    }));
    return {
      sortedGroupNames: sortedNames,
      groupedStandings: groups,
      chartData: aggregatedChart,
    };
  }, [standings]);

  // ✅ FIXED — football-data.org actual status values
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      if (activeTab === "ALL") return true;
      if (activeTab === "LIVE") return m.status === "IN_PLAY";
      if (activeTab === "UPCOMING")
        return m.status === "TIMED" || m.status === "SCHEDULED";
      if (activeTab === "FINISHED") return m.status === "FINISHED";
      return true;
    });
  }, [matches, activeTab]);

  return (
    <div className="relative min-h-screen bg-[#efe9da] text-[#2b2b2b] font-['Space_Grotesk'] pb-32 overflow-y-auto overflow-x-hidden">
      {/* Background Dot Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{
          backgroundImage: "radial-gradient(#2b2b2b 2px, transparent 2px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 relative">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#2b2b2b] bg-transparent hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-colors shrink-0"
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              {/* Trophy SVG */}
              <svg width="40" height="40" viewBox="0 0 60 60" fill="none"
                stroke="#d9b45f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15,20 C15,20 30,40 30,55 C30,40 45,20 45,20 L15,20 Z" />
                <path d="M25,55 L35,55 M30,55 L30,60 L20,60 L40,60" />
                <path d="M15,25 C0,25 0,45 20,40 M45,25 C60,25 60,45 40,40" strokeWidth="3" />
                <circle cx="30" cy="15" r="8" />
              </svg>
              <h1
                className="font-['Bebas_Neue'] leading-[0.85] tracking-tight"
                style={{ fontSize: "clamp(48px,7vw,96px)" }}
              >
                WORLD CUP 2026
              </h1>
            </div>
            <p className="font-['Caveat'] text-2xl opacity-80 -rotate-1 mt-3 ml-2">
              live scores. live tables. zero refresh needed.
            </p>
          </div>

          {/* Live indicator */}
          <div className="flex flex-col items-end gap-2 bg-[#f7f0df] px-6 py-4 rounded-3xl border-2 border-[#2b2b2b] shadow-[4px_4px_0_rgba(43,43,43,0.1)] self-start w-full md:w-auto">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2f7a4d] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2f7a4d]" />
              </span>
              <span className="font-['Bebas_Neue'] text-2xl text-[#2f7a4d] tracking-widest mt-1">
                LIVE DATA
              </span>
            </div>
            <span className="font-['Caveat'] text-sm opacity-70">
              Last updated {secondsSinceUpdate}s ago
            </span>
          </div>
        </header>

        {/* LOADING */}
        {loading && matches.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="h-64 bg-[#e4d8bd] rounded-[2rem] border-2 border-[#2b2b2b]" />
            <div className="h-64 bg-[#e4d8bd] rounded-[2rem] border-2 border-[#2b2b2b]" />
            <div className="h-64 bg-[#e4d8bd] rounded-[2rem] border-2 border-[#2b2b2b]" />
            <div className="h-64 bg-[#e4d8bd] rounded-[2rem] border-2 border-[#2b2b2b]" />
          </div>
        ) : error ? (
          <div className="text-center py-20 font-bold text-red-600 border-2 border-red-600 border-dashed rounded-[2rem] bg-red-50">
            {error}
            <br />
            <button onClick={fetchData} className="mt-4 underline text-sm">
              Try Again
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-16">

            {/* LIVE MATCHES STRIP */}
            {liveMatches.length > 0 && (
              <section>
                <h2 className="font-['Caveat'] text-2xl font-bold text-[#2f7a4d] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2f7a4d] animate-pulse" />
                  🟢 LIVE NOW
                </h2>
                <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-6 items-center">
                  {liveMatches.map((match, i) => {
                    const rotations = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];
                    return (
                      <div
                        key={match.id}
                        className={`shrink-0 min-w-[280px] bg-[#f7f0df] border-2 border-[#2f7a4d] rounded-[1.5rem] shadow-[4px_4px_0_rgba(47,122,77,0.2)] p-6 ${rotations[i % 4]} transition-transform hover:rotate-0`}
                      >
                        <div className="text-center font-bold uppercase text-xs opacity-70 mb-2">
                          {match.stage} {match.groupName && `• ${match.groupName}`}
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <div className="text-right flex-1 font-bold uppercase truncate">
                            {match.homeTeam}
                          </div>
                          <div className="font-['Bebas_Neue'] text-4xl text-[#2f7a4d] bg-[#2f7a4d]/10 px-3 py-1 rounded-xl shrink-0 mt-1">
                            {match.homeScore ?? 0} - {match.awayScore ?? 0}
                          </div>
                          <div className="text-left flex-1 font-bold uppercase truncate">
                            {match.awayTeam}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* GROUP STANDINGS GRID */}
              <section className="lg:col-span-3">
                <h2 className="font-['Bebas_Neue'] text-4xl mb-6 tracking-wide">GROUP STAGE</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedGroupNames.map((groupName) => (
                    <div
                      key={groupName}
                      className="bg-[#f7f0df] rounded-[1.5rem] border-2 border-[#2b2b2b] overflow-hidden shadow-[4px_4px_0_rgba(43,43,43,0.15)] hover:shadow-[6px_6px_0_rgba(43,43,43,0.15)] transition-shadow"
                    >
                      <div className="bg-[#2b2b2b] text-[#f3eee1] px-4 py-2 font-['Bebas_Neue'] text-xl tracking-widest text-center">
                        {groupName}
                      </div>
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#2b2b2b]/15 opacity-60">
                            <th className="py-2 pl-3">Team</th>
                            <th className="py-2 text-center">P</th>
                            <th className="py-2 text-center">W</th>
                            <th className="py-2 text-center">D</th>
                            <th className="py-2 text-center">L</th>
                            <th className="py-2 pr-3 text-center">PTS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedStandings[groupName].map((team, idx) => (
                            <tr
                              key={team.id}
                              className={`border-b border-[#2b2b2b]/10 last:border-0 ${
                                idx < 2
                                  ? "bg-[#2f7a4d]/[0.08] border-l-4 border-l-[#2f7a4d]"
                                  : "border-l-4 border-l-transparent"
                              }`}
                            >
                              <td className="py-2 pl-3 font-bold truncate max-w-[80px]">
                                {team.teamCrestUrl && (
                                  <img
                                    src={team.teamCrestUrl}
                                    alt=""
                                    className="inline-block w-4 h-4 mr-1 object-contain"
                                  />
                                )}
                                {team.teamName}
                              </td>
                              <td className="py-2 text-center opacity-80">{team.playedGames}</td>
                              <td className="py-2 text-center opacity-80">{team.won}</td>
                              <td className="py-2 text-center opacity-80">{team.draw}</td>
                              <td className="py-2 text-center opacity-80">{team.lost}</td>
                              <td className="py-2 pr-3 text-center font-['Bebas_Neue'] text-base">
                                {team.points}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </section>

              {/* GOALS PER GROUP CHART */}
              <section className="lg:col-span-1">
                <h2 className="font-['Bebas_Neue'] text-4xl mb-6 tracking-wide">GOALS / GROUP</h2>
                <div className="bg-[#f7f0df] rounded-[1.5rem] border-2 border-[#2b2b2b] p-6 shadow-[4px_4px_0_rgba(43,43,43,0.15)] h-[380px] lg:h-[calc(100%-4rem)] flex flex-col">
                  <div className="flex-1 min-h-0 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                        <XAxis
                          dataKey="group"
                          tick={{ fontFamily: "Caveat", fontSize: 16, fill: "#2b2b2b" }}
                          axisLine={{ stroke: "#2b2b2b", strokeWidth: 2 }}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "#efe9da", opacity: 0.5 }}
                          contentStyle={{
                            backgroundColor: "#2b2b2b",
                            borderColor: "#2b2b2b",
                            borderRadius: "12px",
                            color: "#f7f0df",
                            fontFamily: "Space Grotesk",
                            fontWeight: "bold",
                          }}
                          itemStyle={{ color: "#d9b45f" }}
                        />
                        <Bar
                          dataKey="goals"
                          radius={[4, 4, 0, 0]}
                          onMouseEnter={(_, index) => setChartActiveIndex(index)}
                          onMouseLeave={() => setChartActiveIndex(-1)}
                        >
                          {chartData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === chartActiveIndex ? "#d9b45f" : "#2b2b2b"}
                              style={{ transition: "fill 0.2s" }}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>
            </div>

            {/* ALL MATCHES LIST */}
            <section>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide">ALL MATCHES</h2>
                <div className="flex flex-wrap gap-3">
                  {(["ALL", "LIVE", "UPCOMING", "FINISHED"] as MatchTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2 rounded-full border-2 border-[#2b2b2b] text-xs font-bold tracking-widest uppercase transition-colors ${
                        activeTab === tab
                          ? "bg-[#2b2b2b] text-[#f3eee1]"
                          : "bg-transparent text-[#2b2b2b] hover:bg-[#f7f0df]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {filteredMatches.length === 0 ? (
                <div className="text-center py-16 font-['Caveat'] text-2xl opacity-60">
                  No matches found for this filter.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredMatches.map((match) => {
                    // ✅ FIXED status values
                    const isLive = match.status === "IN_PLAY";
                    const isFinished = match.status === "FINISHED";
                    const isScheduled =
                      match.status === "TIMED" || match.status === "SCHEDULED";

                    return (
                      <div
                        key={match.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f7f0df] border-2 rounded-[1.5rem] p-4 sm:p-5 transition-colors hover:bg-[#efe9da] ${
                          isFinished ? "opacity-75" : ""
                        } ${
                          isLive
                            ? "border-[#2f7a4d] border-l-4"
                            : "border-[#2b2b2b]"
                        }`}
                      >
                        {/* Stage Badge */}
                        <div className="w-full sm:w-28 shrink-0">
                          <div className="inline-block rounded-full border-2 border-[#2b2b2b] px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                            {match.stage.replace(/_/g, " ")}
                          </div>
                        </div>

                        {/* Scoreboard */}
                        <div className="flex-1 flex items-center justify-center gap-4">
                          <div className="flex-1 text-right font-bold md:text-lg uppercase truncate">
                            {match.homeTeam}
                          </div>
                          <div className="shrink-0 flex items-center justify-center bg-[#efe9da] border-2 border-[#2b2b2b] rounded-xl px-4 py-2 min-w-[5rem]">
                            <span className="font-['Bebas_Neue'] text-3xl leading-none mt-1">
                              {isScheduled
                                ? "- : -"
                                : `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`}
                            </span>
                          </div>
                          <div className="flex-1 text-left font-bold md:text-lg uppercase truncate">
                            {match.awayTeam}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="w-full sm:w-32 flex justify-end shrink-0">
                          {isLive ? (
                            <div className="flex items-center gap-2 rounded-full border-2 border-[#2f7a4d] bg-[#2f7a4d]/10 text-[#2f7a4d] px-3 py-1 text-xs font-bold uppercase tracking-widest">
                              <span className="w-2 h-2 rounded-full bg-[#2f7a4d] animate-pulse" />
                              LIVE
                            </div>
                          ) : isFinished ? (
                            <div className="rounded-full bg-[#2b2b2b]/15 text-[#2b2b2b] px-3 py-1 text-xs font-bold uppercase tracking-widest">
                              FT
                            </div>
                          ) : (
                            <div className="rounded-full border-2 border-[#2b2b2b] bg-transparent text-[#2b2b2b] px-3 py-1 text-xs font-bold uppercase tracking-widest">
                              {new Date(match.kickoffAt).toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </motion.div>
        )}

        {/* FOOTER */}
        <footer className="mt-20 text-center flex flex-col items-center justify-center opacity-70">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none"
            stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="mb-2">
            <path d="M20 5 C12 5 5 12 5 20 C5 28 12 35 20 35 C28 35 35 28 35 20" />
            <path d="M35 12 L35 20 L27 20" />
          </svg>
          <p className="font-['Caveat'] text-2xl italic">
            this page updates itself every 30 seconds — sit back and watch
          </p>
        </footer>
      </div>

      {/* ADMIN SYNC BUTTON */}
      {isAdmin && (
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="fixed bottom-6 right-6 z-50 rounded-full border-2 border-[#2b2b2b] bg-[#f7f0df] text-[#2b2b2b] px-6 py-3 font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0_rgba(43,43,43,0.3)] hover:bg-[#2b2b2b] hover:text-[#f3eee1] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSyncing ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Syncing...
            </>
          ) : (
            <>
              <span className="text-lg leading-none mt-[2px]">⟳</span> Sync Now
            </>
          )}
        </button>
      )}
    </div>
  );
}