import React, { useMemo } from 'react';
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

interface WeddingEnding {
  emoji: string;
  title: string;
  subtitle: string;
}

const WEDDING_ENDINGS: WeddingEnding[] = [
  {
    emoji: '😭',
    title: 'Shaadi Cancel Ho Gayi!',
    subtitle: 'Pandit ji packed his bags and caught the first train back home.',
  },
  {
    emoji: '💀',
    title: 'Abhikasho Missed The Baraat!',
    subtitle: 'The decorated ghodi has galloped away alone into the sunset.',
  },
  {
    emoji: '🚨',
    title: 'Sasural Detected Your Flap!',
    subtitle: 'High alert issued by Rishtedaar Task Force. RUN! 🏃💨',
  },
  {
    emoji: '💔',
    title: 'Shruto Has Left The Mandap!',
    subtitle: 'Bride demanded minimum 10/10 flap skills for the varmala.',
  },
  {
    emoji: '🥁',
    title: 'BARAAT HAS STOPPED!',
    subtitle: 'DJ wale babu pulled the aux cable and took the sound system away.',
  },
  {
    emoji: '👵',
    title: 'Rishta Rejected By Buaji!',
    subtitle: 'Salary slip and flap stamina could not be verified by elders.',
  },
  {
    emoji: '🍛',
    title: 'Gulab Jamun Finished First!',
    subtitle: 'Angry Fufaji spotted storming out of the wedding banquet.',
  },
];

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  isNewBest,
  onPlayAgain,
  onCustomize,
  onMainMenu,
}) => {
  // Pick a random funny ending on mount
  const ending = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * WEDDING_ENDINGS.length);
    return WEDDING_ENDINGS[randomIndex];
  }, []);

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* Top Disaster Emoji */}
        <Text style={styles.disasterEmoji}>{ending.emoji}</Text>

        {/* Funny Ending Title */}
        <Text style={styles.gameOverTitle}>{ending.title}</Text>

        {/* Funny Ending Subtitle */}
        <Text style={styles.gameOverSubtitle}>{ending.subtitle}</Text>

        {/* New Record Banner */}
        {isNewBest ? (
          <View style={styles.newBestBadge}>
            <Text style={styles.newBestText}>
              🔥 Ab Toh Shaadi Pakki Hai! Family WhatsApp Par Share Karo! 🎉
            </Text>
          </View>
        ) : null}

        {/* Score Board Box */}
        <View style={styles.scoreBoard}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>💍 LOVE SCORE</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>🏆 BEST RECORD</Text>
            <Text style={[styles.scoreValue, styles.bestValue]}>
              {bestScore}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          {/* TRY AGAIN / EK AUR CHANCE */}
          <TouchableOpacity
            style={[styles.btn, styles.tryAgainBtn]}
            onPress={onPlayAgain}
            activeOpacity={0.85}
          >
            <Ionicons name="reload" size={20} color="#FFFFFF" />
            <Text style={styles.tryAgainBtnText}>💍 EK AUR CHANCE (TRY AGAIN)</Text>
          </TouchableOpacity>

          {/* CUSTOMIZE */}
          <TouchableOpacity
            style={[styles.btn, styles.customizeBtn]}
            onPress={onCustomize}
            activeOpacity={0.85}
          >
            <Ionicons name="sparkles" size={18} color="#831843" />
            <Text style={styles.customizeBtnText}>CUSTOMIZE LOOK</Text>
          </TouchableOpacity>

          {/* MAIN MENU */}
          <TouchableOpacity
            style={[styles.btn, styles.menuBtn]}
            onPress={onMainMenu}
            activeOpacity={0.85}
          >
            <Ionicons name="home-outline" size={17} color="#FDE68A" />
            <Text style={styles.menuBtnText}>WEDDING HOME</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(20, 2, 8, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'rgba(38, 4, 16, 0.96)',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#F59E0B',
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.65,
    shadowRadius: 16,
    elevation: 16,
  },
  disasterEmoji: {
    fontSize: 44,
    marginBottom: 6,
  },
  gameOverTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FDE68A',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(217, 27, 92, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    marginBottom: 6,
  },
  gameOverSubtitle: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  newBestBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.22)',
    borderColor: '#F59E0B',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginBottom: 16,
    width: '100%',
  },
  newBestText: {
    color: '#FEF08A',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  scoreBoard: {
    width: '100%',
    backgroundColor: 'rgba(18, 2, 7, 0.75)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    marginBottom: 18,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  scoreLabel: {
    color: '#FDE68A',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  scoreValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  bestValue: {
    color: '#FBBF24',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    marginVertical: 8,
  },
  buttonsContainer: {
    width: '100%',
    gap: 10,
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  tryAgainBtn: {
    backgroundColor: '#D91B5C',
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#831843',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  tryAgainBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  customizeBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#D97706',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  customizeBtnText: {
    color: '#831843',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  menuBtn: {
    backgroundColor: 'rgba(20, 2, 8, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  menuBtnText: {
    color: '#FDE68A',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
