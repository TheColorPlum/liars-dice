# Liar's Dice - Product Requirements Document

## 1. Product Overview

### 1.1 Product Vision
A cross-platform multiplayer Liar's Dice game that combines classic gameplay with modern competitive features, offering both casual and competitive experiences across mobile and web platforms.

### 1.2 Target Audience
- Primary: Casual mobile gamers aged 18-45
- Secondary: Board game enthusiasts and competitive online gamers
- Tertiary: Social gamers looking for quick multiplayer experiences

### 1.3 Key Value Propositions
- Classic Liar's Dice gameplay accessible on any device
- Competitive ranking system with global leaderboards
- Seamless cross-platform experience
- Free-to-play with optional premium features

## 2. Technical Architecture

## 2. Technical Architecture

### 2.1 Tech Stack
- **Frontend**: Expo (React Native) for cross-platform mobile/web
- **Web Frontend**: Next.js
- **Backend**: Supabase (PostgreSQL, real-time subscriptions, auth)
- **Deployment**: Vercel (frontend), Supabase (backend)
- **Real-time**: Supabase Realtime for game state synchronization

### 2.2 Development Workflow
- **Version Control**: Git with feature branches and regular checkpoints
- **Database Setup**: Supabase CLI for terminal-based configuration
- **Deployment**: Automated via git integration with Vercel
- **Testing**: Local development with Supabase local instance

### 2.3 Setup Requirements

**Supabase CLI Setup (Terminal-based):**
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize project
supabase init

# Start local development
supabase start

# Create and apply migrations
supabase migration new create_initial_schema
supabase db reset

# Deploy to production
supabase db push
```

**Git Workflow (GitHub):**
```bash
# Initialize GitHub repository
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/liars-dice.git
git push -u origin main

# Feature development pattern
git checkout -b feature/auth-system
git add .
git commit -m "feat: implement user authentication"
git push origin feature/auth-system

