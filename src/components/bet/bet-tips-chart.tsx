import { PieChart, BarChart3 } from 'lucide-react';
import { Bet } from '@/types/bet';

interface BetTipsChartProps {
  bet: Bet;
}

export function BetTipsChart({ bet }: BetTipsChartProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {bet.bet_type === 'category' ? (
          <>
            <PieChart className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Tip Distribution</h2>
          </>
        ) : (
          <>
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Estimate Distribution</h2>
          </>
        )}
      </div>
      
      {/* Graph Placeholder */}
      <div className="w-full h-[400px] bg-muted/30 rounded-lg flex items-center justify-center border border-border/50">
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">
            {bet.bet_type === 'category' ? '📊' : '📈'}
          </div>
          <p className="text-sm">
            {bet.bet_type === 'category' ? 'Pie Chart' : 'Distribution Graph'} will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
}
