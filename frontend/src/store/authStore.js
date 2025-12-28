import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const getInitialAuthState = () => {
  if (typeof window === "undefined") {
    return { user: null, token: null, isAuthenticated: false };
  }

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  try {
    const user = userRaw ? JSON.parse(userRaw) : null;
    return {
      user,
      token,
      isAuthenticated: Boolean(token && user),
    };
  } catch (e) {
    return { user: null, token: null, isAuthenticated: false };
  }
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...getInitialAuthState(),
      hydrated: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

      updateUser: (user) => set({ user }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated?.();
      },
    }
  )
);
