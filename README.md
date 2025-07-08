# Liar's Dice - Cross-Platform Multiplayer Game

A modern implementation of the classic Liar's Dice game built with Expo (React Native) and Supabase, featuring cross-platform support for mobile and web.

## Features

### ✅ Phase 1 Complete (v0.2.0)
- **Single Player Mode**: Play against AI opponents with 3 difficulty levels
- **Intelligent AI**: Confidence-based decision making system
- **Complete Game Engine**: Dice rolling, bidding, challenge mechanics
- **User Authentication**: Email/password and guest mode support
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Modern UI**: Dark theme with intuitive touch controls

### 🚧 Coming Soon
- **Private Matches**: Create and join private games with room codes
- **Ranked Matchmaking**: Skill-based matchmaking with ELO rating
- **Global Leaderboard**: View rankings and player statistics
- **Real-time Multiplayer**: Supabase real-time synchronization

## Tech Stack

- **Frontend**: Expo (React Native) with TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Database**: PostgreSQL with Row Level Security
- **Deployment**: Vercel (web), Supabase (backend)
- **State Management**: React Context

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase CLI (optional for local development)
- Docker Desktop (for local Supabase instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/liars-dice.git
   cd liars-dice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start the development server**
   ```bash
   # For web
   npm run web
   
   # For mobile (requires Expo Go app)
   npm run android  # or npm run ios
   ```

## Development Setup

### Local Supabase Instance (Optional)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Start local Supabase**
   ```bash
   supabase start
   ```

3. **Apply database migrations**
   ```bash
   supabase db reset
   ```

4. **Use local environment variables**
   ```bash
   # In .env.local
   EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
   ```

### Production Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Apply database migrations**
   ```bash
   supabase db push
   ```
3. **Update environment variables** with your production credentials

## Game Rules

Liar's Dice is a bluffing game where players bid on the total number of dice showing a particular face value across all players' dice.

### Basic Rules
- Each player starts with 5 dice
- Players take turns making bids or challenging the previous bid
- A bid consists of a quantity and face value (e.g., "3 fours")
- Ones are wild (count as any face value)
- When challenged, all dice are revealed
- The loser removes one die; eliminated players are out
- Last player standing wins

### Bidding Rules
- First bid can be any quantity/face value
- Subsequent bids must be higher:
  - Higher quantity with same or different face value
  - Same quantity with higher face value
- Players can challenge instead of bidding

## Project Structure

```
liars-dice/
├── components/          # React components
│   ├── AuthScreen.tsx
│   ├── GameBoard.tsx
│   ├── MainMenu.tsx
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── GameContext.tsx
├── lib/               # Core logic
│   ├── gameEngine.ts
│   ├── aiEngine.ts
│   └── supabase.ts
├── types/             # TypeScript types
│   └── game.ts
├── supabase/          # Database migrations
│   └── migrations/
└── assets/            # Images and icons
```

## API Reference

### Game Engine
- `GameEngine`: Core game logic and state management
- `AIEngine`: AI decision making with configurable difficulty
- `GameState`: Complete game state representation

### Authentication
- `useAuth()`: Authentication hook with sign in/up/out
- `useGame()`: Game state management hook

## Database Schema

The game uses PostgreSQL with the following main tables:
- `users` - Player profiles and statistics
- `matches` - Game instances and settings
- `match_participants` - Players in each match
- `game_states` - Real-time game state
- `game_actions` - Action history and replay data

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## Development Roadmap

### Phase 2: Private Matches (v0.3.0)
- [ ] Room code generation and joining
- [ ] Real-time multiplayer synchronization
- [ ] Player capacity management (free: 2, premium: 10)
- [ ] Lobby system with game configuration

### Phase 3: Matchmaking (v0.4.0)
- [ ] Casual and ranked matchmaking queues
- [ ] ELO rating system
- [ ] Global leaderboard
- [ ] Player statistics and analytics

### Phase 4: Premium Features (v0.5.0)
- [ ] Subscription management
- [ ] Advanced statistics
- [ ] Priority matchmaking
- [ ] Custom avatars

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issues page.

---

Built with ❤️ using Expo and Supabase