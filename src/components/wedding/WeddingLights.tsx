import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, useWindowDimensions } from 'react-native';

interface LightConfig {
  xPct: number;
  yPct: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const LIGHTS: LightConfig[] = [
  { xPct: 0.12, yPct: 0.08, size: 8, color: '#FDE68A', duration: 1600, delay: 0 },
  { xPct: 0.28, yPct: 0.05, size: 12, color: '#FEF08A', duration: 2200, delay: 400 },
  { xPct: 0.52, yPct: 0.04, size: 9, color: '#FCD34D', duration: 1800, delay: 800 },
  { xPct: 0.76, yPct: 0.07, size: 14, color: '#FEF08A', duration: 2400, delay: 200 },
  { xPct: 0.88, yPct: 0.12, size: 7, color: '#FDE68A', duration: 1500, delay: 600 },
  { xPct: 0.06, yPct: 0.22, size: 11, color: '#FDE047', duration: 2100, delay: 900 },
  { xPct: 0.92, yPct: 0.25, size: 10, color: '#FDE68A', duration: 1700, delay: 300 },
  { xPct: 0.15, yPct: 0.38, size: 8, color: '#FEF9C3', duration: 2000, delay: 700 },
  { xPct: 0.84, yPct: 0.40, size: 12, color: '#FDE047', duration: 2300, delay: 150 },
  { xPct: 0.48, yPct: 0.34, size: 7, color: '#FCD34D', duration: 1900, delay: 500 },
  { xPct: 0.08, yPct: 0.52, size: 9, color: '#FEF08A', duration: 2200, delay: 1000 },
  { xPct: 0.90, yPct: 0.55, size: 10, color: '#FDE68A', duration: 1800, delay: 350 },
];

const TwinklingLight: React.FC<{
  config: LightConfig;
  screenWidth: number;
  screenHeight: number;
}> = ({ config, screenWidth, screenHeight }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: config.duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: config.duration / 2,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [anim, config]);

  const left = config.xPct * screenWidth - config.size / 2;
  const top = config.yPct * screenHeight - config.size / 2;

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 0.95],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.75, 1.35],
  });

  return (
    <Animated.View
      style={[
        styles.light,
        {
          left,
          top,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: config.color,
          shadowColor: config.color,
          opacity,
          transform: [{ scale }],
        },
      ]}
      pointerEvents="none"
    />
  );
};

export const WeddingLights: React.FC = () => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {LIGHTS.map((light, index) => (
        <TwinklingLight
          key={index}
          config={light}
          screenWidth={width}
          screenHeight={height}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  light: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
});
