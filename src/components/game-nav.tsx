'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Trophy, TrendingUp, MessageCircle, Settings, Home } from 'lucide-react';
import { useGame } from '@/contexts/game-context';
import { useAuth } from '@/contexts/auth-context';

interface GameNavProps {
  gameId: string;
}

export function GameNav({ gameId }: GameNavProps) {
  const pathname = usePathname();
  const { game } = useGame();
  const { user } = useAuth();

  const isGameCreator = game?.account_id && user?.id && game.account_id === user.id.toString();

  const navItems = [
    {
      title: 'Overview',
      href: `/games/${gameId}`,
      icon: Home,
    },
    {
      title: 'Bets',
      href: `/games/${gameId}/bets`,
      icon: Trophy,
    },
    {
      title: 'Leaderboard',
      href: `/games/${gameId}/leaderboard`,
      icon: TrendingUp,
    },
    {
      title: 'Chat',
      href: `/games/${gameId}/chat`,
      icon: MessageCircle,
    },
    ...(isGameCreator ? [{
      title: 'Settings',
      href: `/games/${gameId}/settings`,
      icon: Settings,
    }] : []),
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1 overflow-x-auto no-scrollbar py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
