'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gameAPI, memberAPI } from '@/lib/api';
import { useAuth } from './auth-context';
import { Game, Member } from '@/types/game';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { GameNav } from '@/components/game/game-nav';

interface GameContextType {
  game: Game | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateGame: (updates: Partial<Game>) => Promise<void>;
  member: Member | null;
  memberLoading: boolean;
  memberError: string | null;
  refetchMember: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
  gameSlug: string;
}

export function GameProvider({ children, gameSlug }: GameProviderProps) {
  const { account } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

  const fetchGame = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching game data...'); // Debug log
      const data = await gameAPI.getGameBySlug(gameSlug);
      console.log('Game data received.'); // Debug log
      setGame(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load game';
      console.error('Error fetching game:', err); // Debug log
      setError(errorMessage);
      console.error('Error fetching game:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMember = async () => {
    if (!account || !game) {
      setMember(null);
      setMemberLoading(false);
      setMemberError(null);
      return;
    }
    try {
      setMemberLoading(true);
      setMemberError(null);
      console.log('Fetching member data...'); // Debug log
      const data = await memberAPI.getMemberByGameAndAccountId(game.id, account.id);
      console.log('Member data received.'); // Debug log
      setMember(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load member';
      setMemberError(errorMessage);
      setMember(null);
      console.error('Error fetching member:', err);
    } finally {
      setMemberLoading(false);
    }
  };

  const updateGame = async (updates: Partial<Game>) => {
    if (!game) throw new Error('No game loaded');
    try {
      await gameAPI.updateGame(game.id, updates);
      setGame({ ...game, ...updates });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (gameSlug) {
      fetchGame();
    }
  }, [gameSlug]);

  useEffect(() => {
    if (game) {
      fetchMember();
    }
  }, [game, account]);

  const value = { 
    game, 
    isLoading, 
    error, 
    refetch: fetchGame, 
    updateGame, 
    member, 
    memberLoading, 
    memberError, 
    refetchMember: fetchMember 
  };

  // Block all children until game data is loaded - show complete page skeleton
  if (isLoading) {
    return (
      <GameContext.Provider value={value}>
        <div className="min-h-screen">
          {/* Loading Banner Skeleton */}
          <div className="relative w-full h-[400px] md:h-[500px] rounded-b-2xl overflow-hidden bg-muted animate-pulse">
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 bg-muted-foreground/20 rounded-xl" />
                <div className="h-10 w-24 bg-muted-foreground/20 rounded-full" />
              </div>
              
              <div className="space-y-4">
                <div className="h-12 md:h-16 bg-muted-foreground/20 rounded-xl w-3/4 max-w-md" />
                <div className="h-6 bg-muted-foreground/20 rounded-lg w-1/2 max-w-xs" />
              </div>
            </div>
          </div>

          {/* Game Navigation - actual component, only needs gameSlug */}
          <GameNav gameSlug={gameSlug} />

          {/* Content Area Loading Spinner */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="xl" />
            </div>
          </div>
        </div>
      </GameContext.Provider>
    );
  }

  // Show error state
  if (error) {
    return (
      <GameContext.Provider value={value}>
        <div className="container mx-auto px-4 py-8">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Error Loading Game
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </div>
      </GameContext.Provider>
    );
  }

  // Show not found state
  if (!game && !isLoading) {
    return (
      <GameContext.Provider value={value}>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Game Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">The game you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </GameContext.Provider>
    );
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
