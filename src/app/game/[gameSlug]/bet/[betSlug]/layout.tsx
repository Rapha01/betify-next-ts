'use client';

import React, { ReactNode } from 'react';
import { BetProvider } from '@/contexts/bet-context';

interface BetLayoutProps {
  children: ReactNode;
  params: Promise<{ gameSlug: string; betSlug: string }>;
}

export default function BetLayout({ children, params }: BetLayoutProps) {
  const { betSlug } = React.use(params);

  return (
    <BetProvider betSlug={betSlug}>
      {children}
    </BetProvider>
  );
}
