'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gameAPI, memberAPI } from '@/lib/api';
import { useAuth } from './auth-context';

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

export interface Member {
  id: string;
  game_id: string;
  account_id: string;
  is_moderator: boolean;
  is_banned: boolean;
  is_favorited: boolean;
  currency: number;
  created_at: number;
}

interface GameContextType {
  game: Game | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  member: Member | null;
  memberLoading: boolean;
  memberError: string | null;
  refetchMember: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
  gameId: string;
}

export function GameProvider({ children, gameId }: GameProviderProps) {
  const { account } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

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

  const fetchMember = async () => {
    if (!account) {
      setMember(null);
      setMemberLoading(false);
      setMemberError(null);
      return;
    }
    try {
      setMemberLoading(true);
      setMemberError(null);
      const data = await memberAPI.getMemberByGameAndAccountId(gameId, account.id);
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

  useEffect(() => {
    if (gameId) {
      fetchGame();
      fetchMember();
    }
  }, [gameId, account]);

  return (
    <GameContext.Provider value={{ game, loading, error, refetch: fetchGame, member, memberLoading, memberError, refetchMember: fetchMember }}>
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
