import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'

interface MainMenuProps {
  onStartSinglePlayer: () => void
  onStartPrivateMatch: () => void
  onJoinMatch: () => void
  onShowLeaderboard: () => void
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartSinglePlayer,
  onStartPrivateMatch,
  onJoinMatch,
  onShowLeaderboard
}) => {
  const { user, signOut } = useAuth()
  const { resetGame } = useGame()

  const handleSignOut = async () => {
    try {
      resetGame()
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liar's Dice</Text>
        <Text style={styles.subtitle}>
          Welcome, {user?.user_metadata?.username || 'Guest'}!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onStartSinglePlayer}>
          <Text style={styles.buttonText}>Single Player</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onStartPrivateMatch}>
          <Text style={styles.buttonText}>Private Match</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onJoinMatch}>
          <Text style={styles.buttonText}>Join Match</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onShowLeaderboard}>
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 36,
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
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  signOutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signOutText: {
    color: '#999',
    fontSize: 16,
  },
})