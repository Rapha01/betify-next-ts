# Bet Detail Page Design

## Overview
The bet detail page (`/game/[gameSlug]/bet/[betSlug]`) displays comprehensive information about a specific bet with a clean, minimalistic design consistent with the rest of the application.

## Page Structure

### 1. **Bet Header Section** (Card with left border)
- **BetStatusArea**: Large visual indicator of bet status (active, solved, canceled, expired)
- **BetHeader**: Reuses the existing bet header component showing:
  - Bet title
  - Bet type badge (Category/Estimate)
  - Timeline progress bar
  - Creation and time limit dates
- **Description**: Full bet description text
- **Additional Info**: Quick stats showing:
  - Participant count
  - Total pot amount
  - Dynamic odds information (if applicable)

### 2. **Action Buttons Section** (Card)
All buttons are in a single row with responsive wrapping:

#### For All Users:
- **Create Tip**: Primary action button (redirects non-logged-in users to login)

#### For Admins/Moderators:
- **End Bet**: Yellow/warning button - Only visible if bet is still active
- **Cancel Bet**: Red/error button - Only visible if bet is not solved
- **Solve Bet**: Green/success button - Only visible if bet is not solved

### 3. **Distribution Graph Section** (Card)
- **Header**: Shows appropriate icon (Pie Chart for category, Bar Chart for estimate)
- **Graph Area**: Placeholder for visualization (300px height)
  - Category bets will display a pie chart
  - Estimate bets will display a continuous distribution graph

### 4. **Recent Tips Section** (Card)
- **Header**: "Recent Tips" title
- **Compact Table**: Displays ~10 most recent tips with:
  - User name
  - Answer (as badge)
  - Amount (right-aligned, monospace font)
  - Time ago (relative time format)
- **Pagination**: Full pagination controls at bottom
  - Previous/Next buttons
  - Page numbers
  - Ellipsis for many pages

### 5. **Answer Statistics Table** (Card at bottom)
Comprehensive table showing all possible answers:
- **Answer**: Name with color indicator dot
- **In Pot**: Total amount bet on this answer
- **Odds**: Current odds (monospace font)
- **Users**: Number of users who picked this answer (with user icon)
- **Share**: Visual progress bar + percentage
- **Footer**: Totals row with sums

## Design Principles

### Consistency
- Uses existing BetHeader and BetStatusArea components
- Follows established color scheme and spacing
- Reuses UI components (Card, Badge, Button, etc.)

### Minimalism
- Clean white space between sections
- Simple borders and subtle shadows
- No unnecessary decorative elements
- Clear visual hierarchy

### Responsiveness
- Flexible layouts that adapt to screen size
- Horizontal scroll for tables on mobile
- Wrapping button rows
- Responsive text sizes

### Visual Hierarchy
1. Bet Header (most important - who, what, when)
2. Actions (what can I do)
3. Data Visualization (overview of distribution)
4. Recent Activity (social proof)
5. Detailed Statistics (deep dive)

## Color Coding

### Status Colors (from bet-utils.ts):
- **Active**: Primary color (dark gray/black)
- **Expired**: Warning color (yellow/orange)
- **Solved**: Success color (green)
- **Canceled**: Error color (red)

### Answer Colors (in statistics table):
- Each answer gets a distinct color indicator
- Colors follow the semantic color system

## Typography

- **Headers**: Semibold, clear hierarchy
- **Body Text**: Regular weight, good readability
- **Numbers**: Monospace font for amounts and odds
- **Metadata**: Muted foreground color, smaller size

## Current State

### Implemented (Design Only):
✅ Complete page layout structure
✅ All UI components and sections
✅ Mock data for development
✅ Responsive design
✅ Consistent styling

### Not Yet Implemented (Logic):
⏳ API data fetching
⏳ User authentication check
⏳ Role-based action visibility
⏳ Button click handlers
⏳ Actual graph rendering
⏳ Real pagination logic
⏳ Redirect logic for non-logged-in users

## Next Steps

1. **Add Logic to Create Tip Button**
   - Check authentication status
   - Redirect to login if not authenticated
   - Open create tip modal/dialog if authenticated

2. **Add Logic to Admin/Moderator Buttons**
   - Implement end bet functionality
   - Implement cancel bet functionality
   - Implement solve bet functionality (with answer selection)

3. **Implement Graph Rendering**
   - Integrate charting library (e.g., recharts)
   - Create pie chart component for category bets
   - Create distribution graph for estimate bets

4. **Implement Real Pagination**
   - Fetch tips with pagination from API
   - Handle page changes
   - Update URL with query parameters

5. **Connect to Real API**
   - Replace mock data with actual API calls
   - Handle loading states
   - Handle error states
   - Add proper TypeScript types

## File Location
`betify-next-ts/src/app/game/[gameSlug]/bet/[betSlug]/page.tsx`

## Dependencies
- Existing bet components (BetHeader, BetStatusArea)
- UI components (Card, Button, Badge, Separator, Pagination)
- Icons from lucide-react
- Type definitions from @/types/bet
