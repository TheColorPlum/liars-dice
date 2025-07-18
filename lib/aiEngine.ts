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
    const totalDice = this.getTotalDiceCount(players)
    const ownDice = player.dice
    const onesCount = ownDice.filter(d => d === 1).length
    
    // Count our matching dice for each value (including ones as wild)
    const getOwnDiceCounts = () => {
      const counts: { [key: number]: number } = {}
      for (let i = 2; i <= 6; i++) {
        const actualCount = ownDice.filter(d => d === i).length
        counts[i] = actualCount + onesCount
      }
      return counts
    }

    const ownDiceCounts = getOwnDiceCounts()

    if (!currentBid) {
      // Find our strongest value for opening bid
      const bestValue = Object.entries(ownDiceCounts)
        .reduce((best, [value, count]) => count > best.count ? { value: Number(value), count } : best,
          { value: 2, count: -1 })

      // Conservative opening bid
      const otherDice = totalDice - ownDice.length
      const expectedOthers = Math.floor(otherDice * 0.33)
      
      return {
        shouldChallenge: false,
        bid: {
          quantity: Math.max(1, bestValue.count + expectedOthers),
          face_value: bestValue.value,
          player_id: player.id
        }
      }
    }

    // Calculate confidence in current bid
    const confidence = this.calculateBidConfidence(currentBid, ownDice, totalDice, ownDice.length)
    
    // More aggressive challenging - use working implementation thresholds
    if (confidence < -0.35) {
      return { shouldChallenge: true }
    }

    // Try to find a good bid to make
    const nextBid = this.findBestBid(player, players, currentBid)
    if (nextBid) {
      const bidConfidence = this.calculateBidConfidence(nextBid, ownDice, totalDice, ownDice.length)
      
      if (bidConfidence >= -0.15) {
        return {
          shouldChallenge: false,
          bid: nextBid
        }
      }
    }

    // If no good bid found, challenge
    return { shouldChallenge: true }
  }

  // Calculate confidence in a bid (based on working implementation)
  private calculateBidConfidence(bid: Bid, ownDice: number[], totalDice: number, ownDiceCount: number): number {
    const ownMatches = this.countMatches(ownDice, bid.face_value)
    const otherDice = totalDice - ownDiceCount
    const neededFromOthers = bid.quantity - ownMatches
    
    if (neededFromOthers <= 0) {
      return 1.0 // We already have enough dice
    }
    
    if (neededFromOthers > otherDice) {
      return -1.0 // Impossible to achieve
    }
    
    // Base confidence on:
    // 1. What percentage of needed dice we have
    // 2. How reasonable it is to expect the remaining from others
    const ownSupportRatio = ownMatches / bid.quantity
    const neededRatio = neededFromOthers / otherDice
    
    // More confident if:
    // - We have a higher percentage of needed dice
    // - We need a lower percentage from others
    return ownSupportRatio - (neededRatio * 0.6)
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
    const ownDice = player.dice
    const onesCount = ownDice.filter(d => d === 1).length
    const possibleBids: Bid[] = []

    // Count our dice for each value
    const ownDiceCounts: { [key: number]: number } = {}
    for (let i = 2; i <= 6; i++) {
      const actualCount = ownDice.filter(d => d === i).length
      ownDiceCounts[i] = actualCount + onesCount
    }

    // Generate possible bids based on our dice
    Object.entries(ownDiceCounts).forEach(([valueStr, count]) => {
      const value = Number(valueStr)
      if (count === 0) return

      const minQuantity = currentBid ? 
        (currentBid.quantity === undefined || currentBid.face_value > value ? currentBid.quantity + 1 : currentBid.quantity) : 1
      const maxQuantity = Math.min(totalDice, count + Math.ceil((totalDice - ownDice.length) * 0.5))

      for (let qty = minQuantity; qty <= maxQuantity; qty++) {
        const bid: Bid = { quantity: qty, face_value: value, player_id: player.id }
        
        if (this.isValidBid(bid, currentBid)) {
          const confidence = this.calculateBidConfidence(bid, ownDice, totalDice, ownDice.length)
          if (confidence >= -0.15) {
            possibleBids.push(bid)
          }
        }
      }
    })

    if (possibleBids.length === 0) {
      return null
    }

    // Find bid with highest confidence
    let bestBid = possibleBids[0]
    let bestScore = this.calculateBidConfidence(bestBid, ownDice, totalDice, ownDice.length)

    for (const bid of possibleBids) {
      const confidence = this.calculateBidConfidence(bid, ownDice, totalDice, ownDice.length)
      const valueBonus = bid.face_value / 20 // Small bonus for higher values
      const score = confidence + valueBonus
      
      if (score > bestScore) {
        bestScore = score
        bestBid = bid
      }
    }

    return bestBid
  }

  // Check if bid is valid (higher than current bid)
  private isValidBid(bid: Bid, currentBid: Bid | null): boolean {
    // 1s are wild and cannot be bid on
    if (bid.face_value < 2 || bid.face_value > 6) {
      return false
    }

    if (bid.quantity <= 0) {
      return false
    }

    if (!currentBid) return true

    if (bid.quantity > currentBid.quantity) {
      return true
    } else if (bid.quantity === currentBid.quantity) {
      // Cannot bid same quantity and higher face value if current is already 6
      if (currentBid.face_value === 6) {
        return false
      }
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
    isEndGame: boolean,
    isSinglePlayer: boolean = false
  ): Promise<AIMove> {
    // Faster pacing for single player mode, normal for multiplayer
    const delay = isSinglePlayer ? 
      Math.random() * 500 + 500 :  // 0.5-1s for single player
      Math.random() * 2000 + 1000   // 1-3s for multiplayer
    
    return new Promise(resolve => {
      setTimeout(() => {
        const move = this.generateComputerMove(player, players, currentBid, isEndGame)
        resolve(move)
      }, delay)
    })
  }
}