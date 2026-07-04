import { useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, CalendarDays, Eye, EyeOff, Shield, Trophy, Users, Zap } from "lucide-react";
import { toast } from "sonner";

import { InteractiveBackground } from "./components/InteractiveBackground";
import { DoorsPage, type DoorFeature } from "./components/DoorsPage";
import { ProfileWidget } from "./components/ui/ProfileWidget";
import { PrimeDoorButton } from "./components/PrimeDoorButton";

import { UserProfilePage } from "./pages/global/UserProfilePage";
import { AdminProfilePage } from "./pages/global/AdminProfilePage";
import { AdminUserManagementPage } from "./pages/global/AdminUserManagementPage";

import Layout from "./pages/esport/Layout";
import { type EsportPage } from "./pages/esport/Sidebar";
import EsportHome from "./pages/esport/Home";
import EsportDashboard from "./pages/esport/Dashboard";
import EsportTournaments from "./pages/esport/Tournaments";
import EsportTeams from "./pages/esport/Teams";
import EsportPlayers from "./pages/esport/Players";
import EsportMatches from "./pages/esport/Matches";
import EsportBrackets from "./pages/esport/Brackets";
import EsportLeaderboard from "./pages/esport/Leaderboard";
import EsportProfile from "./pages/esport/Profile";
import EsportSearch from "./pages/esport/Search";

import FootballHome from "./pages/football/FootballHome";
import Leagues from "./pages/football/Leagues";
import Clubs from "./pages/football/Clubs";
import Fixtures from "./pages/football/Fixtures";
import FixtureDetail from "./pages/football/FixtureDetail";
import Standings from "./pages/football/Standings";
import WorldCupAnalytics from "./pages/football/WorldCupAnalytics";

import QuestboardHome from "./pages/questboard/QuestboardHome";
import QuestList from "./pages/questboard/QuestList";
import QuestDetail from "./pages/questboard/QuestDetail";
import GuildMasterPanel from "./pages/questboard/GuildMasterPanel";
import QuestProfile from "./pages/questboard/QuestProfile";
import QuestLeaderboard from "./pages/questboard/QuestLeaderboard";
import QuestboardDashboard from "./pages/questboard/QuestboardDashboard";
import { type User } from "./pages/questboard/api";

type FootballPage =
  | "football-home"
  | "football-leagues"
  | "football-clubs"
  | "football-fixtures"
  | "football-fixture-detail"
  | "football-standings"
  | "football-worldcup";

type QuestboardPage = "questboard-home" | "questboard-list" | "questboard-detail" | "questboard-admin" | "questboard-profile" | "questboard-leaderboard" | "questboard-dashboard";

// App.tsx top — Page type
type Page = 
  | "landing" | "doors" | "login" | "reset-password"
  | EsportPage | "questboard"   
  | FootballPage
  | QuestboardPage
  | "user-profile" | "admin-profile" | "admin-users";

const isEsportPage = (p: Page): p is EsportPage => p.startsWith("esport-");

