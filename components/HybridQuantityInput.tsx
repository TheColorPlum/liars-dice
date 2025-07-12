import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native'
import { CasinoTheme } from '../lib/theme'
import { PixelButtonCSS } from './PixelButtonCSS'

interface HybridQuantityInputProps {
  value: number
  onValueChange: (value: number) => void
  min: number
  max: number
  totalDice: number
  label?: string
}

export const HybridQuantityInput: React.FC<HybridQuantityInputProps> = ({
  value,
  onValueChange,
  min,
  max,
  totalDice,
  label = "Quantity"
}) => {
  const [showTextInput, setShowTextInput] = useState(false)
  const [textValue, setTextValue] = useState(value.toString())

  const handleIncrement = (amount: number) => {
    const newValue = Math.max(min, Math.min(max, value + amount))
    onValueChange(newValue)
  }

  const handleTextSubmit = () => {
    const numValue = parseInt(textValue, 10)
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue))
      onValueChange(clampedValue)
    }
    setShowTextInput(false)
  }

  const openTextInput = () => {
    setTextValue(value.toString())
    setShowTextInput(true)
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      {/* Multi-increment buttons */}
      <View style={styles.buttonRow}>
        <PixelButtonCSS
          text="−5"
          onPress={() => handleIncrement(-5)}
          disabled={value - 5 < min}
          color="silver"
          size="small"
          style={styles.incrementButton}
        />
        
        <PixelButtonCSS
          text="−1"
          onPress={() => handleIncrement(-1)}
          disabled={value <= min}
          color="silver"
          size="small"
          style={styles.incrementButton}
        />
        
        {/* Tappable value display */}
        <TouchableOpacity style={styles.valueButton} onPress={openTextInput}>
          <Text style={styles.valueText}>{value}</Text>
        </TouchableOpacity>
        
        <PixelButtonCSS
          text="+1"
          onPress={() => handleIncrement(1)}
          disabled={value >= max}
          color="silver"
          size="small"
          style={styles.incrementButton}
        />
        
        <PixelButtonCSS
          text="+5"
          onPress={() => handleIncrement(5)}
          disabled={value + 5 > max}
          color="silver"
          size="small"
          style={styles.incrementButton}
        />
      </View>
      
      {/* Context Information */}
      <Text style={styles.contextText}>
        {totalDice} dice on table • Range: {min}-{max}
      </Text>

      {/* Text Input Modal */}
      <Modal
        visible={showTextInput}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTextInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Quantity</Text>
            <TextInput
              style={styles.textInput}
              value={textValue}
              onChangeText={setTextValue}
              keyboardType="numeric"
              selectTextOnFocus
              autoFocus
              onSubmitEditing={handleTextSubmit}
            />
            <View style={styles.modalButtons}>
              <PixelButtonCSS
                text="CANCEL"
                onPress={() => setShowTextInput(false)}
                color="silver"
                size="small"
                style={styles.modalButton}
              />
              <PixelButtonCSS
                text="SET"
                onPress={handleTextSubmit}
                color="green"
                size="small"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: CasinoTheme.spacing.sm,
    gap: CasinoTheme.spacing.xs,
  },
  incrementButton: {
    minWidth: 48,
    minHeight: 48,
  },
  valueButton: {
    backgroundColor: CasinoTheme.colors.charcoal,
    borderRadius: CasinoTheme.borderRadius.sm,
    borderWidth: 2,
    borderColor: CasinoTheme.colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: CasinoTheme.spacing.sm,
    minWidth: 64,
    alignItems: 'center',
  },
  valueText: {
    color: CasinoTheme.colors.gold,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    ...CasinoTheme.fonts.numbers,
  },
  contextText: {
    color: CasinoTheme.colors.grayLight,
    fontSize: 11,
    textAlign: 'center',
    ...CasinoTheme.fonts.body,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: CasinoTheme.colors.charcoal,
    borderRadius: CasinoTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: CasinoTheme.colors.gold,
    padding: CasinoTheme.spacing.lg,
    minWidth: 250,
    alignItems: 'center',
  },
  modalTitle: {
    color: CasinoTheme.colors.gold,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: CasinoTheme.spacing.md,
    ...CasinoTheme.fonts.heading,
  },
  textInput: {
    backgroundColor: CasinoTheme.colors.cream,
    borderRadius: CasinoTheme.borderRadius.sm,
    borderWidth: 1,
    borderColor: CasinoTheme.colors.goldDark,
    padding: CasinoTheme.spacing.md,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: CasinoTheme.spacing.md,
    minWidth: 120,
    ...CasinoTheme.fonts.numbers,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: CasinoTheme.spacing.md,
  },
  modalButton: {
    minWidth: 80,
  },
})