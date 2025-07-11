import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { GameAction } from '../types/game'
import { CasinoTheme } from '../lib/theme'

interface GameHistoryProps {
  actions: GameAction[]
  players: { [id: string]: string } // Map of player IDs to names
}

export const GameHistory: React.FC<GameHistoryProps> = ({ actions, players }) => {
  const formatAction = (action: GameAction): string => {
    const playerName = players[action.player_id] || 'Unknown'
    
    switch (action.type) {
      case 'bid':
        if (action.data && typeof action.data === 'object' && 'quantity' in action.data && 'face_value' in action.data) {
          return `${playerName} bid ${action.data.quantity} × ${action.data.face_value}`
        }
        return `${playerName} made a bid`
        
      case 'challenge':
        if (action.data && typeof action.data === 'object' && 'successful' in action.data) {
          const challengeData = action.data as { successful: boolean, bid: any, total_dice: number }
          const outcome = challengeData.successful ? 'succeeded' : 'failed'
          const bid = challengeData.bid
          return `${playerName} challenged ${bid.quantity} × ${bid.face_value} (${outcome} - actual: ${challengeData.total_dice})`
        }
        return `${playerName} challenged the bid`
        
      case 'dice_lost':
        if (action.data && typeof action.data === 'object' && 'remaining_dice' in action.data) {
          const remaining = (action.data as { remaining_dice: number }).remaining_dice
          return `${playerName} lost a die (${remaining} remaining)`
        }
        return `${playerName} lost a die`
        
      case 'game_over':
        return `${playerName} won the game!`
        
      case 'round_win':
        return `${playerName} won the round`
        
      default:
        return `${playerName} performed an action`
    }
  }

  const getActionIcon = (type: string): string => {
    switch (type) {
      case 'bid':
        return '🎲'
      case 'challenge':
        return '⚔️'
      case 'dice_lost':
        return '💔'
      case 'game_over':
        return '🏆'
      case 'round_win':
        return '✅'
      default:
        return '📝'
    }
  }

  const getActionStyle = (type: string) => {
    switch (type) {
      case 'bid':
        return styles.bidAction
      case 'challenge':
        return styles.challengeAction
      case 'dice_lost':
        return styles.lossAction
      case 'game_over':
        return styles.gameOverAction
      case 'round_win':
        return styles.winAction
      default:
        return styles.defaultAction
    }
  }

  const formatTime = (timestamp: Date): string => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {actions.length === 0 ? (
          <Text style={styles.emptyText}>No actions yet...</Text>
        ) : (
          actions.slice().reverse().map((action, index) => (
            <View key={index} style={[styles.actionContainer, getActionStyle(action.type)]}>
              <View style={styles.actionHeader}>
                <Text style={styles.actionIcon}>
                  {getActionIcon(action.type)}
                </Text>
                <Text style={styles.actionTime}>
                  {formatTime(action.timestamp)}
                </Text>
              </View>
              <Text style={styles.actionText}>
                {formatAction(action)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    margin: 0,
    minHeight: 150,
  },
  scrollView: {
    flex: 1,
  },
  emptyText: {
    color: CasinoTheme.colors.grayLight,
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: CasinoTheme.spacing.lg,
    ...CasinoTheme.fonts.body,
  },
  actionContainer: {
    backgroundColor: CasinoTheme.colors.charcoalLight,
    borderRadius: CasinoTheme.borderRadius.sm,
    padding: CasinoTheme.spacing.sm,
    marginVertical: CasinoTheme.spacing.xs,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: CasinoTheme.colors.goldDark,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CasinoTheme.spacing.xs,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionTime: {
    color: CasinoTheme.colors.grayLight,
    fontSize: 12,
    ...CasinoTheme.fonts.numbers,
  },
  actionText: {
    color: CasinoTheme.colors.cream,
    fontSize: 14,
    lineHeight: 18,
    ...CasinoTheme.fonts.body,
  },
  bidAction: {
    borderLeftColor: CasinoTheme.colors.casinoGreen,
  },
  challengeAction: {
    borderLeftColor: CasinoTheme.colors.casinoRed,
  },
  lossAction: {
    borderLeftColor: CasinoTheme.colors.orange,
  },
  gameOverAction: {
    borderLeftColor: CasinoTheme.colors.purple,
  },
  winAction: {
    borderLeftColor: CasinoTheme.colors.gold,
  },
  defaultAction: {
    borderLeftColor: CasinoTheme.colors.gray,
  },
})