# Create pull request on GitHub, then merge
git checkout main
git pull origin main
git tag -a v0.1.0 -m "Auth system complete"
git push origin main --tags
```

**Vercel Deployment:**
- Connect GitHub repository to Vercel
- Auto-deploy on main branch pushes
- Environment variables managed via Vercel dashboard
- Preview deployments for pull requests

### 2.4 Platform Support
- iOS (mobile app)
- Android (mobile app) 
- Web (responsive web app)

## 3. Core Features

### 3.1 Authentication System
**User Stories:**
- As a user, I can create an account with email/password
- As a user, I can log in with existing credentials
- As a user, I can reset my password if forgotten
- As a user, I can play as a guest (limited features)

**Functional Requirements:**
- Email/password authentication
- Guest mode with temporary session
- Account verification via email
- Password reset functionality
- Session management across devices

**Technical Requirements:**
- Supabase Auth integration
- JWT token handling
- Secure password hashing
- Rate limiting on auth endpoints

### 3.2 Single Player Mode
**User Stories:**
- As a player, I can start a game with 2-5 AI opponents
- As a player, I can select difficulty levels for AI opponents
- As a player, I can pause and resume single-player games
- As a player, I can view my single-player statistics

**Functional Requirements:**
- AI opponents with varying difficulty levels (Easy, Medium, Hard)
- Configurable game settings (number of dice, rounds)
- Local game state persistence
- Statistics tracking for single-player games

**Technical Requirements:**
- AI logic implementation with probabilistic decision-making
- Local storage for game state
- Offline functionality

### 3.3 Private Match System
**User Stories:**
- As a player, I can create a private match with a custom room code
- As a player, I can join a private match using a room code
- As a free user, I can play with up to 2 total players
- As a paid user, I can play with up to 10 total players
- As a match creator, I can configure game settings

**Functional Requirements:**
- Room code generation (6-digit alphanumeric)
- Player capacity enforcement based on tier
- Real-time player joining/leaving
- Game settings configuration (dice count, round limits)
- Private match history

**Technical Requirements:**
- Supabase real-time channels for match communication
- Room state management
- Player capacity validation
- Match cleanup after completion

### 3.4 Matchmaking System
**User Stories:**
- As a player, I can join casual matches for fun gameplay
- As a player, I can join ranked matches to improve my rating
- As a player, I can see estimated wait times
- As a player, I can cancel matchmaking queue

**Functional Requirements:**
- **Casual Matchmaking**: No rating impact, faster matching
- **Ranked Matchmaking**: ELO-based rating system, skill-based matching
- Queue management with estimated wait times
- Match balancing based on player skill levels
- Reconnection handling for dropped connections

**Technical Requirements:**
- Matchmaking algorithm with skill-based pairing
- Queue management system
- Real-time queue status updates
- Connection stability monitoring

### 3.5 Global Leaderboard
**User Stories:**
- As a player, I can view global rankings
- As a player, I can see my current rank and rating
- As a player, I can filter leaderboards by time period
- As a player, I can view detailed player profiles

**Functional Requirements:**
- Global leaderboard with ELO ratings
- Seasonal rankings (monthly/quarterly resets)
- Player profile pages with detailed statistics
- Leaderboard filtering options
- Top player showcasing

**Technical Requirements:**
- Efficient ranking queries with pagination
- Real-time rank updates
- Caching for performance
- Statistics aggregation

### 3.6 Game Engine
**User Stories:**
- As a player, I can play standard Liar's Dice rules
- As a player, I can see game state clearly
- As a player, I can make bids and challenges
- As a player, I can see dice reveals and round results

**Functional Requirements:**
- Standard Liar's Dice gameplay mechanics
- Turn-based gameplay with time limits
- Dice rolling with secure randomization
- Bid validation and challenge resolution
- Game state synchronization across all players

**Technical Requirements:**
- Secure server-side game logic
- Real-time state synchronization
- Cryptographically secure random number generation
- Anti-cheat measures
- Game replay storage

### 3.7 Endgame System (v0.6.5)
**User Stories:**
- As a player, I can experience authentic 1v1 endgame scenarios with sum-based bidding
- As a developer, I can easily test endgame functionality without playing full games
- As a player, I understand the different rules when only 2 players with 1 die each remain

**Functional Requirements:**
- **Endgame Detection**: Automatic detection when 2 active players with 1 die each remain
- **Sum-Based Bidding**: Players bid on total sum of both dice (range 2-12) instead of quantity/face
- **Visual Mode Switch**: UI automatically switches to "FINAL SHOWDOWN" mode with appropriate controls
- **AI Endgame Strategy**: Sophisticated AI logic for sum-based decision making
- **Testing Infrastructure**: Configurable starting dice count (1-5) for rapid testing scenarios

**Technical Requirements:**
- Enhanced bid validation for sum-based logic in endgame scenarios
- Updated challenge resolution to calculate dice sum vs bid comparison
- Dynamic UI components that adapt to normal vs endgame states
- AI endgame strategy ported from reference implementation
- Comprehensive endgame state management across all components

**Testing Features:**
- **Instant Endgame**: 2 players + 1 die each = immediate endgame testing
- **Progressive Testing**: Various dice counts (2-4) for different game length scenarios
- **Visual Indicators**: Special highlighting for quick endgame setup (red buttons, "⚡ INSTANT ENDGAME" text)

## 4. User Interface Requirements

### 4.1 Core UI Components
- **Main Menu**: Play options, profile, leaderboard access
- **Game Board**: Dice display, bid interface, player info
- **Lobby System**: Match creation, joining, player list
- **Profile Screen**: Statistics, achievements, settings
- **Leaderboard**: Rankings, filters, player profiles

### 4.2 Design Principles
- Mobile-first responsive design
- Intuitive touch controls
- Clear visual hierarchy
- Accessibility compliance (WCAG 2.1)
- Consistent cross-platform experience

### 4.3 Performance Requirements
- Game state updates < 100ms latency
- App launch time < 3 seconds
- Smooth 60fps animations
- Offline mode support for single-player

### 4.4 Visual Asset Strategy
- **Art Style**: 2D pixel art for authentic retro casino aesthetic
- **Asset Sources**: Budget-friendly off-the-shelf assets from itch.io ($8-18 total)
- **Implementation**: Custom integration with existing theme system
- **Details**: See CLAUDE.md for complete asset strategy and implementation phases

### 4.5 Casino Visual Design Implementation (Phase 0.6 - Current Focus)

This section outlines the systematic approach to implementing the casino-themed visual redesign across all game components.

#### 4.5.1 Phase 0.6.1: Core Theme System & Layout (v0.6.1)
**Objectives:**
- Establish comprehensive casino color palette and typography system
- Implement responsive layout system optimized for mobile casino aesthetic
- Create reusable style utilities and component base classes

**Key Deliverables:**
- Updated `lib/theme.ts` with complete casino color system
- Mobile-first responsive layout components
- Typography system with casino-appropriate fonts
- Base styling utilities for consistent spacing and sizing

**Components Affected:**
- GameBoard layout restructuring (left/right split design)
- PlayerCard positioning and spacing optimization
- BiddingInterface layout improvements for mobile interaction

#### 4.5.2 Phase 0.6.2: Component Styling Implementation (v0.6.2)
**Objectives:**
- Apply casino theme consistently across all UI components
- Implement intuitive mobile-first interaction patterns
- Enhance visual hierarchy and information density

**Key Deliverables:**
- PlayerCard casino-styled redesign with improved information layout
- BiddingInterface with enhanced mobile usability
- GameHistory component with clear action tracking
- TurnIndicator with prominent visual states
- QuantityStepper with intuitive increment/decrement controls

**Design Principles:**
- Clear visual hierarchy with casino color palette
- Touch-friendly button sizes (minimum 44px tap targets)
- High contrast text for accessibility
- Consistent card-based design language

#### 4.5.3 Phase 0.6.3: Pixel Art Asset Integration (v0.6.3)
**Objectives:**
- Replace placeholder UI elements with acquired pixel art assets
- Implement sprite management system for efficient asset loading
- Create animation framework for dice and UI transitions

**Key Deliverables:**
- AssetManager utility class for sprite loading and caching
- DiceDisplay component updated to use `dice_X_Y.png` sprites
- PixelButton component utilizing button state sprites (normal/hover/clicked)
- PixelPanel component for consistent background styling
- Border and decoration integration across components

**Technical Requirements:**
- Efficient sprite atlasing and loading
- Proper asset scaling for different screen densities
- Fallback handling for asset loading failures
- Performance optimization for asset-heavy components

#### 4.5.4 Phase 0.6.4: Polish & Animation (v0.6.4)
**Objectives:**
- Add smooth animations and transitions throughout the UI
- Implement responsive design refinements
- Add visual feedback and "game juice" effects

**Key Deliverables:**
- Dice rolling animations with realistic physics
- Smooth transitions between game states
- Button press animations and haptic feedback
- Screen shake and particle effects for dramatic moments
- Loading states and skeleton screens

**Animation Guidelines:**
- Subtle, purposeful animations that enhance UX
- Consistent timing and easing curves
- Performance-optimized animations using React Native Animated API
- Respect user accessibility preferences (reduced motion)

#### 4.5.5 Design System Specifications

**Color Palette (Casino Theme):**
```typescript
// Primary casino colors
primary: '#C41E3A',     // Casino red
secondary: '#1B5E20',   // Felt green  
accent: '#FFD700',      // Gold highlights
background: '#0D1B2A',  // Deep navy
surface: '#1A2332',     // Card surface
```

**Typography System:**
- Headers: Bold, high-contrast for game state information
- Body: Medium weight for general game information  
- Monospace: For numerical values (dice counts, bids)
- Icon fonts: For consistent symbol rendering

**Component Hierarchy:**
1. **Game Board**: Primary container with felt background texture
2. **Player Cards**: Elevated surfaces with clear player information
3. **Action Panels**: Interactive areas with prominent call-to-action styling
4. **Status Indicators**: High-visibility elements for game state communication

## 5. Data Model

### 5.1 Core Tables

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  elo_rating INTEGER DEFAULT 1200,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE
);

-- Game matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_type TEXT NOT NULL CHECK (match_type IN ('single_player', 'private', 'casual', 'ranked')),
  room_code TEXT UNIQUE, -- For private matches
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'completed', 'abandoned')),
  max_players INTEGER DEFAULT 2,
  current_players INTEGER DEFAULT 0,
  game_settings JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  winner_id UUID REFERENCES users(id)
);

-- Match participants
CREATE TABLE match_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  player_position INTEGER NOT NULL,
  dice_count INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  placement INTEGER, -- Final ranking in match
  elo_change INTEGER DEFAULT 0, -- For ranked matches
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE
);

-- Game state for real-time updates
CREATE TABLE game_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  round_number INTEGER DEFAULT 1,
  current_player_id UUID REFERENCES users(id),
  current_bid JSONB, -- {quantity: number, face_value: number}
  dice_rolls JSONB, -- Encrypted player dice
  phase TEXT DEFAULT 'bidding' CHECK (phase IN ('bidding', 'challenging', 'revealing', 'round_end')),
  time_limit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game actions log
CREATE TABLE game_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('bid', 'challenge', 'dice_lost', 'round_win')),
  action_data JSONB,
  round_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player statistics
CREATE TABLE player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_type TEXT NOT NULL,
  total_games INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  successful_challenges INTEGER DEFAULT 0,
  failed_challenges INTEGER DEFAULT 0,
  successful_bluffs INTEGER DEFAULT 0,
  average_game_length INTERVAL,
  best_elo_rating INTEGER,
  current_win_streak INTEGER DEFAULT 0,
  longest_win_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard (materialized view for performance)
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
  u.id,
  u.username,
  u.display_name,
  u.avatar_url,
  u.elo_rating,
  u.games_played,
  u.games_won,
  ROUND((u.games_won::float / NULLIF(u.games_played, 0)) * 100, 2) as win_rate,
  ps.current_win_streak,
  ps.longest_win_streak,
  ROW_NUMBER() OVER (ORDER BY u.elo_rating DESC) as rank
FROM users u
LEFT JOIN player_stats ps ON u.id = ps.user_id AND ps.match_type = 'ranked'
WHERE u.games_played > 0
ORDER BY u.elo_rating DESC;

-- Refresh leaderboard periodically
CREATE INDEX idx_leaderboard_elo ON users(elo_rating DESC);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_room_code ON matches(room_code);
CREATE INDEX idx_match_participants_match_id ON match_participants(match_id);
CREATE INDEX idx_game_states_match_id ON game_states(match_id);
```

