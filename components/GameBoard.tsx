import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useGame } from '../contexts/GameContext'
import { Bid } from '../types/game'
import { PlayerCard } from './PlayerCard'
import { DiceDisplay } from './DiceDisplay'
import { BiddingInterface } from './BiddingInterface'

interface GameBoardProps {
  onBack: () => void
}

export const GameBoard: React.FC<GameBoardProps> = ({ onBack }) => {
  const { gameState, gameEngine, makeMove, resetGame } = useGame()
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)

  if (!gameState || !gameEngine) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading game...</Text>
      </View>
    )
  }

  const currentPlayer = gameEngine.getCurrentPlayer()
  const isHumanTurn = currentPlayer && !currentPlayer.is_ai
  const humanPlayer = gameState.players.find(p => !p.is_ai)

  const handleBid = async (bid: Bid) => {
    if (!isHumanTurn) return
    
    const success = await makeMove({ type: 'bid', bid })
    if (success) {
      setSelectedBid(null)
    }
  }

  const handleChallenge = async () => {
    if (!isHumanTurn) return
    
    await makeMove({ type: 'challenge' })
  }

  const handleNewGame = () => {
    resetGame()
    onBack()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liar's Dice</Text>
        <View style={styles.gameInfo}>
          <Text style={styles.roundText}>Round {gameState.round_number}</Text>
          <Text style={styles.phaseText}>
            {gameState.phase === 'bidding' ? 'Bidding' : 
             gameState.phase === 'challenging' ? 'Challenge' : 
             gameState.phase === 'revealing' ? 'Revealing' : 'Round End'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.playersContainer}>
        {gameState.players.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            isCurrentPlayer={index === gameState.current_player_index}
            isHumanPlayer={!player.is_ai}
          />
        ))}
      </ScrollView>

      <View style={styles.centerArea}>
        <View style={styles.bidArea}>
          <Text style={styles.currentBidLabel}>Current Bid:</Text>
          {gameState.current_bid ? (
            <Text style={styles.currentBidText}>
              {gameState.current_bid.quantity} x {gameState.current_bid.face_value}
            </Text>
          ) : (
            <Text style={styles.noBidText}>No bid yet</Text>
          )}
        </View>

        {isHumanTurn && (
          <View style={styles.turnIndicator}>
            <Text style={styles.turnText}>Your Turn</Text>
          </View>
        )}

        {currentPlayer && currentPlayer.is_ai && (
          <View style={styles.aiIndicator}>
            <Text style={styles.aiText}>
              {currentPlayer.username} is thinking...
            </Text>
          </View>
        )}
      </View>

      {humanPlayer && (
        <View style={styles.humanPlayerArea}>
          <Text style={styles.yourDiceLabel}>Your Dice:</Text>
          <DiceDisplay dice={humanPlayer.dice} />
        </View>
      )}

      {isHumanTurn && gameState.phase === 'bidding' && (
        <BiddingInterface
          currentBid={gameState.current_bid}
          onBid={handleBid}
          onChallenge={handleChallenge}
          totalDice={gameEngine.getTotalDiceCount()}
        />
      )}

      {gameState.is_game_over && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.winnerText}>
            {gameState.winner_id === humanPlayer?.id 
              ? 'You won!' 
              : `${gameState.players.find(p => p.id === gameState.winner_id)?.username} won!`}
          </Text>
          <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
            <Text style={styles.newGameButtonText}>New Game</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  gameInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  roundText: {
    color: '#ccc',
    fontSize: 16,
  },
  phaseText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  playersContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerArea: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  bidArea: {
    alignItems: 'center',
    marginBottom: 15,
  },
  currentBidLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  currentBidText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  noBidText: {
    color: '#666',
    fontSize: 18,
  },
  turnIndicator: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  turnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  aiIndicator: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  aiText: {
    color: '#fff',
    fontSize: 16,
  },
  humanPlayerArea: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  yourDiceLabel: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  winnerText: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
  },
  newGameButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  newGameButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButtonText: {
    color: '#999',
    fontSize: 16,
  },
})