import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Player } from '../types/game'

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
  const renderDiceCount = () => {
    const diceIcons = []
    for (let i = 0; i < player.dice_count; i++) {
      diceIcons.push(
        <View key={i} style={styles.diceIcon}>
          <Text style={styles.diceText}>⚀</Text>
        </View>
      )
    }
    return diceIcons
  }

  return (
    <View style={[
      styles.container,
      isCurrentPlayer && styles.currentPlayerContainer,
      !player.is_active && styles.inactiveContainer
    ]}>
      <View style={styles.playerInfo}>
        <Text style={[
          styles.playerName,
          isHumanPlayer && styles.humanPlayerName
        ]}>
          {player.username}
          {player.is_ai && (
            <Text style={styles.aiLabel}> (AI)</Text>
          )}
        </Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.diceCount}>
            {player.dice_count} dice
          </Text>
          {!player.is_active && (
            <Text style={styles.eliminatedText}>ELIMINATED</Text>
          )}
        </View>
      </View>

      <View style={styles.diceContainer}>
        {renderDiceCount()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currentPlayerContainer: {
    borderColor: '#4CAF50',
    backgroundColor: '#2a3a2a',
  },
  inactiveContainer: {
    opacity: 0.5,
    backgroundColor: '#1a1a1a',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  humanPlayerName: {
    color: '#4CAF50',
  },
  aiLabel: {
    color: '#FF9800',
    fontSize: 14,
    fontWeight: 'normal',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  diceCount: {
    color: '#ccc',
    fontSize: 16,
  },
  eliminatedText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: 'bold',
  },
  diceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    maxWidth: 100,
  },
  diceIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 4,
  },
  diceText: {
    color: '#fff',
    fontSize: 12,
  },
})