const featureCopy: Record<DoorFeature, {
  eyebrow: string;
  title: string;
  note: string;
  stats: string[];
  actions: string[];
}> = {
  esport: {
    eyebrow: "Door 01 · E-Sports",
    title: "E-Sports Arena",
    note: "Manage tournaments, track team scores, and follow live match brackets.",
    stats: ["8 tournaments", "32 teams", "Live now"],
    actions: ["View tournaments", "Team standings", "Live matches"],
  },
  questboard: {
    eyebrow: "Door 02 · Quest Board",
    title: "Quest Board",
    note: "Track challenges, complete quests, and climb the leaderboard.",
    stats: ["24 quests", "12 active", "Top scorer"],
    actions: ["Browse quests", "My progress", "Leaderboard"],
  },
  football: {
    eyebrow: "Door 03 · Football",
    title: "Football Tracker",
    note: "Follow leagues, fixtures, standings and live World Cup analytics.",
    stats: ["12 leagues", "48 clubs", "WC 2026 Live"],
    actions: ["View leagues", "Fixtures", "World Cup"],
  },
};

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    try {
      const navigationEntry = window.performance?.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
      const isReload = navigationEntry?.type === "reload" || (window.performance?.navigation?.type === 1);
      if (isReload) {
        const savedPage = sessionStorage.getItem("currentPage") as Page | null;
        if (savedPage) return savedPage;
      } else {
        sessionStorage.removeItem("currentPage");
      }
    } catch (e) {
      console.error("Failed to check reload status", e);
    }
    return "landing";
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [selectedLeagueName, setSelectedLeagueName] = useState<string>("");
  const [selectedFixtureId, setSelectedFixtureId] = useState<string | null>(null);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  const isAdmin = isLoggedIn && (
  currentUser?.role === "ADMIN" ||
  currentUser?.role === "GUILD_MASTER"
);

  // Check URL for reset token on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setResetToken(token);
      setPage("reset-password");
      window.history.replaceState({}, "", "/");
    }
  }, []);

    // Normalize role strings from DB (handles manual edits like "Guild user")
    const normalizeRole = (role: string | undefined | null): string => {
      if (!role) return "USER";
      const r = role.toUpperCase().trim();
      if (r === "ADMIN") return "ADMIN";
      if (r === "GUILD_MASTER") return "GUILD_MASTER";
      // Handle variations from manual DB edits
      if (r.includes("ADMIN") || r.includes("GUILD") || r.includes("MASTER")) return "ADMIN";
      return "USER";
    };

    // Backend roles array → single role string
    const normalizeRoleFromArray = (roles: string[] | undefined | null): string => {
      if (!roles || roles.length === 0) return "USER";
      const combined = roles.join(",").toUpperCase();
      if (combined.includes("ADMIN") || combined.includes("GUILD_MASTER") || combined.includes("MASTER")) return "ADMIN";
      return "USER";
    };

    const refreshUser = async () => {
      try {
        let userFound = false;
        let userData = null;

        const mainRes = await fetch("/api/auth/me", { credentials: "include" });
        if (mainRes.ok) {
          const data = await mainRes.json();
          if (data?.id) {
            userFound = true;
            userData = data;
          }
        }

        if (userFound && userData) {
          const roleSource = userData.roles || (userData.role ? [userData.role] : []);
          userData.role = normalizeRoleFromArray(roleSource);
          setIsLoggedIn(true);
          setCurrentUser(userData);
        }
      } catch (e) {
        console.error("Session restore failed", e);
      }
    };

    // Session restore on refresh
    useEffect(() => {
      refreshUser();
    }, []);

    // Save page changes to sessionStorage for reload persistence
    useEffect(() => {
      sessionStorage.setItem("currentPage", page);
    }, [page]);

  const goLogin = () => setPage("login");
  const logout = () => {
    fetch("/api/auth/signout", { method: "POST", credentials: "include" }).catch(() => {});
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPage("landing");
  };
  const loginSuccess = async () => {
    setIsLoggedIn(true);
    let userData = null;
    try {
      const mainRes = await fetch("/api/auth/me", { credentials: "include" });
      if (mainRes.ok) {
        const data = await mainRes.json();
        if (data?.id) userData = data;
      }
      const qbRes = await fetch("/api/questboard/auth/me", { credentials: "include" });
      if (qbRes.ok) {
        const qbData = await qbRes.json();
        if (qbData?.id) userData = qbData;
      }
      if (userData) {
        const roleSource = userData.roles || (userData.role ? [userData.role] : []);
        userData.role = normalizeRoleFromArray(roleSource);
        setCurrentUser(userData);
      }
    } catch (e) {
      console.error("Login session fetch failed", e);
    }
    setPage("doors");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#efe9da] text-[#2b2b2b]">
      {page !== "login" && page !== "reset-password" && (
        <div className="fixed top-6 right-6 lg:top-8 lg:right-12 z-[100] pointer-events-auto">
          <ProfileWidget
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onLogin={goLogin}
            onLogout={logout}
            onNavigate={(p) => setPage(p)}
          />
        </div>
      )}
      <AnimatePresence mode="wait">
        {page === "landing" && (
          <Screen key="landing">
            <Landing
              onEnterArena={() => setPage("doors")}
              isLoggedIn={isLoggedIn}
              onLogin={goLogin}
              onLogout={logout}
              onFootball={() => setPage("football-home")}
            />
          </Screen>
        )}

        {page === "doors" && (
          <Screen key="doors" zoom>
            <DoorsPage
              onBack={() => setPage("landing")}
              onDoorSelect={(feature) => {
                if (feature === "football") {
                  setPage("football-home");
                } else if (feature === "esport") {
                  setPage("esport-home");
                } else if (feature === "questboard") {
                  setPage("questboard-home");
                } else {
                  setPage(feature);
                }
              }}
              authSlot={
                <div />
              }
            />
          </Screen>
        )}

        {page === "login" && (
          <Screen key="login">
            <LoginPage
              onBack={() => setPage("landing")}
              onLoginSuccess={loginSuccess}
              onLogout={logout}
            />
          </Screen>
        )}

        {page === "reset-password" && (
          <Screen key="reset-password">
            <ResetPasswordPage
              token={resetToken || ""}
              onBack={() => setPage("login")}
              onSuccess={() => setPage("login")}
            />
          </Screen>
        )}

        {isEsportPage(page) && (
          <Screen key={page}>
            <Layout
              currentPage={page}
              onNavigate={(p) => setPage(p)}
              onExit={() => setPage("doors")}
            >
              {page === "esport-home" && <EsportHome />}
              {page === "esport-dashboard" && <EsportDashboard />}
              {page === "esport-tournaments" && <EsportTournaments isAdmin={isAdmin} />}
              {page === "esport-teams" && <EsportTeams isAdmin={isAdmin} />}
              {page === "esport-players" && <EsportPlayers isAdmin={isAdmin} />}
              {page === "esport-matches" && <EsportMatches />}
              {page === "esport-brackets" && <EsportBrackets />}
              {page === "esport-leaderboard" && <EsportLeaderboard />}
              {page === "esport-profile" && <EsportProfile />}
              {page === "esport-search" && <EsportSearch />}
            </Layout>
          </Screen>
        )}

        {/* QUESTBOARD MODULE ROUTES */}
        {page === "questboard-home" && (
          <Screen key="questboard-home">
            <QuestboardHome
              onBack={() => setPage("doors")}
              onDashboard={() => setPage("questboard-dashboard")}
              onBrowseQuests={() => setPage("questboard-list")}
              onMyProgress={() => setPage("questboard-profile")}
              onLeaderboard={() => setPage("questboard-leaderboard")}
              onAdminPanel={() => setPage("questboard-admin")}
              currentUser={currentUser}
            />
          </Screen>
        )}
        {page === "questboard-list" && (
          <Screen key="questboard-list">
            <QuestList
              onBack={() => setPage("questboard-home")}
              onQuestClick={(id) => {
                setSelectedQuestId(id);
                setPage("questboard-detail");
              }}
            />
          </Screen>
        )}
        {page === "questboard-detail" && selectedQuestId && (
          <Screen key="questboard-detail">
            <QuestDetail
              questId={selectedQuestId}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              onBack={() => setPage("questboard-list")}
            />
          </Screen>
        )}
        {page === "questboard-profile" && (
          <Screen key="questboard-profile">
            <QuestProfile
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              onBack={() => setPage("questboard-home")}
            />
          </Screen>
        )}
        {page === "questboard-admin" && (
          <Screen key="questboard-admin">
            <GuildMasterPanel
              currentUser={currentUser}
              onBack={() => setPage("questboard-home")}
            />
          </Screen>
        )}
        {page === "questboard-leaderboard" && (
          <Screen key="questboard-leaderboard">
            <QuestLeaderboard
              onBack={() => setPage("questboard-home")}
            />
          </Screen>
        )}
        {page === "questboard-dashboard" && (
          <Screen key="questboard-dashboard">
            <QuestboardDashboard
              onBack={() => setPage("questboard-home")}
            />
          </Screen>
        )}

        {/* FOOTBALL MODULE ROUTES */}
          {page === "football-home" && (
            <Screen key="football-home">
              <FootballHome
                isLoggedIn={isLoggedIn}
                onLeagues={() => setPage("football-leagues")}
                onClubs={() => setPage("football-clubs")}
                onFixtures={() => {
                  setSelectedLeagueId(null);
                  setPage("football-fixtures");
                }}
                onStandings={() => setPage("football-leagues")}
                
                onWorldCup={() => setPage("football-worldcup")}
                onBackToDoors={() => setPage(isLoggedIn ? "doors" : "login")}
                onLogout={logout}
                
              />
            </Screen>
          )}
        {page === "football-leagues" && (
          <Screen key="football-leagues">
            <Leagues
              isAdmin={isAdmin}
              onBack={() => setPage("football-home")}
              onViewStandings={(id, name) => {          
                setSelectedLeagueId(id);
                setSelectedLeagueName(name);           
                setPage("football-standings");
              }}
              onViewFixtures={(id) => {
                setSelectedLeagueId(id);
                setPage("football-fixtures");
              }}
            />      
          </Screen>
        )}
        {page === "football-clubs" && (
          <Screen key="football-clubs">
            <Clubs
              isAdmin={isAdmin}
              onBack={() => setPage("football-home")}
            />
          </Screen>
        )}
        {page === "football-fixtures" && (
          <Screen key="football-fixtures">
            <Fixtures
              leagueId={selectedLeagueId || undefined}
              isAdmin={isAdmin}
              onBack={() => setPage(selectedLeagueId ? "football-leagues" : "football-home")}
              onFixtureClick={(id) => {
                setSelectedFixtureId(id);
                setPage("football-fixture-detail");
              }}
            />
          </Screen>
        )}
        {page === "football-fixture-detail" && selectedFixtureId && (
          <Screen key="football-fixture-detail">
            <FixtureDetail
              fixtureId={selectedFixtureId}
              isAdmin={isAdmin}
              onBack={() => setPage("football-fixtures")}
            />
          </Screen>
        )}
        {page === "football-standings" && (
          <Screen key="football-standings">
            <Standings
              leagueId={selectedLeagueId || ""}
              leagueName={selectedLeagueName || "League"}
              onBack={() => setPage("football-leagues")}
            />
          </Screen>
        )}
        {page === "football-worldcup" && (
          <Screen key="football-worldcup">
            <WorldCupAnalytics
              isAdmin={isAdmin}
              onBack={() => setPage("football-home")}
            />
          </Screen>
        )}
        {page === "user-profile" && (
          <Screen key="user-profile">
            <UserProfilePage 
              currentUser={currentUser} 
              onBack={() => setPage("doors")} 
              onProfileUpdate={refreshUser}
            />
          </Screen>
        )}
        {page === "admin-profile" && (
          <Screen key="admin-profile">
            <AdminProfilePage 
              currentUser={currentUser} 
              onBack={() => setPage("doors")} 
              onProfileUpdate={refreshUser}
            />
          </Screen>
        )}
        {page === "admin-users" && (
          <Screen key="admin-users">
            <AdminUserManagementPage 
              currentUser={currentUser} 
              onBack={() => setPage("doors")} 
            />
          </Screen>
        )}
      </AnimatePresence>
    </div>
  );
}

