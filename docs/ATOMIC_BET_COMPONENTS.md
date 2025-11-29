# Atomic Bet Components - Documentation

## Overview

The bet components have been refactored into **atomic, reusable components** that share common logic through a centralized utility module. This allows for maximum flexibility - you can compose different layouts for bet cards, detail pages, and other contexts while maintaining consistency.

## Architecture

```
┌─────────────────────────────────────────┐
│         @/lib/bet-utils.ts              │
│   • getBetStatus()                      │
│   • getTimeRemaining()                  │
│   • formatDateRange()                   │
│   • getBetTypeLabel()                   │
│   • isBetExpired()                      │
│   • isBetActive()                       │
└─────────────────────────────────────────┘
                    ▲
                    │ Uses
                    │
┌───────────────────┴─────────────────────┐
│      Atomic Components                  │
├─────────────────────────────────────────┤
│ • BetStatusIcon                         │
│ • BetStatusBadge                        │
│ • BetTypeBadge                          │
│ • BetProgressBar                        │
│ • BetMetadataBadges                     │
└─────────────────────────────────────────┘
                    ▲
                    │ Composes
                    │
┌───────────────────┴─────────────────────┐
│      Composed Components                │
├─────────────────────────────────────────┤
│ • BetCard (for lists/grids)             │
│ • BetHeader (for detail pages)          │
└─────────────────────────────────────────┘
```

## Core Utility: `getBetStatus()`

Located in `@/lib/bet-utils.ts`, this is the **single source of truth** for bet status.

```typescript
import { getBetStatus } from '@/lib/bet-utils';

const statusInfo = getBetStatus(bet);
// Returns:
// {
//   status: 'active' | 'solved' | 'expired' | 'canceled',
//   progress: 0-100,
//   title: "Active" | "Solved" | "Expired" | "Canceled",
//   color: "text-info" | "text-success" | etc.,
//   bgColor: "bg-info/10" | "bg-success/10" | etc.,
//   tag: "active" | "solved" | etc.
// }
```

### Status Priority Logic
1. **Canceled** - If `bet.isCanceled === true`
2. **Solved** - If `bet.isSolved === true`
3. **Active** - If current time < deadline
4. **Expired** - If current time >= deadline

## Atomic Components

### 1. BetStatusIcon

Displays the status icon with optional background.

```typescript
import { BetStatusIcon } from '@/components/bet/status-icon';

<BetStatusIcon 
  bet={bet}
  size="md"              // 'sm' | 'md' | 'lg' | 'xl'
  showBackground={true}  // Show colored circle background
  className="shadow-lg"
/>
```

**Features:**
- Icon changes based on status (✓ solved, ✗ canceled, ⚠ expired, ↗ active)
- Colored background option
- Multiple size options
- Uses `getBetStatus()` internally

### 2. BetStatusBadge

Displays the status as a badge with text.

```typescript
import { BetStatusBadge } from '@/components/bet/status-badge';

<BetStatusBadge 
  bet={bet}
  showIcon={true}     // Show icon in badge
  iconSize="sm"       // 'sm' | 'md'
/>
```

**Features:**
- Color-coded by status
- Optional icon
- Compact display

### 3. BetTypeBadge

Shows whether the bet is Category or Estimate.

```typescript
import { BetTypeBadge } from '@/components/bet/bet-type-badge';

<BetTypeBadge 
  bet={bet}
  showIcon={true}  // Show category/estimate icon
/>
```

**Features:**
- Different colors for category (blue) vs estimate (orange)
- Icon representation

### 4. BetProgressBar

Timeline progress bar with optional time remaining.

```typescript
import { BetProgressBar } from '@/components/bet/bet-progress-bar';

<BetProgressBar 
  bet={bet}
  variant="default"           // 'default' | 'compact'
  showTimeRemaining={true}
  showPercentage={false}
/>
```

**Features:**
- Calculates progress: `(now - start) / (end - start) * 100`
- Only shows for active/expired bets
- Hides for solved/canceled bets
- Time remaining display

### 5. BetMetadataBadges

Group of badges showing odds, tips visibility, and options count.

```typescript
import { BetMetadataBadges } from '@/components/bet/bet-metadata-badges';

<BetMetadataBadges 
  bet={bet}
  showOdds={true}
  showTips={true}
  showOptions={true}
/>
```

**Shows:**
- Odds type (Dynamic/Fixed)
- Tips visibility (Public/Hidden)
- Number of options (for category bets)
- Range (for estimate bets)

## Composed Components

### BetCard (for lists)

Uses atomic components in a card layout.

```typescript
import { BetCard } from '@/components/bet/bet-card';

<BetCard 
  bet={bet}
  onClick={() => router.push(`/bet/${bet.id}`)}
  className="hover:shadow-xl"
/>
```

**Composition:**
- Left: `BetStatusIcon` (large, with background)
- Middle: Badges, title, description, progress, metadata
- Right: Action button

### BetHeader (for detail pages)

Flexible header with 3 variants.

```typescript
import { BetHeader } from '@/components/bet/simple-bet-header';

// Compact
<BetHeader bet={bet} variant="compact" />

// Default (balanced)
<BetHeader 
  bet={bet} 
  variant="default"
  showProgress={true}
  showDescription={true}
  showMetadata={true}
/>

// Detailed (full info)
<BetHeader 
  bet={bet} 
  variant="detailed"
  showProgress={true}
  showDescription={true}
  showMetadata={true}
/>
```

## Usage Examples

### Example 1: Bet List Page

