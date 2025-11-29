import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trophy } from 'lucide-react';
import { Game } from '@/types/game';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const fallbackImage = '/placeholder-game.jpg';
  
  return (
    <Link href={`/game/${game.slug}`}>
      <Card className="overflow-hidden h-full py-0 gap-0">
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
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Trophy className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Title area - grows to fill space */}
        <CardHeader className="flex-1 pt-3">
          
            <h3 className="text-lg font-bold line-clamp-2">{game.title}</h3>
        
        </CardHeader>

        {/* Stats and Button - fixed at bottom */}
        <CardContent className="pb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              <span className="font-medium">{game.bet_count}</span>
              <span className="hidden sm:inline">bets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="font-medium">{game.member_count}</span>
              <span className="hidden sm:inline">users</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pb-5">
          <Button className="w-full">
            Join
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
