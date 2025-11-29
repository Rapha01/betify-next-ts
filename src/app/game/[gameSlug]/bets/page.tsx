'use client';

import { useState, useEffect } from 'react';
import { CreateBetDialog } from '@/components/game/create-bet-dialog';
import { BetHeaderCard } from '@/components/bet/bet-header-card';
import { betAPI } from '@/lib/api';
import { useGame } from '@/contexts/game-context';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Bet } from '@/types/bet';

export default function BetsPage() {
  const { game } = useGame();
  
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBets = async () => {
    if (!game?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching bets...'); // Debug log
      const data = await betAPI.getBetsByGameId(game.id);
      console.log('Bets data received.'); // Debug log
      setBets(data.bets || data || []);
    } catch (err: any) {
      console.error('Error fetching bets:', err);
      setError(err.message || 'Failed to load bets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, [game?.id]);

  const handleBetCreated = () => {
    // Refresh the bets list after creating a new bet
    fetchBets();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Create Bet Button */}
      {game && <CreateBetDialog gameId={game.id} onBetCreated={handleBetCreated} />}

      {/* Bets List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="xl" />
        </div>
      ) : error ? (
        <p className="text-destructive text-center py-8">{error}</p>
      ) : bets.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No bets yet. Create your first bet to get started!
        </p>
      ) : game ? (
        <div className="space-y-4">
          {bets.map((bet: Bet) => (
            <BetHeaderCard 
              key={bet.id} 
              bet={bet}
              gameSlug={game.slug}
              showDescription={false}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
