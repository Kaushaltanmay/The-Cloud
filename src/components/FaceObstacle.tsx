import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { GAME_CONSTANTS } from '../game/constants';
import { ObstaclePair } from '../game/types';
import { DEFAULT_FRIEND_2_URI } from '../assets/placeholders/defaultFaces';

interface FaceObstacleProps {
  obstacle: ObstaclePair;
  faceUri: string | null;
}

export const FaceObstacle: React.FC<FaceObstacleProps> = ({
  obstacle,
  faceUri,
}) => {
  const imageSource = faceUri ? { uri: faceUri } : { uri: DEFAULT_FRIEND_2_URI };
  const tileSize = GAME_CONSTANTS.FACE_TILE_SIZE;
  const towerWidth = GAME_CONSTANTS.TOWER_WIDTH;

  // Number of stacked face tiles needed to cover top and bottom towers
  const topTilesCount = Math.max(1, Math.ceil(obstacle.topHeight / tileSize));
  const bottomTilesCount = Math.max(1, Math.ceil(obstacle.bottomHeight / tileSize));

  return (
    <>
      {/* 1. TOP TOWER OF REPEATING FRIEND 2 FACES */}
      <View
        style={[
          styles.towerContainer,
          styles.topTower,
          {
            left: obstacle.x,
            top: 0,
            width: towerWidth,
            height: obstacle.topHeight,
          },
        ]}
        pointerEvents="none"
      >
        <View style={[styles.towerColumn, { height: obstacle.topHeight }]}>
          {Array.from({ length: topTilesCount }).map((_, i) => (
            <View
              key={`top-tile-${i}`}
              style={[
                styles.tileWrapper,
                {
                  width: towerWidth - 4,
                  height: tileSize,
                },
              ]}
            >
              <Image
                source={imageSource}
                style={styles.faceTileImage}
                resizeMode="cover"
              />
              <View style={styles.tileBorderOverlay} />
            </View>
          ))}
        </View>

        {/* Gap Capstone Lip */}
        <View style={[styles.capstone, styles.topCapstone]} />
      </View>

      {/* 2. BOTTOM TOWER OF REPEATING FRIEND 2 FACES */}
      <View
        style={[
          styles.towerContainer,
          styles.bottomTower,
          {
            left: obstacle.x,
            top: obstacle.bottomY,
            width: towerWidth,
            height: obstacle.bottomHeight,
          },
        ]}
        pointerEvents="none"
      >
        {/* Gap Capstone Lip */}
        <View style={[styles.capstone, styles.bottomCapstone]} />

        <View style={[styles.towerColumn, { height: obstacle.bottomHeight }]}>
          {Array.from({ length: bottomTilesCount }).map((_, i) => (
            <View
              key={`bottom-tile-${i}`}
              style={[
                styles.tileWrapper,
                {
                  width: towerWidth - 4,
                  height: tileSize,
                },
              ]}
            >
              <Image
                source={imageSource}
                style={styles.faceTileImage}
                resizeMode="cover"
              />
              <View style={styles.tileBorderOverlay} />
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  towerContainer: {
    position: 'absolute',
    backgroundColor: '#1E1B4B',
    borderColor: '#4338CA',
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
  },
  topTower: {
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'flex-end',
  },
  bottomTower: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'flex-start',
  },
  towerColumn: {
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tileWrapper: {
    marginVertical: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  faceTileImage: {
    width: '100%',
    height: '100%',
  },
  tileBorderOverlay: {
    ...(StyleSheet.absoluteFill as any),
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.45)', // Red alert highlight for obstacle
    borderRadius: 8,
  },
  capstone: {
    width: '100%',
    height: 8,
    backgroundColor: '#EF4444', // Highlight danger edge of the gap
    zIndex: 12,
  },
  topCapstone: {
    position: 'absolute',
    bottom: 0,
  },
  bottomCapstone: {
    position: 'absolute',
    top: 0,
  },
});
