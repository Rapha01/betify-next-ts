import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Trophy, CheckCircle, XCircle } from 'lucide-react';

export interface Game {
  id: string;
  title: string;
  banner_url: string;
  bet_count: number;
  member_count: number;
  is_active: boolean;
  description?: string;
  slug?: string;
}

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const fallbackImage = '/placeholder-game.jpg'; // You can create a placeholder or use a default
  
  return (
    <Link href={`/games/${game.id}`}>
      <Card className="flex flex-col overflow-hidden h-full transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] transform -translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-2 cursor-pointer">
        {/* Banner Image */}
        <div className="relative w-full h-48 bg-muted overflow-hidden">
          <Image
            src={game.banner_url || fallbackImage}
            alt={game.title}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {!game.banner_url && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Trophy className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">{game.title}</CardTitle>
            <Badge variant={game.is_active ? 'default' : 'secondary'} className="shrink-0">
              {game.is_active ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  Inactive
                </>
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5" title="Number of bets">
              <Trophy className="w-4 h-4" />
              <span className="font-medium">{game.bet_count}</span>
              <span className="hidden sm:inline">bets</span>
            </div>
            <div className="flex items-center gap-1.5" title="Number of users">
              <Users className="w-4 h-4" />
              <span className="font-medium">{game.member_count}</span>
              <span className="hidden sm:inline">users</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button className="w-full" variant="default">
            Join
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
