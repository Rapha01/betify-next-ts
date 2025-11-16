'use client';

import { useGame } from '@/contexts/game-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Send, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function ChatPage() {
  const { game } = useGame();
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // TODO: Implement message sending
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle>Game Chat</CardTitle>
            <CardDescription>
              Chat with other members of {game!.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-[400px] w-full border rounded-md p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* TODO: Replace with actual messages */}
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No messages yet. Be the first to start the conversation!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
