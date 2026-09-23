import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  ImageBackground,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WeddingButton } from '../components/wedding/WeddingButton';
import { WeddingLights } from '../components/wedding/WeddingLights';
import { PetalLayer } from '../components/wedding/PetalLayer';

const WEDDING_SCENE_BG = require('../assets/wedding/wedding_scene.jpg');

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
  soundEnabled,
  onToggleSound,
  onPlay,
  onCustomize,
  onHowToPlay,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Entrance animations
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonsRiseAnim = useRef(new Animated.Value(60)).current;
  const buttonsFadeAnim = useRef(new Animated.Value(0)).current;

  // Title sheen animation
  const shineAnim = useRef(new Animated.Value(-160)).current;

  useEffect(() => {
    // 1. Top bar fade in
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // 2. Buttons slide up & fade in after slight delay
    Animated.parallel([
      Animated.timing(buttonsFadeAnim, {
        toValue: 1,
        duration: 650,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(buttonsRiseAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Periodic golden shine sweep across the title at top
    const shineLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(2200),
        Animated.timing(shineAnim, {
          toValue: width + 80,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: -160,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    shineLoop.start();

    return () => {
      shineLoop.stop();
    };
  }, [headerFadeAnim, buttonsFadeAnim, buttonsRiseAnim, shineAnim, width]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Main Wedding Mandap Scene Background */}
      <ImageBackground
        source={WEDDING_SCENE_BG}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Subtle dark gradient overlay to ensure contrast and luxury mood */}
        <View style={styles.ambientOverlay} pointerEvents="none" />

        {/* Twinkling Golden Bokeh Fairy Lights */}
        <WeddingLights />

        {/* Falling Rose and Marigold Petals */}
        <PetalLayer />

        {/* Dynamic Golden Shine Sweep over the title area */}
        <View
          style={[
            styles.titleShineContainer,
            { top: Math.max(insets.top, 16) + 10 },
          ]}
          pointerEvents="none"
        >
          <Animated.View
            style={[
              styles.shineBar,
              {
                transform: [
                  { translateX: shineAnim },
                  { rotate: '25deg' },
                ],
              },
            ]}
          />
        </View>

        {/* Foreground Content Container */}
        <View
          style={[
            styles.foreground,
            {
              paddingTop: Math.max(insets.top, 16) + 4,
              paddingBottom: Math.max(insets.bottom, 16) + 6,
            },
          ]}
        >
          {/* Top Header: High Score Trophy & Sound Toggle */}
          <Animated.View
            style={[
              styles.topBar,
              {
                opacity: headerFadeAnim,
                transform: [
                  {
                    translateY: headerFadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-15, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.bestScorePill}>
              <Ionicons name="trophy" size={17} color="#FBBF24" />
              <Text style={styles.bestScoreText}>BEST: {bestScore}</Text>
            </View>

            <TouchableOpacity
              style={styles.circleBtn}
              onPress={onToggleSound}
              activeOpacity={0.75}
            >
              <Ionicons
                name={soundEnabled ? 'volume-high' : 'volume-mute'}
                size={20}
                color="#FEF3C7"
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Spacer: allows the authentic couple & mandap to be fully visible and unobstructed */}
          <View style={styles.coupleSpacer} pointerEvents="none" />

          {/* Bottom Action Menu: PLAY, CUSTOMIZE, HOW TO PLAY */}
          <Animated.View
            style={[
              styles.menuContainer,
              {
                opacity: buttonsFadeAnim,
                transform: [{ translateY: buttonsRiseAnim }],
              },
            ]}
          >
            {/* Primary PLAY Button */}
            <WeddingButton
              variant="play"
              title="PLAY"
              onPress={onPlay}
              style={styles.buttonSpacing}
            />

            {/* CUSTOMIZE Button */}
            <WeddingButton
              variant="customize"
              title="CUSTOMIZE"
              onPress={onCustomize}
              style={styles.buttonSpacing}
            />

            {/* HOW TO PLAY Button */}
            <WeddingButton
              variant="howToPlay"
              title="HOW TO PLAY"
              onPress={onHowToPlay}
            />
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E040D',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  ambientOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(20, 4, 10, 0.12)',
  },
  titleShineContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 190,
    overflow: 'hidden',
    zIndex: 5,
  },
  shineBar: {
    width: 38,
    height: 350,
    position: 'absolute',
    top: -80,
    backgroundColor: 'rgba(255, 255, 230, 0.32)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  foreground: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  bestScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 6, 20, 0.82)',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.65)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 4,
    gap: 8,
  },
  bestScoreText: {
    color: '#FEF3C7',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(46, 6, 20, 0.82)',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 4,
  },
  coupleSpacer: {
    flex: 1,
  },
  menuContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  buttonSpacing: {
    marginBottom: 11,
  },
});
