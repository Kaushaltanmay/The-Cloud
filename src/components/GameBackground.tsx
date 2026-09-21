import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GAME_CONSTANTS } from '../game/constants';

interface GameBackgroundProps {
  groundOffset: number;
}

export const GameBackground: React.FC<GameBackgroundProps> = ({ groundOffset }) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* 1. Deep arcade sky gradient layers */}
      <View style={styles.skyGradientTop} />
      <View style={styles.skyGradientBottom} />

      {/* 2. Distant floating stars */}
      <View style={[styles.star, { top: '12%', left: '15%' }]} />
      <View style={[styles.star, { top: '22%', left: '75%' }]} />
      <View style={[styles.star, { top: '18%', left: '45%', width: 4, height: 4 }]} />
      <View style={[styles.star, { top: '35%', left: '88%' }]} />
      <View style={[styles.star, { top: '42%', left: '25%' }]} />
      <View style={[styles.star, { top: '50%', left: '60%', width: 5, height: 5 }]} />

      {/* 3. Distant City Skyline Silhouette */}
      <View style={styles.skyline}>
        <View style={[styles.building, { width: 34, height: 110, left: 20 }]} />
        <View style={[styles.building, { width: 48, height: 145, left: 65 }]} />
        <View style={[styles.building, { width: 40, height: 85, left: 125 }]} />
        <View style={[styles.building, { width: 52, height: 160, left: 180 }]} />
        <View style={[styles.building, { width: 38, height: 120, left: 245 }]} />
        <View style={[styles.building, { width: 45, height: 140, left: 295 }]} />
        <View style={[styles.building, { width: 55, height: 95, left: 350 }]} />
      </View>

      {/* 4. Scrolling Ground & Neon Strip */}
      <View style={styles.groundContainer}>
        {/* Neon laser border separating ground and sky */}
        <View style={styles.neonGroundLine} />
        
        {/* Ground body with repeating stripes */}
        <View
          style={[
            styles.scrollingPattern,
            { transform: [{ translateX: -((groundOffset * 1.5) % 40) }] },
          ]}
        >
          {Array.from({ length: 25 }).map((_, i) => (
            <View key={`stripe-${i}`} style={styles.groundStripe} />
          ))}
        </View>

        {/* Footer text */}
        <View style={styles.groundLabelContainer}>
          <Text style={styles.groundLabel}>FACE FLAP ARCADE</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skyGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#090D16',
  },
  skyGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: '#111827',
  },
  star: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    opacity: 0.75,
  },
  skyline: {
    position: 'absolute',
    bottom: GAME_CONSTANTS.GROUND_HEIGHT,
    left: 0,
    right: 0,
    height: 180,
    opacity: 0.25,
  },
  building: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#3730A3',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  groundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: GAME_CONSTANTS.GROUND_HEIGHT,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    borderTopWidth: 1,
    borderColor: '#312E81',
    zIndex: 15,
  },
  neonGroundLine: {
    height: 4,
    backgroundColor: '#10B981', // Neon green laser ground
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  scrollingPattern: {
    flexDirection: 'row',
    width: 1200,
    height: 30,
    marginTop: 4,
  },
  groundStripe: {
    width: 20,
    height: '100%',
    borderRightWidth: 3,
    borderColor: '#1E293B',
    transform: [{ skewX: '-30deg' }],
  },
  groundLabelContainer: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
    alignItems: 'center',
  },
  groundLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
