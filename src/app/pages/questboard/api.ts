export type User = {
  id: string;
  username: string;
  role: string;
};

export type ServiceType = "ESPORT" | "SPORT";

export type Quest = {
  id: string;
  title: string;
  description: string;
  serviceType: ServiceType;
  points: number;
  difficulty?: number;
  isLiveEventRelated?: boolean;
  relatedMatchId?: string;
};

export type SubmissionStatus = "CLAIMED" | "SUBMITTED" | "APPROVED" | "REJECTED";

export type QuestSubmission = {
  id: string;
  userId: string;
  username: string;
  questId: string;
  questTitle: string;
  points: number;
  status: SubmissionStatus;
  timestamp: string;
};

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const API_BASE = "/api/quests";

export async function fetchQuests(page: number = 0, size: number = 10): Promise<PaginatedResponse<Quest>> {
  const res = await fetch(`${API_BASE}?page=${page}&size=${size}`);
  if (!res.ok) throw new Error("Failed to fetch quests");
  return res.json();
}

export async function fetchQuestById(id: string): Promise<Quest> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch quest");
  return res.json();
}

export async function fetchQuestsByService(service: ServiceType, page: number = 0, size: number = 10): Promise<PaginatedResponse<Quest>> {
  const res = await fetch(`${API_BASE}/service/${service}?page=${page}&size=${size}`);
  if (!res.ok) throw new Error("Failed to fetch quests");
  return res.json();
}

export async function createQuest(quest: Partial<Quest>): Promise<Quest> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quest),
  });
  if (!res.ok) throw new Error("Failed to create quest");
  return res.json();
}

export async function updateQuest(id: string, quest: Partial<Quest>): Promise<Quest> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quest),
  });
  if (!res.ok) throw new Error("Failed to update quest");
  return res.json();
}

export async function deleteQuest(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete quest");
}

// --- User Progression ---

export async function claimQuest(questId: string): Promise<QuestSubmission> {
  const res = await fetch(`${API_BASE}/${questId}/claim`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Failed to claim quest");
  return res.json();
}

export async function submitQuest(questId: string): Promise<QuestSubmission> {
  const res = await fetch(`${API_BASE}/${questId}/submit`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Failed to submit quest");
  return res.json();
}

export async function fetchMyProgress(): Promise<{ points: number, submissions: QuestSubmission[] }> {
  const res = await fetch(`${API_BASE}/my-progress`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
}

export async function fetchLeaderboard(): Promise<{ userId: string, username: string, points: number }[]> {
  const res = await fetch(`${API_BASE}/leaderboard`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

// --- Admin ---

export async function fetchPendingSubmissions(page: number = 0, size: number = 10): Promise<PaginatedResponse<QuestSubmission>> {
  const res = await fetch(`${API_BASE}/submissions/pending?page=${page}&size=${size}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch pending submissions");
  return res.json();
}

export async function approveSubmission(submissionId: string): Promise<QuestSubmission> {
  const res = await fetch(`${API_BASE}/submissions/${submissionId}/approve`, { method: "PUT", credentials: "include" });
  if (!res.ok) throw new Error("Failed to approve submission");
  return res.json();
}
