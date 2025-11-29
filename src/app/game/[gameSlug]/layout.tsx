'use client';

import React, { ReactNode } from 'react';
import { GameProvider } from '@/contexts/game-context';
import { GameNav } from '@/components/game/game-nav';
import { GameBanner } from '@/components/game/game-banner';

interface GameLayoutProps {
  children: ReactNode;
  params: Promise<{ gameSlug: string }>;
}

export default function GameLayout({ children, params }: GameLayoutProps) {
  const { gameSlug } = React.use(params);

  return (
    <GameProvider gameSlug={gameSlug}>
      <div className="flex flex-col min-h-screen">
        <div className="bg-navbar">
          <GameBanner />
        </div>
        <GameNav gameSlug={gameSlug} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </GameProvider>
  );
}
