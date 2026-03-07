'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      const protectedRoutes = ['/dashboard', '/admin'];
      const authRoutes = ['/login', '/signup'];
      
      if (protectedRoutes.some(route => pathname?.startsWith(route)) && !isAuthenticated) {
        router.push('/login');
      }
      
      if (authRoutes.includes(pathname || '') && isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
