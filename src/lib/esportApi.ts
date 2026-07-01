// src/lib/esportApi.ts
//
// Central API client for the E-Sport module.
// Talks to the Spring Boot backend (default port 8080).
//
// IMPORTANT: create a `.env` file in the project root with:
//   VITE_API_URL=http://localhost:8080
//
// All write operations (POST/PUT/DELETE) require an active login
// session (cookie), because SecurityConfig protects them with
// `.authenticated()` / `.hasRole("ADMIN")`. Make sure you've already
// signed in via /api/auth/signin before calling create/update/delete.

const BASE_URL = (import.meta as any).env.VITE_API_URL || "";

// ---------- Types (mirrors the Java models/DTOs) ----------

export type TournamentFormat = "SINGLE_ELIMINATION" | "ROUND_ROBIN";
export type TournamentStatus = "UPCOMING" | "ONGOING" | "COMPLETED";
export type MatchStatus = "SCHEDULED" | "LIVE" | "COMPLETED";

export interface Tournament {
  id: string;
  name: string;
  game: string;
  format: TournamentFormat;
  status: TournamentStatus;
  startDate: string;   // ISO datetime string
  endDate: string;     // ISO datetime string
  maxTeams: number;
  teamIds: string[];
  organizerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TournamentRequest {
  name: string;
  game: string;
  format: TournamentFormat;
  status: TournamentStatus;
  startDate: string; // ISO datetime, e.g. new Date().toISOString()
  endDate: string;   // must be in the future (backend validates @Future)
  maxTeams: number;
}

export interface Team {
  id: string;
  name: string;
  tournamentId: string;
  playerIds: string[];
  captainUserId: string;
  logoUrl: string;
  createdAt?: string;
}

export interface TeamRequest {
  name: string;
  tournamentId?: string;
  logoUrl?: string;
}

export interface Player {
  id: string;
  userId: string;
  teamId: string;
  username: string;
  role: string;
  stats: Record<string, unknown>; // free-form map (kd, rank, etc. if you store them here)
}

export interface PlayerRequest {
  username: string;
  teamId?: string;
  role?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  teamAId: string;
  teamBId: string;
  scoreA: number;
  scoreB: number;
  winnerId: string | null;
  status: MatchStatus;
  scheduledAt: string;
  completedAt: string | null;
}

export interface MatchScoreUpdateRequest {
  scoreA: number;
  scoreB: number;
}

export interface StandingDto {
  teamId: string;
  teamName: string;
  wins: number;
  losses: number;
  points: number;
  played: number;
}

export interface DashboardStats {
  tournaments: number;
  teams: number;
  players: number;
  matches: number;
}

// Spring Data's Page<T> wrapper shape
export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index
  size: number;
  last: boolean;
  first: boolean;
}

// ---------- Core fetch wrapper ----------

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", // sends the session cookie set by /api/auth/signin
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
      // no JSON body, ignore
    }
    throw new ApiError(res.status, message);
  }

  // 204 No Content (used by DELETE endpoints)
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ---------- Tournaments ----------

export const TournamentApi = {
  list: (params?: {
    status?: TournamentStatus;
    game?: string;
    page?: number;
    size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.game) qs.set("game", params.game);
    qs.set("page", String(params?.page ?? 0));
    qs.set("size", String(params?.size ?? 10));
    return request<SpringPage<Tournament>>(`/api/tournaments?${qs}`);
  },

  get: (id: string) => request<Tournament>(`/api/tournaments/${id}`),

  search: (q: string) =>
    request<Tournament[]>(`/api/tournaments/search?q=${encodeURIComponent(q)}`),

  create: (body: TournamentRequest) =>
    request<Tournament>(`/api/tournaments`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: TournamentRequest) =>
    request<Tournament>(`/api/tournaments/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  remove: (id: string) =>
    request<void>(`/api/tournaments/${id}`, { method: "DELETE" }),
};

// ---------- Teams ----------

export const TeamApi = {
  list: () => request<Team[]>(`/api/teams`),

  get: (id: string) => request<Team>(`/api/teams/${id}`),

  search: (q: string) =>
    request<Team[]>(`/api/teams/search?q=${encodeURIComponent(q)}`),

  create: (body: TeamRequest) =>
    request<Team>(`/api/teams`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: TeamRequest) =>
    request<Team>(`/api/teams/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  remove: (id: string) =>
    request<void>(`/api/teams/${id}`, { method: "DELETE" }),
};

// ---------- Players ----------

export const PlayerApi = {
  list: (teamId?: string) =>
    request<Player[]>(`/api/players${teamId ? `?teamId=${teamId}` : ""}`),

  get: (id: string) => request<Player>(`/api/players/${id}`),

  search: (q: string) =>
    request<Player[]>(`/api/players/search?q=${encodeURIComponent(q)}`),

  create: (body: PlayerRequest) =>
    request<Player>(`/api/players`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: PlayerRequest) =>
    request<Player>(`/api/players/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  remove: (id: string) =>
    request<void>(`/api/players/${id}`, { method: "DELETE" }),
};

// ---------- Matches ----------

export const MatchApi = {
  get: (id: string) => request<Match>(`/api/matches/${id}`),

  create: (body: Omit<Match, "id">) =>
    request<Match>(`/api/matches`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateScore: (id: string, body: MatchScoreUpdateRequest) =>
    request<Match>(`/api/matches/${id}/score`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};

// ---------- Bracket & Standings ----------

export const BracketApi = {
  get: (tournamentId: string) =>
    request<Match[]>(`/api/tournaments/${tournamentId}/bracket`),
};

export const StandingsApi = {
  get: (tournamentId: string) =>
    request<StandingDto[]>(`/api/tournaments/${tournamentId}/standings`),
};

// ---------- Admin Dashboard ----------

export const DashboardApi = {
  stats: () => request<DashboardStats>(`/api/admin/dashboard`),
};

export { ApiError };
