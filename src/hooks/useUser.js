import { create } from "zustand";

export const useUser = create((set) => ({
  role: "",
  username: "",
  setRole: (role) => set({ role: role }),
  setUsername: (username) => set({ username: username }),
}));
