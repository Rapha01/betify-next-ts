import { Card } from '@/components/ui/card';
import { Users, Coins, TrendingUp } from 'lucide-react';
import { Bet } from '@/types/bet';

interface BetStatsCardsProps {
  bet: Bet;
}

export function BetStatsCards({ bet }: BetStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Users */}
      <Card>
        <div className="px-4 py-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Participants</p>
              <p className="text-2xl font-bold">{bet.member_count}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </Card>

      {/* Total in Pot */}
      <Card>
        <div className="px-4 py-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total in Pot</p>
              <p className="text-2xl font-bold">{bet.in_pot.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
              <Coins className="w-5 h-5 text-warning" />
            </div>
          </div>
        </div>
      </Card>

      {/* Average Tip */}
      <Card>
        <div className="px-4 py-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Avg. Tip</p>
              <p className="text-2xl font-bold">
                {bet.member_count > 0 
                  ? Math.round(bet.in_pot / bet.member_count).toLocaleString() 
                  : '0'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-info" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
