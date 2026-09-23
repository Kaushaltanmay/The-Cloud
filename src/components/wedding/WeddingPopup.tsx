import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';

export interface WeddingPopupMessage {
  id: number;
  text: string;
}

interface WeddingPopupProps {
  message: WeddingPopupMessage | null;
}

export const WeddingPopup: React.FC<WeddingPopupProps> = ({ message }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;

    anim.setValue(0);
    // Spring pop in, hold for ~1.4s, then fade out
    Animated.sequence([
      Animated.spring(anim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.delay(1400),
      Animated.timing(anim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [message, anim]);

  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.popupContainer,
        {
          opacity: anim,
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.75, 1],
              }),
            },
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
            },
          ],
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.bubble}>
        <Text style={styles.popupText}>{message.text}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 60,
  },
  bubble: {
    backgroundColor: 'rgba(46, 5, 19, 0.92)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  popupText: {
    color: '#FEF3C7',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});
