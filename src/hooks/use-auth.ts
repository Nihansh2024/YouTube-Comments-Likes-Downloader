'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export function useAuth() {
  const { user, isLoading, isAuthenticated, checkAuth, logout, setUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    setUser,
    checkAuth,
  };
}
