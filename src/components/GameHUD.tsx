import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WeddingPopup, WeddingPopupMessage } from './wedding/WeddingPopup';

interface GameHUDProps {
  score: number;
  bestScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPause: () => void;
  isPaused: boolean;
  onResume: () => void;
  popupMessage?: WeddingPopupMessage | null;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  bestScore,
  soundEnabled,
  onToggleSound,
  onPause,
  isPaused,
  onResume,
  popupMessage,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top + 6, 22) },
      ]}
      pointerEvents="box-none"
    >
      {/* Top Header Row */}
      <View style={styles.topRow} pointerEvents="box-none">
        {/* Left: Shaadi Hearts Badge */}
        <View style={styles.heartsBadge}>
          <Text style={styles.heartIcon}>❤️</Text>
          <Text style={styles.heartsText}>3</Text>
        </View>

        {/* Center: LOVE Score with Ring */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>💍 LOVE</Text>
          <Text style={styles.scoreNumber}>{score}</Text>
        </View>

        {/* Right: Best Score & Controls */}
        <View style={styles.rightGroup}>
          <View style={styles.bestPill}>
            <Ionicons name="trophy" size={13} color="#FBBF24" />
            <Text style={styles.bestText}>{bestScore}</Text>
          </View>

          {/* Sound Toggle */}
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={onToggleSound}
            activeOpacity={0.7}
          >
            <Ionicons
              name={soundEnabled ? 'volume-high' : 'volume-mute'}
              size={17}
              color="#FEF3C7"
            />
          </TouchableOpacity>

          {/* Pause Button */}
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={isPaused ? onResume : onPause}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPaused ? 'play' : 'pause'}
              size={17}
              color="#FEF3C7"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Funny Commentary Popup */}
      <WeddingPopup message={popupMessage ?? null} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 50,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  heartsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 5, 19, 0.85)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.65)',
    gap: 4,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  heartIcon: {
    fontSize: 14,
  },
  heartsText: {
    color: '#FEF3C7',
    fontSize: 13,
    fontWeight: '900',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(217, 27, 92, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scoreNumber: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(217, 27, 92, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 1,
    marginTop: -2,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bestPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 5, 19, 0.85)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.65)',
    gap: 4,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  bestText: {
    color: '#FEF3C7',
    fontSize: 12,
    fontWeight: '800',
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(46, 5, 19, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
});
