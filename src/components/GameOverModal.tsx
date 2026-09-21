import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GameOverModalProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onCustomize: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  isNewBest,
  onPlayAgain,
  onCustomize,
  onMainMenu,
}) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.gameOverTitle}>GAME OVER</Text>

        {/* New Record Banner */}
        {isNewBest && (
          <View style={styles.newBestBadge}>
            <Text style={styles.newBestText}>NEW BEST! 🎉</Text>
          </View>
        )}

        {/* Score Board Box */}
        <View style={styles.scoreBoard}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>BEST</Text>
            <Text style={[styles.scoreValue, styles.bestValue]}>
              {bestScore}
            </Text>
          </View>
        </View>

        {/* Buttons List */}
        <View style={styles.buttonsContainer}>
          {/* PLAY AGAIN */}
          <TouchableOpacity
            style={[styles.btn, styles.playAgainBtn]}
            onPress={onPlayAgain}
            activeOpacity={0.8}
          >
            <Ionicons name="reload" size={20} color="#FFFFFF" />
            <Text style={styles.playAgainBtnText}>PLAY AGAIN</Text>
          </TouchableOpacity>

          {/* CUSTOMIZE */}
          <TouchableOpacity
            style={[styles.btn, styles.secondaryBtn]}
            onPress={onCustomize}
            activeOpacity={0.8}
          >
            <Ionicons name="images-outline" size={18} color="#93C5FD" />
            <Text style={styles.secondaryBtnText}>CUSTOMIZE</Text>
          </TouchableOpacity>

          {/* MAIN MENU */}
          <TouchableOpacity
            style={[styles.btn, styles.secondaryBtn]}
            onPress={onMainMenu}
            activeOpacity={0.8}
          >
            <Ionicons name="home-outline" size={18} color="#CBD5E1" />
            <Text style={styles.secondaryBtnText}>MAIN MENU</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(3, 7, 18, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#3730A3',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 2,
    textShadowColor: 'rgba(239, 68, 68, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  newBestBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    borderColor: '#EAB308',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  newBestText: {
    color: '#FACC15',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scoreBoard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  scoreLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  scoreValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  bestValue: {
    color: '#FBBF24',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 10,
  },
  buttonsContainer: {
    width: '100%',
    gap: 10,
  },
  btn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  playAgainBtn: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  playAgainBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  secondaryBtn: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  secondaryBtnText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
