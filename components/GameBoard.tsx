import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useGame } from '../contexts/GameContext'
import { Bid, Player } from '../types/game'
import { CasinoTheme, getContainerStyle } from '../lib/theme'
import { PlayerCard } from './PlayerCard'
import { DiceDisplay } from './DiceDisplay'
import { BiddingInterface } from './BiddingInterface'
import { GameHistory } from './GameHistory'
import { ChallengeResult } from './ChallengeResult'
import { TurnIndicator } from './TurnIndicator'
import { RoundTransition } from './RoundTransition'

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
      {/* Compact Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Liar's Dice</Text>
          <Text style={styles.roundText}>Round {gameState.round_number} • {gameState.phase === 'bidding' ? 'Bidding' : gameState.phase === 'challenging' ? 'Challenge' : gameState.phase === 'revealing' ? 'Revealing' : 'Round End'}</Text>
        </View>
      </View>

      {/* Main Content - Left/Right Split */}
      <View style={styles.mainContent}>
        {/* Left Side - Game State Info */}
        <View style={styles.leftPanel}>
          <View style={styles.currentBidSection}>
            <Text style={styles.sectionTitle}>Current Bid</Text>
            {gameState.current_bid ? (
              <Text style={styles.currentBidText}>
                {gameState.current_bid.quantity} × {gameState.current_bid.face_value}
              </Text>
            ) : (
              <Text style={styles.noBidText}>No bid yet</Text>
            )}
          </View>

          <TurnIndicator
            currentPlayer={currentPlayer}
            isHumanTurn={isHumanTurn}
            gamePhase={gameState.phase}
          />

          {humanPlayer && (
            <View style={styles.yourDiceSection}>
              <Text style={styles.sectionTitle}>Your Dice</Text>
              <DiceDisplay dice={humanPlayer.dice} />
            </View>
          )}

          <View style={styles.gameHistorySection}>
            <Text style={styles.sectionTitle}>Game History</Text>
            <GameHistory 
              actions={gameEngine ? gameEngine.getActions() : []} 
              players={Object.fromEntries(
                gameState.players.map(p => [p.id, p.username])
              )}
            />
          </View>
        </View>

        {/* Right Side - Players */}
        <View style={styles.rightPanel}>
          <Text style={styles.sectionTitle}>Players</Text>
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
        </View>
      </View>

      {/* Bottom Bidding Interface - Only show when it's human's turn */}
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
    backgroundColor: CasinoTheme.colors.charcoalDark,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CasinoTheme.colors.charcoalDark,
  },
  loadingText: {
    color: CasinoTheme.colors.cream,
    fontSize: 18,
    ...CasinoTheme.fonts.body,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CasinoTheme.spacing.lg,
    paddingVertical: CasinoTheme.spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: CasinoTheme.colors.gold,
    backgroundColor: CasinoTheme.colors.charcoal,
    ...CasinoTheme.shadows.small,
  },
  backButton: {
    paddingVertical: CasinoTheme.spacing.xs,
    paddingHorizontal: CasinoTheme.spacing.sm,
    borderRadius: CasinoTheme.borderRadius.sm,
    borderWidth: 2,
    borderColor: CasinoTheme.colors.gold,
    backgroundColor: CasinoTheme.colors.charcoalLight,
  },
  backButtonText: {
    color: CasinoTheme.colors.gold,
    fontSize: 16,
    ...CasinoTheme.fonts.body,
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: CasinoTheme.colors.gold,
    marginBottom: 2,
    ...CasinoTheme.fonts.header,
    textShadowColor: CasinoTheme.colors.charcoalDark,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  roundText: {
    color: CasinoTheme.colors.cream,
    fontSize: 14,
    ...CasinoTheme.fonts.body,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: CasinoTheme.colors.casinoGreen, // Felt table background
  },
  leftPanel: {
    flex: 1,
    padding: CasinoTheme.spacing.md,
    borderRightWidth: 3,
    borderRightColor: CasinoTheme.colors.gold,
    backgroundColor: CasinoTheme.colors.casinoGreenDark,
  },
  rightPanel: {
    flex: 1,
    padding: CasinoTheme.spacing.md,
    backgroundColor: CasinoTheme.colors.casinoGreen,
  },
  sectionTitle: {
    color: CasinoTheme.colors.gold,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: CasinoTheme.spacing.sm,
    ...CasinoTheme.fonts.header,
    textShadowColor: CasinoTheme.colors.charcoalDark,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  currentBidSection: {
    marginBottom: CasinoTheme.spacing.lg,
    padding: CasinoTheme.spacing.md,
    backgroundColor: CasinoTheme.colors.charcoal,
    borderRadius: CasinoTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: CasinoTheme.colors.gold,
    ...CasinoTheme.shadows.medium,
  },
  yourDiceSection: {
    marginBottom: CasinoTheme.spacing.lg,
    padding: CasinoTheme.spacing.md,
    backgroundColor: CasinoTheme.colors.charcoal,
    borderRadius: CasinoTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: CasinoTheme.colors.gold,
    ...CasinoTheme.shadows.medium,
  },
  gameHistorySection: {
    flex: 1,
    padding: CasinoTheme.spacing.md,
    backgroundColor: CasinoTheme.colors.charcoal,
    borderRadius: CasinoTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: CasinoTheme.colors.gold,
    ...CasinoTheme.shadows.medium,
  },
  playersContainer: {
    flex: 1,
  },
  currentBidText: {
    color: CasinoTheme.colors.gold,
    fontSize: 24,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.numbers,
    textShadowColor: CasinoTheme.colors.charcoalDark,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  noBidText: {
    color: CasinoTheme.colors.grayLight,
    fontSize: 18,
    ...CasinoTheme.fonts.body,
    fontStyle: 'italic',
  },
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
    color: CasinoTheme.colors.gold,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: CasinoTheme.spacing.lg,
    ...CasinoTheme.fonts.header,
    textShadowColor: CasinoTheme.colors.charcoalDark,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  winnerText: {
    color: CasinoTheme.colors.cream,
    fontSize: 28,
    fontWeight: '600',
    marginBottom: CasinoTheme.spacing.xxl,
    ...CasinoTheme.fonts.body,
    textAlign: 'center',
  },
  newGameButton: {
    backgroundColor: CasinoTheme.colors.gold,
    paddingVertical: CasinoTheme.spacing.md,
    paddingHorizontal: CasinoTheme.spacing.xl,
    borderRadius: CasinoTheme.borderRadius.md,
    borderWidth: 3,
    borderColor: CasinoTheme.colors.goldDark,
    ...CasinoTheme.shadows.large,
  },
  newGameButtonText: {
    color: CasinoTheme.colors.charcoalDark,
    fontSize: 20,
    fontWeight: 'bold',
    ...CasinoTheme.fonts.header,
  },
})