import React, { useState } from 'react'
import { View, Text, StyleSheet, Animated, TouchableOpacity, Modal } from 'react-native'
import { GameAction } from '../types/game'
import { GameHistory } from './GameHistory'
import { PixelButtonCSS } from './PixelButtonCSS'

interface GameLogModalProps {
  isVisible: boolean
  actions: GameAction[]
  players: { [id: string]: string }
  isEndgame: boolean
  onClose: () => void
}

export const GameLogModal: React.FC<GameLogModalProps> = ({
  isVisible,
  actions,
  players,
  isEndgame,
  onClose
}) => {
  const [fadeAnim] = useState(new Animated.Value(0))

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible])

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.container,
            { opacity: fadeAnim }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🎲 GAME LOG</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Game History Content */}
          <View style={styles.historyContainer}>
            <GameHistory
              actions={actions}
              players={players}
              isEndgame={isEndgame}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <PixelButtonCSS
              text="CLOSE"
              onPress={onClose}
              color="gold"
              size="medium"
              style={styles.closeModalButton}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#2a4a2a', // Casino felt green
    borderRadius: 16,
    width: '95%',
    maxWidth: 500,
    maxHeight: '85%',
    borderWidth: 3,
    borderColor: '#d4af37', // Gold
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37',
  },
  title: {
    fontSize: 18,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    letterSpacing: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  closeText: {
    fontSize: 24,
    fontFamily: 'PressStart2P_400Regular',
    color: '#f5f5dc', // Cream
    lineHeight: 24,
  },
  historyContainer: {
    flex: 1,
    padding: 16,
    minHeight: 200,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderTopWidth: 1,
    borderTopColor: '#d4af37',
    alignItems: 'center',
  },
  closeModalButton: {
    minWidth: 120,
  },
})