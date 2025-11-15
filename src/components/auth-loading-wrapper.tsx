'use client';

import { useAuth } from '../contexts/auth-context';

interface AuthLoadingWrapperProps {
  children: React.ReactNode;
}

export function AuthLoadingWrapper({ children }: AuthLoadingWrapperProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}