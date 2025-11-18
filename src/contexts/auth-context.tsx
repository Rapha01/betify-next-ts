'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, accountAPI, getToken, setToken } from '../lib/api';

interface Account {
  id: string;
  username: string;
  email: string;
  role: string;
  is_email_verified: boolean;
  avatarUrl: string;
  created_at: number;
}

interface AuthContextType {
  account: Account | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateAccount: (updates: Partial<Account & { password?: string }>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setAccount(response.account);
        } catch (error) {
          // Token might be invalid, clear it
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      setAccount(response.account);
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(username, email, password);
      // After registration, account might need to login separately
      // or we could auto-login them
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Even if logout fails, clear local state
    } finally {
      setAccount(null);
    }
  };

  const updateAccount = async (updates: Partial<Account>) => {
    if (!account) throw new Error('No account loaded');
    try {
      await accountAPI.updateAccount(account.id, updates);
      setAccount({ ...account, ...updates });
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    account,
    login,
    register,
    logout,
    updateAccount,
    isLoading,
  };

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
