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
    const ownDie = player.dice[0]

    if (!currentBid) {
      // Initial bid - use difficulty to vary aggressiveness
      // Easy: more conservative (+1), Medium: balanced (+2), Hard: more aggressive (+3)
      const aggressivenessBuffer = this.difficulty.bidAcceptanceThreshold > -0.1 ? 1 : 
                                  this.difficulty.bidAcceptanceThreshold > -0.2 ? 2 : 3
      const initialSum = Math.min(12, ownDie + aggressivenessBuffer)
      
      return {
        shouldChallenge: false,
        bid: {
          quantity: 1, // Quantity is ignored in endgame
          face_value: initialSum, // Sum value goes in face_value field
          player_id: player.id
        }
      }
    }

    // Calculate confidence in current bid using endgame-specific logic
    const confidence = this.calculateEndgameConfidence(currentBid.face_value, ownDie)
    
    // Use existing difficulty threshold for challenge decision
    if (confidence < this.difficulty.challengeThreshold) {
      return { shouldChallenge: true }
    }

    // Challenge if bid exceeds maximum possible sum (always)
    const maxPossibleSum = ownDie + 6 // Our die + maximum opponent die (6)
    if (currentBid.face_value > maxPossibleSum) {
      return { shouldChallenge: true }
    }

    // Try to make next bid if confidence allows
    const nextSum = currentBid.face_value + 1
    if (nextSum <= 12) {
      const nextBidConfidence = this.calculateEndgameConfidence(nextSum, ownDie)
      
      // Use existing difficulty threshold for bid acceptance
      if (nextBidConfidence >= this.difficulty.bidAcceptanceThreshold) {
        return {
          shouldChallenge: false,
          bid: {
            quantity: 1, // Quantity is ignored in endgame
            face_value: nextSum,
            player_id: player.id
          }
        }
      }
    }

    // If no confident bid can be made, challenge
    return { shouldChallenge: true }
  }

  // Calculate confidence in an endgame bid (adapting existing confidence pattern)
  private calculateEndgameConfidence(bidSum: number, ownDie: number): number {
    const maxPossibleSum = ownDie + 6  // Our die + max opponent die (6)
    const minPossibleSum = ownDie + 1  // Our die + min opponent die (1)
    
    // If bid is impossible, maximum negative confidence
    if (bidSum > maxPossibleSum) {
      return -1.0
    }
    
    // If bid is guaranteed (our die alone exceeds it), maximum confidence
    if (bidSum < minPossibleSum) {
      return 1.0
    }
    
    // Calculate confidence based on how much "room" we have
    // Higher bids (closer to maximum) are less confident
    // This mirrors the existing confidence calculation pattern
    const range = maxPossibleSum - minPossibleSum
    const position = bidSum - minPossibleSum
    const confidence = 1.0 - (position / range)
    
    // Scale to match existing confidence range (-1 to 1)
    return (confidence * 2) - 1
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

      // Very conservative opening bid - only bid what we have plus a small buffer
      const otherDice = totalDice - ownDice.length
      const smallBuffer = Math.min(1, Math.floor(otherDice / 8)) // Very small expectation from others
      
      return {
        shouldChallenge: false,
        bid: {
          quantity: Math.max(1, bestValue.count + smallBuffer),
          face_value: bestValue.value,
          player_id: player.id
        }
      }
    }

    // Calculate confidence in current bid
    const confidence = this.calculateBidConfidence(currentBid, ownDice, totalDice, ownDice.length)
    
    // Use difficulty-based challenge threshold
    if (confidence < this.difficulty.challengeThreshold) {
      return { shouldChallenge: true }
    }

    // Try to find a good bid to make
    const nextBid = this.findBestBid(player, players, currentBid)
    if (nextBid) {
      const bidConfidence = this.calculateBidConfidence(nextBid, ownDice, totalDice, ownDice.length)
      
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

      // Fix: Allow AI to increase face value with same quantity OR increase quantity
      const minQuantity = currentBid ? 
        (value > currentBid.face_value ? currentBid.quantity : currentBid.quantity + 1) : 1
      
      // Much more conservative bidding - only bid what we can reasonably support
      const otherDice = totalDice - ownDice.length
      
      // Only expect a small number from others, not a percentage
      // This prevents AI from making huge leaps in quantity
      const maxReasonableIncrease = Math.min(2, Math.floor(otherDice / 6)) // At most 2, or 1 per 6 other dice
      const maxQuantity = Math.min(totalDice, count + maxReasonableIncrease)

      for (let qty = minQuantity; qty <= maxQuantity; qty++) {
        const bid: Bid = { quantity: qty, face_value: value, player_id: player.id }
        
        // Sanity check: never bid more than 40% of total dice
        if (qty > totalDice * 0.4) {
          continue
        }
        
        if (this.isValidBid(bid, currentBid)) {
          const confidence = this.calculateBidConfidence(bid, ownDice, totalDice, ownDice.length)
          // Use difficulty-based threshold instead of hardcoded -0.15
          if (confidence >= this.difficulty.bidAcceptanceThreshold) {
            possibleBids.push(bid)
          }
        }
      }
    })

    if (possibleBids.length === 0) {
      return null
    }

    // Add variety to AI bid selection - don't always pick highest confidence
    const topBids = possibleBids
      .map(bid => ({
        bid,
        confidence: this.calculateBidConfidence(bid, ownDice, totalDice, ownDice.length),
        variety: Math.random() * 0.1 // Small random factor for variety
      }))
      .sort((a, b) => (b.confidence + b.variety) - (a.confidence + a.variety))
    
    // Pick from top 3 bids for variety
    const topChoices = topBids.slice(0, Math.min(3, topBids.length))
    const selectedChoice = topChoices[Math.floor(Math.random() * topChoices.length)]
    
    let bestBid = selectedChoice.bid

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