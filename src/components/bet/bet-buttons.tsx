import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Clock, Ban, CheckCircle } from 'lucide-react';
import { Bet } from '@/types/bet';

interface BetButtonsProps {
  bet: Bet;
  isLoggedIn?: boolean;
  canManageBet?: boolean;
}

export function BetButtons({ bet, isLoggedIn = false, canManageBet = false }: BetButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Create Tip Button - Visible to all */}
      <Button size="lg" className="flex-1 min-w-[200px]">
        <Plus className="w-4 h-4 mr-2" />
        Create Tip
      </Button>

      {/* Admin/Moderator Actions */}
      {canManageBet && (
        <>
          <Separator orientation="vertical" className="h-10 hidden md:block" />
          
          {/* End Bet - Only if active */}
          {!bet.is_solved && !bet.is_canceled && (
            <Button 
              variant="outline" 
              size="lg"
              className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
            >
              <Clock className="w-4 h-4 mr-2" />
              End Bet
            </Button>
          )}

          {/* Cancel Bet - Only if not solved */}
          {!bet.is_solved && (
            <Button 
              variant="outline" 
              size="lg"
              className="border-error text-error hover:bg-error hover:text-error-foreground"
            >
              <Ban className="w-4 h-4 mr-2" />
              Cancel Bet
            </Button>
          )}

          {/* Solve Bet - Only if not solved */}
          {!bet.is_solved && (
            <Button 
              variant="outline" 
              size="lg"
              className="border-success text-success hover:bg-success hover:text-success-foreground"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Solve Bet
            </Button>
          )}
        </>
      )}
    </div>
  );
}
