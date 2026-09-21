import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StorageService } from './src/services/storage';
import { SoundService } from './src/services/audio';
import { GameSettings, GameState } from './src/game/types';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { CustomizeScreen } from './src/screens/CustomizeScreen';
import { HowToPlayModal } from './src/components/HowToPlayModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameState>('MENU');
  const [howToPlayVisible, setHowToPlayVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [settings, setSettings] = useState<GameSettings>({
    bestScore: 0,
    playerFaceUri: null,
    obstacleFaceUri: null,
    soundEnabled: true,
    hapticsEnabled: true,
  });

  // Lock to portrait orientation & load saved game data
  useEffect(() => {
    async function setupApp() {
      try {
        // Lock screen to portrait
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );

        // Initialize audio engine
        await SoundService.init();

        // Load saved scores & faces
        const loadedSettings = await StorageService.loadSettings();
        setSettings(loadedSettings);
      } catch (e) {
        console.warn('Initialization error', e);
      } finally {
        setIsLoading(false);
      }
    }

    setupApp();

    return () => {
      SoundService.cleanup();
    };
  }, []);

  const handleToggleSound = async () => {
    const nextSound = !settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: nextSound }));
    await StorageService.saveSoundEnabled(nextSound);
  };

  const handleUpdateBestScore = async (newBest: number) => {
    setSettings((prev) => ({ ...prev, bestScore: newBest }));
  };

  const handleSaveAndPlay = (
    playerUri: string | null,
    obstacleUri: string | null
  ) => {
    setSettings((prev) => ({
      ...prev,
      playerFaceUri: playerUri,
      obstacleFaceUri: obstacleUri,
    }));
    setCurrentScreen('PLAYING');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* 1. MAIN MENU SCREEN */}
        {currentScreen === 'MENU' && (
          <HomeScreen
            bestScore={settings.bestScore}
            playerFaceUri={settings.playerFaceUri}
            obstacleFaceUri={settings.obstacleFaceUri}
            soundEnabled={settings.soundEnabled}
            onToggleSound={handleToggleSound}
            onPlay={() => setCurrentScreen('PLAYING')}
            onCustomize={() => setCurrentScreen('CUSTOMIZE')}
            onHowToPlay={() => setHowToPlayVisible(true)}
          />
        )}

        {/* 2. CUSTOMIZATION SETUP SCREEN */}
        {currentScreen === 'CUSTOMIZE' && (
          <CustomizeScreen
            playerFaceUri={settings.playerFaceUri}
            obstacleFaceUri={settings.obstacleFaceUri}
            onSaveAndPlay={handleSaveAndPlay}
            onBack={() => setCurrentScreen('MENU')}
          />
        )}

        {/* 3. FLAPPY GAMEPLAY SCREEN */}
        {currentScreen === 'PLAYING' && (
          <GameScreen
            playerFaceUri={settings.playerFaceUri}
            obstacleFaceUri={settings.obstacleFaceUri}
            bestScore={settings.bestScore}
            soundEnabled={settings.soundEnabled}
            hapticsEnabled={settings.hapticsEnabled}
            onUpdateBestScore={handleUpdateBestScore}
            onToggleSound={handleToggleSound}
            onCustomize={() => setCurrentScreen('CUSTOMIZE')}
            onMainMenu={() => setCurrentScreen('MENU')}
          />
        )}

        {/* HOW TO PLAY MODAL */}
        <HowToPlayModal
          visible={howToPlayVisible}
          onClose={() => setHowToPlayVisible(false)}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#090D16',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
