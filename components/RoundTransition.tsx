import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { Player } from '../types/game'

interface RoundTransitionProps {
  isVisible: boolean
  transitionType: 'round_start' | 'player_eliminated' | 'round_end' | 'game_over'
  eliminatedPlayer?: Player | null
  roundNumber?: number
  winnerName?: string
  onComplete: () => void
}

export const RoundTransition: React.FC<RoundTransitionProps> = ({
  isVisible,
  transitionType,
  eliminatedPlayer,
  roundNumber,
  winnerName,
  onComplete
}) => {
  const [fadeAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0.8))
  const [slideAnim] = useState(new Animated.Value(50))

  useEffect(() => {
    if (isVisible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        })
      ]).start()

      // Auto complete based on transition type
      const duration = getDisplayDuration()
      const timer = setTimeout(() => {
        hideTransition()
      }, duration)

      return () => clearTimeout(timer)
    } else {
      resetAnimation()
    }
  }, [isVisible, transitionType])

  const getDisplayDuration = () => {
    switch (transitionType) {
      case 'player_eliminated':
        return 3000 // 3 seconds for elimination
      case 'round_start':
        return 2000 // 2 seconds for round start
      case 'round_end':
        return 2500 // 2.5 seconds for round end
      case 'game_over':
        return 4000 // 4 seconds for game over
      default:
        return 2000
    }
  }

  const hideTransition = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      onComplete()
    })
  }

  const resetAnimation = () => {
    fadeAnim.setValue(0)
    scaleAnim.setValue(0.8)
    slideAnim.setValue(50)
  }

  const getTransitionContent = () => {
    switch (transitionType) {
      case 'player_eliminated':
        return {
          icon: '💀',
          title: 'Player Eliminated!',
          message: `${eliminatedPlayer?.username || 'A player'} has been eliminated from the game`,
          bgColor: 'rgba(244, 67, 54, 0.9)',
          borderColor: '#f44336'
        }
      
      case 'round_start':
        return {
          icon: '🎲',
          title: `Round ${roundNumber || 1}`,
          message: 'New round starting!\nRoll your dice and make your move',
          bgColor: 'rgba(33, 150, 243, 0.9)',
          borderColor: '#2196F3'
        }
      
      case 'round_end':
        return {
          icon: '🏁',
          title: 'Round Complete',
          message: 'Round finished!\nPreparing next round...',
          bgColor: 'rgba(76, 175, 80, 0.9)',
          borderColor: '#4CAF50'
        }
      
      case 'game_over':
        return {
          icon: '🏆',
          title: 'Game Over!',
          message: `${winnerName || 'Player'} wins the game!\nCongratulations!`,
          bgColor: 'rgba(156, 39, 176, 0.9)',
          borderColor: '#9C27B0'
        }
      
      default:
        return {
          icon: '🎯',
          title: 'Game Update',
          message: 'Something happened in the game',
          bgColor: 'rgba(96, 125, 139, 0.9)',
          borderColor: '#607D8B'
        }
    }
  }

  if (!isVisible) {
    return null
  }

  const content = getTransitionContent()

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.container,
          {
            backgroundColor: content.bgColor,
            borderColor: content.borderColor,
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ]
          }
        ]}
      >
        <Text style={styles.icon}>{content.icon}</Text>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.message}>{content.message}</Text>
        
        {transitionType === 'player_eliminated' && eliminatedPlayer && (
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>
              {eliminatedPlayer.username}
              {eliminatedPlayer.is_ai && <Text style={styles.aiLabel}> (AI)</Text>}
            </Text>
            <Text style={styles.eliminationReason}>
              Lost their last die
            </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  container: {
    borderRadius: 20,
    padding: 32,
    margin: 20,
    alignItems: 'center',
    borderWidth: 3,
    minWidth: 300,
    maxWidth: 350,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  playerInfo: {
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  aiLabel: {
    fontSize: 14,
    fontWeight: 'normal',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  eliminationReason: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
})