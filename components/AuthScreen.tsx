import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { OfflineNotice } from './OfflineNotice'
import { PixelButtonCSS } from './PixelButtonCSS'

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp, signInAsGuest } = useAuth()

  const handleAuth = async () => {
    if (loading) return
    
    setLoading(true)
    
    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        if (!username.trim()) {
          Alert.alert('Error', 'Please enter a username')
          return
        }
        await signUp(email, password, username)
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestMode = async () => {
    if (loading) return
    
    setLoading(true)
    
    try {
      await signInAsGuest()
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to continue as guest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <OfflineNotice />
      <View style={styles.header}>
        <Text style={styles.title}>Liar's Dice</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Welcome Back!' : 'Join the Game!'}
        </Text>
      </View>

      <View style={styles.formContainer}>
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <PixelButtonCSS
          text={loading ? 'LOADING...' : isLogin ? 'SIGN IN' : 'SIGN UP'}
          onPress={handleAuth}
          color="gold"
          size="auto"
          style={styles.authButton}
          disabled={loading}
        />

        <PixelButtonCSS
          text={isLogin ? "DON'T HAVE AN ACCOUNT? SIGN UP" : "ALREADY HAVE AN ACCOUNT? SIGN IN"}
          onPress={() => setIsLogin(!isLogin)}
          color="silver"
          size="auto"
          style={styles.switchButton}
          textStyle={styles.smallText}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <PixelButtonCSS
          text="CONTINUE AS GUEST"
          onPress={handleGuestMode}
          color="blue"
          size="auto"
          style={styles.guestButton}
          disabled={loading}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a5a1a', // Casino felt green
    justifyContent: 'center',
    padding: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    color: '#d4af37', // Gold
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    color: '#f5f5dc', // Cream
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  formContainer: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#2a4a2a', // Darker felt green
    color: '#f5f5dc', // Cream text
    padding: 16,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 14,
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    borderWidth: 2,
    borderTopColor: '#1a3a1a', // Darker shadow
    borderLeftColor: '#1a3a1a',
    borderRightColor: '#3a6a3a', // Lighter highlight  
    borderBottomColor: '#3a6a3a',
  },
  authButton: {
    marginBottom: 16,
    width: '100%',
  },
  switchButton: {
    marginBottom: 24,
    width: '100%',
  },
  smallText: {
    fontSize: 9, // Smaller for long text
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#3a6a3a',
  },
  dividerText: {
    color: '#f5f5dc', // Cream
    paddingHorizontal: 16,
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular', // Pixel font
    letterSpacing: 1,
  },
  guestButton: {
    width: '100%',
  },
})