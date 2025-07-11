import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Animated, ImageBackground, Image } from 'react-native'
import { Player } from '../types/game'
import { CasinoTheme } from '../lib/theme'
// import { PixelPanel } from './PixelPanel'  // TEMPORARILY COMMENTED OUT
import { assetManager } from '../lib/AssetManager'

interface PlayerCardProps {
  player: Player
  isCurrentPlayer: boolean
  isHumanPlayer: boolean
  variant?: 'opponent' | 'self' // New prop for different layouts
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCurrentPlayer,
  isHumanPlayer,
  variant = 'opponent'
}) => {
  // Simplified component - no complex animations for pixel art style

  // Render different layouts based on variant
  if (variant === 'opponent') {
    return (
      <View style={[
        styles.opponentCard,
        isCurrentPlayer && styles.currentPlayer,
        !player.is_active && styles.inactive
      ]}>
        <Text style={styles.opponentLabel}>OPPONENT</Text>
        <View style={styles.opponentInfo}>
          <View style={styles.opponentDice}>
            {/* Show dice count as blocks */}
            {Array.from({ length: player.dice_count }, (_, i) => (
              <View key={i} style={styles.diceBlock} />
            ))}
          </View>
        </View>
        {!player.is_active && (
          <Text style={styles.eliminatedLabel}>OUT</Text>
        )}
      </View>
    )
  } else {
    // Self variant - Player card at bottom
    return (
      <View style={[
        styles.playerCard,
        isCurrentPlayer && styles.currentPlayer,
        !player.is_active && styles.inactive
      ]}>
        <Text style={styles.playerLabel}>PLAYER</Text>
        <Text style={styles.playerName}>{player.username}</Text>
        {!player.is_active && (
          <Text style={styles.eliminatedLabel}>OUT</Text>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  // Opponent Card - Top row cards matching mockup
  opponentCard: {
    minWidth: 120,
    minHeight: 100,
    backgroundColor: '#d4af37', // Gold background
    borderWidth: 2,
    borderTopColor: '#FFEC8B', // Gold highlight
    borderLeftColor: '#FFEC8B',
    borderRightColor: '#CC9900', // Gold shadow
    borderBottomColor: '#CC9900',
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 8,
  },
  opponentLabel: {
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular',
    color: '#2A2A2A', // Dark text on gold
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },
  opponentInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opponentDice: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  diceBlock: {
    width: 12,
    height: 12,
    backgroundColor: '#2A2A2A', // Dark dice blocks
    borderRadius: 3,
    margin: 2,
  },

  // Player Card - Bottom center card matching mockup
  playerCard: {
    backgroundColor: '#d4af37', // Gold background
    borderWidth: 3,
    borderTopColor: '#FFEC8B', // Gold highlight
    borderLeftColor: '#FFEC8B',
    borderRightColor: '#CC9900', // Gold shadow
    borderBottomColor: '#CC9900',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 200,
  },
  playerLabel: {
    fontSize: 16,
    fontFamily: 'PressStart2P_400Regular',
    color: '#2A2A2A', // Dark text on gold
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 10,
  },
  playerName: {
    fontSize: 14,
    fontFamily: 'PressStart2P_400Regular',
    color: '#2A2A2A', // Dark text on gold
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // State modifiers
  currentPlayer: {
    borderTopColor: '#FFFFFF', // Brighter highlight when current
    borderLeftColor: '#FFFFFF',
    backgroundColor: '#FFD700', // Brighter gold when current
  },
  inactive: {
    opacity: 0.5,
    backgroundColor: '#999999', // Gray when eliminated
    borderTopColor: '#BBBBBB',
    borderLeftColor: '#BBBBBB',
    borderRightColor: '#777777',
    borderBottomColor: '#777777',
  },
  eliminatedLabel: {
    fontSize: 10,
    fontFamily: 'PressStart2P_400Regular',
    color: '#FF0000', // Red for eliminated
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 4,
  },
})