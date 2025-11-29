# Bet Component Consolidation

## Summary
Consolidated the bet header display components into a single, reusable `BetHeaderCard` component that works for both the game bets list and the bet detail page.

## Changes Made

### New Component: `bet-header-card.tsx`
Created a comprehensive component that combines:
- **Status Area**: Visual indicator with icon and badge (previously `BetStatusArea`)
- **Bet Header**: Title, type badge, and timeline (previously `BetHeader`)
- **Additional Info**: Odds type and tips visibility
- **Description**: Optional description display (only for detail page)
- **Navigation**: Optional Link wrapper (only for list page)

#### Props:
```typescript
interface BetHeaderCardProps {
  bet: Bet;
  gameSlug?: string;        // If provided, wraps in Link for navigation
  showDescription?: boolean; // If true, displays bet description
  className?: string;
}
```

### Updated Components

#### `bet-card.tsx`
**Before**: ~110 lines with complex layout and imports
**After**: 12 lines - simple wrapper around `BetHeaderCard`

```typescript
export function BetCard({ bet, gameSlug, onClick }: BetCardProps) {
  return <BetHeaderCard bet={bet} gameSlug={gameSlug} showDescription={false} />;
}
```

#### Bet Detail Page
**Before**: ~50 lines of JSX for header section
**After**: 1 line

```typescript
<BetHeaderCard bet={bet} showDescription={true} />
```

## Usage

### On Game Bets List (with link):
```typescript
<BetHeaderCard 
  bet={bet} 
  gameSlug={gameSlug} 
  showDescription={false} 
/>
```

### On Bet Detail Page (without link):
```typescript
<BetHeaderCard 
  bet={bet} 
  showDescription={true} 
/>
```

## Features

### Consistent Styling
- Border-left color based on bet status
- Status icon and badge
- Type badge (Category/Estimate)
- Timeline progress bar
- Odds and tips visibility indicators

### Responsive Design
- Adapts padding for mobile/desktop
- Status area maintains fixed size
- Content area scales with available space

### Smart Behavior
- **With gameSlug**: Wraps entire card in Link for navigation
- **Without gameSlug**: Static display (for detail page)
- **With showDescription**: Displays full bet description
- **Without showDescription**: Compact view for list

## Benefits

1. **DRY Principle**: Single source of truth for bet header display
2. **Consistency**: Identical appearance across all pages
3. **Maintainability**: Changes in one place affect all uses
4. **Simplicity**: Components that use it have minimal code
5. **Flexibility**: Props control behavior without code duplication

## Old Components (Can be removed)

These components are now obsolete:
- ✅ `bet-header.tsx` - Functionality merged into `bet-header-card.tsx`
- ✅ `bet-status-area.tsx` - Functionality merged into `bet-header-card.tsx`

Note: Keep these files for now in case rollback is needed, but they are no longer imported anywhere.

## File Locations

- **New**: `src/components/bet/bet-header-card.tsx`
- **Updated**: `src/components/bet/bet-card.tsx`
- **Updated**: `src/app/game/[gameSlug]/bet/[betSlug]/page.tsx`
