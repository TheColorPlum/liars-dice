import { Player, Bid, AIMove, AIDifficulty, AI_DIFFICULTIES } from '../types/game'
import { GAME_RULES } from './gameEngine'

export class AIEngine {
  private difficulty: AIDifficulty

  constructor(difficulty: 'easy' | 'medium' | 'hard') {
    this.difficulty = AI_DIFFICULTIES[difficulty]
  }

  // Generate AI move based on current game state
  generateComputerMove(
    player: Player,
    players: Player[],
    currentBid: Bid | null,
    isEndGame: boolean
  ): AIMove {
    if (isEndGame) {
      return this.generateEndGameMove(player, currentBid)
    }

    return this.generateNormalGameMove(player, players, currentBid)
  }

  // Generate move for endgame scenario (1v1 with single dice)
  private generateEndGameMove(player: Player, currentBid: Bid | null): AIMove {
    if (!currentBid) {
      // Make a conservative first bid
      return {
        shouldChallenge: false,
        bid: {
          quantity: 1,
          face_value: this.getHighestDie(player.dice),
          player_id: player.id
        }
      }
    }

    // In endgame, we know our die, so we can be more certain
    const ownDie = player.dice[0]
    const bidMatches = ownDie === currentBid.face_value || 
                      (GAME_RULES.ONES_ARE_WILD && ownDie === 1 && currentBid.face_value !== 1)

    if (currentBid.quantity === 1) {
      // If bid is 1, challenge if we don't have it
      return { shouldChallenge: !bidMatches }
    }

    // If bid is 2 or more, always challenge (impossible with 1 die each)
    return { shouldChallenge: true }
  }

  // Generate move for normal game scenario
  private generateNormalGameMove(player: Player, players: Player[], currentBid: Bid | null): AIMove {
    if (!currentBid) {
      // Make opening bid
      return {
        shouldChallenge: false,
        bid: this.generateOpeningBid(player, players)
      }
    }

    // Calculate confidence in current bid
    const confidence = this.calculateBidConfidence(currentBid, player.dice, this.getTotalDiceCount(players), player.dice_count)

    // Decide whether to challenge
    if (confidence < this.difficulty.challengeThreshold) {
      return { shouldChallenge: true }
    }

    // Try to find a good bid to make
    const nextBid = this.findBestBid(player, players, currentBid)
    if (nextBid) {
      const bidConfidence = this.calculateBidConfidence(nextBid, player.dice, this.getTotalDiceCount(players), player.dice_count)
      
      if (bidConfidence >= this.difficulty.bidAcceptanceThreshold) {
        return {
          shouldChallenge: false,
          bid: nextBid
        }
      }
    }

    // If no good bid found, challenge
    return { shouldChallenge: true }
  }

  // Calculate confidence in a bid (-1 to 1, higher is more confident)
  private calculateBidConfidence(bid: Bid, ownDice: number[], totalDice: number, ownDiceCount: number): number {
    const probability = this.calculateBidProbability(bid, ownDice, totalDice)
    const adjustedProbability = probability * this.difficulty.probabilityMultiplier

    // Convert probability to confidence score
    // 0.5 probability = 0 confidence
    // 1.0 probability = 1 confidence
    // 0.0 probability = -1 confidence
    return (adjustedProbability - 0.5) * 2
  }

  // Calculate probability that a bid is true
  private calculateBidProbability(bid: Bid, ownDice: number[], totalDice: number): number {
    const ownMatches = this.countMatches(ownDice, bid.face_value)
    const otherDice = totalDice - ownDice.length
    const needed = Math.max(0, bid.quantity - ownMatches)

    if (needed === 0) return 1.0
    if (needed > otherDice) return 0.0

    // Probability per die for others (1/6 for specific face + 1/6 for wilds if applicable)
    const probPerDie = bid.face_value === 1 ? 1/6 : 2/6 // 1s are wild except when bidding 1s

    // Use binomial probability for needed successes
    return this.binomialProbability(otherDice, needed, probPerDie)
  }

  // Count matching dice (including wilds)
  private countMatches(dice: number[], faceValue: number): number {
    return dice.filter(die => 
      die === faceValue || (GAME_RULES.ONES_ARE_WILD && die === 1 && faceValue !== 1)
    ).length
  }

  // Calculate binomial probability
  private binomialProbability(n: number, k: number, p: number): number {
    if (k > n) return 0
    if (k === 0) return Math.pow(1 - p, n)

    let probability = 0
    for (let i = k; i <= n; i++) {
      probability += this.binomialCoefficient(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i)
    }
    return probability
  }

  // Calculate binomial coefficient (n choose k)
  private binomialCoefficient(n: number, k: number): number {
    if (k > n - k) k = n - k
    let result = 1
    for (let i = 0; i < k; i++) {
      result *= (n - i) / (i + 1)
    }
    return result
  }

  // Generate opening bid
  private generateOpeningBid(player: Player, players: Player[]): Bid {
    const totalDice = this.getTotalDiceCount(players)
    const ownDice = player.dice
    const highestDie = this.getHighestDie(ownDice)

    // Conservative opening: bid what we have
    const matches = this.countMatches(ownDice, highestDie)
    const quantity = Math.max(1, matches)

    return {
      quantity,
      face_value: highestDie,
      player_id: player.id
    }
  }

  // Find the best bid to make
  private findBestBid(player: Player, players: Player[], currentBid: Bid): Bid | null {
    const totalDice = this.getTotalDiceCount(players)
    const possibleBids: Bid[] = []

    // Generate all possible bids
    for (let quantity = 1; quantity <= totalDice; quantity++) {
      for (let faceValue = 1; faceValue <= GAME_RULES.DICE_FACES; faceValue++) {
        const bid: Bid = { quantity, face_value: faceValue, player_id: player.id }
        
        if (this.isValidBid(bid, currentBid)) {
          possibleBids.push(bid)
        }
      }
    }

    // Find bid with highest confidence
    let bestBid: Bid | null = null
    let bestConfidence = -Infinity

    for (const bid of possibleBids) {
      const confidence = this.calculateBidConfidence(bid, player.dice, totalDice, player.dice_count)
      if (confidence > bestConfidence) {
        bestConfidence = confidence
        bestBid = bid
      }
    }

    return bestBid
  }

  // Check if bid is valid (higher than current bid)
  private isValidBid(bid: Bid, currentBid: Bid | null): boolean {
    if (!currentBid) return true

    if (bid.quantity > currentBid.quantity) {
      return true
    } else if (bid.quantity === currentBid.quantity) {
      return bid.face_value > currentBid.face_value
    }

    return false
  }

  // Get highest die value
  private getHighestDie(dice: number[]): number {
    return Math.max(...dice)
  }

  // Calculate total dice count
  private getTotalDiceCount(players: Player[]): number {
    return players.filter(p => p.is_active).reduce((total, p) => total + p.dice_count, 0)
  }

  // Add delay for natural AI pacing
  async makeDelayedMove(
    player: Player,
    players: Player[],
    currentBid: Bid | null,
    isEndGame: boolean
  ): Promise<AIMove> {
    // Random delay between 1-3 seconds for natural feel
    const delay = Math.random() * 2000 + 1000
    
    return new Promise(resolve => {
      setTimeout(() => {
        const move = this.generateComputerMove(player, players, currentBid, isEndGame)
        resolve(move)
      }, delay)
    })
  }
}