import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// Custom storage adapter for Expo/React Native
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
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