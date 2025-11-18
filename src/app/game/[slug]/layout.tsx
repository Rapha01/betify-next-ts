'use client';

import React, { ReactNode } from 'react';
import { GameProvider, useGame } from '@/contexts/game-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { GameNav } from '@/components/game-nav';
import { GameBanner } from '@/components/game-banner';

interface GameLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

function GameGuard({ children, gameSlug }: { children: ReactNode; gameSlug: string }) {
  const { game, loading, error } = useGame();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <GameBanner />
        <GameNav gameSlug={gameSlug} />
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

export default function GameLayout({ children, params }: GameLayoutProps) {
  const { slug } = React.use(params);

  return (
    <GameProvider gameSlug={slug}>
      <GameGuard gameSlug={slug}>
        <div className="flex flex-col min-h-screen">
          <GameBanner />
          <GameNav gameSlug={slug} />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </GameGuard>
    </GameProvider>
  );
}
