'use client';

import React, { ReactNode } from 'react';
import { GameProvider } from '@/contexts/game-context';
import { GameNav } from '@/components/game-nav';

interface GameLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default function GameLayout({ children, params }: GameLayoutProps) {
  const { id } = React.use(params);

  return (
    <GameProvider gameId={id}>
      <div className="flex flex-col min-h-screen">
        <GameNav gameId={id} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </GameProvider>
  );
}
