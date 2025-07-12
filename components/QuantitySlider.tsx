import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'
import { CasinoTheme } from '../lib/theme'

interface QuantitySliderProps {
  value: number
  onValueChange: (value: number) => void
  min: number
  max: number
  totalDice: number
  label?: string
}

export const QuantitySlider: React.FC<QuantitySliderProps> = ({
  value,
  onValueChange,
  min,
  max,
  totalDice,
  label = "Quantity"
}) => {
  const handleValueChange = (newValue: number) => {
    // Round to nearest integer for dice quantities
    const roundedValue = Math.round(newValue)
    console.log('🎯 QuantitySlider change:', {
      rawValue: newValue,
      rounded: roundedValue,
      min,
      max,
      currentValue: value
    })
    onValueChange(roundedValue)
  }

  const handleSlidingStart = () => {
    console.log('🖐️ QuantitySlider: Sliding started')
  }

  const handleSlidingComplete = (finalValue: number) => {
    console.log('✋ QuantitySlider: Sliding complete:', finalValue)
  }

  // Ensure value is always within bounds to prevent slider jumping
  const clampedValue = Math.max(min, Math.min(max, value))
  
  console.log('🎲 QuantitySlider render:', { 
    originalValue: value, 
    clampedValue, 
    min, 
    max, 
    totalDice,
    isOutOfBounds: value !== clampedValue
  })

  // If value was clamped, notify parent to update their state
  useEffect(() => {
    if (value !== clampedValue) {
      console.log('📢 QuantitySlider: Value was out of bounds, notifying parent')
      onValueChange(clampedValue)
    }
  }, [value, clampedValue, onValueChange])

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.sliderContainer}>
        {/* Min/Max Labels */}
        <Text style={styles.boundLabel}>{min}</Text>
        
        {/* Slider */}
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            value={clampedValue}
            onValueChange={handleValueChange}
            onSlidingStart={handleSlidingStart}
            onSlidingComplete={handleSlidingComplete}
            minimumValue={min}
            maximumValue={max}
            step={1}
            snapToAlignment="center"
            allowTouchTrack={false}
            minimumTrackTintColor={CasinoTheme.colors.gold}
            maximumTrackTintColor={CasinoTheme.colors.grayDark}
            thumbStyle={styles.thumb}
            trackStyle={styles.track}
          />
          
          {/* Current Value Display */}
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{clampedValue}</Text>
          </View>
        </View>
        
        <Text style={styles.boundLabel}>{max}</Text>
      </View>
      
      {/* Context Information */}
      <Text style={styles.contextText}>
        {totalDice} dice on table
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: CasinoTheme.spacing.sm,
  },
  label: {
    color: CasinoTheme.colors.gold,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: CasinoTheme.spacing.sm,
    textAlign: 'center',
    ...CasinoTheme.fonts.heading,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: CasinoTheme.spacing.sm,
  },
  boundLabel: {
    color: CasinoTheme.colors.grayLight,
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
    ...CasinoTheme.fonts.numbers,
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: CasinoTheme.spacing.md,
    position: 'relative',
  },
  slider: {
    height: 40,
    width: '100%',
  },
  track: {
    height: 6,
    borderRadius: 3,
  },
  thumb: {
    backgroundColor: CasinoTheme.colors.gold,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: CasinoTheme.colors.goldDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  valueContainer: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: [{ translateX: -12 }],
    backgroundColor: CasinoTheme.colors.charcoal,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: CasinoTheme.colors.gold,
  },
  valueText: {
    color: CasinoTheme.colors.gold,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    ...CasinoTheme.fonts.numbers,
  },
  contextText: {
    color: CasinoTheme.colors.grayLight,
    fontSize: 12,
    textAlign: 'center',
    ...CasinoTheme.fonts.body,
  },
})