'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gameAPI, memberAPI } from '@/lib/api';
import { useAuth } from './auth-context';

export interface Game {
  id: string;
  account_id: string;
  title: string;
  slug: string;
  description: string;
  banner_url: string;
  language: string;
  currency_name: string;
  start_currency: number;
  is_public: boolean;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

  const fetchGame = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching game with slug:', gameSlug); // Debug log
      const data = await gameAPI.getGameBySlug(gameSlug);
      console.log('Game data received:', data); // Debug log
      setGame(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load game';
      console.error('Error fetching game:', err); // Debug log
      setError(errorMessage);
      console.error('Error fetching game:', err);
    } finally {
      setLoading(false);
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
      const data = await memberAPI.getMemberByGameAndAccountId(game.id, account.id);
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

  return (
    <GameContext.Provider value={{ game, loading, error, refetch: fetchGame, updateGame, member, memberLoading, memberError, refetchMember: fetchMember }}>
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
