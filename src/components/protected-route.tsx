'use client';

import { useAuth } from '../contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  redirectTo = '/login',
  requireAuth = true
}: ProtectedRouteProps) {
  const { account, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete
    if (!isLoading) {
      if (requireAuth && !account) {
        router.push(redirectTo);
      } else if (!requireAuth && account) {
        // For routes that should only be accessible when NOT logged in (like login page)
        router.push('/mygames');
      }
    }
  }, [account, isLoading, requireAuth, redirectTo, router]);

  // AuthProvider at layout level handles loading state with built-in loading spinner
  // Just prevent flash of unauthorized content during redirect
  if (!isLoading && requireAuth && !account) {
    return null; // Will redirect via useEffect
  }

  if (!isLoading && !requireAuth && account) {
    return null; // Will redirect via useEffect
  }

  // Only render children when auth state is verified
  return <>{children}</>;
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { 
    requireAuth?: boolean; 
    redirectTo?: string;
  }
) {
  const { requireAuth = true, redirectTo } = options || {};

  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute 
        requireAuth={requireAuth} 
        redirectTo={redirectTo}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}