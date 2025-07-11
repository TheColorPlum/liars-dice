import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Bid } from '../types/game'
import { QuantityStepper } from './QuantityStepper'
import { PixelButtonCSS } from './PixelButtonCSS'

interface BiddingInterfaceProps {
  currentBid: Bid | null
  onBid: (bid: Bid) => void
  onChallenge: () => void
  totalDice: number
  variant?: 'full' | 'compact'
}

export const BiddingInterface: React.FC<BiddingInterfaceProps> = ({
  currentBid,
  onBid,
  onChallenge,
  totalDice,
  variant = 'full'
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
        <PixelButtonCSS
          key={i}
          text={i.toString()}
          onPress={() => setSelectedFaceValue(i)}
          color={selectedFaceValue === i ? "gold" : "silver"}
          size="small"
          style={styles.faceButton}
        />
      )
    }
    
    return buttons
  }

  if (variant === 'compact') {
    // Compact version for game table - simplified essential controls
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactLabel}>YOUR BID</Text>
        <Text style={styles.compactBidText}>
          {selectedQuantity} × {selectedFaceValue}
        </Text>
        
        <View style={styles.compactControls}>
          {/* Simple Quantity Controls */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionLabel}>QTY</Text>
            <View style={styles.simpleQuantityControls}>
              <PixelButtonCSS
                text="−"
                onPress={() => setSelectedQuantity(Math.max(getSmartBounds().min, selectedQuantity - 1))}
                disabled={selectedQuantity <= getSmartBounds().min}
                color="silver"
                size="small"
                style={styles.stepperButton}
              />
              <Text style={styles.quantityValue}>{selectedQuantity}</Text>
              <PixelButtonCSS
                text="+"
                onPress={() => setSelectedQuantity(Math.min(getSmartBounds().max, selectedQuantity + 1))}
                disabled={selectedQuantity >= getSmartBounds().max}
                color="silver"
                size="small"
                style={styles.stepperButton}
              />
            </View>
          </View>
          
          {/* Face Value Selection */}
          <View style={styles.faceSection}>
            <Text style={styles.sectionLabel}>FACE</Text>
            <View style={styles.compactFaceButtons}>
              {renderFaceValueButtons()}
            </View>
          </View>
        </View>

        <View style={styles.compactActionButtons}>
          <PixelButtonCSS
            text="BID"
            onPress={handleMakeBid}
            color="green"
            disabled={!isValidBid(selectedQuantity, selectedFaceValue)}
            size="small"
            style={styles.compactButton}
          />

          {currentBid && (
            <PixelButtonCSS
              text="LIAR"
              onPress={onChallenge}
              color="red"
              size="small"
              style={styles.compactButton}
            />
          )}
        </View>
      </View>
    )
  }

  // Full version for other screens
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
          <PixelButtonCSS
            text="BID"
            onPress={handleMakeBid}
            color="green"
            disabled={!isValidBid(selectedQuantity, selectedFaceValue)}
            size="medium"
            style={styles.actionButton}
          />

          {currentBid && (
            <PixelButtonCSS
              text="LIAR"
              onPress={onChallenge}
              color="red"
              size="medium"
              style={styles.actionButton}
            />
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
          style={styles.stepper}
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
  // Full version styles
  container: {
    backgroundColor: '#2a4a2a', // Dark felt green
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 6,
    borderWidth: 2,
    borderTopColor: '#3a6a3a', // Lighter highlight
    borderLeftColor: '#3a6a3a',
    borderRightColor: '#1a3a1a', // Darker shadow
    borderBottomColor: '#1a3a1a',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37', // Gold divider
  },
  bidInfo: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
  },
  selectionRow: {
    flexDirection: 'row',
  },
  stepper: {
    marginRight: 16,
  },
  sectionContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: '#d4af37', // Gold
    fontSize: 14,
    fontFamily: 'PressStart2P_400Regular',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  faceValueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  faceButton: {
    margin: 4,
  },
  selectedBidLabel: {
    color: '#f5f5dc', // Cream
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  selectedBidText: {
    color: '#d4af37', // Gold
    fontSize: 18,
    fontFamily: 'PressStart2P_400Regular',
    letterSpacing: 1,
  },

  // Compact version styles
  compactContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  compactLabel: {
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    marginBottom: 8,
    letterSpacing: 1,
  },
  compactBidText: {
    fontSize: 18,
    fontFamily: 'PressStart2P_400Regular',
    color: '#f5f5dc', // Cream
    marginBottom: 16,
    letterSpacing: 1,
  },
  compactControls: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },

  // Quantity Section
  quantitySection: {
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  simpleQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperButton: {
    minWidth: 32,
    minHeight: 32,
  },
  quantityValue: {
    fontSize: 16,
    fontFamily: 'PressStart2P_400Regular',
    color: '#f5f5dc', // Cream
    minWidth: 24,
    textAlign: 'center',
  },

  // Face Value Section
  faceSection: {
    alignItems: 'center',
  },
  compactFaceButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  compactActionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  compactButton: {
    marginHorizontal: 6,
    minWidth: 80,
  },
})