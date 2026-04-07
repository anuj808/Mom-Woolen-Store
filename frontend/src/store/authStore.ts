import { create } from 'zustand';
import type { AuthState, User } from '@/types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user:            null,
  token:           null,
  isAuthenticated: false,
  isLoading:       true,

  // Called after successful OTP verify or profile setup
  setAuth: (user: User, token: string) => {
    localStorage.setItem('wc_token', token);
    localStorage.setItem('wc_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  // Partial update after profile setup
  updateUser: (partial: Partial<User>) =>
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...partial };
      localStorage.setItem('wc_user', JSON.stringify(updated));
      return { user: updated };
    }),

  logout: () => {
    localStorage.removeItem('wc_token');
    localStorage.removeItem('wc_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Called once on app mount to restore session from localStorage
  initAuth: () => {
    if (typeof window === 'undefined') return;
    try {
      const token = localStorage.getItem('wc_token');
      const raw   = localStorage.getItem('wc_user');
      if (token && raw) {
        const user = JSON.parse(raw) as User;
        set({ user, token, isAuthenticated: true, isLoading: false });
        return;
      }
    } catch {
      localStorage.removeItem('wc_token');
      localStorage.removeItem('wc_user');
    }
    set({ isLoading: false });
  },
}));