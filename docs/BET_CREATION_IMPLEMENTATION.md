# Bet Creation - Frontend Implementation

## Overview
Complete frontend implementation for the bet creation feature with full API integration, validation, and error handling.

## Features Implemented

### 1. API Integration (`src/lib/api.ts`)
Added `betAPI` object with the following endpoints:
- `getBetsByGameId(gameId)` - Fetch all bets for a game
- `getBetById(betId)` - Get a single bet by ID
- `createBet(gameId, betData)` - Create a new bet
- `updateBet(betId, updates)` - Update an existing bet
- `deleteBet(betId)` - Delete a bet
- `closeBet(betId, winningAnswer?)` - Close a bet with optional winning answer
- `abortBet(betId)` - Abort a bet and refund participants

### 2. Create Bet Dialog (`src/components/bet/create-bet-dialog.tsx`)

#### State Management
- All form fields managed with `useState`
- Loading state during API calls
- Error state for validation and API errors
- Automatic error clearing when dialog closes or user edits

#### Validation Rules
- **Title**: Required, max 128 characters
- **Description**: Optional, max 512 characters
- **Date & Time**: Must be in the future
- **Catalogue Bets**:
  - Minimum 2 answers, maximum 32
  - Each answer title max 64 characters
  - Base odds: 0-32
- **Scale Bets**:
  - Min < Max
  - Step > 0
  - Base odds: 1-32
  - Win rate: 1-95%

#### Error Handling
- Validation errors shown in alert box with icon
- API errors displayed with error messages
- Loading spinner on submit button during API call
- Form disabled during submission
- Success automatically closes dialog and refreshes list

#### User Experience
- Error banner with AlertCircle icon
- Real-time error clearing when user starts editing
- Form reset on successful creation
- Disabled state during loading
- Parent callback notification on success

### 3. Bets Page (`src/app/game/[slug]/bets/page.tsx`)

#### Features
- Automatic bet list loading on page mount
- Loading spinner while fetching
- Error display if fetch fails
- Empty state message when no bets exist
- Automatic refresh after creating new bet
- Basic bet cards showing:
  - Title and description
  - Bet type
  - Time limit
  - Dynamic odds info (if enabled)

#### State Management
- `bets` - Array of fetched bets
- `isLoading` - Loading state for initial fetch
- `error` - Error message if fetch fails

## Data Flow

```
User fills form → 
Client-side validation → 
API call to backend → 
Success: Reset form, close dialog, refresh list → 
Parent page re-fetches bets →
Updated list displayed
```

## API Request Format

### Create Bet Request Body
```typescript
{
  title: string;           // Required, max 128 chars
  desc: string;            // Optional, max 512 chars
  betType: 'catalogue' | 'scale';
  dynamicOdds: boolean;
  dynamicOddsPower?: number;  // 1-10, only if dynamicOdds is true
  isTipsHidden: boolean;
  timeLimit: string;       // ISO date string
  
  // For catalogue bets
  catalogue_answers?: {
    title: string;         // Max 64 chars
    baseOdds: number;      // 0-32
  }[];
  
  // For scale bets
  scale_options?: {
    step: number;          // > 0
    min: number;
    max: number;           // > min
    baseOdds: number;      // 1-32
    winRate: number;       // 1-95
  };
}
```

## Future Enhancements

### Recommended Additions
1. **Toast Notifications**: Replace alerts with toast library (sonner recommended)
2. **Success Message**: Visual feedback on successful bet creation
3. **Bet Cards**: More detailed bet cards with actions (edit, delete, close)
4. **Filters**: Filter bets by status (active, closed, aborted)
5. **Search**: Search bets by title
6. **Pagination**: Handle large numbers of bets
7. **Real-time Updates**: WebSocket for live bet updates
8. **Bet Details**: Detailed view showing all participants and tips
9. **Analytics**: Show bet statistics (participation rate, pot size, etc.)

### Installation for Toast Support
```bash
npx shadcn-ui@latest add sonner
```

Then update to use toast:
```typescript
import { toast } from 'sonner';

// On success
toast.success('Bet created successfully!');

// On error
toast.error('Failed to create bet');
```

## Testing Checklist

- [ ] Create catalogue bet with 2 answers
- [ ] Create catalogue bet with 32 answers
- [ ] Create scale bet with valid range
- [ ] Try to create bet with empty title
- [ ] Try to create bet with past date
- [ ] Try to create bet with min >= max (scale)
- [ ] Try to create bet with < 2 answers (catalogue)
- [ ] Verify dynamic odds toggle works
- [ ] Verify isTipsHidden toggle works
- [ ] Verify form resets after successful creation
- [ ] Verify bet list refreshes after creation
- [ ] Verify error messages display correctly
- [ ] Verify loading states work properly

## Notes

- All API calls go through `apiFetch` wrapper which handles:
  - Cookie-based authentication
  - Error parsing
  - Development delay simulation
  - Content-Type headers
  
- The gameId/slug is passed from the URL params to the CreateBetDialog component

- The form automatically validates before submission to reduce unnecessary API calls

- Date/time picker uses native browser controls with Calendar24 style for better UX
