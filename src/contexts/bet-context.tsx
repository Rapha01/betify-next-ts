'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { betAPI } from '@/lib/api';
import { Bet } from '@/types/bet';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface BetContextType {
  bet: Bet | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateBet: (updates: Partial<Bet>) => Promise<void>;
}

const BetContext = createContext<BetContextType | undefined>(undefined);

interface BetProviderProps {
  children: ReactNode;
  betSlug: string;
}

export function BetProvider({ 
  children, 
  betSlug
}: BetProviderProps) {
  const [bet, setBet] = useState<Bet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching bet data...'); // Debug log
      const data = await betAPI.getBetBySlug(betSlug);
      console.log('Bet data received.'); // Debug log
      setBet(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load bet';
      console.error('Error fetching bet:', err); // Debug log
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBet = async (updates: Partial<Bet>) => {
    if (!bet) throw new Error('No bet loaded');
    try {
      await betAPI.updateBet(bet.id, updates);
      setBet({ ...bet, ...updates });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (betSlug) {
      fetchBet();
    }
  }, [betSlug]);

  const value = { 
    bet, 
    isLoading, 
    error, 
    refetch: fetchBet, 
    updateBet 
  };

  // Block children during loading
  if (isLoading) {
    return (
      <BetContext.Provider value={value}>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="xl" />
          </div>
        </div>
      </BetContext.Provider>
    );
  }

  // Block children on error
  if (error) {
    return (
      <BetContext.Provider value={value}>
        <div className="container mx-auto px-4 py-8">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Error Loading Bet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </div>
      </BetContext.Provider>
    );
  }

  // Block children if bet not found
  if (!bet && !isLoading) {
    return (
      <BetContext.Provider value={value}>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Bet Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">The bet you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </BetContext.Provider>
    );
  }

  return (
    <BetContext.Provider value={value}>
      {children}
    </BetContext.Provider>
  );
}

export function useBet() {
  const context = useContext(BetContext);
  if (context === undefined) {
    throw new Error('useBet must be used within a BetProvider');
  }
  return context;
}
