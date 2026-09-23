import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type WeddingButtonVariant = 'play' | 'customize' | 'howToPlay';

interface WeddingButtonProps {
  variant: WeddingButtonVariant;
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const WeddingButton: React.FC<WeddingButtonProps> = ({
  variant,
  title,
  onPress,
  style,
}) => {
  const pressScale = useRef(new Animated.Value(1)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  // Idle pulse animation for primary PLAY button
  useEffect(() => {
    if (variant !== 'play') return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.035,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [variant, pulseScale]);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const combinedScale = Animated.multiply(pressScale, pulseScale);

  if (variant === 'play') {
    return (
      <Animated.View
        style={[
          styles.buttonWrapper,
          { transform: [{ scale: combinedScale }] },
          style,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.basePill, styles.playPill]}
        >
          {/* Top glossy highlight line */}
          <View style={styles.glossHighlight} />

          <View style={styles.contentRow}>
            <View style={styles.playIconContainer}>
              <Ionicons name="play" size={22} color="#FFFBEB" style={{ marginLeft: 2 }} />
            </View>
            <Text style={styles.playText}>{title}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'customize') {
    return (
      <Animated.View
        style={[
          styles.buttonWrapper,
          { transform: [{ scale: pressScale }] },
          style,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.basePill, styles.customizePill]}
        >
          <View style={styles.contentRow}>
            <Ionicons name="sparkles" size={18} color="#831843" />
            <Text style={styles.customizeText}>{title}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // How to Play
  return (
    <Animated.View
      style={[
        styles.buttonWrapper,
        { transform: [{ scale: pressScale }] },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.basePill, styles.howToPlayPill]}
      >
        <View style={styles.contentRow}>
          <Ionicons name="help-circle-outline" size={18} color="#FDE68A" />
          <Text style={styles.howToPlayText}>{title}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  basePill: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  // --- PLAY VARIANT ---
  playPill: {
    backgroundColor: '#D91B5C',
    borderWidth: 2.5,
    borderColor: '#F59E0B',
    shadowColor: '#831843',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  glossHighlight: {
    position: 'absolute',
    top: 2,
    left: '10%',
    right: '10%',
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  playIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2.5,
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  // --- CUSTOMIZE VARIANT ---
  customizePill: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#D97706',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  customizeText: {
    color: '#831843',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  // --- HOW TO PLAY VARIANT ---
  howToPlayPill: {
    backgroundColor: 'rgba(46, 5, 19, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.65)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  howToPlayText: {
    color: '#FDE68A',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
