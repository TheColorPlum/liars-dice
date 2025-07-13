import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native'
import { Bid, Player } from '../types/game'
import { DiceDisplay } from './DiceDisplay'

interface DramaticChallengeResultProps {
  isVisible: boolean
  challengedBid: Bid | null
  challengeSuccessful: boolean
  challengerName: string
  bidderName: string
  players: Player[]
  isEndgame: boolean
  onComplete: () => void
  capturedDiceState?: Player[] // Use this instead of players for dice display
}

interface RevealedPlayer {
  player: Player
  revealed: boolean
  count: number // running count of matching dice
}

export const DramaticChallengeResult: React.FC<DramaticChallengeResultProps> = ({
  isVisible,
  challengedBid,
  challengeSuccessful,
  challengerName,
  bidderName,
  players,
  isEndgame,
  onComplete,
  capturedDiceState
}) => {
  const [fadeAnim] = useState(new Animated.Value(0))
  const [revealedPlayers, setRevealedPlayers] = useState<RevealedPlayer[]>([])
  const [currentRevealIndex, setCurrentRevealIndex] = useState(-1)
  const [totalCount, setTotalCount] = useState(0)
  const [showFinalResult, setShowFinalResult] = useState(false)
  const [challengedPlayerIndex, setChallengedPlayerIndex] = useState(-1)

  // Reset state when visibility changes
  useEffect(() => {
    if (isVisible && challengedBid && (capturedDiceState || players).length > 0) {
      console.log('🎭 Starting dramatic challenge sequence...')
      
      // Use captured dice state if available, otherwise fall back to current players
      const playersToUse = capturedDiceState || players
      console.log('🎭 Using dice state:', capturedDiceState ? 'CAPTURED' : 'CURRENT')
      console.log('🎭 Players data:', playersToUse.map(p => ({ 
        id: p.id, 
        username: p.username, 
        dice: p.dice, 
        is_active: p.is_active,
        is_ai: p.is_ai 
      })))
      
      // Initialize reveal sequence
      const activePlayers = playersToUse.filter(p => p.is_active)
      console.log('🎭 Active players:', activePlayers.map(p => ({ 
        id: p.id, 
        username: p.username, 
        dice: p.dice, 
        is_ai: p.is_ai 
      })))
      
      // Find challenged player (the one who made the bid) and challenger
      const challengedIdx = activePlayers.findIndex(p => p.id === challengedBid.player_id)
      const challengerIdx = activePlayers.findIndex(p => p.username === challengerName)
      setChallengedPlayerIndex(challengedIdx)
      
      // Create reveal order: challenger first, then others, then challenged player last
      const challengedPlayer = challengedIdx >= 0 ? activePlayers[challengedIdx] : null
      const challengerPlayer = challengerIdx >= 0 ? activePlayers[challengerIdx] : null
      const otherPlayers = activePlayers.filter((_, idx) => idx !== challengedIdx && idx !== challengerIdx)
      
      let revealOrder: Player[] = []
      if (challengerPlayer) revealOrder.push(challengerPlayer)
      revealOrder.push(...otherPlayers)
      if (challengedPlayer) revealOrder.push(challengedPlayer)
      
      const initialRevealed: RevealedPlayer[] = revealOrder.map(player => ({
        player,
        revealed: false,
        count: 0
      }))
      
      // Update challenged player index to match new reveal order
      const newChallengedIdx = revealOrder.findIndex(p => p.id === challengedBid.player_id)
      setChallengedPlayerIndex(newChallengedIdx)
      
      setRevealedPlayers(initialRevealed)
      setCurrentRevealIndex(-1)
      setTotalCount(0)
      setShowFinalResult(false)
      
      // Start animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
      
      // Start reveal sequence after initial delay
      setTimeout(() => {
        startRevealSequence(initialRevealed, revealOrder)
      }, 1000)
    }
  }, [isVisible, challengedBid, players, capturedDiceState])

  const countMatchingDice = (dice: number[], targetFace: number, isEndgame: boolean): number => {
    // Handle missing or empty dice
    if (!dice || dice.length === 0) {
      console.log('🎭 Warning: Player has no dice data:', dice)
      return 0
    }
    
    if (isEndgame) {
      // In endgame, we're looking at the sum
      return dice.reduce((sum, die) => sum + die, 0)
    } else {
      // Normal game: count matching faces (including 1s as wild)
      return dice.reduce((count, die) => {
        if (die === targetFace || (die === 1 && targetFace !== 1)) {
          return count + 1
        }
        return count
      }, 0)
    }
  }

  const startRevealSequence = (revealed: RevealedPlayer[], revealOrder: Player[]) => {
    let index = 0
    
    const revealNext = () => {
      if (index >= revealOrder.length) {
        // All revealed, show final result
        setTimeout(() => {
          setShowFinalResult(true)
        }, 500)
        
        // Auto-complete after showing result
        setTimeout(() => {
          onComplete()
        }, 4000)
        return
      }
      
      const player = revealOrder[index]
      
      console.log('🎭 Revealing player:', {
        username: player.username,
        id: player.id,
        dice: player.dice,
        diceCount: player.dice?.length || 0,
        is_ai: player.is_ai
      })
      
      const playerDiceCount = countMatchingDice(
        player.dice, 
        challengedBid?.face_value || 2, 
        isEndgame
      )
      
      console.log('🎭 Player dice count result:', playerDiceCount)
      
      setCurrentRevealIndex(index)
      
      // Update revealed state for this player using player ID for reliable matching
      setRevealedPlayers(prev => prev.map(rp => 
        rp.player.id === player.id 
          ? { ...rp, revealed: true, count: playerDiceCount }
          : rp
      ))
      
      console.log('🎭 Updated revealed state for:', player.username, 'revealed:', true)
      
      // Update running total
      setTotalCount(prev => {
        const newTotal = isEndgame ? prev + playerDiceCount : prev + playerDiceCount
        return newTotal
      })
      
      index++
      
      // Longer delay for challenged player reveal (final reveal)
      const isLastReveal = index >= revealOrder.length
      const isChallengedPlayer = player.id === challengedBid?.player_id
      const delay = isLastReveal || isChallengedPlayer ? 2000 : 1200
      
      setTimeout(revealNext, delay)
    }
    
    revealNext()
  }

  if (!isVisible || !challengedBid) {
    return null
  }

  const wasExact = isEndgame 
    ? totalCount === challengedBid.face_value
    : totalCount === challengedBid.quantity

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.container,
          { opacity: fadeAnim }
        ]}
      >
        <Text style={styles.title}>
          🎯 CHALLENGE!
        </Text>
        
        <View style={styles.bidInfo}>
          <Text style={styles.label}>Challenged Bid:</Text>
          <Text style={styles.bidText}>
            {isEndgame 
              ? `Sum: ${challengedBid.face_value}`
              : `${challengedBid.quantity} × ${challengedBid.face_value}`
            }
          </Text>
        </View>

        <Text style={styles.revealTitle}>
          {showFinalResult ? 'FINAL RESULT' : 'REVEALING DICE...'}
        </Text>

        {/* Players and their dice reveals - Scrollable */}
        <ScrollView style={styles.playersScrollView} contentContainerStyle={styles.playersContainer}>
          {revealedPlayers.map((revealedPlayer, index) => (
            <View key={revealedPlayer.player.id} style={styles.playerReveal}>
              <Text style={[
                styles.playerName,
                index === challengedPlayerIndex && styles.challengedPlayerName,
                currentRevealIndex === index && styles.currentlyRevealing
              ]}>
                {revealedPlayer.player.username}
                {index === challengedPlayerIndex && ' (CHALLENGED)'}
              </Text>
              
              {revealedPlayer.revealed && (
                <View style={styles.diceReveal}>
                  {revealedPlayer.player.dice && revealedPlayer.player.dice.length > 0 ? (
                    <DiceDisplay 
                      dice={revealedPlayer.player.dice}
                    />
                  ) : (
                    <Text style={styles.noDiceText}>No dice data</Text>
                  )}
                  <Text style={styles.playerCount}>
                    {isEndgame 
                      ? `Sum: ${revealedPlayer.count}`
                      : `Count: ${revealedPlayer.count}`
                    }
                  </Text>
                </View>
              )}
              
              {!revealedPlayer.revealed && currentRevealIndex >= index && (
                <Text style={styles.revealingText}>Revealing...</Text>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Running total - Fixed position */}
        {currentRevealIndex >= 0 && (
          <View style={styles.runningTotal}>
            <Text style={styles.totalLabel}>
              {isEndgame ? 'Total Sum:' : 'Total Count:'}
            </Text>
            <Text style={styles.totalValue}>{totalCount}</Text>
          </View>
        )}

        {/* Final result */}
        {showFinalResult && (
          <View style={styles.finalResult}>
            <Text style={[
              styles.resultText,
              challengeSuccessful ? styles.successText : styles.failureText
            ]}>
              {challengeSuccessful ? '✅ Challenge Successful!' : '❌ Challenge Failed!'}
            </Text>
            
            <Text style={styles.outcomeText}>
              {challengeSuccessful 
                ? `${challengerName} was right - ${bidderName} loses a die!`
                : `${bidderName} was right - ${challengerName} loses a die!`
              }
            </Text>

            {wasExact && (
              <View style={styles.exactBadge}>
                <Text style={styles.exactText}>Exact Count!</Text>
              </View>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#2a4a2a', // Casino felt green
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#d4af37', // Gold
    minWidth: 350,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  bidInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    color: '#f5f5dc', // Cream
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  bidText: {
    color: '#d4af37', // Gold
    fontSize: 18,
    fontFamily: 'PressStart2P_400Regular',
    letterSpacing: 1,
  },
  revealTitle: {
    fontSize: 14,
    fontFamily: 'PressStart2P_400Regular',
    color: '#f5f5dc', // Cream
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  playersScrollView: {
    width: '100%',
    maxHeight: 300, // Limit height to ensure running total is visible
  },
  playersContainer: {
    width: '100%',
    paddingBottom: 10,
  },
  playerReveal: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  playerName: {
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular',
    color: '#f5f5dc', // Cream
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  challengedPlayerName: {
    color: '#ff6b6b', // Red for challenged player
  },
  currentlyRevealing: {
    color: '#d4af37', // Gold for currently revealing
  },
  diceReveal: {
    alignItems: 'center',
    gap: 8,
  },
  playerCount: {
    fontSize: 10,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    letterSpacing: 0.5,
  },
  revealingText: {
    fontSize: 10,
    fontFamily: 'PressStart2P_400Regular',
    color: '#999',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  noDiceText: {
    fontSize: 10,
    fontFamily: 'PressStart2P_400Regular',
    color: '#ff6b6b', // Red to highlight the issue
    letterSpacing: 0.5,
  },
  runningTotal: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)', // Gold background
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular',
    color: '#f5f5dc', // Cream
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 24,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    letterSpacing: 1,
  },
  finalResult: {
    alignItems: 'center',
    marginTop: 16,
  },
  resultText: {
    fontSize: 16,
    fontFamily: 'PressStart2P_400Regular',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  successText: {
    color: '#4CAF50', // Green
  },
  failureText: {
    color: '#f44336', // Red
  },
  outcomeText: {
    color: '#f5f5dc', // Cream
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  exactBadge: {
    backgroundColor: '#FF9800', // Orange
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 12,
  },
  exactText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'PressStart2P_400Regular',
    letterSpacing: 0.5,
  },
})