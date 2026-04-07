'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Wrap your root layout with this.
 * On every page load it reads localStorage and restores the user session
 * into Zustand — so the navbar, protected pages, etc. all know who is logged in.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <>{children}</>;
}