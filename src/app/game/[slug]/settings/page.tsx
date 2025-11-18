'use client';

import { useGame } from '@/contexts/game-context';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings as SettingsIcon, Save, AlertCircle, Lock, Smile } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import languageCodes from '@/lib/languageCodes';
import EmojiPicker from 'emoji-picker-react';

export default function SettingsPage() {
  const { game, updateGame } = useGame();
  const { account } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [currencyName, setCurrencyName] = useState('');
  const [startCurrency, setStartCurrency] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Check if account is the game creator
  const isGameCreator = game?.account_id && account?.id && game.account_id === account.id;

  useEffect(() => {
    setTitle(game!.title || '');
    setDescription(game!.description || '');
    setLanguage(game!.language || '');
    setBannerUrl(game!.banner_url || '');
    setCurrencyName(game!.currency_name || '');
    setStartCurrency(game!.start_currency?.toString() || '');
    setIsPublic(game!.is_public || false);
    setIsActive(game!.is_active || false);
    // Add other fields when they're available in the Game interface
  }, [game]);

  // Redirect if not the game creator
  useEffect(() => {
    if (!isGameCreator) {
      router.push(`/game/${game!.slug}`);
    }
  }, [isGameCreator, game!.slug, router]);

  const handleEmojiClick = (emojiData: any) => {
    setCurrencyName(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const updates: any = {};

      if (title !== game!.title) {
        updates.title = title;
      }
      if (description !== game!.description) {
        updates.description = description;
      }
      if (language !== game!.language) {
        updates.language = language;
      }
      if (bannerUrl !== game!.banner_url) {
        updates.banner_url = bannerUrl;
      }
      if (currencyName !== game!.currency_name) {
        updates.currency_name = currencyName;
      }
      if (startCurrency !== game!.start_currency?.toString()) {
        const parsedStartCurrency = parseInt(startCurrency);
        if (!isNaN(parsedStartCurrency)) {
          updates.start_currency = parsedStartCurrency;
        }
      }
      if (isPublic !== game!.is_public) {
        updates.is_public = isPublic;
      }
      if (isActive !== game!.is_active) {
        updates.is_active = isActive;
      }

      if (Object.keys(updates).length > 0) {
        await updateGame(updates);
      }

      // TODO: Save other settings when the backend supports them
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
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
        <div className="grid gap-6 md:grid-cols-2">
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

              <div className="space-y-2">
                <label htmlFor="language" className="text-sm font-medium">
                  Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageCodes.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="bannerUrl" className="text-sm font-medium">
                  Banner URL
                </label>
                <Input
                  id="bannerUrl"
                  placeholder="https://example.com/banner.jpg"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
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
              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-2 flex-1">
                  <label htmlFor="currencyName" className="text-sm font-medium">
                    Currency Name
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="shrink-0"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Input
                      id="currencyName"
                      placeholder="e.g., Coins, Points"
                      value={currencyName}
                      onChange={(e) => setCurrencyName(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  {showEmojiPicker && (
                    <div className="mt-2">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <label htmlFor="startCurrency" className="text-sm font-medium">
                    Starting Currency
                  </label>
                  <Input
                    id="startCurrency"
                    type="number"
                    placeholder="e.g., 1000"
                    value={startCurrency ? parseFloat(startCurrency).toString() : ''}
                    onChange={(e) => setStartCurrency(e.target.value)}
                  />
                </div>
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
        </div>

        <div className="w-full">
          <Button onClick={handleSaveSettings} size="lg" disabled={isSaving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
