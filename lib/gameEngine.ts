import { Player, Bid, GameState, GameAction, GameMove, GameRules } from '../types/game'

export const GAME_RULES: GameRules = {
  STARTING_DICE: 5,
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 6,
  DICE_FACES: 6,
  ONES_ARE_WILD: true,
  TIME_LIMIT_SECONDS: 30
}

export class GameEngine {
  private gameState: GameState
  private actions: GameAction[]

  constructor(gameState: GameState) {
    this.gameState = gameState
    this.actions = []
  }

  // Roll dice for a player
  rollDice(player: Player): number[] {
    const dice: number[] = []
    for (let i = 0; i < player.dice_count; i++) {
      dice.push(Math.floor(Math.random() * GAME_RULES.DICE_FACES) + 1)
    }
    return dice
  }

  // Roll dice for all players at the start of a round
  startNewRound(): void {
    this.gameState.players.forEach(player => {
      if (player.is_active) {
        player.dice = this.rollDice(player)
      }
    })
    this.gameState.current_bid = null
    this.gameState.phase = 'bidding'
    this.gameState.current_player_index = this.findNextActivePlayer(this.gameState.current_player_index)
  }

  // Validate if a bid is legal
  isValidBid(bid: Bid, currentBid: Bid | null): boolean {
    if (!currentBid) {
      return bid.quantity > 0 && bid.face_value >= 1 && bid.face_value <= GAME_RULES.DICE_FACES
    }

    // Must either increase quantity or face value (or both)
    if (bid.quantity > currentBid.quantity) {
      return bid.face_value >= 1 && bid.face_value <= GAME_RULES.DICE_FACES
    } else if (bid.quantity === currentBid.quantity) {
      return bid.face_value > currentBid.face_value && bid.face_value <= GAME_RULES.DICE_FACES
    }

    return false
  }

  // Make a bid
  makeBid(playerId: string, bid: Bid): boolean {
    const player = this.gameState.players.find(p => p.id === playerId)
    if (!player || !player.is_active) return false

    if (this.gameState.current_player_index !== this.gameState.players.indexOf(player)) {
      return false
    }

    if (!this.isValidBid(bid, this.gameState.current_bid)) {
      return false
    }

    this.gameState.current_bid = bid
    this.gameState.current_player_index = this.findNextActivePlayer(this.gameState.current_player_index)

    this.addAction({
      type: 'bid',
      player_id: playerId,
      data: bid,
      timestamp: new Date()
    })

    return true
  }

  // Challenge the current bid
  challengeBid(challengerId: string): { success: boolean, challengeSuccessful: boolean, loserId: string } {
    const challenger = this.gameState.players.find(p => p.id === challengerId)
    if (!challenger || !challenger.is_active || !this.gameState.current_bid) {
      return { success: false, challengeSuccessful: false, loserId: '' }
    }

    const currentBid = this.gameState.current_bid
    const totalDice = this.countTotalDice(currentBid.face_value)

    const challengeSuccessful = totalDice < currentBid.quantity
    const loserId = challengeSuccessful ? currentBid.player_id : challengerId

    this.gameState.phase = 'revealing'

    this.addAction({
      type: 'challenge',
      player_id: challengerId,
      data: {
        bid: currentBid,
        total_dice: totalDice,
        successful: challengeSuccessful
      },
      timestamp: new Date()
    })

    // Remove a die from the loser
    this.removeDieFromPlayer(loserId)

    return { success: true, challengeSuccessful, loserId }
  }

  // Count total dice of a specific face value (including ones if wild)
  private countTotalDice(faceValue: number): number {
    let count = 0
    this.gameState.players.forEach(player => {
      if (player.is_active) {
        player.dice.forEach(die => {
          if (die === faceValue || (GAME_RULES.ONES_ARE_WILD && die === 1 && faceValue !== 1)) {
            count++
          }
        })
      }
    })
    return count
  }

  // Remove a die from a player
  private removeDieFromPlayer(playerId: string): void {
    const player = this.gameState.players.find(p => p.id === playerId)
    if (!player) return

    player.dice_count = Math.max(0, player.dice_count - 1)
    
    if (player.dice_count === 0) {
      player.is_active = false
    }

    this.addAction({
      type: 'dice_lost',
      player_id: playerId,
      data: { remaining_dice: player.dice_count },
      timestamp: new Date()
    })

    // Check if game is over
    this.checkGameOver()
  }

  // Find the next active player
  private findNextActivePlayer(currentIndex: number): number {
    const activePlayers = this.gameState.players.filter(p => p.is_active)
    if (activePlayers.length <= 1) return currentIndex

    let nextIndex = (currentIndex + 1) % this.gameState.players.length
    while (!this.gameState.players[nextIndex].is_active) {
      nextIndex = (nextIndex + 1) % this.gameState.players.length
    }
    return nextIndex
  }

  // Check if the game is over
  private checkGameOver(): void {
    const activePlayers = this.gameState.players.filter(p => p.is_active)
    
    if (activePlayers.length === 1) {
      this.gameState.is_game_over = true
      this.gameState.winner_id = activePlayers[0].id
      this.gameState.phase = 'round_end'

      this.addAction({
        type: 'game_over',
        player_id: activePlayers[0].id,
        data: { winner: activePlayers[0] },
        timestamp: new Date()
      })
    }
  }

  // Add an action to the game log
  private addAction(action: GameAction): void {
    this.actions.push(action)
  }

  // Get the current game state
  getGameState(): GameState {
    return { ...this.gameState }
  }

  // Get all game actions
  getActions(): GameAction[] {
    return [...this.actions]
  }

  // Get current player
  getCurrentPlayer(): Player | null {
    return this.gameState.players[this.gameState.current_player_index] || null
  }

  // Get active players
  getActivePlayers(): Player[] {
    return this.gameState.players.filter(p => p.is_active)
  }

  // Calculate total dice count for all active players
  getTotalDiceCount(): number {
    return this.getActivePlayers().reduce((total, player) => total + player.dice_count, 0)
  }

  // Get possible bids for current player
  getPossibleBids(): Bid[] {
    const currentBid = this.gameState.current_bid
    const totalDice = this.getTotalDiceCount()
    const possibleBids: Bid[] = []

    for (let quantity = 1; quantity <= totalDice; quantity++) {
      for (let faceValue = 1; faceValue <= GAME_RULES.DICE_FACES; faceValue++) {
        const bid: Bid = {
          quantity,
          face_value: faceValue,
          player_id: this.getCurrentPlayer()?.id || ''
        }

        if (this.isValidBid(bid, currentBid)) {
          possibleBids.push(bid)
        }
      }
    }

    return possibleBids
  }

  // Process a player's move
  processMove(playerId: string, move: GameMove): boolean {
    if (move.type === 'bid' && move.bid) {
      return this.makeBid(playerId, move.bid)
    } else if (move.type === 'challenge') {
      const result = this.challengeBid(playerId)
      return result.success
    }
    return false
  }

  // Create a new game state
  static createNewGame(players: Player[], matchId: string): GameState {
    const gameState: GameState = {
      id: `game_${Date.now()}`,
      match_id: matchId,
      players: players.map(p => ({
        ...p,
        dice_count: GAME_RULES.STARTING_DICE,
        dice: [],
        is_active: true
      })),
      current_player_index: 0,
      current_bid: null,
      round_number: 1,
      phase: 'bidding',
      time_limit: null,
      winner_id: null,
      is_game_over: false
    }

    return gameState
  }
}