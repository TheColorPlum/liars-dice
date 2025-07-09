import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { Bid } from '../types/game'

interface ChallengeResultProps {
  isVisible: boolean
  challengedBid: Bid | null
  actualCount: number
  challengeSuccessful: boolean
  challengerName: string
  bidderName: string
  onHide: () => void
}

export const ChallengeResult: React.FC<ChallengeResultProps> = ({
  isVisible,
  challengedBid,
  actualCount,
  challengeSuccessful,
  challengerName,
  bidderName,
  onHide
}) => {
  const [fadeAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0.8))

  useEffect(() => {
    if (isVisible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start()

      // Auto hide after 4 seconds
      const timer = setTimeout(() => {
        hideResult()
      }, 4000)

      return () => clearTimeout(timer)
    } else {
      hideResult()
    }
  }, [isVisible])

  const hideResult = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      onHide()
    })
  }

  if (!isVisible || !challengedBid) {
    return null
  }

  const wasExact = actualCount === challengedBid.quantity

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.container,
          challengeSuccessful ? styles.successContainer : styles.failureContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Text style={styles.title}>
          {challengeSuccessful ? '🎯 Challenge Successful!' : '❌ Challenge Failed!'}
        </Text>
        
        <View style={styles.bidInfo}>
          <Text style={styles.label}>Challenged Bid:</Text>
          <Text style={styles.bidText}>
            {challengedBid.quantity} × {challengedBid.face_value}
          </Text>
        </View>

        <View style={styles.resultInfo}>
          <Text style={styles.label}>Actual Count:</Text>
          <Text style={[
            styles.countText,
            wasExact ? styles.exactCount : 
            challengeSuccessful ? styles.successCount : styles.failureCount
          ]}>
            {actualCount}
          </Text>
        </View>

        <View style={styles.outcomeInfo}>
          <Text style={styles.outcomeText}>
            {challengeSuccessful 
              ? `${challengerName} was right - ${bidderName} loses a die!`
              : `${bidderName} was right - ${challengerName} loses a die!`
            }
          </Text>
        </View>

        {wasExact && (
          <View style={styles.exactBadge}>
            <Text style={styles.exactText}>Exact Count!</Text>
          </View>
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    borderWidth: 3,
    minWidth: 280,
  },
  successContainer: {
    borderColor: '#4CAF50',
  },
  failureContainer: {
    borderColor: '#f44336',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  bidInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  bidText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  successCount: {
    color: '#4CAF50',
  },
  failureCount: {
    color: '#f44336',
  },
  exactCount: {
    color: '#FF9800',
  },
  outcomeInfo: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  outcomeText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  exactBadge: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 12,
  },
  exactText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
})