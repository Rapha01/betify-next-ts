'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/game-context';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { memberAPI } from '@/lib/api';
import { Trophy, Heart, CheckCircle, XCircle, Users, Sparkles, TrendingUp, Coins, Star, Bookmark, Pin } from 'lucide-react';

export function GameBanner() {
  const { game, loading, member, refetchMember } = useGame();
  const { account } = useAuth();
  const router = useRouter();

  const handleFavoriteToggle = async () => {
    if (!account) {
      // Redirect to login if not logged in
      router.push('/login');
      return;
    }
    
    if (!game) {
      return;
    }
    
    try {
      const newFavoritedState = !member?.is_favorited;
      await memberAPI.updateMember(game.id, account.id, 'is_favorited', newFavoritedState);
      // Refetch member to update the state
      refetchMember();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] rounded-b-2xl overflow-hidden bg-muted animate-pulse">
        {/* Loading content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 bg-muted-foreground/20 rounded-xl" />
            <div className="h-10 w-24 bg-muted-foreground/20 rounded-full" />
          </div>
          
          <div className="space-y-4">
            <div className="h-12 md:h-16 bg-muted-foreground/20 rounded-xl w-3/4 max-w-md" />
            <div className="h-6 bg-muted-foreground/20 rounded-lg w-1/2 max-w-xs" />
          </div>
        </div>
      </div>
    );
  }

  if (!game) return null;

  const currencyBalance = member?.currency ?? game.start_currency;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-b-2xl overflow-hidden bg-background">
      {/* Background Image */}
      {game.banner_url ? (
        <div className="absolute inset-0">
          <Image
            src={game.banner_url}
            alt={game.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="w-32 h-32 text-foreground/10" />
          </div>
        </div>
      )}
      
      {/* Top Bar - Favorite */}
      <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-start z-20">
        {/* Favorite Button */}
        <Button
          variant="outline"
          size="sm"
          className="backdrop-blur-xl !bg-background/100 border border-border hover:!bg-background/100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 rounded-2xl w-12 h-12 md:w-14 md:h-14 p-0"
          onClick={handleFavoriteToggle}
        >
          <Pin className={`!w-6 !h-6 md:!w-8 md:!h-8 transition-all duration-300 ${member?.is_favorited ? 'fill-foreground text-foreground rotate-0' : 'text-muted-foreground hover:text-foreground rotate-45'}`} />
        </Button>
      </div>

      {/* Bottom Content - Title, Stats & Currency */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
        <div className="space-y-6">
          {/* Title & Description */}
          <div className="space-y-2">
            <h1 
              className="text-4xl md:text-6xl font-black text-banner-title leading-tight"
              style={{
                textShadow: '0 0 20px color-mix(in srgb, var(--banner-title-glow) 80%, transparent), 0 0 40px color-mix(in srgb, var(--banner-title-glow) 60%, transparent), 0 2px 4px color-mix(in srgb, var(--banner-title-glow) 90%, transparent)'
              }}
            >
              {game.title}
            </h1>
          </div>

          {/* Currency Balance Card - Always visible */}
          <div className="backdrop-blur-xl bg-background/100 border border-border rounded-2xl p-5 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] max-w-md">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs md:text-sm font-medium uppercase tracking-wider">Your Balance</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl md:text-4xl font-black text-foreground drop-shadow-lg leading-tight">{Number(currencyBalance)}</span>
                  <span className="text-xl md:text-2xl font-bold text-foreground leading-tight">{game.currency_name}</span>
                </div>
              </div>
              <div className="p-4 bg-warning/10 rounded-xl backdrop-blur-sm">
                <Coins className="h-8 w-8 text-warning" />
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
}
