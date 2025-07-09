import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { CasinoTheme } from '../lib/theme'

interface QuantityStepperProps {
  value: number
  onValueChange: (value: number) => void
  min: number
  max: number
  totalDice: number
  label?: string
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onValueChange,
  min,
  max,
  totalDice,
  label = "Quantity"
}) => {
  const canDecrease = value > min
  const canIncrease = value < max
  const percentage = Math.round((value / totalDice) * 100)

  const handleDecrease = () => {
    if (canDecrease) {
      onValueChange(value - 1)
    }
  }

  const handleIncrease = () => {
    if (canIncrease) {
      onValueChange(value + 1)
    }
  }

  const getBidCategory = () => {
    if (percentage <= 25) return { text: 'Conservative', color: '#4CAF50' }
    if (percentage <= 50) return { text: 'Moderate', color: '#FF9800' }
    if (percentage <= 75) return { text: 'Aggressive', color: '#f44336' }
    return { text: 'Very Risky', color: '#9C27B0' }
  }

  const category = getBidCategory()

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          style={[
            styles.stepperButton,
            !canDecrease && styles.disabledButton
          ]}
          onPress={handleDecrease}
          disabled={!canDecrease}
        >
          <Text style={[
            styles.stepperButtonText,
            !canDecrease && styles.disabledButtonText
          ]}>
            −
          </Text>
        </TouchableOpacity>

        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{value}</Text>
          <Text style={styles.contextText}>
            {percentage}% of {totalDice}
          </Text>
          <Text style={[styles.categoryText, { color: category.color }]}>
            {category.text}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.stepperButton,
            !canIncrease && styles.disabledButton
          ]}
          onPress={handleIncrease}
          disabled={!canIncrease}
        >
          <Text style={[
            styles.stepperButtonText,
            !canIncrease && styles.disabledButtonText
          ]}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    color: CasinoTheme.colors.gold,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: CasinoTheme.spacing.sm,
    textAlign: 'center',
    ...CasinoTheme.fonts.header,
    textShadowColor: CasinoTheme.colors.charcoalDark,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CasinoTheme.spacing.md,
  },
  stepperButton: {
    backgroundColor: CasinoTheme.colors.gold,
    width: 44,
    height: 44,
    borderRadius: CasinoTheme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: CasinoTheme.colors.goldDark,
    ...CasinoTheme.shadows.medium,
  },
  disabledButton: {
    backgroundColor: CasinoTheme.colors.gray,
    borderColor: CasinoTheme.colors.grayDark,
  },
  stepperButtonText: {
    color: CasinoTheme.colors.charcoalDark,
    fontSize: 22,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.numbers,
  },
  disabledButtonText: {
    color: CasinoTheme.colors.grayLight,
  },
  valueContainer: {
    alignItems: 'center',
    minWidth: 90,
  },
  valueText: {
    color: CasinoTheme.colors.gold,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
    ...CasinoTheme.fonts.numbers,
    textShadowColor: CasinoTheme.colors.charcoalDark,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  contextText: {
    color: CasinoTheme.colors.creamDark,
    fontSize: 12,
    marginBottom: 2,
    ...CasinoTheme.fonts.body,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.body,
  },
})