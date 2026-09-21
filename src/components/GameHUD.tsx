import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GameHUDProps {
  score: number;
  bestScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPause: () => void;
  isPaused: boolean;
  onResume: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  bestScore,
  soundEnabled,
  onToggleSound,
  onPause,
  isPaused,
  onResume,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top + 8, 24) },
      ]}
      pointerEvents="box-none"
    >
      {/* Left: Best Score Pill */}
      <View style={styles.bestPill}>
        <Ionicons name="trophy" size={14} color="#FBBF24" />
        <Text style={styles.bestText}>BEST {bestScore}</Text>
      </View>

      {/* Center: Large Glowing Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreNumber}>{score}</Text>
      </View>

      {/* Right: Quick Action Controls */}
      <View style={styles.actionsGroup}>
        {/* Sound Toggle */}
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={onToggleSound}
          activeOpacity={0.7}
        >
          <Ionicons
            name={soundEnabled ? 'volume-high' : 'volume-mute'}
            size={18}
            color="#E2E8F0"
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
            size={18}
            color="#E2E8F0"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 50,
  },
  bestPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    gap: 6,
  },
  bestText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(99, 102, 241, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  actionsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
