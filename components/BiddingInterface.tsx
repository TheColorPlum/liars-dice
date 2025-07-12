import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Bid } from '../types/game'
import { HybridQuantityInput } from './HybridQuantityInput'
import { PixelButtonCSS } from './PixelButtonCSS'

interface BiddingInterfaceProps {
  currentBid: Bid | null
  onBid: (bid: Bid) => void
  onChallenge: () => void
  totalDice: number
  variant?: 'full' | 'compact'
  isEndgame?: boolean
}

export const BiddingInterface: React.FC<BiddingInterfaceProps> = ({
  currentBid,
  onBid,
  onChallenge,
  totalDice,
  variant = 'full',
  isEndgame = false
}) => {
  // Calculate simple bounds and initial values
  const getSmartBounds = () => {
    let bounds
    if (isEndgame) {
      // In endgame, we bid on sum of dice (2-12)
      if (!currentBid) {
        bounds = { min: 2, max: 12, initial: 7 } // Conservative first bid
      } else {
        bounds = { min: currentBid.face_value + 1, max: 12, initial: Math.min(12, currentBid.face_value + 1) }
      }
    } else {
      if (!currentBid) {
        // First bid: simple starting range
        const minQuantity = 1
        const maxQuantity = totalDice
        bounds = { min: minQuantity, max: maxQuantity, initial: 2 } // Start with 2 as reasonable opening
      } else {
        // Subsequent bids: must be higher than current
        const minQuantity = currentBid.quantity
        const maxQuantity = totalDice
        bounds = { min: minQuantity, max: maxQuantity, initial: currentBid.quantity + 1 }
      }
    }
    
    console.log('🎲 BiddingInterface bounds:', {
      currentBid,
      isEndgame,
      totalDice,
      calculated: bounds
    })
    
    return bounds
  }

  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [selectedFaceValue, setSelectedFaceValue] = useState(2) // Start at 2 since 1s are wild
  const [selectedSum, setSelectedSum] = useState(7) // For endgame sum bidding

  // Update bounds and selected values when currentBid or endgame state changes
  useEffect(() => {
    const bounds = getSmartBounds()
    console.log('🔄 BiddingInterface useEffect setting values:', {
      isEndgame,
      bounds,
      currentSelectedQuantity: selectedQuantity,
      currentSelectedSum: selectedSum
    })
    
    if (isEndgame) {
      setSelectedSum(bounds.initial)
    } else {
      setSelectedQuantity(bounds.initial)
    }
  }, [currentBid, totalDice, isEndgame])

  const isValidBid = (quantity: number, faceValue: number, sumValue?: number): boolean => {
    if (isEndgame) {
      // In endgame, validate sum value (2-12)
      const sum = sumValue || selectedSum
      if (sum < 2 || sum > 12) return false
      if (!currentBid) return true
      return sum > currentBid.face_value
    }
    
    // Normal game validation
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
    if (isEndgame) {
      if (isValidBid(1, selectedSum, selectedSum)) {
        onBid({
          quantity: 1, // Quantity is ignored in endgame
          face_value: selectedSum, // Sum value goes in face_value field
          player_id: 'human_player'
        })
      }
    } else {
      if (isValidBid(selectedQuantity, selectedFaceValue)) {
        onBid({
          quantity: selectedQuantity,
          face_value: selectedFaceValue,
          player_id: 'human_player'
        })
      }
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
        <Text style={styles.compactLabel}>{isEndgame === true ? 'FINAL SHOWDOWN' : 'YOUR BID'}</Text>
        <Text style={styles.compactBidText}>
          {isEndgame === true ? `Sum: ${selectedSum}` : `${selectedQuantity} × ${selectedFaceValue}`}
        </Text>
        <Text style={styles.compactContext}>{totalDice} dice on table</Text>
        
        <View style={styles.compactControls}>
          {isEndgame === true ? (
            /* Endgame Sum Controls */
            <View style={styles.quantitySection}>
              <Text style={styles.sectionLabel}>SUM</Text>
              <View style={styles.simpleQuantityControls}>
                <PixelButtonCSS
                  text="−"
                  onPress={() => setSelectedSum(Math.max(getSmartBounds().min, selectedSum - 1))}
                  disabled={selectedSum <= getSmartBounds().min}
                  color="silver"
                  size="small"
                  style={styles.stepperButton}
                />
                <Text style={styles.quantityValue}>{selectedSum}</Text>
                <PixelButtonCSS
                  text="+"
                  onPress={() => setSelectedSum(Math.min(getSmartBounds().max, selectedSum + 1))}
                  disabled={selectedSum >= getSmartBounds().max}
                  color="silver"
                  size="small"
                  style={styles.stepperButton}
                />
              </View>
              <Text style={styles.endgameHint}>Bid on total of both dice</Text>
            </View>
          ) : (
            <>
              {/* Normal Game Controls - Use Hybrid Input */}
              <View style={styles.quantitySection}>
                <Text style={styles.sectionLabel}>QTY</Text>
                <View style={styles.compactHybridContainer}>
                  <HybridQuantityInput
                    value={selectedQuantity}
                    onValueChange={setSelectedQuantity}
                    min={getSmartBounds().min}
                    max={getSmartBounds().max}
                    totalDice={totalDice}
                    label=""
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
            </>
          )}
        </View>

        <View style={styles.compactActionButtons}>
          <PixelButtonCSS
            text="BID"
            onPress={handleMakeBid}
            color="green"
            disabled={isEndgame === true ? !isValidBid(1, selectedSum, selectedSum) : !isValidBid(selectedQuantity, selectedFaceValue)}
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
          <Text style={styles.selectedBidLabel}>{isEndgame === true ? 'Final Showdown:' : 'Your Bid:'}</Text>
          <Text style={styles.selectedBidText}>
            {isEndgame === true ? `Sum: ${selectedSum}` : `${selectedQuantity} × ${selectedFaceValue}`}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <PixelButtonCSS
            text="BID"
            onPress={handleMakeBid}
            color="green"
            disabled={isEndgame === true ? !isValidBid(1, selectedSum, selectedSum) : !isValidBid(selectedQuantity, selectedFaceValue)}
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
        {isEndgame === true ? (
          <View style={styles.endgameContainer}>
            <Text style={styles.sectionTitle}>Dice Sum (2-12)</Text>
            <View style={styles.endgameSumControls}>
              <PixelButtonCSS
                text="−"
                onPress={() => setSelectedSum(Math.max(getSmartBounds().min, selectedSum - 1))}
                disabled={selectedSum <= getSmartBounds().min}
                color="silver"
                size="medium"
                style={styles.endgameStepperButton}
              />
              <Text style={styles.endgameSumValue}>{selectedSum}</Text>
              <PixelButtonCSS
                text="+"
                onPress={() => setSelectedSum(Math.min(getSmartBounds().max, selectedSum + 1))}
                disabled={selectedSum >= getSmartBounds().max}
                color="silver"
                size="medium"
                style={styles.endgameStepperButton}
              />
            </View>
            <Text style={styles.endgameHint}>Bid on the total sum of both dice</Text>
          </View>
        ) : (
          <>
            <HybridQuantityInput
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
          </>
        )}
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
    margin: 6,
    minWidth: 48,
    minHeight: 48,
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
    marginBottom: 8,
    letterSpacing: 1,
  },
  compactContext: {
    fontSize: 11,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    marginBottom: 16,
    letterSpacing: 0.5,
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
  compactHybridContainer: {
    width: '100%',
    minHeight: 80,
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
    gap: 8,
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

  // Endgame styles
  endgameHint: {
    fontSize: 8,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  endgameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  endgameSumControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 12,
  },
  endgameStepperButton: {
    minWidth: 48,
    minHeight: 48,
  },
  endgameSumValue: {
    fontSize: 24,
    fontFamily: 'PressStart2P_400Regular',
    color: '#f5f5dc', // Cream
    minWidth: 48,
    textAlign: 'center',
  },
})