```typescript
import { BetCard } from '@/components/bet/bet-card';

export default function BetsPage() {
  const bets = useBets();
  
  return (
    <div className="space-y-4">
      {bets.map(bet => (
        <BetCard 
          key={bet.id} 
          bet={bet}
          onClick={() => router.push(`/bet/${bet.id}`)}
        />
      ))}
    </div>
  );
}
```

### Example 2: Bet Detail Page

```typescript
import { BetHeader } from '@/components/bet/simple-bet-header';
import { getBetStatus } from '@/lib/bet-utils';
import { Card } from '@/components/ui/card';

export default function BetDetailPage({ bet }: { bet: Bet }) {
  const status = getBetStatus(bet);
  
  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Header */}
      <Card className="p-6">
        <BetHeader 
          bet={bet}
          variant="detailed"
          showProgress={true}
          showDescription={true}
          showMetadata={true}
        />
      </Card>
      
      {/* Bet Options */}
      {status.status === 'active' && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Place Your Bet</h2>
          {/* Your betting UI */}
        </Card>
      )}
      
      {/* Tips */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Tips</h2>
        {/* Tips list */}
      </Card>
    </div>
  );
}
```

### Example 3: Custom Layout with Atomic Components

```typescript
import { BetStatusIcon } from '@/components/bet/status-icon';
import { BetTypeBadge } from '@/components/bet/bet-type-badge';
import { BetProgressBar } from '@/components/bet/bet-progress-bar';
import { getBetStatus } from '@/lib/bet-utils';

function CustomBetWidget({ bet }: { bet: Bet }) {
  const status = getBetStatus(bet);
  
  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <BetStatusIcon bet={bet} size="md" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <BetTypeBadge bet={bet} />
          <span className={status.color}>{status.title}</span>
        </div>
        <h4 className="font-bold">{bet.title}</h4>
        <BetProgressBar bet={bet} variant="compact" />
      </div>
    </div>
  );
}
```

### Example 4: Using Utilities Directly

```typescript
import { getBetStatus, isBetActive, getTimeRemaining } from '@/lib/bet-utils';

function BetStatusChip({ bet }: { bet: Bet }) {
  const status = getBetStatus(bet);
  const isActive = isBetActive(bet);
  const timeLeft = getTimeRemaining(bet);
  
  return (
    <div className={cn("chip", status.color)}>
      {status.title} - {status.progress}%
      {isActive && <span> • {timeLeft}</span>}
    </div>
  );
}
```

## Available Utilities

All utilities are in `@/lib/bet-utils.ts`:

```typescript
// Status and info
getBetStatus(bet: Bet): BetStatusInfo
getBetTypeLabel(bet: Bet): string

// Time utilities
getTimeRemaining(bet: Bet): string
formatDateRange(bet: Bet): string

// Boolean checks
isBetExpired(bet: Bet): boolean
isBetActive(bet: Bet): boolean
```

## Import Patterns

```typescript
// Direct imports for components
import { BetCard } from '@/components/bet/bet-card';
import { BetHeader } from '@/components/bet/simple-bet-header';
import { BetStatusIcon } from '@/components/bet/status-icon';
import { BetStatusBadge } from '@/components/bet/status-badge';
import { BetTypeBadge } from '@/components/bet/bet-type-badge';
import { BetProgressBar } from '@/components/bet/bet-progress-bar';
import { BetMetadataBadges } from '@/components/bet/bet-metadata-badges';

// Utilities
import { getBetStatus } from '@/lib/bet-utils';
```

## File Structure

```
src/
├── lib/
│   └── bet-utils.ts              ⭐ Core utilities
│
└── components/bet/
    ├── bet-card.tsx              🎴 Composed: Card for lists
    ├── simple-bet-header.tsx     📄 Composed: Header for detail pages
    │
    ├── status-icon.tsx           🔸 Atomic: Status icon
    ├── status-badge.tsx          🔸 Atomic: Status badge
    ├── bet-type-badge.tsx        🔸 Atomic: Type badge
    ├── bet-progress-bar.tsx      🔸 Atomic: Progress bar
    └── bet-metadata-badges.tsx   🔸 Atomic: Metadata badges
```

## Benefits

✅ **Single Source of Truth** - `getBetStatus()` used everywhere
✅ **Composable** - Mix and match atomic components
✅ **Flexible** - Different layouts for different contexts
✅ **Maintainable** - Change logic in one place
✅ **Type-Safe** - Full TypeScript support
✅ **Testable** - Utilities can be tested independently
✅ **Consistent** - Same styling and behavior everywhere

## Migration from Old Code

**Before:**
```typescript
// Old approach - embedded logic
<BetCard bet={bet} />  // All logic inside
```

**After:**
```typescript
// New approach - composed from atoms
import { BetCard } from '@/components/bet/bet-card';
import { BetHeader } from '@/components/bet/simple-bet-header';
import { getBetStatus } from '@/lib/bet-utils';

// Use BetCard for lists (same API)
<BetCard bet={bet} />

// Use BetHeader for detail pages
<BetHeader bet={bet} variant="detailed" />

// Or compose your own
const status = getBetStatus(bet);
// Build custom UI
```

## Next Steps

1. **Use BetCard** in your bet lists
2. **Use BetHeader** in your detail pages
3. **Compose custom layouts** using atomic components
4. **Leverage utilities** for custom logic
5. **Extend** by adding new atomic components as needed

---

**Remember:** The atomic approach gives you building blocks. Compose them however you need!
