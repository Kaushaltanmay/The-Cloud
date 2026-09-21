import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageProcessorService } from '../services/imageProcessor';
import { StorageService } from '../services/storage';
import { DEFAULT_FRIEND_1_URI, DEFAULT_FRIEND_2_URI } from '../assets/placeholders/defaultFaces';

interface CustomizeScreenProps {
  playerFaceUri: string | null;
  obstacleFaceUri: string | null;
  onSaveAndPlay: (playerUri: string | null, obstacleUri: string | null) => void;
  onBack: () => void;
}

export const CustomizeScreen: React.FC<CustomizeScreenProps> = ({
  playerFaceUri: initialPlayerUri,
  obstacleFaceUri: initialObstacleUri,
  onSaveAndPlay,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [playerUri, setPlayerUri] = useState<string | null>(initialPlayerUri);
  const [obstacleUri, setObstacleUri] = useState<string | null>(initialObstacleUri);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const handlePickPhoto = async (target: 'player' | 'obstacle', useCamera: boolean = false) => {
    try {
      setLoadingType(target);
      const uri = useCamera
        ? await ImageProcessorService.captureFace(target === 'player' ? 1 : 2)
        : await ImageProcessorService.pickAndCropFace(target === 'player' ? 1 : 2);

      if (uri) {
        if (target === 'player') {
          setPlayerUri(uri);
          await StorageService.savePlayerFace(uri);
        } else {
          setObstacleUri(uri);
          await StorageService.saveObstacleFace(uri);
        }
      }
    } catch (e) {
      Alert.alert('Image Error', 'Could not process selected face image.');
    } finally {
      setLoadingType(null);
    }
  };

  const handleResetToDefault = async (target: 'player' | 'obstacle') => {
    if (target === 'player') {
      setPlayerUri(null);
      await StorageService.savePlayerFace(null);
    } else {
      setObstacleUri(null);
      await StorageService.saveObstacleFace(null);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CUSTOMIZE YOUR GAME</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Upload photos of your friends to turn them into the flying player and obstacle towers!
        </Text>

        {/* 1. FRIEND 1 — PLAYER FACE CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.badgePlayer}>
              <Text style={styles.badgeText}>FLYING CHARACTER</Text>
            </View>
            <Text style={styles.cardTitle}>Friend 1 — Player</Text>
            <Text style={[styles.statusText, playerUri ? styles.statusSet : styles.statusNotSet]}>
              Player Face: {playerUri ? 'Custom Photo Set' : 'Not Set (Using Default)'}
            </Text>
          </View>

          <View style={styles.previewSection}>
            <View style={styles.avatarOuterRing}>
              <Image
                source={playerUri ? { uri: playerUri } : { uri: DEFAULT_FRIEND_1_URI }}
                style={styles.avatarImage}
              />
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewHeading}>Flying Face Headshot</Text>
              <Text style={styles.previewHelp}>
                {playerUri
                  ? 'Face automatically masked in pure circular frame (No bird body!).'
                  : 'Currently using default animated face.'}
              </Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.btn, styles.uploadBtn]}
              onPress={() => handlePickPhoto('player', false)}
              disabled={loadingType === 'player'}
            >
              <Ionicons name="images" size={18} color="#FFFFFF" />
              <Text style={styles.btnText}>UPLOAD PHOTO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.cameraBtn]}
              onPress={() => handlePickPhoto('player', true)}
              disabled={loadingType === 'player'}
            >
              <Ionicons name="camera" size={18} color="#93C5FD" />
            </TouchableOpacity>

            {playerUri && (
              <TouchableOpacity
                style={[styles.btn, styles.resetBtn]}
                onPress={() => handleResetToDefault('player')}
              >
                <Ionicons name="trash-outline" size={18} color="#F87171" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 2. FRIEND 2 — OBSTACLE FACE CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.badgeObstacle}>
              <Text style={styles.badgeText}>FACE TOWERS</Text>
            </View>
            <Text style={styles.cardTitle}>Friend 2 — Obstacles</Text>
            <Text style={[styles.statusText, obstacleUri ? styles.statusSet : styles.statusNotSet]}>
              Obstacle Face: {obstacleUri ? 'Custom Photo Set' : 'Not Set (Using Default)'}
            </Text>
          </View>

          <View style={styles.previewSection}>
            {/* Mini Tower Preview showing repeating face tiles */}
            <View style={styles.miniTowerPreview}>
              <Image
                source={obstacleUri ? { uri: obstacleUri } : { uri: DEFAULT_FRIEND_2_URI }}
                style={styles.miniTowerTile}
              />
              <Image
                source={obstacleUri ? { uri: obstacleUri } : { uri: DEFAULT_FRIEND_2_URI }}
                style={styles.miniTowerTile}
              />
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewHeading}>Stacked Face Obstacle</Text>
              <Text style={styles.previewHelp}>
                Friend 2's face repeats vertically to form the danger towers.
              </Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.btn, styles.uploadBtn, { backgroundColor: '#DC2626' }]}
              onPress={() => handlePickPhoto('obstacle', false)}
              disabled={loadingType === 'obstacle'}
            >
              <Ionicons name="images" size={18} color="#FFFFFF" />
              <Text style={styles.btnText}>UPLOAD PHOTO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.cameraBtn]}
              onPress={() => handlePickPhoto('obstacle', true)}
              disabled={loadingType === 'obstacle'}
            >
              <Ionicons name="camera" size={18} color="#FCA5A5" />
            </TouchableOpacity>

            {obstacleUri && (
              <TouchableOpacity
                style={[styles.btn, styles.resetBtn]}
                onPress={() => handleResetToDefault('obstacle')}
              >
                <Ionicons name="trash-outline" size={18} color="#F87171" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* SAVE & PLAY BUTTON */}
        <TouchableOpacity
          style={styles.saveAndPlayBtn}
          onPress={() => onSaveAndPlay(playerUri, obstacleUri)}
          activeOpacity={0.85}
        >
          <Ionicons name="play" size={22} color="#FFFFFF" />
          <Text style={styles.saveAndPlayText}>SAVE & PLAY</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 18,
    gap: 14,
  },
  cardHeader: {
    alignItems: 'flex-start',
    gap: 4,
  },
  badgePlayer: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  badgeObstacle: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  badgeText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusSet: {
    color: '#10B981',
  },
  statusNotSet: {
    color: '#F59E0B',
  },
  previewSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 16,
    gap: 14,
  },
  avatarOuterRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#6366F1',
    overflow: 'hidden',
    backgroundColor: '#0F172A',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  miniTowerPreview: {
    width: 50,
    height: 68,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#EF4444',
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    gap: 2,
  },
  miniTowerTile: {
    width: '100%',
    height: 32,
  },
  previewInfo: {
    flex: 1,
  },
  previewHeading: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  previewHelp: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  btn: {
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  uploadBtn: {
    flex: 1,
    backgroundColor: '#4F46E5',
  },
  cameraBtn: {
    width: 44,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resetBtn: {
    width: 44,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  saveAndPlayBtn: {
    backgroundColor: '#10B981',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  saveAndPlayText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
