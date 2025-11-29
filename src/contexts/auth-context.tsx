'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../lib/api';
import { LoadingSpinner } from '../components/ui/loading-spinner';

interface Account {
  id: string;
  username: string;
  email: string;
  role: string;
  is_email_verified: boolean;
  avatar_url: string;
  created_at: number;
}

interface AuthContextType {
  account: Account | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccount: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      // With cookie-based auth, we just try to fetch the current account
      // The cookie will be sent automatically
      try {
        console.log('Fetching current account...'); // Debug log
        const response = await authAPI.getCurrentAccount();
        console.log('Current account data received.'); // Debug log
        setAccount(response.account);
      } catch (error) {
        // Not authenticated or cookie expired
        // No need to clear anything - cookies are handled by the server
        console.log('No authenticated account found.'); // Debug log
        setAccount(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Logging in...'); // Debug log
      const response = await authAPI.login(email, password);
      console.log('Login successful.'); // Debug log
      setAccount(response.account);
    } catch (error) {
      console.error('Login failed:', error); // Debug log
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('Registering account...'); // Debug log
      const response = await authAPI.register(username, email, password);
      console.log('Registration successful.'); // Debug log
      // After registration, account might need to login separately
      // or we could auto-login them
    } catch (error) {
      console.error('Registration failed:', error); // Debug log
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...'); // Debug log
      await authAPI.logout();
      console.log('Logout successful.'); // Debug log
    } catch (error) {
      console.error('Logout failed:', error); // Debug log
      // Even if logout fails, clear local state
    } finally {
      setAccount(null);
    }
  };

  const refreshAccount = async () => {
    try {
      console.log('Refreshing account data...'); // Debug log
      const response = await authAPI.getCurrentAccount();
      console.log('Account data refreshed.'); // Debug log
      setAccount(response.account);
    } catch (error) {
      console.error('Failed to refresh account:', error); // Debug log
      setAccount(null);
      throw error;
    }
  };

  const value: AuthContextType = {
    account,
    login,
    register,
    logout,
    refreshAccount,
    isLoading,
  };

  // Block children during initial auth check
  if (isLoading) {
    return (
      <AuthContext.Provider value={value}>
        <LoadingSpinner size="xl" fullScreen />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
