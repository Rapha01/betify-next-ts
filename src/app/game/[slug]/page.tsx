import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverGameAPI } from '@/lib/serverApi';
import { GameOverviewClient } from '@/components/game-overview-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO (crawlers will see this!)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const game = await serverGameAPI.getGameBySlug(slug);
    
    const title = `${game.title} - Betify`;
    const description = game.description || `Join ${game.title} on Betify! ${game.member_count} members, ${game.bet_count} active bets. Start betting now!`;
    const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://betify.com'}/game/${slug}`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: 'Betify',
        type: 'website',
        images: game.banner_url ? [
          {
            url: game.banner_url,
            width: 1200,
            height: 630,
            alt: game.title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: game.banner_url ? [game.banner_url] : [],
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    // Return default metadata if game not found
    return {
      title: 'Game Not Found - Betify',
      description: 'The requested game could not be found.',
    };
  }
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  
  try {
    // Fetch game data on the server for initial render
    const game = await serverGameAPI.getGameBySlug(slug);
    
    // Server-rendered content for crawlers
    return (
      <>
        {/* SEO-friendly hidden content for crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Game',
              name: game.title,
              description: game.description,
              url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://betify.com'}/game/${slug}`,
              image: game.banner_url,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                reviewCount: game.member_count,
              },
            }),
          }}
        />
        
        {/* Client component for interactive features */}
        <GameOverviewClient />
      </>
    );
  } catch (error) {
    // If game not found, return 404
    notFound();
  }
}
