export interface Player {
  id: string
  username: string
  display_name?: string
  avatar_url?: string
  dice_count: number
  dice: number[]
  is_active: boolean
  is_ai: boolean
  ai_difficulty?: 'easy' | 'medium' | 'hard'
}

export interface Bid {
  quantity: number
  face_value: number
  player_id: string
}

export interface GameState {
  id: string
  match_id: string
  players: Player[]
  current_player_index: number
  current_bid: Bid | null
  round_number: number
  phase: 'bidding' | 'challenging' | 'revealing' | 'round_end'
  time_limit: Date | null
  winner_id: string | null
  is_game_over: boolean
  pending_round_transition?: {
    next_player_index: number
  }
}

export interface GameAction {
  type: 'bid' | 'challenge' | 'dice_lost' | 'round_win' | 'game_over'
  player_id: string
  data?: any
  timestamp: Date
}

export interface Match {
  id: string
  match_type: 'single_player' | 'private' | 'casual' | 'ranked'
  room_code?: string
  status: 'waiting' | 'in_progress' | 'completed' | 'abandoned'
  max_players: number
  current_players: number
  game_settings: {
    starting_dice: number
    time_limit_seconds: number
    ai_difficulty?: 'easy' | 'medium' | 'hard'
  }
  created_by: string
  created_at: Date
  started_at?: Date
  ended_at?: Date
  winner_id?: string
}

export interface GameMove {
  type: 'bid' | 'challenge'
  bid?: Bid
}

export interface AIMove {
  shouldChallenge: boolean
  bid?: Bid
}

export interface AIDifficulty {
  challengeThreshold: number
  bidAcceptanceThreshold: number
  probabilityMultiplier: number
}

export const AI_DIFFICULTIES: Record<string, AIDifficulty> = {
  easy: {
    challengeThreshold: -0.25,
    bidAcceptanceThreshold: -0.05,
    probabilityMultiplier: 0.9
  },
  medium: {
    challengeThreshold: -0.35,
    bidAcceptanceThreshold: -0.15,
    probabilityMultiplier: 1.0
  },
  hard: {
    challengeThreshold: -0.45,
    bidAcceptanceThreshold: -0.25,
    probabilityMultiplier: 1.1
  }
}

export interface GameRules {
  STARTING_DICE: number
  MIN_PLAYERS: number
  MAX_PLAYERS: number
  DICE_FACES: number
  ONES_ARE_WILD: boolean
  TIME_LIMIT_SECONDS: number
}