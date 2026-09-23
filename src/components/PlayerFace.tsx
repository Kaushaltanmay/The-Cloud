import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { GAME_CONSTANTS } from '../game/constants';
import { DEFAULT_FRIEND_1_URI } from '../assets/placeholders/defaultFaces';

interface PlayerFaceProps {
  x: number;
  y: number;
  rotation: number;
  faceUri: string | null;
  isFlapping?: boolean;
}

export const PlayerFace: React.FC<PlayerFaceProps> = ({
  x,
  y,
  rotation,
  faceUri,
  isFlapping = false,
}) => {
  const size = GAME_CONSTANTS.PLAYER_DIAMETER;
  const imageSource = faceUri ? { uri: faceUri } : { uri: DEFAULT_FRIEND_1_URI };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          left: x - size / 2,
          top: y - size / 2,
          transform: [{ rotate: `${rotation}deg` }],
        },
      ]}
      pointerEvents="none"
    >
      {/* Floating Royal Wedding Aura / Outer Ring */}
      <View style={styles.glowRing} />

      {/* Pure Floating Head / Face Container */}
      <View style={styles.faceMask}>
        <Image
          source={imageSource}
          style={styles.faceImage}
          resizeMode="cover"
        />
      </View>

      {/* Flap Speed Trail indicator (festive golden/sparkle puff) */}
      {isFlapping && <View style={styles.flapTrail} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  glowRing: {
    ...(StyleSheet.absoluteFill as any),
    borderRadius: GAME_CONSTANTS.PLAYER_DIAMETER / 2,
    borderWidth: 2.5,
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(217, 27, 92, 0.25)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  faceMask: {
    width: GAME_CONSTANTS.PLAYER_DIAMETER - 4,
    height: GAME_CONSTANTS.PLAYER_DIAMETER - 4,
    borderRadius: (GAME_CONSTANTS.PLAYER_DIAMETER - 4) / 2,
    overflow: 'hidden',
    backgroundColor: '#370617',
  },
  faceImage: {
    width: '100%',
    height: '100%',
  },
  flapTrail: {
    position: 'absolute',
    bottom: -6,
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(253, 230, 138, 0.85)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
