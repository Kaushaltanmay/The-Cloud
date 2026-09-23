import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GAME_CONSTANTS } from '../game/constants';

interface GameBackgroundProps {
  groundOffset: number;
}

export const GameBackground: React.FC<GameBackgroundProps> = ({ groundOffset }) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* 1. Deep royal wedding evening twilight sky */}
      <View style={styles.skyGradientTop} />
      <View style={styles.skyGradientBottom} />

      {/* 2. Twinkling Golden Fairy Lights & Bokeh Stars */}
      <View style={[styles.fairyLight, { top: '10%', left: '12%', width: 7, height: 7 }]} />
      <View style={[styles.fairyLight, { top: '18%', left: '78%', width: 10, height: 10 }]} />
      <View style={[styles.fairyLight, { top: '14%', left: '48%', width: 6, height: 6 }]} />
      <View style={[styles.fairyLight, { top: '28%', left: '88%', width: 8, height: 8 }]} />
      <View style={[styles.fairyLight, { top: '34%', left: '22%', width: 9, height: 9 }]} />
      <View style={[styles.fairyLight, { top: '44%', left: '65%', width: 7, height: 7 }]} />
      <View style={[styles.fairyLight, { top: '52%', left: '14%', width: 8, height: 8 }]} />
      <View style={[styles.fairyLight, { top: '58%', left: '82%', width: 6, height: 6 }]} />

      {/* 3. Subtle Mandap Arch Silhouette in the distance */}
      <View style={styles.mandapSilhouette}>
        <View style={styles.mandapPillarLeft} />
        <View style={styles.mandapDome} />
        <View style={styles.mandapPillarRight} />
      </View>

      {/* 4. Festive Scrolling Wedding Stage Ground */}
      <View style={styles.groundContainer}>
        {/* Golden laser border separating ground and sky */}
        <View style={styles.goldenGroundLine} />

        {/* Marigold Petal Trim Line */}
        <View style={styles.marigoldTrim}>
          {Array.from({ length: 28 }).map((_, i) => (
            <View key={`petal-${i}`} style={styles.marigoldDot} />
          ))}
        </View>

        {/* Scrolling Pattern with Festive Wedding Chevrons */}
        <View
          style={[
            styles.scrollingPattern,
            { transform: [{ translateX: -((groundOffset * 1.5) % 36) }] },
          ]}
        >
          {Array.from({ length: 32 }).map((_, i) => (
            <View key={`stripe-${i}`} style={styles.groundStripe} />
          ))}
        </View>

        {/* Footer text */}
        <View style={styles.groundLabelContainer}>
          <Text style={styles.groundLabel}>✨ SHRUTO & ABHIKASHO KI SHAADI ✨</Text>
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
    height: '55%',
    backgroundColor: '#1F030E',
  },
  skyGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: '#120208',
  },
  fairyLight: {
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: '#FDE68A',
    opacity: 0.65,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  mandapSilhouette: {
    position: 'absolute',
    bottom: GAME_CONSTANTS.GROUND_HEIGHT,
    left: 0,
    right: 0,
    height: 140,
    opacity: 0.22,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mandapDome: {
    width: 140,
    height: 70,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    backgroundColor: '#831843',
    position: 'absolute',
    bottom: 50,
  },
  mandapPillarLeft: {
    position: 'absolute',
    bottom: 0,
    left: '28%',
    width: 20,
    height: 85,
    backgroundColor: '#701A75',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  mandapPillarRight: {
    position: 'absolute',
    bottom: 0,
    right: '28%',
    width: 20,
    height: 85,
    backgroundColor: '#701A75',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  groundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: GAME_CONSTANTS.GROUND_HEIGHT,
    backgroundColor: '#260410',
    overflow: 'hidden',
    borderTopWidth: 2,
    borderColor: '#F59E0B',
    zIndex: 15,
  },
  goldenGroundLine: {
    height: 4,
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  marigoldTrim: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 2,
  },
  marigoldDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FBBF24',
  },
  scrollingPattern: {
    flexDirection: 'row',
    width: 1200,
    height: 25,
    marginTop: 2,
  },
  groundStripe: {
    width: 18,
    height: '100%',
    borderRightWidth: 2.5,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    transform: [{ skewX: '-30deg' }],
  },
  groundLabelContainer: {
    position: 'absolute',
    bottom: 7,
    width: '100%',
    alignItems: 'center',
  },
  groundLabel: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
