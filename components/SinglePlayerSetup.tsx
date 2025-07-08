import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useGame } from '../contexts/GameContext'

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
      <View style={styles.header}>
        <Text style={styles.title}>Single Player</Text>
        <Text style={styles.subtitle}>Game Setup</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Number of Players</Text>
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
          You + {selectedPlayerCount - 1} AI opponent{selectedPlayerCount > 2 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>AI Difficulty</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.easyButton]} 
            onPress={() => handleStartGame('easy')}
          >
            <Text style={styles.buttonText}>Easy</Text>
            <Text style={styles.buttonSubtext}>Relaxed gameplay</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.mediumButton]} 
            onPress={() => handleStartGame('medium')}
          >
            <Text style={styles.buttonText}>Medium</Text>
            <Text style={styles.buttonSubtext}>Balanced challenge</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.hardButton]} 
            onPress={() => handleStartGame('hard')}
          >
            <Text style={styles.buttonText}>Hard</Text>
            <Text style={styles.buttonSubtext}>Intense competition</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
  },
  sectionContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  playerCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  playerCountButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  selectedPlayerCount: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  playerCountText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  selectedPlayerCountText: {
    color: '#fff',
  },
  playerCountSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  easyButton: {
    backgroundColor: '#4CAF50',
  },
  mediumButton: {
    backgroundColor: '#FF9800',
  },
  hardButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  buttonSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: '#999',
    fontSize: 16,
  },
})