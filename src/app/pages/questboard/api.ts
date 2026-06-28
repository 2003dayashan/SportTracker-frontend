export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
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
  claimedBy?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchQuests = async (categoryId?: string): Promise<Quest[]> => {
  const url = categoryId ? `/api/quests?category=${categoryId}` : `/api/quests`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch quests");
  return res.json();
};

export const fetchQuestById = async (id: string): Promise<Quest> => {
  const res = await fetch(`/api/quests/${id}`);
  if (!res.ok) throw new Error("Failed to fetch quest");
  return res.json();
};

export const claimQuest = async (id: string): Promise<Quest> => {
  const res = await fetch(`/api/quests/${id}/claim`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Failed to claim quest");
  return res.json();
};

export const submitQuest = async (id: string, formData: FormData): Promise<Quest> => {
  const res = await fetch(`/api/quests/${id}/submit`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to submit quest");
  return res.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch(`/api/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};
