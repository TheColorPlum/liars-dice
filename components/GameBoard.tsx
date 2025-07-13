import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native'
import { useGame } from '../contexts/GameContext'
import { Bid, Player } from '../types/game'
import { CasinoTheme, getContainerStyle, getPanelBackgroundStyle, getPanelContentStyle } from '../lib/theme'
import { PlayerCard } from './PlayerCard'
import { DiceDisplay } from './DiceDisplay'
import { BiddingInterface } from './BiddingInterface'
import { GameHistory } from './GameHistory'
import { DramaticChallengeResult } from './DramaticChallengeResult'
import { TurnIndicator } from './TurnIndicator'
import { RoundTransition } from './RoundTransition'
import { PixelButtonCSS } from './PixelButtonCSS'
// import { PixelPanel } from './PixelPanel'  // TEMPORARILY COMMENTED OUT
import { assetManager } from '../lib/AssetManager'

interface GameBoardProps {
  onBack: () => void
}

export const GameBoard: React.FC<GameBoardProps> = ({ onBack }) => {
  const { gameState, gameEngine, makeMove, processAIMove, completeChallengeSequence, resetGame, isEndgame } = useGame()
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [showChallengeResult, setShowChallengeResult] = useState(false)
  const [challengeResultData, setChallengeResultData] = useState<{
    challengedBid: Bid | null
    challengeSuccessful: boolean
    challengerName: string
    bidderName: string
    players: Player[]
    capturedDiceState?: Player[]
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
  const [isGameLogExpanded, setIsGameLogExpanded] = useState(false)
  const [processedChallengeActionIds, setProcessedChallengeActionIds] = useState<Set<string>>(new Set())
  const [isDramaticSequenceActive, setIsDramaticSequenceActive] = useState(false)

  // Handle AI moves - similar to working implementation
  useEffect(() => {
    if (gameState && 
        gameEngine &&
        !gameState.is_game_over &&
        gameState.phase === 'bidding' &&
        !isDramaticSequenceActive) { // Pause AI moves during dramatic sequence
      
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
  }, [gameState, gameEngine, processAIMove, isDramaticSequenceActive])

  // Watch for challenge actions to show dramatic results
  useEffect(() => {
    if (gameEngine) {
      const actions = gameEngine.getActions()
      const challengeActions = actions.filter(a => a.type === 'challenge')
      
      // Find unprocessed challenge actions
      const unprocessedChallenges = challengeActions.filter(action => {
        const actionId = `${action.timestamp.getTime()}_${action.player_id}`
        return !processedChallengeActionIds.has(actionId)
      })
      
      if (unprocessedChallenges.length > 0) {
        // Process the most recent unprocessed challenge
        const challengeAction = unprocessedChallenges[unprocessedChallenges.length - 1]
        
        if (challengeAction.data) {
          const challengeData = challengeAction.data as {
            bid: Bid
            total_dice: number
            successful: boolean
            is_endgame?: boolean
            captured_dice_state?: Player[]
          }
          
          console.log('🎯 Starting dramatic challenge sequence!')
          
          const challengerName = gameState?.players.find(p => p.id === challengeAction.player_id)?.username || 'Unknown'
          const bidderName = gameState?.players.find(p => p.id === challengeData.bid.player_id)?.username || 'Unknown'
          
          // Mark this challenge as processed
          const actionId = `${challengeAction.timestamp.getTime()}_${challengeAction.player_id}`
          setProcessedChallengeActionIds(prev => new Set([...prev, actionId]))
          
          // Activate dramatic sequence (this will pause AI moves)
          console.log('🎭 Pausing AI moves for dramatic sequence')
          setIsDramaticSequenceActive(true)
          
          setChallengeResultData({
            challengedBid: challengeData.bid,
            challengeSuccessful: challengeData.successful,
            challengerName,
            bidderName,
            players: [...(gameState?.players || [])], // Current state for display logic
            capturedDiceState: challengeData.captured_dice_state // The dice that were actually counted
          })
          setShowChallengeResult(true)
        }
      }
    }
  }, [gameEngine?.getActions().length])

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

      {/* Center-Focused Vertical Layout */}
      <View style={styles.gameTable}>
        
        {/* Simplified Opponents - Dice Count Only */}
        <View style={styles.opponentsBar}>
          {gameState.players
            .filter(player => player.is_ai)
            .map((player, index) => (
              <View key={player.id} style={styles.opponentSummary}>
                <Text style={styles.opponentName}>{player.username}</Text>
                <Text style={styles.opponentDiceCount}>{player.dice_count} dice</Text>
              </View>
            ))}
        </View>

        {/* Current Bid - Prominent Display */}
        <View style={styles.currentBidSection}>
          <Text style={styles.currentBidLabel}>{isEndgame === true ? 'FINAL SHOWDOWN' : 'CURRENT BID'}</Text>
          <View style={styles.currentBidContainer}>
            <Text style={styles.currentBidValue}>
              {gameState.current_bid 
                ? (isEndgame === true 
                    ? `Sum: ${gameState.current_bid.face_value}` 
                    : `${gameState.current_bid.quantity} × ${gameState.current_bid.face_value}`)
                : (isEndgame === true ? 'BID TOTAL SUM' : 'NO BID')}
            </Text>
          </View>
          <Text style={styles.diceCountInfo}>
            {gameEngine.getTotalDiceCount()} dice on table
          </Text>
        </View>

        {/* Player Dice - Primary Focus */}
        {humanPlayer && (
          <View style={styles.playerDiceSection}>
            <Text style={styles.yourDiceLabel}>YOUR DICE</Text>
            <View style={styles.primaryDiceDisplay}>
              <DiceDisplay dice={humanPlayer.dice} />
            </View>
          </View>
        )}

        {/* Quick Actions - Immediate Access */}
        <View style={styles.quickActionsSection}>
          {isHumanTurn && gameState.phase === 'bidding' && (
            <View style={styles.quickBiddingControls}>
              <BiddingInterface
                currentBid={gameState.current_bid}
                onBid={handleBid}
                onChallenge={handleChallenge}
                totalDice={gameEngine.getTotalDiceCount()}
                variant="compact"
                isEndgame={isEndgame || false}
              />
            </View>
          )}
        </View>

        {/* Game Log - Expandable */}
        <View style={styles.gameLogContainer}>
          <TouchableOpacity 
            style={styles.gameLogHeader} 
            onPress={() => setIsGameLogExpanded(!isGameLogExpanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.gameLogTitle}>GAME LOG</Text>
            <Text style={styles.gameLogToggle}>
              {isGameLogExpanded ? '▼' : '▲'}
            </Text>
          </TouchableOpacity>

          {isGameLogExpanded && (
            <View style={styles.gameLogExpanded}>
              <GameHistory
                actions={gameEngine?.getActions() || []}
                players={gameState.players.reduce((acc, player) => {
                  acc[player.id] = player.username
                  return acc
                }, {} as { [id: string]: string })}
                isEndgame={isEndgame || false}
              />
            </View>
          )}
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
        <DramaticChallengeResult
          isVisible={showChallengeResult}
          challengedBid={challengeResultData.challengedBid}
          challengeSuccessful={challengeResultData.challengeSuccessful}
          challengerName={challengeResultData.challengerName}
          bidderName={challengeResultData.bidderName}
          players={challengeResultData.players}
          capturedDiceState={challengeResultData.capturedDiceState}
          isEndgame={isEndgame || false}
          onComplete={() => {
            setShowChallengeResult(false)
            setChallengeResultData(null)
            console.log('🎭 Resuming AI moves and completing challenge sequence')
            setIsDramaticSequenceActive(false) // Resume AI moves after sequence
            
            // Complete the challenge sequence (start new round with fresh dice)
            completeChallengeSequence()
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

  // Game Table - Center-Focused Vertical Layout
  gameTable: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  // Simplified Opponents Bar
  opponentsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
  },
  opponentSummary: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  opponentName: {
    fontSize: 10,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  opponentDiceCount: {
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular',
    color: '#f5f5dc', // Cream
    letterSpacing: 0.5,
  },

  // Current Bid Section - Prominent
  currentBidSection: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  currentBidLabel: {
    fontSize: 16,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    marginBottom: 12,
    letterSpacing: 1,
  },
  currentBidContainer: {
    backgroundColor: '#d4af37', // Gold background
    borderWidth: 3,
    borderTopColor: '#FFEC8B', // Gold highlight
    borderLeftColor: '#FFEC8B',
    borderRightColor: '#CC9900', // Gold shadow
    borderBottomColor: '#CC9900',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  currentBidValue: {
    fontSize: 24,
    fontFamily: 'PressStart2P_400Regular',
    color: '#2A2A2A', // Dark text on gold
    textAlign: 'center',
    letterSpacing: 1,
  },
  diceCountInfo: {
    fontSize: 14,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 0.5,
  },

  // Player Dice Section - Primary Focus
  playerDiceSection: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  yourDiceLabel: {
    fontSize: 18,
    fontFamily: 'PressStart2P_400Regular',
    color: '#f5f5dc', // Cream
    marginBottom: 16,
    letterSpacing: 1,
  },
  primaryDiceDisplay: {
    transform: [{ scale: 1.2 }], // Make dice larger as primary focus
  },

  // Quick Actions Section
  quickActionsSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickBiddingControls: {
    width: '100%',
    maxWidth: 400,
  },

  // Game Log - Expandable
  gameLogContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  gameLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderBottomWidth: 1,
    borderBottomColor: '#d4af37',
  },
  gameLogTitle: {
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular',
    color: '#d4af37', // Gold
    letterSpacing: 1,
  },
  gameLogToggle: {
    fontSize: 14,
    fontFamily: 'PressStart2P_400Regular',
    color: '#f5f5dc', // Cream
    letterSpacing: 0.5,
  },
  gameLogExpanded: {
    maxHeight: 250,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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