### 5.3 AI Implementation Reference

The computer AI system should implement a sophisticated confidence-based approach for decision making, based on the following reference from the previous version:

```typescript
// Core AI decision types
interface AIMove {
  shouldChallenge: boolean;
  bid?: Bid;
}

// AI difficulty configuration
interface AIDifficulty {
  challengeThreshold: number;    // Confidence level to challenge
  bidAcceptanceThreshold: number; // Confidence level to accept making bid
  probabilityMultiplier: number;  // Adjustment to probability calculations
}

const AI_DIFFICULTIES: Record<string, AIDifficulty> = {
  easy: {
    challengeThreshold: -0.25,      // More conservative challenging
    bidAcceptanceThreshold: -0.05,  // More conservative bidding
    probabilityMultiplier: 0.9      // Slightly pessimistic estimates
  },
  medium: {
    challengeThreshold: -0.35,      // Baseline from implementation
    bidAcceptanceThreshold: -0.15,  // Baseline from implementation
    probabilityMultiplier: 1.0      // Standard probability (33% per die)
  },
  hard: {
    challengeThreshold: -0.45,      // More aggressive challenging
    bidAcceptanceThreshold: -0.25,  // More aggressive bidding
    probabilityMultiplier: 1.1      // Slightly optimistic estimates
  }
};

// Key AI functions (to be implemented based on reference)
generateComputerMove(player, players, currentBid, isEndGame): AIMove
calculateBidConfidence(bid, ownDice, totalDice, ownDiceCount): number
calculateBidProbability(bid, ownDice, totalDice): number
generateEndGameMove(player, currentBid): AIMove
generateNormalGameMove(player, players, currentBid): AIMove
```

