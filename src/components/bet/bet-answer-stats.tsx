import { Users } from 'lucide-react';

interface Answer {
  id: string;
  answer: string;
  in_pot: number;
  odds: number;
  user_count: number;
  percentage: number;
}

interface BetAnswerStatsProps {
  answers: Answer[];
}

export function BetAnswerStats({ answers }: BetAnswerStatsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Answer Statistics</h2>
      
      <div className="border rounded-lg overflow-hidden bg-transparent">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr className="text-xs text-muted-foreground">
                <th className="text-left py-3 px-4 font-medium">Answer</th>
                <th className="text-right py-3 px-4 font-medium">In Pot</th>
                <th className="text-right py-3 px-4 font-medium">Odds</th>
                <th className="text-right py-3 px-4 font-medium">Users</th>
                <th className="text-right py-3 px-4 font-medium">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {answers.map((answer) => (
                <tr 
                  key={answer.id} 
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ 
                          backgroundColor: answer.answer === 'Yes' 
                            ? 'oklch(0.65 0.20 166)' 
                            : 'oklch(0.62 0.25 25)' 
                        }}
                      />
                      <span className="font-medium">{answer.answer}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {answer.in_pot.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold">
                    {answer.odds.toFixed(2)}x
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span>{answer.user_count}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${answer.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium min-w-[3ch]">
                        {answer.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/30 border-t font-semibold">
              <tr>
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4 text-right font-mono">
                  {answers.reduce((sum, a) => sum + a.in_pot, 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right text-muted-foreground">-</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span>{answers.reduce((sum, a) => sum + a.user_count, 0)}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
