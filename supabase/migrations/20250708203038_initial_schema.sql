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

-- Create indexes for performance
CREATE INDEX idx_leaderboard_elo ON users(elo_rating DESC);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_room_code ON matches(room_code);
CREATE INDEX idx_match_participants_match_id ON match_participants(match_id);
CREATE INDEX idx_game_states_match_id ON game_states(match_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read public match info" ON matches
  FOR SELECT USING (true);

CREATE POLICY "Users can create matches" ON matches
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Match participants can read their match data" ON match_participants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Game states are readable by match participants" ON game_states
  FOR SELECT USING (
    match_id IN (
      SELECT match_id FROM match_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Game actions are readable by match participants" ON game_actions
  FOR SELECT USING (
    match_id IN (
      SELECT match_id FROM match_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read their own stats" ON player_stats
  FOR SELECT USING (auth.uid() = user_id);