**AI Decision Flow:**
1. **Endgame Detection**: Special logic for 1v1 with single dice
2. **Confidence Calculation**: Evaluate current bid against known dice
3. **Challenge Decision**: Challenge if confidence below threshold
4. **Bid Generation**: Find best valid bid within confidence range
5. **Fallback Strategy**: Challenge if no confident bids available

**Integration Points:**
- `game_states.ai_moves` - Log AI decisions for analysis
- `matches.ai_difficulty` - Store difficulty setting per match
- Real-time AI move delays for natural pacing

```javascript
// Supabase real-time channels
const gameChannels = {
  match: `match:${matchId}`,           // Match-level updates
  lobby: `lobby:${roomCode}`,          // Lobby/waiting room
  leaderboard: 'leaderboard:global'    // Global leaderboard updates
};
```

## 6. User Flows

### 6.1 New User Onboarding
1. Download app / visit website
2. Create account or continue as guest
3. Complete tutorial game
4. Access main menu with all features

### 6.2 Ranked Match Flow
1. Select "Ranked Match" from main menu
2. Enter matchmaking queue
3. Match found, enter game lobby
4. Game starts with 2-6 players
5. Play complete match
6. View results and ELO changes
7. Return to main menu

### 6.3 Private Match Flow
1. Select "Private Match" from main menu
2. Choose "Create" or "Join"
3. If creating: configure settings, share room code
4. If joining: enter room code
5. Wait in lobby for other players
6. Host starts game when ready
7. Play and view results

