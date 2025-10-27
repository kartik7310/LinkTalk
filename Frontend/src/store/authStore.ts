import { User } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  _id: string;
  email: string;
  userName: string;
  fullName: string;
  connectCode: string;
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}
            
export const userAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      
    }),
    {
      name: "auth-storage",
    }
  )
);

console.log("data",User);