import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Bid } from '../types/game'
import { QuantityStepper } from './QuantityStepper'
import { CasinoTheme, getButtonStyle } from '../lib/theme'

interface BiddingInterfaceProps {
  currentBid: Bid | null
  onBid: (bid: Bid) => void
  onChallenge: () => void
  totalDice: number
}

export const BiddingInterface: React.FC<BiddingInterfaceProps> = ({
  currentBid,
  onBid,
  onChallenge,
  totalDice
}) => {
  // Calculate smart initial values and bounds
  const getSmartBounds = () => {
    if (!currentBid) {
      // First bid: reasonable range based on total dice
      const minQuantity = 1
      const maxQuantity = Math.max(Math.floor(totalDice * 0.6), 8) // 60% of total dice or 8, whichever is higher
      return { min: minQuantity, max: maxQuantity, initial: Math.max(Math.floor(totalDice * 0.15), 2) }
    } else {
      // Subsequent bids: must be higher than current
      const minQuantity = currentBid.quantity
      const maxQuantity = Math.min(totalDice, currentBid.quantity + Math.max(Math.floor(totalDice * 0.3), 5))
      return { min: minQuantity, max: maxQuantity, initial: currentBid.quantity + 1 }
    }
  }

  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [selectedFaceValue, setSelectedFaceValue] = useState(2) // Start at 2 since 1s are wild

  // Update bounds and selected quantity when currentBid changes
  useEffect(() => {
    const bounds = getSmartBounds()
    setSelectedQuantity(bounds.initial)
  }, [currentBid, totalDice])

  const isValidBid = (quantity: number, faceValue: number): boolean => {
    // 1s are wild and cannot be bid on
    if (faceValue < 2 || faceValue > 6) {
      return false
    }

    if (quantity <= 0) {
      return false
    }

    if (!currentBid) return true
    
    if (quantity > currentBid.quantity) {
      return true
    } else if (quantity === currentBid.quantity) {
      // Cannot bid same quantity and higher face value if current is already 6
      if (currentBid.face_value === 6) {
        return false
      }
      return faceValue > currentBid.face_value
    }
    
    return false
  }

  const handleMakeBid = () => {
    if (isValidBid(selectedQuantity, selectedFaceValue)) {
      onBid({
        quantity: selectedQuantity,
        face_value: selectedFaceValue,
        player_id: 'human_player'
      })
    }
  }


  const renderFaceValueButtons = () => {
    const buttons = []
    
    // Start from 2 since 1s are wild and cannot be bid on
    for (let i = 2; i <= 6; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.faceButton,
            selectedFaceValue === i && styles.selectedButton
          ]}
          onPress={() => setSelectedFaceValue(i)}
        >
          <Text style={[
            styles.buttonText,
            selectedFaceValue === i && styles.selectedButtonText
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      )
    }
    
    return buttons
  }

  return (
    <View style={styles.container}>
      {/* Current Bid and Selected Bid Row */}
      <View style={styles.topRow}>
        <View style={styles.bidInfo}>
          <Text style={styles.selectedBidLabel}>Your Bid:</Text>
          <Text style={styles.selectedBidText}>
            {selectedQuantity} × {selectedFaceValue}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.bidButton,
              !isValidBid(selectedQuantity, selectedFaceValue) && styles.disabledButton
            ]}
            onPress={handleMakeBid}
            disabled={!isValidBid(selectedQuantity, selectedFaceValue)}
          >
            <Text style={styles.bidButtonText}>Bid</Text>
          </TouchableOpacity>

          {currentBid && (
            <TouchableOpacity
              style={styles.challengeButton}
              onPress={onChallenge}
            >
              <Text style={styles.challengeButtonText}>Challenge</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Selection Controls */}
      <View style={styles.selectionRow}>
        <QuantityStepper
          value={selectedQuantity}
          onValueChange={setSelectedQuantity}
          min={getSmartBounds().min}
          max={getSmartBounds().max}
          totalDice={totalDice}
          label="Quantity"
        />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Face Value</Text>
          <View style={styles.faceValueContainer}>
            {renderFaceValueButtons()}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: CasinoTheme.colors.charcoal,
    padding: CasinoTheme.spacing.lg,
    marginHorizontal: CasinoTheme.spacing.md,
    marginBottom: CasinoTheme.spacing.md,
    borderRadius: CasinoTheme.borderRadius.lg,
    borderWidth: 4,
    borderColor: CasinoTheme.colors.gold,
    borderTopWidth: 6,
    borderTopColor: CasinoTheme.colors.goldLight,
    ...CasinoTheme.shadows.large,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CasinoTheme.spacing.lg,
    paddingBottom: CasinoTheme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: CasinoTheme.colors.goldDark,
  },
  bidInfo: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: CasinoTheme.spacing.md,
  },
  selectionRow: {
    flexDirection: 'row',
    gap: CasinoTheme.spacing.xl,
  },
  sectionContainer: {
    flex: 1,
  },
  sectionTitle: {
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
  faceValueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: CasinoTheme.spacing.xs,
  },
  faceButton: {
    backgroundColor: CasinoTheme.colors.charcoalLight,
    padding: CasinoTheme.spacing.sm,
    borderRadius: CasinoTheme.borderRadius.sm,
    minWidth: 40,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: CasinoTheme.colors.goldDark,
    ...CasinoTheme.shadows.small,
  },
  selectedButton: {
    backgroundColor: CasinoTheme.colors.gold,
    borderColor: CasinoTheme.colors.goldLight,
  },
  buttonText: {
    color: CasinoTheme.colors.cream,
    fontSize: 16,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.numbers,
  },
  selectedButtonText: {
    color: CasinoTheme.colors.charcoalDark,
  },
  selectedBidLabel: {
    color: CasinoTheme.colors.goldLight,
    fontSize: 16,
    marginBottom: CasinoTheme.spacing.xs,
    ...CasinoTheme.fonts.body,
  },
  selectedBidText: {
    color: CasinoTheme.colors.gold,
    fontSize: 24,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.numbers,
    textShadowColor: CasinoTheme.colors.charcoalDark,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  bidButton: {
    backgroundColor: CasinoTheme.colors.gold,
    paddingVertical: CasinoTheme.spacing.md,
    paddingHorizontal: CasinoTheme.spacing.lg,
    borderRadius: CasinoTheme.borderRadius.md,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 3,
    borderColor: CasinoTheme.colors.goldDark,
    ...CasinoTheme.shadows.medium,
  },
  disabledButton: {
    backgroundColor: CasinoTheme.colors.gray,
    borderColor: CasinoTheme.colors.grayDark,
  },
  bidButtonText: {
    color: CasinoTheme.colors.charcoalDark,
    fontSize: 18,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.header,
  },
  challengeButton: {
    backgroundColor: CasinoTheme.colors.casinoRed,
    paddingVertical: CasinoTheme.spacing.md,
    paddingHorizontal: CasinoTheme.spacing.lg,
    borderRadius: CasinoTheme.borderRadius.md,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 3,
    borderColor: CasinoTheme.colors.casinoRedDark,
    ...CasinoTheme.shadows.medium,
  },
  challengeButtonText: {
    color: CasinoTheme.colors.cream,
    fontSize: 18,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.header,
  },
})