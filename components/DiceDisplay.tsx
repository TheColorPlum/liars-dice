import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { CasinoTheme } from '../lib/theme'
import { assetManager } from '../lib/AssetManager'

interface DiceDisplayProps {
  dice: number[]
  color?: number // Dice color (1=black/white, 2-6=color variants)
  showHidden?: boolean // Use mystery dice for hidden values
}

export const DiceDisplay: React.FC<DiceDisplayProps> = ({ 
  dice, 
  color = 1, 
  showHidden = false 
}) => {
  const getDiceImage = (value: number) => {
    if (showHidden) {
      return assetManager.getDiceSprite(color, 7) // Mystery dice
    }
    return assetManager.getDiceSprite(color, value)
  }

  return (
    <View style={styles.container}>
      {dice.map((value, index) => (
        <View key={index} style={styles.dieContainer}>
          <Image 
            source={getDiceImage(value)}
            style={styles.dieImage}
            resizeMode="contain"
          />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  dieContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    backgroundColor: '#d4af37', // Gold background matching player card
    borderWidth: 3,
    borderTopColor: '#FFEC8B', // Gold highlight
    borderLeftColor: '#FFEC8B',
    borderRightColor: '#CC9900', // Gold shadow
    borderBottomColor: '#CC9900',
    borderRadius: 8,
  },
  dieImage: {
    width: 44,
    height: 44,
    // Ensure pixel-perfect rendering
    borderRadius: 0,
  },
})