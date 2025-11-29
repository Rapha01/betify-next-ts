'use client';

import { useGame } from '@/contexts/game-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Trophy, 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Sparkles, 
  Award,
  Flame,
  Target,
  Clock,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

export function GameOverviewClient() {
  const { game, member } = useGame();

  if (!game) {
    return null;
  }

  const createdDate = new Date(game.created_at);
  const daysActive = Math.floor((Date.now() - game.created_at) / (1000 * 60 * 60 * 24));
  const avgBetsPerDay = daysActive > 0 ? (game.bet_count / daysActive).toFixed(1) : '0';

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Bets Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Bets</CardTitle>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-black text-foreground">{game.bet_count}</div>
                <span className="text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  {avgBetsPerDay}/day
                </span>
              </div>
            </div>
            <div className="p-4 bg-primary/10 rounded-xl">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Target className="w-3 h-3" />
              Active betting pools
            </p>
          </CardContent>
        </Card>

        {/* Members Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Community</CardTitle>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-black text-foreground">{game.member_count}</div>
                <span className="text-xs text-muted-foreground">
                  <Users className="w-3 h-3 inline mr-1" />
                  Active
                </span>
              </div>
            </div>
            <div className="p-4 bg-primary/10 rounded-xl">
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Registered participants
            </p>
          </CardContent>
        </Card>

        {/* Activity Status Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Status</CardTitle>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-black text-foreground">{game.is_active ? 'Live' : 'Paused'}</div>
                <span className="text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {daysActive}d
                </span>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${game.is_active ? 'bg-primary/10' : 'bg-muted'}`}>
              {game.is_active ? (
                <Flame className="h-8 w-8 text-primary animate-pulse" />
              ) : (
                <Calendar className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Since {createdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Game Info & Description Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* About Card - Takes 2 columns on large screens */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">About This Game</CardTitle>
                <CardDescription>Game details and description</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-base">
              {game.description || 'No description available for this game. The game creator hasn\'t added any details yet.'}
            </p>
            
            {/* Game Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Visibility
                </p>
                <p className="text-sm font-medium flex items-center gap-2">
                  {game.is_public ? (
                    <>
                      <span className="text-xs px-2 py-1 rounded border border-primary/30 bg-primary/10 text-primary">Public</span>
                      <span className="text-xs text-muted-foreground">Anyone can join</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs px-2 py-1 rounded border border-border bg-muted/10 text-muted-foreground">Private</span>
                      <span className="text-xs text-muted-foreground">Invite only</span>
                    </>
                  )}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Currency
                </p>
                <p className="text-sm font-medium">
                  <span className="text-xl font-bold">{game.currency_name}</span>
                  <span className="text-xs text-muted-foreground ml-2">Starting: {Number(game.start_currency)}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Sidebar */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Quick Stats</CardTitle>
                <CardDescription>At a glance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <span className="text-sm font-bold">{createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Days Active</span>
                </div>
                <span className="text-sm font-bold">{daysActive} days</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Avg Bets/Day</span>
                </div>
                <span className="text-sm font-bold">{avgBetsPerDay}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Language</span>
                </div>
                <span className="text-sm font-bold uppercase">{game.language}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
                <CardDescription>Latest bets and updates</CardDescription>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded border border-border">Live</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="relative mb-4">
              <div className="bg-muted p-6 rounded-full">
                <Trophy className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
            <p className="text-muted-foreground text-center text-lg font-medium mb-2">
              No recent activity yet
            </p>
            <p className="text-muted-foreground/60 text-center text-sm max-w-md">
              Activity will appear here when members place bets, join the game, or when new betting pools are created.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
