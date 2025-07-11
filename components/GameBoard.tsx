import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native'
import { useGame } from '../contexts/GameContext'
import { Bid, Player } from '../types/game'
import { CasinoTheme, getContainerStyle, getPanelBackgroundStyle, getPanelContentStyle } from '../lib/theme'
import { PlayerCard } from './PlayerCard'
import { DiceDisplay } from './DiceDisplay'
import { BiddingInterface } from './BiddingInterface'
import { GameHistory } from './GameHistory'
import { ChallengeResult } from './ChallengeResult'
import { TurnIndicator } from './TurnIndicator'
import { RoundTransition } from './RoundTransition'
import { PixelButtonCSS } from './PixelButtonCSS'
// import { PixelPanel } from './PixelPanel'  // TEMPORARILY COMMENTED OUT
import { assetManager } from '../lib/AssetManager'

interface GameBoardProps {
  onBack: () => void
}

export const GameBoard: React.FC<GameBoardProps> = ({ onBack }) => {
  const { gameState, gameEngine, makeMove, processAIMove, resetGame } = useGame()
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [showChallengeResult, setShowChallengeResult] = useState(false)
  const [challengeResultData, setChallengeResultData] = useState<{
    challengedBid: Bid | null
    actualCount: number
    challengeSuccessful: boolean
    challengerName: string
    bidderName: string
  } | null>(null)
  const [showRoundTransition, setShowRoundTransition] = useState(false)
  const [roundTransitionData, setRoundTransitionData] = useState<{
    type: 'round_start' | 'player_eliminated' | 'round_end' | 'game_over'
    eliminatedPlayer?: Player | null
    roundNumber?: number
    winnerName?: string
  } | null>(null)
  const [lastRoundNumber, setLastRoundNumber] = useState(1)
  const [lastActivePlayers, setLastActivePlayers] = useState<string[]>([])

  // Handle AI moves - similar to working implementation
  useEffect(() => {
    if (gameState && 
        gameEngine &&
        !gameState.is_game_over &&
        gameState.phase === 'bidding') {
      
      const currentPlayer = gameEngine.getCurrentPlayer()
      
      if (currentPlayer && currentPlayer.is_ai) {
        console.log(`It's ${currentPlayer.username}'s turn (AI)`)
        
        // Faster delay for single player mode
        const humanPlayers = gameState.players.filter(p => !p.is_ai)
        const isSinglePlayer = humanPlayers.length === 1
        const delay = isSinglePlayer ? 300 : 1000  // 0.3s for single player, 1s for multiplayer
        
        const aiMoveTimeout = setTimeout(() => {
          processAIMove()
        }, delay)

        return () => clearTimeout(aiMoveTimeout)
      }
    }
  }, [gameState, gameEngine, processAIMove])

  // Watch for challenge actions to show results
  useEffect(() => {
    if (gameEngine) {
      const actions = gameEngine.getActions()
      const lastAction = actions[actions.length - 1]
      
      if (lastAction && lastAction.type === 'challenge' && lastAction.data) {
        const challengeData = lastAction.data as {
          bid: Bid
          total_dice: number
          successful: boolean
        }
        
        const challengerName = gameState?.players.find(p => p.id === lastAction.player_id)?.username || 'Unknown'
        const bidderName = gameState?.players.find(p => p.id === challengeData.bid.player_id)?.username || 'Unknown'
        
        setChallengeResultData({
          challengedBid: challengeData.bid,
          actualCount: challengeData.total_dice,
          challengeSuccessful: challengeData.successful,
          challengerName,
          bidderName
        })
        setShowChallengeResult(true)
      }
    }
  }, [gameEngine?.getActions().length, gameState?.players])

  // Watch for round changes and player eliminations
  useEffect(() => {
    if (!gameState) return

    const currentActivePlayers = gameState.players
      .filter(p => p.is_active)
      .map(p => p.id)
    
    // Check for player elimination
    if (lastActivePlayers.length > 0 && currentActivePlayers.length < lastActivePlayers.length) {
      const eliminatedPlayerIds = lastActivePlayers.filter(id => !currentActivePlayers.includes(id))
      
      if (eliminatedPlayerIds.length > 0) {
        const eliminatedPlayer = gameState.players.find(p => eliminatedPlayerIds.includes(p.id))
        
        if (eliminatedPlayer) {
          setRoundTransitionData({
            type: 'player_eliminated',
            eliminatedPlayer
          })
          setShowRoundTransition(true)
        }
      }
    }

    // Check for round change
    if (gameState.round_number > lastRoundNumber) {
      setRoundTransitionData({
        type: 'round_start',
        roundNumber: gameState.round_number
      })
      setShowRoundTransition(true)
      setLastRoundNumber(gameState.round_number)
    }

    // Check for game over
    if (gameState.is_game_over && gameState.winner_id) {
      const winner = gameState.players.find(p => p.id === gameState.winner_id)
      setRoundTransitionData({
        type: 'game_over',
        winnerName: winner?.username || 'Unknown'
      })
      setShowRoundTransition(true)
    }

    setLastActivePlayers(currentActivePlayers)
  }, [gameState?.round_number, gameState?.players, gameState?.is_game_over, gameState?.winner_id])

  // Initialize tracking on first load
  useEffect(() => {
    if (gameState && lastActivePlayers.length === 0) {
      const activePlayers = gameState.players
        .filter(p => p.is_active)
        .map(p => p.id)
      setLastActivePlayers(activePlayers)
      setLastRoundNumber(gameState.round_number)
    }
  }, [gameState])

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
      {/* Header with back button */}
      <View style={styles.header}>
        <PixelButtonCSS
          text="BACK"
          onPress={onBack}
          color="gold"
          size="small"
          style={styles.backButton}
        />
      </View>

      {/* Game Table Layout - Matching Mockup */}
      <View style={styles.gameTable}>
        
        {/* Top Row - Opponent Cards */}
        <View style={styles.opponentsRow}>
          {gameState.players
            .filter(player => player.is_ai)
            .slice(0, 3) // Show max 3 opponents in top row
            .map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                isCurrentPlayer={index === gameState.current_player_index}
                isHumanPlayer={false}
                variant="opponent"
              />
            ))}
        </View>

        {/* Center Area - Current Bid Display */}
        <View style={styles.centerArea}>
          <View style={styles.centerBidDisplay}>
            <Text style={styles.centerBidLabel}>CURRENT BID</Text>
            <View style={styles.centerBidValueContainer}>
              <Text style={styles.centerBidValue}>
                {gameState.current_bid 
                  ? `${gameState.current_bid.quantity} × ${gameState.current_bid.face_value}` 
                  : 'NO BID'}
              </Text>
            </View>
          </View>
          
          {/* Turn Indicator - Smaller, less prominent */}
          <View style={styles.smallTurnIndicator}>
            <TurnIndicator
              currentPlayer={currentPlayer}
              isHumanTurn={isHumanTurn}
              gamePhase={gameState.phase}
            />
          </View>
        </View>

        {/* Bottom Row - Player and Bidding */}
        <View style={styles.bottomRow}>
          {/* Player Section */}
          {humanPlayer && (
            <View style={styles.playerSection}>
              <PlayerCard
                player={humanPlayer}
                isCurrentPlayer={humanPlayer.id === currentPlayer?.id}
                isHumanPlayer={true}
                variant="self"
              />
              <DiceDisplay dice={humanPlayer.dice} />
            </View>
          )}

          {/* Bidding Interface - Right Side */}
          <View style={styles.biddingSection}>
            {/* Bidding Controls - Only show when it's human's turn */}
            {isHumanTurn && gameState.phase === 'bidding' && (
              <BiddingInterface
                currentBid={gameState.current_bid}
                onBid={handleBid}
                onChallenge={handleChallenge}
                totalDice={gameEngine.getTotalDiceCount()}
                variant="compact"
              />
            )}
          </View>
        </View>

      </View>

      {gameState.is_game_over && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>GAME OVER!</Text>
          <Text style={styles.winnerText}>
            {gameState.winner_id === humanPlayer?.id 
              ? 'YOU WON!' 
              : `${gameState.players.find(p => p.id === gameState.winner_id)?.username} WON!`}
          </Text>
          <PixelButtonCSS
            text="NEW GAME"
            onPress={handleNewGame}
            color="green"
            size="auto"
            style={styles.newGameButton}
          />
        </View>
      )}

      {challengeResultData && (
        <ChallengeResult
          isVisible={showChallengeResult}
          challengedBid={challengeResultData.challengedBid}
          actualCount={challengeResultData.actualCount}
          challengeSuccessful={challengeResultData.challengeSuccessful}
          challengerName={challengeResultData.challengerName}
          bidderName={challengeResultData.bidderName}
          onHide={() => {
            setShowChallengeResult(false)
            setChallengeResultData(null)
          }}
        />
      )}

      {roundTransitionData && (
        <RoundTransition
          isVisible={showRoundTransition}
          transitionType={roundTransitionData.type}
          eliminatedPlayer={roundTransitionData.eliminatedPlayer}
          roundNumber={roundTransitionData.roundNumber}
          winnerName={roundTransitionData.winnerName}
          onComplete={() => {
            setShowRoundTransition(false)
            setRoundTransitionData(null)
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a5a1a', // Casino felt green
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a5a1a',
  },
  loadingText: {
    color: '#f5f5dc', // Cream
    fontSize: 16,
    fontFamily: 'PressStart2P_400Regular',
  },
  
  // Header - Simple back button
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50, // Account for status bar
  },
  backButton: {
    alignSelf: 'flex-start',
  },

  // Game Table Layout - Matching Mockup
  gameTable: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'flex-start',
  },

  // Top Row - Opponents (horizontal row)
  opponentsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingVertical: 8,
    marginBottom: 16,
  },

  // Center Area - Current bid display and turn indicator
  centerArea: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },

  // Center Bid Display - Main focal point
  centerBidDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  centerBidLabel: {
    fontSize: 18,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    marginBottom: 16,
    letterSpacing: 1,
  },
  centerBidValueContainer: {
    backgroundColor: '#d4af37', // Gold background
    borderWidth: 3,
    borderTopColor: '#FFEC8B', // Gold highlight
    borderLeftColor: '#FFEC8B',
    borderRightColor: '#CC9900', // Gold shadow
    borderBottomColor: '#CC9900',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 32,
    minWidth: 160,
    alignItems: 'center',
  },
  centerBidValue: {
    fontSize: 24,
    fontFamily: 'PressStart2P_400Regular',
    color: '#2A2A2A', // Dark text on gold
    textAlign: 'center',
    letterSpacing: 1,
  },

  // Small Turn Indicator
  smallTurnIndicator: {
    transform: [{ scale: 0.7 }],
    opacity: 0.8,
  },

  // Bottom Row - Player + Bidding side by side
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
  },

  // Player Section (left side of bottom row)
  playerSection: {
    flex: 1,
    alignItems: 'center',
    marginRight: 16,
  },

  // Bidding Section (right side of bottom row)
  biddingSection: {
    alignItems: 'center',
    minWidth: 140,
    paddingLeft: 8,
  },



  // Game Over Modal
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: '#d4af37', // Gold
    fontSize: 24,
    fontFamily: 'PressStart2P_400Regular',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
  },
  winnerText: {
    color: '#f5f5dc', // Cream
    fontSize: 16,
    fontFamily: 'PressStart2P_400Regular',
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  newGameButton: {
    // PixelButtonCSS will handle its own styling
  },
})