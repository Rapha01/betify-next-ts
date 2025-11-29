import { Bet } from '@/types/bet';

/**
 * Normalize bet data - converts timestamp fields from strings to numbers
 * Should be applied to all bets coming from the API
 */
export function normalizeBet(bet: Bet): Bet {
  return {
    ...bet,
    timelimit: Number(bet.timelimit),
    created_at: Number(bet.created_at),
    solved_at: Number(bet.solved_at),
  };
}

/**
 * Normalize array of bets
 */
export function normalizeBets(bets: Bet[]): Bet[] {
  return bets.map(normalizeBet);
}

/**
 * Bet status types
 */
export type BetStatus = 'canceled' | 'solved' | 'expired' | 'active';

/**
 * Complete bet status information
 */
export interface BetStatusInfo {
  status: BetStatus;
  progress: number;
  title: string;
  color: string; // Semantic color name (e.g., 'destructive', 'success', 'primary', 'warning')
  timeRemaining: string; // Human-readable time remaining
}

/**
 * Determine bet status with priority logic
 * Based on old BetStatusTab.js implementation
 */
export function getBetStatus(bet: Bet): BetStatusInfo {
  const start = bet.created_at;
  const now = Date.now();
  const end = bet.timelimit;

  // Check if bet has no time limit (timelimit === 0)
  const hasNoTimeLimit = end === 0;

  // Handle invalid dates
  const isValidStart = !isNaN(start);
  const isValidEnd = !isNaN(end) && !hasNoTimeLimit;
  
  // Calculate progress (0-100%)
  let progress = 0;
  if (hasNoTimeLimit) {
    // For bets with no time limit:
    // - 0% if active (not solved/canceled)
    // - 100% if solved/canceled
    progress = bet.is_solved || bet.is_canceled ? 100 : 0;
  } else if (!isValidStart || !isValidEnd) {
    progress = 0;
  } else if (end < now) {
    progress = 100;
  } else if (now < start) {
    progress = 0;
  } else {
    progress = Math.floor(((now - start) / (end - start)) * 100);
  }

  // Calculate time remaining (only if there's a time limit)
  const timeRemaining = hasNoTimeLimit ? 'No time limit' : getTimeRemainingText(now, end);

  // Determine status with priority
  let status: BetStatus;
  let title: string;
  let color: string;

  if (bet.is_canceled) {
    status = 'canceled';
    title = 'Canceled';
    color = 'destructive';
  } else if (bet.is_solved) {
    status = 'solved';
    title = 'Solved';
    color = 'info';
  } else if (hasNoTimeLimit || progress < 100) {
    // If no time limit, bet is always active (until solved/canceled)
    status = 'active';
    title = 'Active';
    color = 'success';
  } else {
    status = 'expired';
    title = 'Expired';
    color = 'warning';
  }

  return { status, progress, title, color, timeRemaining };
}

/**
 * Calculate time remaining text between two timestamps
 * @param start - Start timestamp (defaults to now)
 * @param end - End timestamp
 * @returns Human-readable time remaining text
 */
export function getTimeRemainingText(start: number = Date.now(), end: number): string {
  // Handle invalid timestamps
  if (!end || isNaN(end) || isNaN(start)) {
    return 'Invalid date';
  }
  
  const diff = end - start;

  if (diff < 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  if (minutes > 0) return `${minutes}m remaining`;
  return 'Less than a minute';
}

/**
 * Format date range for display
 */
export function formatDateRange(bet: Bet): string {
  const start = new Date(bet.created_at);
  const end = new Date(bet.timelimit);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return `${formatDate(start)} - ${formatDate(end)}`;
}

/**
 * Get bet type label
 */
export function getBetTypeLabel(bet: Bet): string {
  return bet.bet_type === 'category' ? 'Category' : 'Estimate';
}

/**
 * Check if bet is expired
 */
export function isBetExpired(bet: Bet): boolean {
  return bet.timelimit < Date.now();
}

/**
 * Check if bet is active (not expired, not solved, not canceled)
 */
export function isBetActive(bet: Bet): boolean {
  return !bet.is_solved && !bet.is_canceled && !isBetExpired(bet);
}