## 7. Monetization Strategy

### 7.1 Free Tier
- Single player mode (unlimited)
- Private matches (2 players max)
- Casual matchmaking (unlimited)
- Ranked matchmaking (unlimited)
- Basic leaderboard access

### 7.2 Premium Tier ($4.99/month)
- Private matches (10 players max)
- Priority matchmaking queue
- Advanced statistics and analytics
- Extended match history
- Custom avatar uploads

### 7.3 Future Monetization (Phase 2)
- Dice skins and themes ($0.99-$4.99)
- In-game betting with virtual currency
- Tournament entry fees
- Cosmetic customizations

## 8. Success Metrics

### 8.1 User Engagement
- Daily Active Users (DAU)
- Average session duration
- Games played per user per day
- Return rate (Day 1, Day 7, Day 30)

### 8.2 Monetization
- Premium conversion rate
- Average revenue per user (ARPU)
- Lifetime value (LTV)
- Churn rate

### 8.3 Game Performance
- Average matchmaking time
- Game completion rate
- Player retention in matches
- Real-time latency metrics

## 9. Technical Considerations

### 9.1 Scalability
- Supabase connection pooling
- Efficient database queries with proper indexing
- CDN for static assets
- Real-time connection management

### 9.2 Security
- Server-side game logic validation
- Encrypted dice storage
- Rate limiting on all endpoints
- Anti-cheat measures

### 9.3 Performance
- Optimized React Native bundle size
- Lazy loading for non-critical features
- Efficient state management
- Caching strategies

## 10. Launch Strategy

### 10.1 MVP Features (Phase 1)
- Account creation/login
- Single player mode
- Private matches (2 players)
- Basic matchmaking
- Simple leaderboard

### 10.2 Post-Launch Features (Phase 2)
- Premium tier implementation
- Enhanced statistics
- Tournament system
- Social features (friends, chat)

### 10.3 Future Enhancements (Phase 3)
- Cosmetic monetization
- In-game betting mode
- Advanced AI opponents
- Spectator mode

