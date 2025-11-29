import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bet } from '@/types/bet';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Coins, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBetStatus } from '@/lib/bet-utils';

interface BetHeaderCardProps {
  bet: Bet;
  gameSlug?: string;
  showDescription?: boolean;
  className?: string;
}

export function BetHeaderCard({ bet, gameSlug, showDescription = false, className }: BetHeaderCardProps) {
  const statusInfo = getBetStatus(bet);
  
  // Icon mapping for status
  const iconMap = {
    canceled: XCircle,
    solved: CheckCircle2,
    expired: AlertCircle,
    active: TrendingUp,
  };
  
  const StatusIcon = iconMap[statusInfo.status];
  
  // Construct Tailwind classes from semantic color name
  const textColor = `text-${statusInfo.color}`;
  const bgColor = `bg-${statusInfo.color}/10`;
  const borderColor = `border-${statusInfo.color}`;
  const borderLeftColor = `border-l-${statusInfo.color}`;

  const content = (
    <Card className={cn(`border-l-4 ${borderLeftColor} py-4`, className)}>
      <div className="px-3 sm:px-4">
        <div className="space-y-2">
          <div className="flex gap-4 sm:gap-6">
            {/* Status Area */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className={cn('rounded-xl flex items-center justify-center flex-shrink-0 w-20 h-20', bgColor)}>
                <StatusIcon className={cn('w-10 h-10', textColor)} />
              </div>
              
              <Badge 
                variant="outline"
                className={cn("text-xs font-semibold border-2", textColor, borderColor, bgColor)}
              >
                {statusInfo.title}
              </Badge>
            </div>

            {/* Header Content */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Title and Type Badge */}
              <div>
                <Badge 
                  variant={bet.bet_type === 'category' ? 'default' : 'secondary'}
                  className="float-right text-xs font-medium ml-2 mt-1"
                >
                  {bet.bet_type === 'category' ? (
                    <>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Category
                    </>
                  ) : (
                    <>
                      <Coins className="w-3 h-3 mr-1" />
                      Estimate
                    </>
                  )}
                </Badge>

                <h3 className="font-semibold text-muted-foreground">
                  {bet.title}
                </h3>
              </div>

              {/* Timeline Bar */}
              {!bet.is_solved && !bet.is_canceled && (
                <div className="space-y-1.5">
                  <Progress 
                    value={statusInfo.progress} 
                    className={cn(
                      'h-2',
                      statusInfo.status === 'active' && 'bg-primary/20'
                    )} 
                  />
                  
                  <div className={cn(
                    "flex items-center text-[10px] sm:text-xs text-muted-foreground",
                    bet.timelimit === 0 ? "justify-start" : "justify-between"
                  )}>
                    <span>
                      {bet.created_at 
                        ? new Date(bet.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : 'Start'
                      }
                    </span>
                    {bet.timelimit !== 0 && (
                      <span>
                        {new Date(bet.timelimit).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Description - Only shown if showDescription is true */}
              {showDescription && bet.description && (
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {bet.description}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="flex items-center justify-start gap-2 flex-wrap text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Coins className="w-4 h-4" />
                  <span>{bet.dynamic_odds ? 'Dynamic Odds' : 'Fixed Odds'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {!bet.isTipsHidden ? (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Visible Tips</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>Hidden Tips</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  // If gameSlug is provided, wrap in Link for navigation
  if (gameSlug) {
    return (
      <Link href={`/game/${gameSlug}/bet/${bet.slug}`} className="block cursor-pointer hover:shadow-lg transition-shadow">
        {content}
      </Link>
    );
  }

  // Otherwise return just the card (for detail page)
  return content;
}
