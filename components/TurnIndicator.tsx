import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { Player } from '../types/game'

interface TurnIndicatorProps {
  currentPlayer: Player | null
  isHumanTurn: boolean
  gamePhase: string
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  currentPlayer,
  isHumanTurn,
  gamePhase
}) => {
  const [pulseAnim] = useState(new Animated.Value(1))
  const [fadeAnim] = useState(new Animated.Value(0))

  useEffect(() => {
    // Fade in animation when component mounts or player changes
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()

    // Pulse animation for human turns
    if (isHumanTurn) {
      const pulseSequence = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      ])

      Animated.loop(pulseSequence).start()
    } else {
      // Stop pulsing for AI turns
      pulseAnim.setValue(1)
    }

    return () => {
      // Cleanup animations
      pulseAnim.stopAnimation()
      fadeAnim.stopAnimation()
    }
  }, [currentPlayer?.id, isHumanTurn])

  if (!currentPlayer) {
    return null
  }

  const getTurnIndicatorStyle = () => {
    if (isHumanTurn) {
      return [styles.turnIndicator, styles.humanTurnIndicator]
    } else {
      return [styles.turnIndicator, styles.aiTurnIndicator]
    }
  }

  const getTurnMessage = () => {
    if (gamePhase === 'revealing') {
      return 'Revealing dice...'
    } else if (gamePhase === 'round_end') {
      return 'Round ending...'
    } else if (isHumanTurn) {
      return 'Your Turn'
    } else {
      return `${currentPlayer.username} is thinking...`
    }
  }

  const getTurnIcon = () => {
    if (gamePhase === 'revealing') {
      return '🎲'
    } else if (gamePhase === 'round_end') {
      return '🏁'
    } else if (isHumanTurn) {
      return '👤'
    } else {
      return '🤖'
    }
  }

  return (
    <Animated.View 
      style={[
        getTurnIndicatorStyle(),
        {
          opacity: fadeAnim,
          transform: isHumanTurn ? [{ scale: pulseAnim }] : []
        }
      ]}
    >
      <View style={styles.indicatorContent}>
        <Text style={styles.turnIcon}>{getTurnIcon()}</Text>
        <Text style={[
          styles.turnText,
          isHumanTurn ? styles.humanTurnText : styles.aiTurnText
        ]}>
          {getTurnMessage()}
        </Text>
      </View>
      
      {!isHumanTurn && gamePhase === 'bidding' && (
        <View style={styles.thinkingDots}>
          <ThinkingDots />
        </View>
      )}
    </Animated.View>
  )
}

const ThinkingDots: React.FC = () => {
  const [dot1] = useState(new Animated.Value(0))
  const [dot2] = useState(new Animated.Value(0))
  const [dot3] = useState(new Animated.Value(0))

  useEffect(() => {
    const animateDots = () => {
      const duration = 400
      const delay = 200

      const sequence = Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0, duration, useNativeDriver: true }),
      ])

      const sequence2 = Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot2, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 0, duration, useNativeDriver: true }),
      ])

      const sequence3 = Animated.sequence([
        Animated.delay(delay * 2),
        Animated.timing(dot3, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 0, duration, useNativeDriver: true }),
      ])

      Animated.loop(
        Animated.parallel([sequence, sequence2, sequence3])
      ).start()
    }

    animateDots()
  }, [])

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  turnIndicator: {
    borderRadius: 6, // More square for pixel art style
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 2,
    minWidth: 180,
  },
  humanTurnIndicator: {
    backgroundColor: '#2a5a2a', // Darker green
    borderTopColor: '#4a8a4a', // Lighter highlight
    borderLeftColor: '#4a8a4a',
    borderRightColor: '#1a4a1a', // Darker shadow
    borderBottomColor: '#1a4a1a',
  },
  aiTurnIndicator: {
    backgroundColor: '#2a4a2a', // Dark felt green
    borderTopColor: '#3a6a3a', // Lighter highlight
    borderLeftColor: '#3a6a3a',
    borderRightColor: '#1a3a1a', // Darker shadow
    borderBottomColor: '#1a3a1a',
  },
  indicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  turnIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#d4af37', // Gold
  },
  turnText: {
    fontSize: 16,
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    letterSpacing: 1,
  },
  humanTurnText: {
    color: '#4CAF50', // Keep green for human
  },
  aiTurnText: {
    color: '#f5f5dc', // Cream for AI
  },
  thinkingDots: {
    marginTop: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    backgroundColor: '#d4af37', // Gold dots
  },
})