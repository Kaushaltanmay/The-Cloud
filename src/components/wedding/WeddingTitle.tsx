import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Animated,
  useWindowDimensions,
} from 'react-native';

const TITLE_ASSET = require('../../assets/wedding/wedding_title.png');

interface WeddingTitleProps {
  entranceDelay?: number;
}

export const WeddingTitle: React.FC<WeddingTitleProps> = ({ entranceDelay = 200 }) => {
  const { width } = useWindowDimensions();

  // Responsive dimensions for title: max 340dp, fits nicely with padding
  const titleWidth = Math.min(width * 0.88, 330);
  const titleHeight = (titleWidth * 305) / 465;

  // Animation values
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    // 1. Entrance animation (fade + drop down slightly)
    const entranceTimeout = setTimeout(() => {
      Animated.spring(entranceAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, entranceDelay);

    // 2. Idle floating/breathing animation
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 3,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();

    // 3. Periodic golden shine sweep across the title
    const shineLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(2500),
        Animated.timing(shineAnim, {
          toValue: titleWidth + 100,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: -150,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    shineLoop.start();

    return () => {
      clearTimeout(entranceTimeout);
      floatLoop.stop();
      shineLoop.stop();
    };
  }, [entranceAnim, floatAnim, shineAnim, entranceDelay, titleWidth]);

  const translateY = Animated.add(
    entranceAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, 0],
    }),
    floatAnim
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: titleWidth,
          height: titleHeight,
          opacity: entranceAnim,
          transform: [
            { translateY },
            {
              scale: entranceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.92, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Image
        source={TITLE_ASSET}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Golden Shine Sweep */}
      <View style={styles.shineMask} pointerEvents="none">
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'relative',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  shineMask: {
    ...(StyleSheet.absoluteFill as any),
    overflow: 'hidden',
    borderRadius: 20,
  },
  shineBar: {
    width: 32,
    height: '250%',
    position: 'absolute',
    top: '-75%',
    backgroundColor: 'rgba(255, 245, 200, 0.35)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
});
