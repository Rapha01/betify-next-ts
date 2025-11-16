'use client';

import React, { ReactNode } from 'react';
import { GameProvider, useGame } from '@/contexts/game-context';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { memberAPI } from '@/lib/api';
import { Trophy, Heart, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { GameNav } from '@/components/game-nav';

interface GameLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

function GameGuard({ children, gameId }: { children: ReactNode; gameId: string }) {
  const { game, loading, error } = useGame();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <GameBanner />
        <GameNav gameId={gameId} />
        <main className="flex-1">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Game
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!game) {
    return (
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
    );
  }

  return <>{children}</>;
}

interface GameLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

function GameBanner() {
  const { game, loading, member, refetchMember } = useGame();
  const { account } = useAuth();

  const handleFavoriteToggle = async () => {
    console.log('handleFavoriteToggle called', { game, member, account });
    if (!game || !account) {
      console.log('Missing game or account');
      return;
    }
    
    try {
      console.log('Calling API to toggle favorite');
      const newFavoritedState = !member?.is_favorited;
      await memberAPI.updateMember(game.id, account.id, 'is_favorited', newFavoritedState);
      console.log('API call successful, refetching member');
      // Refetch member to update the state
      refetchMember();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-muted animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
        </div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Loading text */}
        <div className="absolute inset-0 flex items-center px-6 md:px-8">
          <div className="text-white">
            <div className="h-8 md:h-12 bg-white/20 rounded mb-2 w-64"></div>
            <div className="h-4 bg-white/20 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-muted">
      {game.banner_url ? (
        <Image
          src={game.banner_url}
          alt={game.title}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <Trophy className="w-24 h-24 text-muted-foreground/30" />
        </div>
      )}
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      {/* Favorite Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="bg-black/60 hover:bg-black/80 text-white border-white/50"
          onClick={handleFavoriteToggle}
        >
          <Heart className={`w-5 h-5 ${member?.is_favorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </Button>
      </div>
      
      {/* Overlay with status badge */}
      <div className="absolute top-4 right-4">
        <Badge variant={game.is_active ? 'default' : 'secondary'} className="text-base px-4 py-2">
          {game.is_active ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Active
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 mr-2" />
              Inactive
            </>
          )}
        </Badge>
      </div>

      {/* Game Title and Date Inside Banner */}
      <div className="absolute inset-0 flex items-center px-6 md:px-8">
        <div className="text-white">
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">{game.title}</h1>
          <p className="text-white/90 mt-2 text-sm md:text-base drop-shadow-md">
            Created {new Date(game.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GameLayout({ children, params }: GameLayoutProps) {
  const { id } = React.use(params);

  return (
    <GameProvider gameId={id}>
      <GameGuard gameId={id}>
        <div className="flex flex-col min-h-screen">
          <GameBanner />
          <GameNav gameId={id} />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </GameGuard>
    </GameProvider>
  );
}
