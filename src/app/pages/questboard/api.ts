export interface User {
  id: string;
  username: string;
  email: string;
  role: "USER" | "GUILD_MASTER" | "ADMIN";
  xp?: number;
  level?: number;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "CLAIMED" | "SUBMITTED" | "COMPLETED" | "REJECTED" | "EXPIRED";
  difficulty: "EASY" | "MEDIUM" | "HARD" | "LEGENDARY";
  rewardXp: number;
  deadline: string;
  categoryId: string;
  createdBy: string;
  claimedBy?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  notDeleted?: boolean;
}

export interface QuestSubmission {
  id: string;
  questId: string;
  userId: string;
  proofText: string;
  proofFileUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    let errMsg = "API Request Failed";
    try {
      const errJson = JSON.parse(errorText);
      errMsg = errJson.message || errMsg;
    } catch {
      errMsg = errorText || errMsg;
    }
    throw new Error(errMsg);
  }
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text);
  } catch {
    return text as unknown as T;
  }
}

// User Profile
export const fetchMyProfile = async (): Promise<User> => {
  const res = await fetch(`/api/questboard/auth/me`, { credentials: "include" });
  return handleResponse<User>(res);
};

// Quests
export const fetchQuests = async (categoryId?: string, status?: string): Promise<{content: Quest[], last: boolean}> => {
  const params = new URLSearchParams();
  if (categoryId) params.append("categoryId", categoryId);
  if (status) params.append("status", status);
  params.append("size", "50");
  
  const res = await fetch(`/api/quests?${params.toString()}`);
  return handleResponse(res);
};

export const fetchQuestById = async (id: string): Promise<Quest> => {
  const res = await fetch(`/api/quests/${id}`);
  return handleResponse(res);
};

export const createQuest = async (questData: Partial<Quest>): Promise<Quest> => {
  const res = await fetch(`/api/quests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(questData)
  });
  return handleResponse(res);
};

export const updateQuest = async (id: string, questData: Partial<Quest>): Promise<Quest> => {
  const res = await fetch(`/api/quests/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(questData)
  });
  return handleResponse(res);
};

export const deleteQuest = async (id: string): Promise<{deleted: boolean}> => {
  const res = await fetch(`/api/quests/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  return handleResponse(res);
};

// Quest Actions
export const claimQuest = async (id: string): Promise<Quest> => {
  const res = await fetch(`/api/quests/${id}/claim`, { method: "POST", credentials: "include" });
  return handleResponse(res);
};

export const submitQuest = async (id: string, formData: FormData): Promise<QuestSubmission> => {
  const res = await fetch(`/api/quests/${id}/submit`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return handleResponse(res);
};

export const approveSubmission = async (submissionId: string, approved: boolean): Promise<QuestSubmission> => {
  const res = await fetch(`/api/quests/submissions/${submissionId}/approve?approved=${approved}`, {
    method: "POST",
    credentials: "include"
  });
  return handleResponse(res);
};

export const fetchPendingSubmissions = async (): Promise<QuestSubmission[]> => {
  const res = await fetch(`/api/quests/submissions/pending`, { credentials: "include" });
  return handleResponse(res);
};

// Categories
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch(`/api/categories`);
  return handleResponse(res);
};

export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
  const res = await fetch(`/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(categoryData)
  });
  return handleResponse(res);
};

export const fetchLeaderboard = async (): Promise<User[]> => {
  const res = await fetch(`/api/quests/leaderboard`);
  return handleResponse(res);
};
