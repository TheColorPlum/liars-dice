import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'
import { PixelButtonCSS } from './PixelButtonCSS'

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
      {/* Header - Centered title */}
      <View style={styles.header}>
        <Text style={styles.title}>MAIN MENU</Text>
      </View>

      {/* Main Button Stack - Centered vertical layout matching mockup */}
      <View style={styles.buttonStack}>
        <PixelButtonCSS
          text="SINGLE PLAYER"
          onPress={onStartSinglePlayer}
          color="gold"
          size="auto"
          style={styles.menuButton}
        />

        <PixelButtonCSS
          text="MULTIPLAYER"
          onPress={onStartPrivateMatch}
          color="gold"
          size="auto"
          style={styles.menuButton}
        />

        <PixelButtonCSS
          text="JOIN GAME"
          onPress={onJoinMatch}
          color="gold"
          size="auto"
          style={styles.menuButton}
        />

        <PixelButtonCSS
          text="GLOBAL LEADERBOARD"
          onPress={onShowLeaderboard}
          color="gold"
          size="auto"
          style={styles.menuButton}
          textStyle={styles.smallerText}
        />

        <PixelButtonCSS
          text="SETTINGS"
          onPress={() => {}} // TODO: Add settings handler
          color="gold"
          size="auto"
          style={styles.menuButton}
        />
      </View>

      {/* Footer - Logout positioned at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // CASINO FELT BACKGROUND - Phase B styling applied
  container: {
    flex: 1,
    backgroundColor: '#1a5a1a', // Deep casino felt green from mockup
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    // Add subtle texture effect through gradient-like shadows
    borderWidth: 0,
  },
  
  // Header section
  header: {
    alignItems: 'center',
    marginBottom: 48, // Adjusted for better proportions
  },
  title: {
    fontSize: 18, // Adjusted for pixel font readability
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    color: '#d4af37', // Gold color from mockup
    textAlign: 'center',
    letterSpacing: 1, // Slight spacing for pixel font clarity
  },
  
  // Main button stack - matches mockup layout
  buttonStack: {
    width: '100%',
    maxWidth: 260, // Slightly narrower for better proportions
    alignItems: 'center', // Center buttons
  },
  menuButton: {
    // PixelButton spacing - matches mockup
    marginBottom: 12, // Consistent but tighter spacing
    width: '100%', // Full width within buttonStack
  },
  smallerText: {
    fontSize: 10, // Even smaller for long text like "GLOBAL LEADERBOARD"
    letterSpacing: 0.5, // Slight letter spacing for readability
  },
  
  // Footer section
  footer: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutText: {
    color: '#ccc',
    fontSize: 10, // Smaller for pixel font
    fontFamily: 'PressStart2P_400Regular', // Pixel font
  },
})