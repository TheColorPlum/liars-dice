import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'
import { mockSupabase } from './mockAuth'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// Check if we should use mock authentication (when local Supabase isn't available)
const shouldUseMockAuth = () => {
  return supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')
}

// Platform-specific storage adapter
const createStorageAdapter = () => {
  if (Platform.OS === 'web') {
    // Use localStorage for web
    return {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          return Promise.resolve(window.localStorage.getItem(key))
        }
        return Promise.resolve(null)
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value)
        }
        return Promise.resolve()
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key)
        }
        return Promise.resolve()
      },
    }
  } else {
    // Use SecureStore for mobile
    const SecureStore = require('expo-secure-store')
    return {
      getItem: (key: string) => {
        return SecureStore.getItemAsync(key)
      },
      setItem: (key: string, value: string) => {
        return SecureStore.setItemAsync(key, value)
      },
      removeItem: (key: string) => {
        return SecureStore.deleteItemAsync(key)
      },
    }
  }
}

// Create either real or mock Supabase client
export const supabase = shouldUseMockAuth() ? mockSupabase : createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Database types based on our schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          display_name: string | null
          avatar_url: string | null
          tier: 'free' | 'premium'
          elo_rating: number
          games_played: number
          games_won: number
          created_at: string
          updated_at: string
          last_active: string | null
        }
        Insert: {
          id?: string
          email: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          tier?: 'free' | 'premium'
          elo_rating?: number
          games_played?: number
          games_won?: number
          created_at?: string
          updated_at?: string
          last_active?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          tier?: 'free' | 'premium'
          elo_rating?: number
          games_played?: number
          games_won?: number
          created_at?: string
          updated_at?: string
          last_active?: string | null
        }
      }
      matches: {
        Row: {
          id: string
          match_type: 'single_player' | 'private' | 'casual' | 'ranked'
          room_code: string | null
          status: 'waiting' | 'in_progress' | 'completed' | 'abandoned'
          max_players: number
          current_players: number
          game_settings: any
          created_by: string | null
          created_at: string
          started_at: string | null
          ended_at: string | null
          winner_id: string | null
        }
        Insert: {
          id?: string
          match_type: 'single_player' | 'private' | 'casual' | 'ranked'
          room_code?: string | null
          status?: 'waiting' | 'in_progress' | 'completed' | 'abandoned'
          max_players?: number
          current_players?: number
          game_settings?: any
          created_by?: string | null
          created_at?: string
          started_at?: string | null
          ended_at?: string | null
          winner_id?: string | null
        }
        Update: {
          id?: string
          match_type?: 'single_player' | 'private' | 'casual' | 'ranked'
          room_code?: string | null
          status?: 'waiting' | 'in_progress' | 'completed' | 'abandoned'
          max_players?: number
          current_players?: number
          game_settings?: any
          created_by?: string | null
          created_at?: string
          started_at?: string | null
          ended_at?: string | null
          winner_id?: string | null
        }
      }
      match_participants: {
        Row: {
          id: string
          match_id: string
          user_id: string | null
          player_position: number
          dice_count: number
          is_active: boolean
          placement: number | null
          elo_change: number
          joined_at: string
          left_at: string | null
        }
        Insert: {
          id?: string
          match_id: string
          user_id?: string | null
          player_position: number
          dice_count?: number
          is_active?: boolean
          placement?: number | null
          elo_change?: number
          joined_at?: string
          left_at?: string | null
        }
        Update: {
          id?: string
          match_id?: string
          user_id?: string | null
          player_position?: number
          dice_count?: number
          is_active?: boolean
          placement?: number | null
          elo_change?: number
          joined_at?: string
          left_at?: string | null
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']