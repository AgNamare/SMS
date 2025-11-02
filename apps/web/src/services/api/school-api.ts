// src/services/api/school-api.ts
export const schoolApi = {
  async getAll() {
    const res = await fetch(`http://localhost:3000/api/schools`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch schools");
    return res.json();
  },
};