function Screen({ children, zoom = false }: { children: ReactNode; zoom?: boolean }) {
  return (
    <motion.div
      className="relative min-h-screen w-full overflow-y-auto"
      initial={{ opacity: 0, scale: zoom ? 1.06 : 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: zoom ? 0.7 : 0.55, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function Landing({ onEnterArena, isLoggedIn, onLogin, onLogout, onFootball }: {
  onEnterArena: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onFootball: () => void;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#efe9da] text-[#2b2b2b]">
      <InteractiveBackground onPortalEnd={onEnterArena} />
      <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-[#efe9da]/85 via-[#efe9da]/25 to-transparent" />
      <div className="pointer-events-none relative z-40 mx-auto flex min-h-screen max-w-[1320px] flex-col px-6 py-6 lg:px-12">
        <header className="flex items-center justify-between">
          <Logo />
          <div className="pointer-events-auto flex items-center gap-3">
            <nav className="pointer-events-auto hidden items-center gap-7 font-['Space_Grotesk'] text-sm md:flex mr-24 lg:mr-32">
              {["Teams", "Matches", "Arena", "Football", "About"].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="relative uppercase tracking-[0.14em] opacity-80 transition-opacity hover:opacity-100"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex flex-1 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-md"
          >
            <h1 className="mt-6 font-['Bebas_Neue'] text-[clamp(64px,9vw,132px)] leading-[0.9] tracking-[0.01em]">STICK<br />LEAGUE</h1>
            <p className="mt-2 -rotate-2 font-['Caveat'] text-[28px] leading-[1.1]">where doodles go pro.</p>
            <p className="mt-6 max-w-sm font-['Space_Grotesk'] text-base leading-[1.6] opacity-80">The whole scene is alive — kick the football to watch our star player juggle, tap again to switch the trick, or step through the portal into the arena.</p>
          </motion.div>
        </main>
        <footer className="flex flex-wrap items-center justify-between gap-3 font-['Space_Grotesk'] text-xs uppercase tracking-[0.18em] opacity-70">
          <span>© 2026 Stick League</span>
          <span>Season 01 · Now live</span>
        </footer>
      </div>
    </div>
  );
}



function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 rounded-full border-2 border-[#2b2b2b] bg-[#efe9da]/80 px-4 py-2 font-['Space_Grotesk'] text-sm shadow-[3px_3px_0_0_rgba(43,43,43,0.35)]"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />Back
    </motion.button>
  );
}

function Logo() {
  return (
    <div className="pointer-events-auto flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#2b2b2b] bg-[#efe9da]/70">
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="4" r="3" />
          <path d="M11 7v9" />
          <path d="M11 16l-5 7M11 16l5 7" />
          <path d="M11 10l-6 1M11 10l6 1" />
        </svg>
      </div>
      <span className="font-['Bebas_Neue'] text-[26px] tracking-[0.04em]">STICK&nbsp;LEAGUE</span>
    </div>
  );
}

// ─── LOGIN PAGE ────────────────────────────────────────────────────────────────

function LoginPage({ onBack, onLoginSuccess, onLogout }: {
  onBack: () => void;
  onLoginSuccess: () => void;
  onLogout: () => void;
}) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [isWide, setIsWide] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsWide(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const switchMode = (next: "login" | "register" | "forgot") => {
    setMode(next);
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowPassword(false);
    if (next === "forgot") setEmail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isForgot) {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Failed to send reset email");
        setSuccessMsg(`Reset link sent to ${email}. Check your inbox!`);
        toast.success(`Reset link sent to ${email}`);
        setIsLoading(false);
        return;
      }

      if (isRegister) {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, email, password }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Signup failed");
        }
        const loginRes = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        if (!loginRes.ok) throw new Error("Auto login failed after signup");
        toast.success("Account created successfully!");
        onLoginSuccess();
      } else {
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Invalid email or password");
        }
        toast.success("Welcome back!");
        onLoginSuccess();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const sidebarContent = {
    login: { heading: "WELCOME\nBACK", sub: "Sign in to keep your teams, fixtures, drills, and match progress synced across the clubhouse." },
    register: { heading: "JOIN THE\nROSTER", sub: "Create your player card, save your squad, and enter the arena with your own league identity." },
    forgot: { heading: "RESET\nACCESS", sub: "No worries — enter your email and we'll send reset instructions straight to your inbox." },
  };

  const sidebarX = isWide && isRegister ? "100%" : "0%";
  const sidebarRadius = isRegister ? "0 2rem 2rem 0" : "2rem 0 0 2rem";
  const formX = isWide && isRegister ? "-100%" : "0%";

  return (
    <div className="min-h-screen overflow-auto bg-[#efe9da] text-[#2b2b2b]">
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:radial-gradient(#2b2b2b_1px,transparent_1px)] [background-size:22px_22px]" />
      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <BackButton onClick={onBack} />
          <Logo />
          <PrimeDoorButton variant="logout" label="Log Out" onComplete={onLogout} />
        </header>

        <section className="flex flex-1 items-center py-10">
          <div className="relative grid w-full overflow-hidden rounded-[2rem] border-[3px] border-[#2b2b2b] bg-[#f7f0df] shadow-[12px_12px_0_rgba(43,43,43,0.22)] lg:grid-cols-2">
            <motion.aside
              animate={{ x: sidebarX, borderRadius: sidebarRadius }}
              transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
              className="relative z-10 hidden min-h-[620px] flex-col justify-between bg-[#2b2b2b] p-10 text-[#f3eee1] lg:flex"
            >
              <div>
                <div className="mb-12 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#f3eee1]">
                    <svg width="25" height="28" viewBox="0 0 22 26" fill="none" stroke="#f3eee1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="4" r="3" /><path d="M11 7v9" /><path d="M11 16l-5 7M11 16l5 7" /><path d="M11 10l-6 1M11 10l6 1" />
                    </svg>
                  </div>
                  <span className="font-['Bebas_Neue'] text-3xl tracking-[0.04em]">STICK LEAGUE</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={mode} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2, delay: 0.15 }}>
                    <h1 className="whitespace-pre-line font-['Bebas_Neue'] text-[72px] leading-[0.9] tracking-[0.015em]">{sidebarContent[mode].heading}</h1>
                    <p className="mt-5 max-w-sm font-['Space_Grotesk'] text-base leading-7 text-[#f3eee1]/65">{sidebarContent[mode].sub}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="space-y-4">
                {["Save squads", "Track match history", "Unlock training drills"].map((item) => (
                  <div key={item} className="flex items-center gap-3 font-['Space_Grotesk'] text-sm text-[#f3eee1]/80">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f3eee1]" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.aside>

            <motion.div animate={{ x: formX }} transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }} className="relative min-h-[620px] p-6 sm:p-10 lg:col-start-2">
              <AnimatePresence mode="wait">
                <motion.form key={mode} onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="mx-auto flex h-full max-w-md flex-col justify-center">
                  <span className="mb-5 w-fit rounded-full border-2 border-[#2b2b2b] bg-[#efe9da] px-3 py-1 font-['Space_Grotesk'] text-[11px] uppercase tracking-[0.22em]">
                    {mode === "login" ? "Login" : mode === "register" ? "Register" : "Reset Password"}
                  </span>
                  <h2 className="font-['Bebas_Neue'] text-6xl leading-none">
                    {mode === "login" ? "Welcome back" : mode === "register" ? "Create account" : "Forgot password?"}
                  </h2>
                  <p className="mt-2 font-['Space_Grotesk'] text-sm leading-6 opacity-65">
                    {mode === "login" ? "Enter your credentials to continue." : mode === "register" ? "Start saving your player profile today." : "Enter your email and we'll send reset instructions."}
                  </p>

                  <div className="mt-8 space-y-4">
                    {isRegister && (
                      <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.12em]">
                        <span>Username</span>
                        <input type="text" required placeholder="stickmaster99" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 w-full rounded-2xl border-2 border-[#2b2b2b]/20 bg-[#efe9da] px-4 py-3 font-normal normal-case tracking-normal outline-none placeholder:text-[#2b2b2b]/35 focus:border-[#2b2b2b] focus:shadow-[0_0_0_3px_rgba(43,43,43,0.14)]" />
                      </label>
                    )}
                    <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.12em]">
                      <span>Email address</span>
                      <input type="email" required placeholder="player@stickleague.gg" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-2xl border-2 border-[#2b2b2b]/20 bg-[#efe9da] px-4 py-3 font-normal normal-case tracking-normal outline-none placeholder:text-[#2b2b2b]/35 focus:border-[#2b2b2b] focus:shadow-[0_0_0_3px_rgba(43,43,43,0.14)]" />
                    </label>
                    {!isForgot && (
                      <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.12em]">
                        <span>Password</span>
                        <div className="relative mt-2">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder={isRegister ? "Minimum 6 characters" : "Enter your password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl border-2 border-[#2b2b2b]/20 bg-[#efe9da] pl-4 pr-12 py-3 font-normal normal-case tracking-normal outline-none placeholder:text-[#2b2b2b]/35 focus:border-[#2b2b2b] focus:shadow-[0_0_0_3px_rgba(43,43,43,0.14)]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2b2b2b]/50 hover:text-[#2b2b2b] focus:outline-none transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </label>
                    )}
                  </div>

                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border-2 border-red-400 bg-red-50 px-4 py-3 font-['Space_Grotesk'] text-sm text-red-600">
                      {errorMsg}
                    </motion.div>
                  )}
                  {successMsg && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border-2 border-[#2f7a4d] bg-[#2f7a4d]/10 px-4 py-3 font-['Space_Grotesk'] text-sm text-[#2f7a4d]">
                      ✅ {successMsg}
                    </motion.div>
                  )}

                  {mode === "login" && (
                    <div className="mt-4 flex items-center justify-between font-['Space_Grotesk'] text-sm">
                      <label className="flex items-center gap-2 opacity-70">
                        <input type="checkbox" className="h-4 w-4 accent-[#2b2b2b]" />
                        Remember me
                      </label>
                      <button type="button" onClick={() => switchMode("forgot")} className="font-bold underline decoration-2 underline-offset-4">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {!successMsg && (
                    <button type="submit" disabled={isLoading} className="mt-7 rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] px-5 py-3 font-['Space_Grotesk'] font-bold text-[#f3eee1] shadow-[4px_4px_0_rgba(43,43,43,0.28)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {mode === "login" ? "Signing in..." : mode === "register" ? "Creating..." : "Sending..."}
                        </>
                      ) : (
                        mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Send Reset Link"
                      )}
                    </button>
                  )}

                  {isForgot && (
                    <button type="button" onClick={() => switchMode("login")} className="mt-4 rounded-full border-2 border-[#2b2b2b] bg-transparent px-5 py-3 font-['Space_Grotesk'] font-bold text-[#2b2b2b] transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                      ← Back to Sign In
                    </button>
                  )}

                  {!isForgot && (
                    <p className="mt-6 text-center font-['Space_Grotesk'] text-sm opacity-75">
                      {isRegister ? "Already have an account?" : "Don't have an account?"}
                      <button type="button" onClick={() => switchMode(isRegister ? "login" : "register")} className="ml-2 font-bold underline decoration-2 underline-offset-4">
                        {isRegister ? "Sign in" : "Create an account"}
                      </button>
                    </p>
                  )}

                  {mode === "login" && (
                    <div className="mt-6 rounded-2xl border-2 border-[#2b2b2b]/20 bg-[#efe9da] p-4 font-['Space_Grotesk'] text-xs leading-6 opacity-80">
                      <strong>Demo access:</strong> dayashan@test.com · Test@1234
                    </div>
                  )}
                </motion.form>
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ─── RESET PASSWORD PAGE ───────────────────────────────────────────────────────

function ResetPasswordPage({ token, onBack, onSuccess }: {
  token: string;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirm) {
      setErrorMsg("Passwords don't match!");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Reset failed. Link may have expired.");
      }
      setSuccessMsg("Password reset successful! Redirecting to login...");
      toast.success("Password reset successful!");
      setTimeout(onSuccess, 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-auto bg-[#efe9da] text-[#2b2b2b]">
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:radial-gradient(#2b2b2b_1px,transparent_1px)] [background-size:22px_22px]" />
      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <BackButton onClick={onBack} />
          <Logo />
          <div />
        </header>

        <section className="flex flex-1 items-center py-10">
          <div className="relative grid w-full overflow-hidden rounded-[2rem] border-[3px] border-[#2b2b2b] bg-[#f7f0df] shadow-[12px_12px_0_rgba(43,43,43,0.22)] lg:grid-cols-2">

            {/* SIDEBAR */}
            <div className="relative z-10 hidden min-h-[620px] flex-col justify-between bg-[#2b2b2b] p-10 text-[#f3eee1] lg:flex">
              <div>
                <div className="mb-12 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#f3eee1]">
                    <svg width="25" height="28" viewBox="0 0 22 26" fill="none" stroke="#f3eee1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="4" r="3" /><path d="M11 7v9" /><path d="M11 16l-5 7M11 16l5 7" /><path d="M11 10l-6 1M11 10l6 1" />
                    </svg>
                  </div>
                  <span className="font-['Bebas_Neue'] text-3xl tracking-[0.04em]">STICK LEAGUE</span>
                </div>
                <h1 className="whitespace-pre-line font-['Bebas_Neue'] text-[72px] leading-[0.9] tracking-[0.015em]">
                  {"NEW\nPASSWORD"}
                </h1>
                <p className="mt-5 max-w-sm font-['Space_Grotesk'] text-base leading-7 text-[#f3eee1]/65">
                  Choose a strong password to secure your Stick League account.
                </p>
              </div>
              <div className="space-y-4">
                {["At least 6 characters", "Mix letters and numbers", "Don't reuse old passwords"].map((item) => (
                  <div key={item} className="flex items-center gap-3 font-['Space_Grotesk'] text-sm text-[#f3eee1]/80">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f3eee1]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* FORM */}
            <div className="relative min-h-[620px] p-6 sm:p-10 lg:col-start-2">
              <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="mx-auto flex h-full max-w-md flex-col justify-center">
                <span className="mb-5 w-fit rounded-full border-2 border-[#2b2b2b] bg-[#efe9da] px-3 py-1 font-['Space_Grotesk'] text-[11px] uppercase tracking-[0.22em]">
                  New Password
                </span>
                <h2 className="font-['Bebas_Neue'] text-6xl leading-none">Set new password</h2>
                <p className="mt-2 font-['Space_Grotesk'] text-sm leading-6 opacity-65">Enter your new password below.</p>

                <div className="mt-8 space-y-4">
                  <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.12em]">
                    <span>New Password</span>
                    <input type="password" required placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-2xl border-2 border-[#2b2b2b]/20 bg-[#efe9da] px-4 py-3 font-normal normal-case tracking-normal outline-none placeholder:text-[#2b2b2b]/35 focus:border-[#2b2b2b] focus:shadow-[0_0_0_3px_rgba(43,43,43,0.14)]" />
                  </label>
                  <label className="block font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.12em]">
                    <span>Confirm Password</span>
                    <input type="password" required placeholder="Repeat your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-2 w-full rounded-2xl border-2 border-[#2b2b2b]/20 bg-[#efe9da] px-4 py-3 font-normal normal-case tracking-normal outline-none placeholder:text-[#2b2b2b]/35 focus:border-[#2b2b2b] focus:shadow-[0_0_0_3px_rgba(43,43,43,0.14)]" />
                  </label>
                </div>

                {errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border-2 border-red-400 bg-red-50 px-4 py-3 font-['Space_Grotesk'] text-sm text-red-600">
                    {errorMsg}
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border-2 border-[#2f7a4d] bg-[#2f7a4d]/10 px-4 py-3 font-['Space_Grotesk'] text-sm text-[#2f7a4d]">
                    ✅ {successMsg}
                  </motion.div>
                )}

                {!successMsg && (
                  <button type="submit" disabled={isLoading} className="mt-7 rounded-full border-2 border-[#2b2b2b] bg-[#2b2b2b] px-5 py-3 font-['Space_Grotesk'] font-bold text-[#f3eee1] shadow-[4px_4px_0_rgba(43,43,43,0.28)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                )}

                <button type="button" onClick={onBack} className="mt-4 rounded-full border-2 border-[#2b2b2b] bg-transparent px-5 py-3 font-['Space_Grotesk'] font-bold text-[#2b2b2b] transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  ← Back to Sign In
                </button>
              </motion.form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
