import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { GameState, Player, Bid, GameAction, Match, GameMove } from '../types/game'
import { GameEngine } from '../lib/gameEngine'
import { AIEngine } from '../lib/aiEngine'
import { supabase } from '../lib/supabase'

interface GameContextType {
  gameState: GameState | null
  gameEngine: GameEngine | null
  match: Match | null
  loading: boolean
  error: string | null
  startSinglePlayerGame: (aiDifficulty: 'easy' | 'medium' | 'hard') => void
  makeMove: (move: GameMove) => Promise<boolean>
  resetGame: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

type GameStateAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'SET_MATCH'; payload: Match }
  | { type: 'UPDATE_GAME_STATE'; payload: GameState }
  | { type: 'RESET_GAME' }

interface GameProviderState {
  gameState: GameState | null
  gameEngine: GameEngine | null
  match: Match | null
  loading: boolean
  error: string | null
}

const initialState: GameProviderState = {
  gameState: null,
  gameEngine: null,
  match: null,
  loading: false,
  error: null
}

function gameReducer(state: GameProviderState, action: GameStateAction): GameProviderState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_GAME_STATE':
      return { 
        ...state, 
        gameState: action.payload,
        gameEngine: new GameEngine(action.payload),
        loading: false,
        error: null
      }
    case 'SET_MATCH':
      return { ...state, match: action.payload }
    case 'UPDATE_GAME_STATE':
      return { 
        ...state, 
        gameState: action.payload,
        gameEngine: state.gameEngine ? new GameEngine(action.payload) : null
      }
    case 'RESET_GAME':
      return initialState
    default:
      return state
  }
}

interface GameProviderProps {
  children: React.ReactNode
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Start a single player game
  const startSinglePlayerGame = (aiDifficulty: 'easy' | 'medium' | 'hard') => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Create AI players
      const aiPlayers: Player[] = []
      for (let i = 1; i <= 3; i++) {
        aiPlayers.push({
          id: `ai_${i}`,
          username: `AI Player ${i}`,
          display_name: `AI Player ${i}`,
          dice_count: 5,
          dice: [],
          is_active: true,
          is_ai: true,
          ai_difficulty: aiDifficulty
        })
      }

      // Create human player
      const humanPlayer: Player = {
        id: 'human_player',
        username: 'You',
        display_name: 'You',
        dice_count: 5,
        dice: [],
        is_active: true,
        is_ai: false
      }

      const allPlayers = [humanPlayer, ...aiPlayers]
      
      // Create match
      const match: Match = {
        id: `match_${Date.now()}`,
        match_type: 'single_player',
        status: 'in_progress',
        max_players: 4,
        current_players: 4,
        game_settings: {
          starting_dice: 5,
          time_limit_seconds: 30,
          ai_difficulty: aiDifficulty
        },
        created_by: 'human_player',
        created_at: new Date(),
        started_at: new Date()
      }

      // Create game state
      const gameState = GameEngine.createNewGame(allPlayers, match.id)
      
      dispatch({ type: 'SET_MATCH', payload: match })
      dispatch({ type: 'SET_GAME_STATE', payload: gameState })

      // Start first round
      const gameEngine = new GameEngine(gameState)
      gameEngine.startNewRound()
      dispatch({ type: 'UPDATE_GAME_STATE', payload: gameEngine.getGameState() })

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  // Make a move in the game
  const makeMove = async (move: GameMove): Promise<boolean> => {
    if (!state.gameEngine || !state.gameState) return false

    const currentPlayer = state.gameEngine.getCurrentPlayer()
    if (!currentPlayer) return false

    try {
      const success = state.gameEngine.processMove(currentPlayer.id, move)
      
      if (success) {
        const updatedState = state.gameEngine.getGameState()
        dispatch({ type: 'UPDATE_GAME_STATE', payload: updatedState })

        // Process AI moves after human move
        if (!updatedState.is_game_over) {
          setTimeout(() => processAIMoves(), 1000)
        }
      }

      return success
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Move failed' })
      return false
    }
  }

  // Process AI moves
  const processAIMoves = async () => {
    if (!state.gameEngine || !state.gameState) return

    let currentState = state.gameEngine.getGameState()
    const gameEngine = state.gameEngine

    while (!currentState.is_game_over) {
      const currentPlayer = gameEngine.getCurrentPlayer()
      
      if (!currentPlayer || !currentPlayer.is_ai) break

      const aiEngine = new AIEngine(currentPlayer.ai_difficulty || 'medium')
      const activePlayers = gameEngine.getActivePlayers()
      const isEndGame = activePlayers.length === 2 && activePlayers.every(p => p.dice_count === 1)

      try {
        const aiMove = await aiEngine.makeDelayedMove(
          currentPlayer,
          currentState.players,
          currentState.current_bid,
          isEndGame
        )

        if (aiMove.shouldChallenge) {
          gameEngine.challengeBid(currentPlayer.id)
        } else if (aiMove.bid) {
          gameEngine.makeBid(currentPlayer.id, aiMove.bid)
        }

        currentState = gameEngine.getGameState()
        dispatch({ type: 'UPDATE_GAME_STATE', payload: currentState })

        // Break if game is over or it's human player's turn
        if (currentState.is_game_over || !gameEngine.getCurrentPlayer()?.is_ai) {
          break
        }

      } catch (error) {
        console.error('AI move error:', error)
        break
      }
    }
  }

  // Reset the game
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' })
  }

  const value = {
    gameState: state.gameState,
    gameEngine: state.gameEngine,
    match: state.match,
    loading: state.loading,
    error: state.error,
    startSinglePlayerGame,
    makeMove,
    resetGame
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}