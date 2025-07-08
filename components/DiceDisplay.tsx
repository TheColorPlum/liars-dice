import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

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
    gap: 10,
    flexWrap: 'wrap',
  },
  die: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  dieSymbol: {
    fontSize: 24,
    color: '#333',
  },
  dieValue: {
    fontSize: 10,
    color: '#666',
    marginTop: -5,
  },
})