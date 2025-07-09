import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CasinoTheme } from '../lib/theme'

interface DiceDisplayProps {
  dice: number[]
}

const getDiceSymbol = (value: number): string => {
  switch (value) {
    case 1: return '⚀'
    case 2: return '⚁'
    case 3: return '⚂'
    case 4: return '⚃'
    case 5: return '⚄'
    case 6: return '⚅'
    default: return '⚀'
  }
}

export const DiceDisplay: React.FC<DiceDisplayProps> = ({ dice }) => {
  return (
    <View style={styles.container}>
      {dice.map((value, index) => (
        <View key={index} style={styles.die}>
          <Text style={styles.dieSymbol}>{getDiceSymbol(value)}</Text>
          <Text style={styles.dieValue}>{value}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: CasinoTheme.spacing.sm,
    flexWrap: 'wrap',
  },
  die: {
    width: 56,
    height: 56,
    backgroundColor: CasinoTheme.colors.cream,
    borderRadius: CasinoTheme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: CasinoTheme.colors.charcoalDark,
    ...CasinoTheme.shadows.medium,
  },
  dieSymbol: {
    fontSize: 28,
    color: CasinoTheme.colors.charcoalDark,
  },
  dieValue: {
    fontSize: 12,
    color: CasinoTheme.colors.charcoal,
    marginTop: -2,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.numbers,
  },
})