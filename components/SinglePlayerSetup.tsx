import React from 'react'
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

  const handleStartGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    startSinglePlayerGame(difficulty)
    onGameStarted()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Single Player</Text>
        <Text style={styles.subtitle}>Choose AI Difficulty</Text>
      </View>

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
    marginBottom: 50,
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
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
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
    fontSize: 20,
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