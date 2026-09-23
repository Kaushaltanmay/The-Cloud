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
      {/* 1. TOP MANDAP PILLAR OF REPEATING ABHIKASHO FACES */}
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

        {/* Golden Brass Capstone Lip */}
        <View style={[styles.capstone, styles.topCapstone]}>
          <View style={styles.rubyLine} />
        </View>
      </View>

      {/* 2. BOTTOM MANDAP PILLAR OF REPEATING ABHIKASHO FACES */}
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
        {/* Golden Brass Capstone Lip */}
        <View style={[styles.capstone, styles.bottomCapstone]}>
          <View style={styles.rubyLine} />
        </View>

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
    backgroundColor: '#260410',
    borderColor: '#F59E0B',
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#450A0A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },
  topTower: {
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    justifyContent: 'flex-end',
  },
  bottomTower: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
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
    backgroundColor: '#1E040D',
    position: 'relative',
  },
  faceTileImage: {
    width: '100%',
    height: '100%',
  },
  tileBorderOverlay: {
    ...(StyleSheet.absoluteFill as any),
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.45)', // Royal gold border for mandap tiles
    borderRadius: 8,
  },
  capstone: {
    width: '100%',
    height: 9,
    backgroundColor: '#F59E0B', // Golden brass capstone
    zIndex: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rubyLine: {
    width: '80%',
    height: 3,
    backgroundColor: '#BE123C', // Ruby red accent on gap lip
    borderRadius: 1.5,
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
