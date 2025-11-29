'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Trophy, TrendingUp, MessageCircle, Settings, Home, Sparkles } from 'lucide-react';
import { useGame } from '@/contexts/game-context';
import { useAuth } from '@/contexts/auth-context';

interface GameNavProps {
  gameSlug: string;
}

export function GameNav({ gameSlug }: GameNavProps) {
  const pathname = usePathname();
  const { game } = useGame();
  const { account } = useAuth();

  const isGameCreator = game?.account_id && account?.id && game.account_id === account.id;

  const navItems = [
    {
      title: 'Overview',
      href: `/game/${gameSlug}`,
      icon: Home
    },
    {
      title: 'Bets',
      href: `/game/${gameSlug}/bets`,
      icon: Trophy
    },
    {
      title: 'Leaderboard',
      href: `/game/${gameSlug}/leaderboard`,
      icon: TrendingUp
    },
    {
      title: 'Chat',
      href: `/game/${gameSlug}/chat`,
      icon: MessageCircle,
      gradient: 'from-purple-500 to-pink-500',
    },
    ...(isGameCreator ? [{
      title: 'Settings',
      href: `/game/${gameSlug}/settings`,
      icon: Settings
    }] : []),
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-navbar-border bg-navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-navbar-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-navbar-primary'
                    : 'text-navbar-foreground/60 hover:text-navbar-foreground hover:bg-navbar-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
