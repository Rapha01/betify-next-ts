'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gameAPI } from '@/lib/api';

export interface Game {
  id: string;
  account_id: string;
  title: string;
  description: string;
  banner_url: string;
  bet_count: number;
  member_count: number;
  is_active: boolean;
  created_at: number;
}

interface GameContextType {
  game: Game | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
  gameId: string;
}

export function GameProvider({ children, gameId }: GameProviderProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGame = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gameAPI.getGameById(gameId);
      setGame(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load game';
      setError(errorMessage);
      console.error('Error fetching game:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameId) {
      fetchGame();
    }
  }, [gameId]);

  return (
    <GameContext.Provider value={{ game, loading, error, refetch: fetchGame }}>
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
