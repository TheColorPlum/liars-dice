import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Alert } from 'react-native'
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { GameProvider } from './contexts/GameContext'
import { AuthScreen } from './components/AuthScreen'
import { MainMenu } from './components/MainMenu'
import { SinglePlayerSetup } from './components/SinglePlayerSetup'
import { GameBoard } from './components/GameBoard'

type Screen = 'menu' | 'singlePlayerSetup' | 'game' | 'privateMatch' | 'joinMatch' | 'leaderboard'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')
  
  // Load pixel font
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  })

  if (loading || !fontsLoaded) {
    return <View style={styles.loadingContainer} />
  }

  if (!user) {
    return <AuthScreen />
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MainMenu
            onStartSinglePlayer={() => setCurrentScreen('singlePlayerSetup')}
            onStartPrivateMatch={() => Alert.alert('Coming Soon', 'Private matches will be available soon!')}
            onJoinMatch={() => Alert.alert('Coming Soon', 'Join match will be available soon!')}
            onShowLeaderboard={() => Alert.alert('Coming Soon', 'Leaderboard will be available soon!')}
          />
        )
      case 'singlePlayerSetup':
        return (
          <SinglePlayerSetup
            onBack={() => setCurrentScreen('menu')}
            onGameStarted={() => setCurrentScreen('game')}
          />
        )
      case 'game':
        return (
          <GameBoard
            onBack={() => setCurrentScreen('menu')}
          />
        )
      default:
        return (
          <MainMenu
            onStartSinglePlayer={() => setCurrentScreen('singlePlayerSetup')}
            onStartPrivateMatch={() => Alert.alert('Coming Soon', 'Private matches will be available soon!')}
            onJoinMatch={() => Alert.alert('Coming Soon', 'Join match will be available soon!')}
            onShowLeaderboard={() => Alert.alert('Coming Soon', 'Leaderboard will be available soon!')}
          />
        )
    }
  }

  return (
    <View style={styles.container}>
      {renderScreen()}
      <StatusBar style="light" />
    </View>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
})
