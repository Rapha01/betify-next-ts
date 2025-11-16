'use client';

import { useGame } from '@/contexts/game-context';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings as SettingsIcon, Save, AlertCircle, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { game } = useGame();
  const { account } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currencyName, setCurrencyName] = useState('');
  const [startCurrency, setStartCurrency] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isActive, setIsActive] = useState(true);

  // Check if account is the game creator
  const isGameCreator = game?.account_id && account?.id && game.account_id === account.id;

  useEffect(() => {
    setTitle(game!.title || '');
    setDescription(game!.description || '');
    // Add other fields when they're available in the Game interface
  }, [game]);

  // Redirect if not the game creator
  useEffect(() => {
    if (!isGameCreator) {
      router.push(`/games/${game!.id}`);
    }
  }, [isGameCreator, game!.id, router]);

  const handleSaveSettings = () => {
    // TODO: Implement settings save
    console.log('Saving settings:', { title, description, currencyName, startCurrency, isPublic, isActive });
  };

  if (!isGameCreator) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Lock className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Only the game creator can access settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update the basic details of your game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Game title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Game description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Game Configuration</CardTitle>
              <CardDescription>
                Configure game-specific settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currencyName" className="text-sm font-medium">
                  Currency Name
                </label>
                <Input
                  id="currencyName"
                  placeholder="e.g., Coins, Points"
                  value={currencyName}
                  onChange={(e) => setCurrencyName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="startCurrency" className="text-sm font-medium">
                  Starting Currency
                </label>
                <Input
                  id="startCurrency"
                  type="number"
                  placeholder="e.g., 1000"
                  value={startCurrency}
                  onChange={(e) => setStartCurrency(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <label htmlFor="isPublic" className="text-sm font-medium">
                  Public Game (Anyone can join)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active Game (Bets can be placed)
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