## 12. Development Implementation Guide

### 12.1 Project Initialization
```bash
# Project setup
npx create-expo-app liars-dice --template typescript
cd liars-dice

# Initialize GitHub repository
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/username/liars-dice.git
git push -u origin main

# Install dependencies
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
npm install @supabase/realtime-js

# Initialize Supabase
supabase init
supabase start
supabase migration new initial_schema
```

### 12.2 Database Migration Strategy
```bash
# Create migration files in order
supabase migration new 001_create_users_table
supabase migration new 002_create_matches_table
supabase migration new 003_create_game_states_table
supabase migration new 004_create_indexes_and_views

# Apply migrations locally
supabase db reset

# Test migrations
supabase db diff

# Deploy to production
supabase db push
```

### 12.3 Git Checkpoint Strategy (GitHub)
```bash
# Create feature branches for development
git checkout -b feature/database-setup
git add .
git commit -m "feat: setup database schema and migrations"
git push origin feature/database-setup

# Create pull request on GitHub, review, and merge to main
# Then create tagged releases
git checkout main
git pull origin main

# Major feature checkpoints with GitHub releases
git tag -a v0.1.0 -m "Database schema and auth setup"
git tag -a v0.2.0 -m "Single player mode complete"
git tag -a v0.3.0 -m "Private matches implemented"
git tag -a v0.4.0 -m "Matchmaking system ready"
git tag -a v0.5.0 -m "Leaderboard functionality"
git tag -a v0.6.1 -m "Core casino theme system and layout"
git tag -a v0.6.2 -m "Component casino styling implementation"
git tag -a v0.6.3 -m "Pixel art asset integration complete"
git tag -a v0.6.4 -m "Game table redesign with center bid focus"
git tag -a v0.7.0 -m "Advanced features and social systems"
git tag -a v1.0.0 -m "MVP ready for production"

# Push with tags to create GitHub releases
git push origin main --tags
```

### 12.4 Environment Configuration
```bash
# Local development (.env.local)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Production (Vercel environment variables)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=production-anon-key
SUPABASE_SERVICE_ROLE_KEY=production-service-role-key
```

### 12.5 Deployment Checklist
- [ ] Database migrations applied via Supabase CLI
- [ ] Environment variables configured in Vercel
- [ ] GitHub repository connected to Vercel
- [ ] Branch protection rules enabled on main branch
- [ ] Automatic deployments configured for main branch
- [ ] Preview deployments tested via pull requests
- [ ] Production deployment verified
- [ ] GitHub releases created for major versions

### 12.6 Development Milestones
1. **Phase 1**: Database setup and authentication (v0.1.0)
2. **Phase 2**: Single player mode with AI (v0.2.0)
3. **Phase 3**: Private match system (v0.3.0)
4. **Phase 4**: Matchmaking implementation (v0.4.0)
5. **Phase 5**: Leaderboard and statistics (v0.5.0)
6. **Phase 0.6**: Casino Visual Redesign (v0.6.x) - **✅ COMPLETED**
   - ✅ v0.6.1: Core theme system and layout restructuring
   - ✅ v0.6.2: Component-by-component casino styling implementation  
   - ✅ v0.6.3: Pixel art asset integration and sprite management
   - ✅ v0.6.4: Game table redesign with center bid focus and simplified bidding interface
   - ✅ v0.6.5: Endgame implementation and testing features
7. **Phase 7**: Advanced features and social systems (v0.7.0)
8. **Phase 8**: MVP production ready (v1.0.0)

## 14. Risk Assessment

### 13.1 Technical Risks
- Real-time synchronization complexity
- Cross-platform compatibility issues
- Supabase scaling limitations
- Network connectivity handling

### 13.2 Business Risks
- User acquisition costs
- Competitive market saturation
- Monetization conversion rates
- Platform policy changes

### 13.3 Mitigation Strategies
- Comprehensive testing across platforms
- Gradual feature rollout
- Performance monitoring
- Alternative backend planning