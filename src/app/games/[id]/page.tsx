'use client';

import { useGame } from '@/contexts/game-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Trophy, Users, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function GamePage() {
  const { game, loading, error, refetch } = useGame();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="w-full h-64 md:h-96 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <div className="flex gap-4">
              <Skeleton className="h-20 w-32" />
              <Skeleton className="h-20 w-32" />
              <Skeleton className="h-20 w-32" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Game
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Game Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">The game you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Game Banner */}
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-muted">
          {game.banner_url ? (
            <Image
              src={game.banner_url}
              alt={game.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Trophy className="w-24 h-24 text-muted-foreground/30" />
            </div>
          )}
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Overlay with status badge */}
          <div className="absolute top-4 right-4">
            <Badge variant={game.is_active ? 'default' : 'secondary'} className="text-base px-4 py-2">
              {game.is_active ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Inactive
                </>
              )}
            </Badge>
          </div>

          {/* Game Title and Date Inside Banner */}
          <div className="absolute inset-0 flex items-center px-6 md:px-8">
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">{game.title}</h1>
              <p className="text-white/90 mt-2 text-sm md:text-base drop-shadow-md">
                Created {new Date(game.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 justify-center md:justify-start">
          <Button size="lg" className="flex-1 md:flex-none">
            Join Game
          </Button>
          <Button size="lg" variant="outline" className="flex-1 md:flex-none">
            Share
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bets</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{game.bet_count}</div>
              <p className="text-xs text-muted-foreground">Active betting pools</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{game.member_count}</div>
              <p className="text-xs text-muted-foreground">Active participants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{game.is_active ? 'Active' : 'Inactive'}</div>
              <p className="text-xs text-muted-foreground">
                Since {new Date(game.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>About This Game</CardTitle>
            <CardDescription>Game details and description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {game.description || 'No description available for this game.'}
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bets and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No recent activity to display.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
