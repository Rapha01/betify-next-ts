'use client';

import { useBet } from '@/contexts/bet-context';
import { useAuth } from '@/contexts/auth-context';
import { BetHeaderCard } from '@/components/bet/bet-header-card';
import { BetStatsCards } from '@/components/bet/bet-stats-cards';
import { BetButtons } from '@/components/bet/bet-buttons';
import { BetTipsChart } from '@/components/bet/bet-tips-chart';
import { BetTipsList } from '@/components/bet/bet-tips-list';
import { BetAnswerStats } from '@/components/bet/bet-answer-stats';

// Mock data for development - TODO: Replace with actual API calls
const mockAnswers = [
  { id: '1', answer: 'Yes', in_pot: 7500, odds: 1.65, user_count: 89, percentage: 60 },
  { id: '2', answer: 'No', in_pot: 4950, odds: 2.51, user_count: 67, percentage: 40 },
];

const mockRecentTips = [
  { id: '1', user: 'Player123', answer: 'Yes', amount: 250, timestamp: Date.now() - 10 * 60 * 1000 },
  { id: '2', user: 'BetMaster', answer: 'No', amount: 500, timestamp: Date.now() - 25 * 60 * 1000 },
  { id: '3', user: 'GamerX', answer: 'Yes', amount: 150, timestamp: Date.now() - 45 * 60 * 1000 },
  { id: '4', user: 'ProPlayer', answer: 'Yes', amount: 350, timestamp: Date.now() - 60 * 60 * 1000 },
  { id: '5', user: 'Rookie99', answer: 'No', amount: 100, timestamp: Date.now() - 90 * 60 * 1000 },
];

export function BetDetailsClient() {
  const { bet } = useBet();
  const { account } = useAuth();

  if (!bet) {
    return null;
  }

  // TODO: Check user authentication and role
  const isLoggedIn = !!account;
  const isAdmin = false; // Mock - TODO: Get from game context or member data
  const isModerator = false; // Mock - TODO: Get from game context or member data
  const canManageBet = isAdmin || isModerator;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* Statistics Cards */}
      <BetStatsCards bet={bet} />

      {/* Bet Header Section */}
      <BetHeaderCard bet={bet} showDescription={true} />

      {/* Action Buttons */}
      <BetButtons bet={bet} isLoggedIn={isLoggedIn} canManageBet={canManageBet} />

      {/* Distribution Graph & Recent Tips Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <BetTipsChart bet={bet} />
        <BetTipsList tips={mockRecentTips} />
      </div>

      {/* Answers Statistics Table */}
      <BetAnswerStats answers={mockAnswers} />
    </div>
  );
}
