import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { Player } from '../types/game'
import { CasinoTheme } from '../lib/theme'

interface PlayerCardProps {
  player: Player
  isCurrentPlayer: boolean
  isHumanPlayer: boolean
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCurrentPlayer,
  isHumanPlayer
}) => {
  const [glowAnim] = useState(new Animated.Value(0))

  useEffect(() => {
    if (isCurrentPlayer) {
      // Glow animation when becoming current player
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 500,
          useNativeDriver: false,
        })
      ]).start()
    } else {
      // Fade out glow when no longer current player
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }
  }, [isCurrentPlayer])

  const getDiceCountStyle = () => {
    if (player.dice_count <= 1) {
      return styles.criticalDiceCount
    } else if (player.dice_count === 2) {
      return styles.lowDiceCount
    } else {
      return styles.normalDiceCount
    }
  }

  const getDiceCountBadgeStyle = () => {
    if (player.dice_count <= 1) {
      return styles.criticalBadge
    } else if (player.dice_count === 2) {
      return styles.lowBadge
    } else {
      return styles.normalBadge
    }
  }

  const animatedGlowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(76, 175, 80, 0)', 'rgba(76, 175, 80, 0.3)']
  })

  return (
    <Animated.View style={[
      styles.container,
      isCurrentPlayer && styles.currentPlayerContainer,
      !player.is_active && styles.inactiveContainer,
      isCurrentPlayer && { 
        shadowColor: '#4CAF50',
        shadowOpacity: glowAnim,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        elevation: 6,
      }
    ]}>
      <View style={styles.playerInfo}>
        <View style={styles.nameRow}>
          <Text style={[
            styles.playerName,
            isHumanPlayer && styles.humanPlayerName
          ]}>
            {player.username}
          </Text>
          {player.is_ai && (
            <Text style={styles.aiLabel}>AI</Text>
          )}
        </View>
        
        <View style={styles.statusRow}>
          <View style={[styles.diceCountBadge, getDiceCountBadgeStyle()]}>
            <Text style={[styles.diceCountNumber, getDiceCountStyle()]}>
              {player.dice_count}
            </Text>
            <Text style={styles.diceLabel}>dice</Text>
          </View>
          {!player.is_active && (
            <Text style={styles.eliminatedText}>OUT</Text>
          )}
        </View>
      </View>

      {isCurrentPlayer && (
        <View style={styles.currentPlayerIndicator}>
          <Text style={styles.currentPlayerText}>▶</Text>
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CasinoTheme.colors.charcoal,
    padding: CasinoTheme.spacing.md,
    marginVertical: CasinoTheme.spacing.xs,
    borderRadius: CasinoTheme.borderRadius.md,
    borderWidth: 3,
    borderColor: CasinoTheme.colors.goldDark,
    ...CasinoTheme.shadows.medium,
  },
  currentPlayerContainer: {
    borderColor: CasinoTheme.colors.gold,
    backgroundColor: CasinoTheme.colors.charcoalLight,
    borderWidth: 4,
    ...CasinoTheme.shadows.large,
  },
  inactiveContainer: {
    opacity: 0.6,
    backgroundColor: CasinoTheme.colors.charcoalDark,
    borderColor: CasinoTheme.colors.gray,
  },
  playerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: CasinoTheme.spacing.xs,
  },
  playerName: {
    color: CasinoTheme.colors.cream,
    fontSize: 18,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.body,
  },
  humanPlayerName: {
    color: CasinoTheme.colors.gold,
    textShadowColor: CasinoTheme.colors.charcoalDark,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  aiLabel: {
    color: CasinoTheme.colors.charcoalDark,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: CasinoTheme.colors.orange,
    paddingHorizontal: CasinoTheme.spacing.xs,
    paddingVertical: 2,
    borderRadius: CasinoTheme.borderRadius.sm,
    borderWidth: 1,
    borderColor: CasinoTheme.colors.orangeLight,
    ...CasinoTheme.fonts.body,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentPlayerIndicator: {
    marginLeft: CasinoTheme.spacing.sm,
  },
  currentPlayerText: {
    color: CasinoTheme.colors.gold,
    fontSize: 18,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.header,
  },
  diceCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CasinoTheme.spacing.sm,
    paddingVertical: CasinoTheme.spacing.xs,
    borderRadius: CasinoTheme.borderRadius.lg,
    gap: CasinoTheme.spacing.xs,
    borderWidth: 2,
  },
  diceCountNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.numbers,
  },
  diceLabel: {
    fontSize: 12,
    color: CasinoTheme.colors.creamDark,
    ...CasinoTheme.fonts.body,
  },
  normalDiceCount: {
    color: CasinoTheme.colors.cream,
  },
  lowDiceCount: {
    color: CasinoTheme.colors.orangeLight,
  },
  criticalDiceCount: {
    color: CasinoTheme.colors.casinoRedLight,
  },
  normalBadge: {
    backgroundColor: CasinoTheme.colors.casinoGreenDark,
    borderColor: CasinoTheme.colors.casinoGreen,
  },
  lowBadge: {
    backgroundColor: CasinoTheme.colors.orange + '40', // 25% opacity
    borderColor: CasinoTheme.colors.orangeLight,
  },
  criticalBadge: {
    backgroundColor: CasinoTheme.colors.casinoRedDark,
    borderColor: CasinoTheme.colors.casinoRed,
  },
  eliminatedText: {
    color: CasinoTheme.colors.casinoRedLight,
    fontSize: 12,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.body,
  },
})