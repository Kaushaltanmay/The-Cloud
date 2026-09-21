import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_CONSTANTS } from '../game/constants';
import { GameSettings } from '../game/types';

export const StorageService = {
  async loadSettings(): Promise<GameSettings> {
    try {
      const [bestScoreRaw, playerFace, obstacleFace, soundRaw, hapticsRaw] =
        await Promise.all([
          AsyncStorage.getItem(GAME_CONSTANTS.STORAGE_KEYS.BEST_SCORE),
          AsyncStorage.getItem(GAME_CONSTANTS.STORAGE_KEYS.PLAYER_FACE),
          AsyncStorage.getItem(GAME_CONSTANTS.STORAGE_KEYS.OBSTACLE_FACE),
          AsyncStorage.getItem(GAME_CONSTANTS.STORAGE_KEYS.SOUND_ENABLED),
          AsyncStorage.getItem(GAME_CONSTANTS.STORAGE_KEYS.HAPTICS_ENABLED),
        ]);

      return {
        bestScore: bestScoreRaw ? parseInt(bestScoreRaw, 10) : 0,
        playerFaceUri: playerFace || null,
        obstacleFaceUri: obstacleFace || null,
        soundEnabled: soundRaw !== null ? soundRaw === 'true' : true,
        hapticsEnabled: hapticsRaw !== null ? hapticsRaw === 'true' : true,
      };
    } catch (e) {
      console.warn('Failed to load settings from storage', e);
      return {
        bestScore: 0,
        playerFaceUri: null,
        obstacleFaceUri: null,
        soundEnabled: true,
        hapticsEnabled: true,
      };
    }
  },

  async saveBestScore(score: number): Promise<void> {
    try {
      await AsyncStorage.setItem(
        GAME_CONSTANTS.STORAGE_KEYS.BEST_SCORE,
        score.toString()
      );
    } catch (e) {
      console.warn('Failed to save best score', e);
    }
  },

  async savePlayerFace(uri: string | null): Promise<void> {
    try {
      if (uri) {
        await AsyncStorage.setItem(
          GAME_CONSTANTS.STORAGE_KEYS.PLAYER_FACE,
          uri
        );
      } else {
        await AsyncStorage.removeItem(GAME_CONSTANTS.STORAGE_KEYS.PLAYER_FACE);
      }
    } catch (e) {
      console.warn('Failed to save player face URI', e);
    }
  },

  async saveObstacleFace(uri: string | null): Promise<void> {
    try {
      if (uri) {
        await AsyncStorage.setItem(
          GAME_CONSTANTS.STORAGE_KEYS.OBSTACLE_FACE,
          uri
        );
      } else {
        await AsyncStorage.removeItem(GAME_CONSTANTS.STORAGE_KEYS.OBSTACLE_FACE);
      }
    } catch (e) {
      console.warn('Failed to save obstacle face URI', e);
    }
  },

  async saveSoundEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        GAME_CONSTANTS.STORAGE_KEYS.SOUND_ENABLED,
        enabled.toString()
      );
    } catch (e) {
      console.warn('Failed to save sound preference', e);
    }
  },

  async saveHapticsEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        GAME_CONSTANTS.STORAGE_KEYS.HAPTICS_ENABLED,
        enabled.toString()
      );
    } catch (e) {
      console.warn('Failed to save haptics preference', e);
    }
  },
};
