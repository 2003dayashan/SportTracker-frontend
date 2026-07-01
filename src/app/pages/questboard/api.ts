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

const API_BASE = "/api/quests";

export async function fetchQuests(): Promise<Quest[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch quests");
  return res.json();
}

export async function fetchQuestsByService(service: ServiceType): Promise<Quest[]> {
  const res = await fetch(`${API_BASE}/service/${service}`);
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

export async function fetchPendingSubmissions(): Promise<QuestSubmission[]> {
  const res = await fetch(`${API_BASE}/submissions/pending`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch pending submissions");
  return res.json();
}

export async function approveSubmission(submissionId: string): Promise<QuestSubmission> {
  const res = await fetch(`${API_BASE}/submissions/${submissionId}/approve`, { method: "PUT", credentials: "include" });
  if (!res.ok) throw new Error("Failed to approve submission");
  return res.json();
}
