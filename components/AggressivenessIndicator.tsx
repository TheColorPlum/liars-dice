import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface AggressivenessIndicatorProps {
  percentage: number
  style?: any
}

export const AggressivenessIndicator: React.FC<AggressivenessIndicatorProps> = ({
  percentage,
  style
}) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage))
  
  // Determine color based on aggressiveness level
  const getColor = (percent: number) => {
    if (percent < 25) return '#2ECC71' // Green - Conservative
    if (percent < 50) return '#F39C12' // Orange - Moderate  
    if (percent < 75) return '#E67E22' // Orange-Red - Aggressive
    return '#E74C3C' // Red - Very Aggressive
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        AGGRESSIVENESS: {Math.round(clampedPercentage)}%
      </Text>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill,
              {
                width: `${clampedPercentage}%`,
                backgroundColor: getColor(clampedPercentage)
              }
            ]}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    letterSpacing: 1,
    marginBottom: 8,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 200,
    alignItems: 'center',
  },
  progressBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#2a4a2a', // Dark felt green
    borderRadius: 6,
    borderWidth: 2,
    borderTopColor: '#1a3a1a', // Darker shadow
    borderLeftColor: '#1a3a1a',
    borderRightColor: '#3a6a3a', // Lighter highlight
    borderBottomColor: '#3a6a3a',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 4, // Ensure some visibility even at 0%
  },
})