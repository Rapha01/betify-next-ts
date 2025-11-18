'use client';

import { useGame } from '@/contexts/game-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Calendar } from 'lucide-react';

export function GameOverviewClient() {
  const { game } = useGame();

  if (!game) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
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
