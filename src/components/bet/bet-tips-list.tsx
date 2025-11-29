import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Tip {
  id: string;
  user: string;
  answer: string;
  amount: number;
  timestamp: number;
}

interface BetTipsListProps {
  tips: Tip[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

// Helper function to format timestamps
function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function BetTipsList({ tips, currentPage = 1, totalPages = 3, onPageChange }: BetTipsListProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Recent Tips</h2>
      
      {/* Tips List - Scrollable */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[400px] pr-2">
        {tips.map((tip) => (
          <div 
            key={tip.id}
            className="group relative bg-transparent border border-border rounded-lg p-3 hover:shadow-md hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-3">
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <span className="text-sm font-semibold text-primary">
                    {tip.user.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                {/* Online indicator - optional */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm truncate">{tip.user}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className="text-xs font-medium"
                  >
                    {tip.answer}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(tip.timestamp)}
                  </span>
                </div>
              </div>

              {/* Amount Badge */}
              <div className="flex-shrink-0">
                <div className="bg-primary/10 text-primary px-2 py-1 rounded-lg">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    <span className="font-bold text-xs font-mono">
                      {tip.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
