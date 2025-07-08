// Quick test of our game engine
import { GameEngine } from './lib/gameEngine.js'
import { AIEngine } from './lib/aiEngine.js'

// Test the game engine
const players = [
  { id: '1', username: 'Player 1', dice_count: 5, dice: [], is_active: true, is_ai: false },
  { id: '2', username: 'AI 1', dice_count: 5, dice: [], is_active: true, is_ai: true, ai_difficulty: 'medium' }
]

const gameState = GameEngine.createNewGame(players, 'test-match')
const gameEngine = new GameEngine(gameState)

console.log('Testing game engine...')
console.log('Initial game state:', gameState)

// Start a round
gameEngine.startNewRound()
console.log('After starting round:', gameEngine.getGameState())

// Test AI
const aiEngine = new AIEngine('medium')
const aiPlayer = players[1]
const aiMove = aiEngine.generateComputerMove(aiPlayer, players, null, false)
console.log('AI move:', aiMove)

console.log('Game engine test complete!')