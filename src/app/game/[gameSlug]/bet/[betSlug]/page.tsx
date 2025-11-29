import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverBetAPI } from '@/lib/serverApi';
import { BetDetailsClient } from '@/components/bet/bet-details-client';

interface PageProps {
  params: Promise<{ gameSlug: string; betSlug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { betSlug } = await params;
  
  try {
    const bet = await serverBetAPI.getBetBySlug(betSlug);
    return {
      title: `${bet.title} - Betify`,
      description: bet.description || `View details and place tips on: ${bet.title}`,
    };
  } catch (error) {
    return {
      title: 'Bet Not Found - Betify',
      description: 'The requested bet could not be found.',
    };
  }
}

export default async function BetDetailsPage({ params }: PageProps) {
  const { betSlug } = await params;

  // Fetch bet data on the server for initial render and SEO
  try {
    const bet = await serverBetAPI.getBetBySlug(betSlug);

    // Server-rendered content for crawlers
    return (
      <>
        {/* SEO-friendly structured data for crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Thing',
              name: bet.title,
              description: bet.description,
              url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://betify.com'}/game/${bet.game_id}/bet/${betSlug}`,
            }),
          }}
        />

        {/* Client component - BetProvider is in layout.tsx */}
        <BetDetailsClient />
      </>
    );
  } catch (error) {
    // If bet not found, return 404
    notFound();
  }
}
