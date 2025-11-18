'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';

export default function BetsPage() {
  const params = useParams();
  const gameId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Bets</CardTitle>
          <CardDescription>All betting pools for this game</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Bets page coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
