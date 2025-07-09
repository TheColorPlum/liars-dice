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
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 2,
  },
  humanTurnIndicator: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  aiTurnIndicator: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    borderColor: '#FF9800',
  },
  indicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  turnIcon: {
    fontSize: 20,
  },
  turnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  humanTurnText: {
    color: '#4CAF50',
  },
  aiTurnText: {
    color: '#FF9800',
  },
  thinkingDots: {
    marginTop: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9800',
  },
})