import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useGame } from '../contexts/GameContext'
import { PixelButtonCSS } from './PixelButtonCSS'

interface SinglePlayerSetupProps {
  onBack: () => void
  onGameStarted: () => void
}

export const SinglePlayerSetup: React.FC<SinglePlayerSetupProps> = ({
  onBack,
  onGameStarted
}) => {
  const { startSinglePlayerGame } = useGame()
  const [selectedPlayerCount, setSelectedPlayerCount] = useState(4)

  const handleStartGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    startSinglePlayerGame(difficulty, selectedPlayerCount)
    onGameStarted()
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SINGLE PLAYER</Text>
        <Text style={styles.subtitle}>GAME SETUP</Text>
      </View>

      {/* Player Count Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>NUMBER OF PLAYERS</Text>
        <View style={styles.playerCountContainer}>
          {[2, 3, 4, 5, 6].map((count) => (
            <TouchableOpacity
              key={count}
              style={[
                styles.playerCountButton,
                selectedPlayerCount === count && styles.selectedPlayerCount
              ]}
              onPress={() => setSelectedPlayerCount(count)}
            >
              <Text style={[
                styles.playerCountText,
                selectedPlayerCount === count && styles.selectedPlayerCountText
              ]}>
                {count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.playerCountSubtext}>
          YOU + {selectedPlayerCount - 1} AI OPPONENT{selectedPlayerCount > 2 ? 'S' : ''}
        </Text>
      </View>

      {/* AI Difficulty Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>AI DIFFICULTY</Text>
        <View style={styles.buttonContainer}>
          <PixelButtonCSS
            text="EASY"
            onPress={() => handleStartGame('easy')}
            color="green"
            size="auto"
            style={styles.difficultyButton}
            textStyle={styles.difficultyButtonText}
          />

          <PixelButtonCSS
            text="MEDIUM"
            onPress={() => handleStartGame('medium')}
            color="gold"
            size="auto"
            style={styles.difficultyButton}
            textStyle={styles.difficultyButtonText}
          />

          <PixelButtonCSS
            text="HARD"
            onPress={() => handleStartGame('hard')}
            color="red"
            size="auto"
            style={styles.difficultyButton}
            textStyle={styles.difficultyButtonText}
          />
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>BACK TO MENU</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a5a1a', // Casino felt green
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    color: '#d4af37', // Gold
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    color: '#f5f5dc', // Cream
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sectionContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 40,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    color: '#d4af37', // Gold
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  playerCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    width: '100%',
  },
  playerCountButton: {
    width: 48,
    height: 48,
    borderRadius: 6, // Slightly squared for pixel art style
    backgroundColor: '#2a4a2a', // Darker felt green
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderTopColor: '#1a3a1a', // Darker shadow
    borderLeftColor: '#1a3a1a',
    borderRightColor: '#3a6a3a', // Lighter highlight
    borderBottomColor: '#3a6a3a',
  },
  selectedPlayerCount: {
    backgroundColor: '#d4af37', // Gold when selected
    borderTopColor: '#FFEC8B', // Gold highlight
    borderLeftColor: '#FFEC8B',
    borderRightColor: '#CC9900', // Gold shadow
    borderBottomColor: '#CC9900',
  },
  playerCountText: {
    color: '#f5f5dc', // Cream
    fontSize: 16,
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    textAlign: 'center',
  },
  selectedPlayerCountText: {
    color: '#2A2A2A', // Dark text on gold background
  },
  playerCountSubtext: {
    color: '#f5f5dc', // Cream
    fontSize: 10,
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  difficultyButton: {
    marginBottom: 16,
    width: '100%',
    maxWidth: 280,
  },
  difficultyButtonText: {
    fontSize: 14,
    letterSpacing: 1,
  },
  backButton: {
    position: 'absolute',
    bottom: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: '#f5f5dc', // Cream
    fontSize: 10,
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    letterSpacing: 0.5,
  },
})