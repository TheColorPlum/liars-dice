import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Bid } from '../types/game'

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
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [selectedFaceValue, setSelectedFaceValue] = useState(1)

  const isValidBid = (quantity: number, faceValue: number): boolean => {
    if (!currentBid) return true
    
    if (quantity > currentBid.quantity) {
      return true
    } else if (quantity === currentBid.quantity) {
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

  const renderQuantityButtons = () => {
    const buttons = []
    const maxQuantity = Math.min(totalDice, currentBid ? currentBid.quantity + 3 : 5)
    
    for (let i = 1; i <= maxQuantity; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.quantityButton,
            selectedQuantity === i && styles.selectedButton
          ]}
          onPress={() => setSelectedQuantity(i)}
        >
          <Text style={[
            styles.buttonText,
            selectedQuantity === i && styles.selectedButtonText
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      )
    }
    
    return buttons
  }

  const renderFaceValueButtons = () => {
    const buttons = []
    
    for (let i = 1; i <= 6; i++) {
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
      <Text style={styles.title}>Make Your Move</Text>
      
      <View style={styles.selectionContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            {renderQuantityButtons()}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Face Value</Text>
          <View style={styles.faceValueContainer}>
            {renderFaceValueButtons()}
          </View>
        </View>
      </View>

      <View style={styles.selectedBidContainer}>
        <Text style={styles.selectedBidLabel}>Your Bid:</Text>
        <Text style={styles.selectedBidText}>
          {selectedQuantity} x {selectedFaceValue}
        </Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.bidButton,
            !isValidBid(selectedQuantity, selectedFaceValue) && styles.disabledButton
          ]}
          onPress={handleMakeBid}
          disabled={!isValidBid(selectedQuantity, selectedFaceValue)}
        >
          <Text style={styles.bidButtonText}>Make Bid</Text>
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
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  selectionContainer: {
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 5,
  },
  faceValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 5,
  },
  quantityButton: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  faceButton: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedButtonText: {
    color: '#fff',
  },
  selectedBidContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  selectedBidLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  selectedBidText: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  bidButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  bidButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  challengeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  challengeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})