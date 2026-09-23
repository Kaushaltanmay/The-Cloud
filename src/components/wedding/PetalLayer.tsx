import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';

const ROSE_PETAL = require('../../assets/wedding/rose_petal.png');
const MARIGOLD_PETAL = require('../../assets/wedding/marigold_petal.png');

interface PetalConfig {
  type: 'rose' | 'marigold';
  startXRatio: number;
  size: number;
  fallDuration: number;
  swayDuration: number;
  swayDistance: number;
  rotationRange: [string, string];
  delay: number;
  opacity: number;
}

const PETAL_PRESETS: PetalConfig[] = [
  {
    type: 'rose',
    startXRatio: 0.15,
    size: 26,
    fallDuration: 6200,
    swayDuration: 2400,
    swayDistance: 25,
    rotationRange: ['-20deg', '45deg'],
    delay: 200,
    opacity: 0.9,
  },
  {
    type: 'marigold',
    startXRatio: 0.32,
    size: 22,
    fallDuration: 5500,
    swayDuration: 2000,
    swayDistance: 35,
    rotationRange: ['30deg', '-30deg'],
    delay: 1500,
    opacity: 0.85,
  },
  {
    type: 'rose',
    startXRatio: 0.52,
    size: 28,
    fallDuration: 7000,
    swayDuration: 2600,
    swayDistance: 30,
    rotationRange: ['0deg', '80deg'],
    delay: 800,
    opacity: 0.95,
  },
  {
    type: 'marigold',
    startXRatio: 0.72,
    size: 24,
    fallDuration: 5800,
    swayDuration: 2100,
    swayDistance: 28,
    rotationRange: ['-45deg', '45deg'],
    delay: 2400,
    opacity: 0.9,
  },
  {
    type: 'rose',
    startXRatio: 0.88,
    size: 25,
    fallDuration: 6500,
    swayDuration: 2300,
    swayDistance: 22,
    rotationRange: ['15deg', '-60deg'],
    delay: 1100,
    opacity: 0.85,
  },
  {
    type: 'marigold',
    startXRatio: 0.08,
    size: 20,
    fallDuration: 6000,
    swayDuration: 1900,
    swayDistance: 30,
    rotationRange: ['-10deg', '70deg'],
    delay: 3200,
    opacity: 0.8,
  },
  {
    type: 'rose',
    startXRatio: 0.42,
    size: 30,
    fallDuration: 7400,
    swayDuration: 2800,
    swayDistance: 40,
    rotationRange: ['-30deg', '60deg'],
    delay: 4000,
    opacity: 0.9,
  },
  {
    type: 'marigold',
    startXRatio: 0.62,
    size: 23,
    fallDuration: 5400,
    swayDuration: 2200,
    swayDistance: 26,
    rotationRange: ['20deg', '-40deg'],
    delay: 2800,
    opacity: 0.85,
  },
  {
    type: 'rose',
    startXRatio: 0.82,
    size: 27,
    fallDuration: 6800,
    swayDuration: 2500,
    swayDistance: 32,
    rotationRange: ['-50deg', '30deg'],
    delay: 4800,
    opacity: 0.92,
  },
  {
    type: 'marigold',
    startXRatio: 0.22,
    size: 21,
    fallDuration: 5900,
    swayDuration: 2100,
    swayDistance: 25,
    rotationRange: ['-15deg', '55deg'],
    delay: 5200,
    opacity: 0.8,
  },
];

const FallingPetal: React.FC<{
  config: PetalConfig;
  screenWidth: number;
  screenHeight: number;
}> = ({ config, screenWidth, screenHeight }) => {
  const fallAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Fall loop
    const fallLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(fallAnim, {
          toValue: 1,
          duration: config.fallDuration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(fallAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    fallLoop.start();

    // 2. Sway loop
    const swayLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: config.swayDuration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -1,
          duration: config.swayDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: 0,
          duration: config.swayDuration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    swayLoop.start();

    return () => {
      fallLoop.stop();
      swayLoop.stop();
    };
  }, [fallAnim, swayAnim, config]);

  const startX = config.startXRatio * screenWidth;
  const startY = -50;
  const endY = screenHeight + 60;

  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [startY, endY],
  });

  const translateX = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-config.swayDistance, config.swayDistance],
  });

  const rotate = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: config.rotationRange,
  });

  const source = config.type === 'rose' ? ROSE_PETAL : MARIGOLD_PETAL;

  return (
    <Animated.Image
      source={source}
      style={[
        styles.petal,
        {
          left: startX,
          width: config.size,
          height: (config.size * 64) / 48,
          opacity: config.opacity,
          transform: [{ translateY }, { translateX }, { rotate }],
        },
      ]}
      resizeMode="contain"
    />
  );
};

export const PetalLayer: React.FC = () => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {PETAL_PRESETS.map((preset, index) => (
        <FallingPetal
          key={index}
          config={preset}
          screenWidth={width}
          screenHeight={height}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  petal: {
    position: 'absolute',
    top: 0,
    shadowColor: '#450A0A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
  },
});
