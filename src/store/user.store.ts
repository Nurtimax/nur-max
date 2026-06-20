import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  name: string;
  email: string;
  photoUrl?: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: { email: "", name: "", photoUrl: "https://picsum.photos/200/300" },
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage",
    }
  )
);
