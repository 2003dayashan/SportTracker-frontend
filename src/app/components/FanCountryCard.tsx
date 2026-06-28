import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WORLD_CUP_COUNTRIES } from "../data/worldCupCountries";

interface TeamRow {
  position: number;
  team: { name: string; tla: string; crest?: string };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

interface MatchEntry {
  utcDate: string;
  status: string;
  homeTeam: { tla: string; name: string };
  awayTeam: { tla: string; name: string };
  score: { fullTime: { home: number | null; away: number | null } };
}

interface TeamStats {
  teamName: string;
  groupName: string;
  teamRow: TeamRow;
  groupTable: TeamRow[];
  matches: MatchEntry[];
  nextMatch: MatchEntry | null;
}

interface FanCountryCardProps {
  countryCode: string; // stored in fan profile (tla e.g. "BRA", "ENG")
}

export default function FanCountryCard({ countryCode }: FanCountryCardProps) {
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const country = WORLD_CUP_COUNTRIES.find(
    (c) => c.code.toUpperCase() === countryCode.toUpperCase()
  );

  useEffect(() => {
    if (!countryCode) return;
    setLoading(true);
    setError(false);

    // Extract TLA from countryCode (football-data uses 3-letter codes)
    const tla = countryCode.length === 3
      ? countryCode
      : countryToTla(countryCode);

    fetch(`/api/football/worldcup/team-stats?countryCode=${tla}`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [countryCode]);

  const primary = country?.primary ?? "#2b2b2b";
  const secondary = country?.secondary ?? "#efe9da";
  const ink = "#2b2b2b";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-[#f7f0df] border-2 border-[#2b2b2b] rounded-[2rem]
                 shadow-[6px_6px_0_rgba(43,43,43,0.2)] overflow-hidden"
    >
      {/* Jersey color top bar */}
      <div
        className="h-3 w-full"
        style={{ background: `linear-gradient(90deg, ${primary} 60%, ${secondary})` }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-5xl leading-none">{country?.flag ?? "🏳️"}</span>
          <div>
            <div className="font-['Bebas_Neue'] text-2xl text-[#2b2b2b] leading-none">
              {country?.name ?? countryCode}
            </div>
            <div className="font-['Caveat'] text-sm text-[#2b2b2b] opacity-60 mt-0.5">
              your supported nation
            </div>
          </div>

          {/* Mini jersey swatch */}
          <div className="ml-auto flex gap-1.5 items-center">
            <div
              className="w-6 h-8 rounded-sm border border-[#2b2b2b]"
              style={{ background: primary }}
              title="Kit primary"
            />
            <div
              className="w-6 h-8 rounded-sm border border-[#2b2b2b]"
              style={{ background: secondary }}
              title="Kit secondary"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SkeletonBlock />
            </motion.div>
          )}

          {error && !loading && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="font-['Caveat'] text-lg text-center py-6 opacity-60">
              couldn't load stats right now :/
            </motion.div>
          )}

          {stats && !loading && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-5">

              {/* Team stat pills */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "PLAYED", val: stats.teamRow?.playedGames ?? 0 },
                  { label: "WINS", val: stats.teamRow?.won ?? 0 },
                  { label: "GOALS", val: stats.teamRow?.goalsFor ?? 0 },
                  { label: "PTS", val: stats.teamRow?.points ?? 0 },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center bg-[#efe9da] border-2 border-[#2b2b2b]
                               rounded-2xl py-3 px-1"
                  >
                    <span className="font-['Bebas_Neue'] text-3xl text-[#2b2b2b]">{val}</span>
                    <span className="font-['Space_Grotesk'] text-[10px] font-bold tracking-widest
                                     uppercase text-[#2b2b2b] opacity-60">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Group standings mini-table */}
              {stats.groupTable && stats.groupTable.length > 0 && (
                <div>
                  <div className="font-['Bebas_Neue'] text-sm tracking-widest mb-2 opacity-70">
                    {formatGroupName(stats.groupName)} STANDINGS
                  </div>
                  <div className="border-2 border-[#2b2b2b] rounded-2xl overflow-hidden">
                    {/* table header */}
                    <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto]
                                    bg-[#2b2b2b] text-[#f3eee1] px-3 py-1.5
                                    font-['Space_Grotesk'] text-[10px] font-bold uppercase tracking-widest gap-x-3">
                      <span>#</span>
                      <span>Team</span>
                      <span>P</span>
                      <span>W</span>
                      <span>L</span>
                      <span>Pts</span>
                    </div>
                    {stats.groupTable.map((row, i) => {
                      const isMe = row.team.tla.toUpperCase() === countryCode.toUpperCase();
                      return (
                        <div
                          key={row.team.tla}
                          className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center px-3 py-2
                                      gap-x-3 font-['Space_Grotesk'] text-sm border-t border-[#2b2b2b]/10
                                      ${isMe
                              ? "font-bold"
                              : "opacity-70"
                            }`}
                          style={isMe
                            ? { borderLeft: `4px solid ${primary}`, background: `${primary}18` }
                            : {}}
                        >
                          <span className="font-['Bebas_Neue'] text-base">{row.position}</span>
                          <span className="truncate">{row.team.name}</span>
                          <span>{row.playedGames}</span>
                          <span>{row.won}</span>
                          <span>{row.lost}</span>
                          <span className="font-['Bebas_Neue'] text-base">{row.points}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Next match */}
              {stats.nextMatch && (
                <div>
                  <div className="font-['Bebas_Neue'] text-sm tracking-widest mb-2 opacity-70">
                    NEXT MATCH
                  </div>
                  <div className="bg-[#efe9da] border-2 border-[#2b2b2b] rounded-2xl px-4 py-3
                                  flex items-center justify-between gap-2">
                    <span className="font-['Space_Grotesk'] font-bold text-sm">
                      {stats.nextMatch.homeTeam.name}
                    </span>
                    <div className="flex flex-col items-center">
                      <span className="font-['Caveat'] text-base">vs</span>
                      <span className="font-['Space_Grotesk'] text-[10px] opacity-60 text-center">
                        {formatDate(stats.nextMatch.utcDate)}
                      </span>
                    </div>
                    <span className="font-['Space_Grotesk'] font-bold text-sm text-right">
                      {stats.nextMatch.awayTeam.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Recent matches */}
              {stats.matches && stats.matches.filter(m => m.status === "FINISHED").length > 0 && (
                <div>
                  <div className="font-['Bebas_Neue'] text-sm tracking-widest mb-2 opacity-70">
                    RECENT RESULTS
                  </div>
                  <div className="space-y-2">
                    {stats.matches
                      .filter((m) => m.status === "FINISHED")
                      .slice(-3)
                      .reverse()
                      .map((m, i) => {
                        const isHome = m.homeTeam.tla.toUpperCase() === countryCode.toUpperCase();
                        const myGoals = isHome
                          ? m.score.fullTime.home
                          : m.score.fullTime.away;
                        const oppGoals = isHome
                          ? m.score.fullTime.away
                          : m.score.fullTime.home;
                        const opp = isHome ? m.awayTeam.name : m.homeTeam.name;
                        const resultColor =
                          myGoals! > oppGoals! ? "#2f7a4d"
                            : myGoals! < oppGoals! ? "#c0392b"
                            : "#d9b45f";
                        const resultLabel =
                          myGoals! > oppGoals! ? "W"
                            : myGoals! < oppGoals! ? "L"
                            : "D";

                        return (
                          <div
                            key={i}
                            className="flex items-center gap-3 bg-[#efe9da] border border-[#2b2b2b]/15
                                       rounded-xl px-3 py-2 font-['Space_Grotesk'] text-sm"
                          >
                            <span
                              className="font-['Bebas_Neue'] text-base w-5 text-center"
                              style={{ color: resultColor }}
                            >
                              {resultLabel}
                            </span>
                            <span className="flex-1 truncate opacity-80">vs {opp}</span>
                            <span className="font-bold">
                              {myGoals} – {oppGoals}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── helpers ── */

function SkeletonBlock() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-[#2b2b2b]/10 rounded-2xl" />
        ))}
      </div>
      <div className="h-28 bg-[#2b2b2b]/10 rounded-2xl" />
      <div className="h-14 bg-[#2b2b2b]/10 rounded-2xl" />
    </div>
  );
}

function formatDate(utcDate: string) {
  const d = new Date(utcDate);
  return d.toLocaleDateString("en-GB", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
  });
}

function formatGroupName(raw: string) {
  // "GROUP_A" → "Group A"
  return raw?.replace("GROUP_", "Group ") ?? "Group";
}

// Fallback: map 2-letter ISO → football-data TLA (extend as needed)
function countryToTla(code: string): string {
  const map: Record<string, string> = {
    BR: "BRA", AR: "ARG", FR: "FRA", DE: "GER", ES: "ESP",
    PT: "POR", NL: "NED", BE: "BEL", HR: "CRO", GB_ENG: "ENG",
    US: "USA", MX: "MEX", JP: "JPN", KR: "KOR", AU: "AUS",
    MA: "MAR", SN: "SEN", GH: "GHA", EG: "EGY", NG: "NGA",
    CA: "CAN", CO: "COL", UY: "URU", EC: "ECU", CH: "SUI",
    TR: "TUR", SA: "KSA", IR: "IRN",
  };
  return map[code.replace("-", "_")] ?? code;
}