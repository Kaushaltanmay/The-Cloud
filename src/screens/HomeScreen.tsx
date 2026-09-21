import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEFAULT_FRIEND_1_URI } from '../assets/placeholders/defaultFaces';
import { GAME_CONSTANTS } from '../game/constants';

interface HomeScreenProps {
  bestScore: number;
  playerFaceUri: string | null;
  obstacleFaceUri: string | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPlay: () => void;
  onCustomize: () => void;
  onHowToPlay: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  bestScore,
  playerFaceUri,
  obstacleFaceUri,
  soundEnabled,
  onToggleSound,
  onPlay,
  onCustomize,
  onHowToPlay,
}) => {
  const insets = useSafeAreaInsets();
  const bobAnim = useRef(new Animated.Value(0)).current;

  // Idle floating animation for the face
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, {
          toValue: -12,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(bobAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bobAnim]);

  const playerImageSource = playerFaceUri
    ? { uri: playerFaceUri }
    : { uri: DEFAULT_FRIEND_1_URI };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Header: Sound & Settings */}
      <View style={styles.topBar}>
        <View style={styles.bestScorePill}>
          <Ionicons name="trophy" size={16} color="#FBBF24" />
          <Text style={styles.bestScoreText}>BEST: {bestScore}</Text>
        </View>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={onToggleSound}
          activeOpacity={0.7}
        >
          <Ionicons
            name={soundEnabled ? 'volume-high' : 'volume-mute'}
            size={20}
            color="#E2E8F0"
          />
        </TouchableOpacity>
      </View>

      {/* Hero Center Section */}
      <View style={styles.heroSection}>
        {/* Floating Player Face Preview */}
        <Animated.View
          style={[
            styles.facePreviewWrapper,
            { transform: [{ translateY: bobAnim }] },
          ]}
        >
          <View style={styles.glowRing} />
          <View style={styles.faceCircle}>
            <Image source={playerImageSource} style={styles.faceImage} />
          </View>
        </Animated.View>

        {/* Game Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>FACE FLAP</Text>
          <Text style={styles.subtitle}>
            “Your friend's face. Your friend's obstacles.”
          </Text>
        </View>

        {/* Status Indicators */}
        <View style={styles.statusChips}>
          <View style={[styles.chip, styles.chipActive]}>
            <Ionicons
              name="checkmark-circle"
              size={13}
              color="#10B981"
            />
            <Text style={styles.chipText}>
              Friend 1: Ready
            </Text>
          </View>

          <View style={[styles.chip, obstacleFaceUri ? styles.chipActive : styles.chipInactive]}>
            <Ionicons
              name={obstacleFaceUri ? 'checkmark-circle' : 'layers-outline'}
              size={13}
              color={obstacleFaceUri ? '#EF4444' : '#94A3B8'}
            />
            <Text style={styles.chipText}>
              Friend 2: {obstacleFaceUri ? 'Loaded' : 'Default'}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Action Buttons */}
      <View style={styles.menuButtons}>
        {/* PLAY BUTTON */}
        <TouchableOpacity
          style={[styles.menuBtn, styles.playBtn]}
          onPress={onPlay}
          activeOpacity={0.85}
        >
          <Ionicons name="play" size={24} color="#FFFFFF" />
          <Text style={styles.playBtnText}>PLAY</Text>
        </TouchableOpacity>

        {/* CUSTOMIZE BUTTON */}
        <TouchableOpacity
          style={[styles.menuBtn, styles.secondaryBtn]}
          onPress={onCustomize}
          activeOpacity={0.8}
        >
          <Ionicons name="images-outline" size={20} color="#818CF8" />
          <Text style={styles.secondaryBtnText}>CUSTOMIZE</Text>
        </TouchableOpacity>

        {/* HOW TO PLAY BUTTON */}
        <TouchableOpacity
          style={[styles.menuBtn, styles.tertiaryBtn]}
          onPress={onHowToPlay}
          activeOpacity={0.8}
        >
          <Ionicons name="help-circle-outline" size={20} color="#94A3B8" />
          <Text style={styles.tertiaryBtnText}>HOW TO PLAY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.35)',
    gap: 8,
  },
  bestScoreText: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    gap: 18,
  },
  facePreviewWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowRing: {
    ...(StyleSheet.absoluteFill as any),
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 10,
  },
  faceCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  faceImage: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    textShadowColor: 'rgba(99, 102, 241, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 14,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  statusChips: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  chipInactive: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  chipText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  menuButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 8,
  },
  menuBtn: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  playBtn: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  secondaryBtn: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#3730A3',
  },
  secondaryBtnText: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  tertiaryBtn: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tertiaryBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
