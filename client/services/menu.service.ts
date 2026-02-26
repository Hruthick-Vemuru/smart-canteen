const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type Category =
  | "BREAKFAST"
  | "RICE_NOODLES"
  | "STARTERS"
  | "CURRIES"
  | "SPECIALS";

export type MenuItem = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category: Category;
  isVeg: boolean;
  isSpecial: boolean;
  available: boolean;
  rating?: number;
};


export async function getMenu(): Promise<MenuItem[]> {
  const res = await fetch(`${API_URL}/api/menu`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch menu");
  return res.json();
}

export async function createMenuItem(data: Partial<MenuItem>, role?: string) {
  const res = await fetch(`${API_URL}/api/menu`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-role": role || "",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function toggleAvailability(id: string, role?: string) {
  const res = await fetch(`${API_URL}/api/menu/${id}`, {
    method: "PATCH",
    headers: {
      "x-user-role": role || "",
    },
  });
  return res.json();
}
export async function deleteMenuItem(id: string, role?: string) {
  const res = await fetch(`${API_URL}/api/menu/${id}`, {
    method: "DELETE",
    headers: {
      "x-user-role": role || "",
    },
  });
  return res.json();
}
