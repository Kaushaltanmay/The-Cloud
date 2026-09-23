import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from 'react-native';
import { GAME_CONSTANTS } from '../game/constants';
import { GameState, ObstaclePair, PlayerState } from '../game/types';
import { checkCollisions } from '../game/collision';
import { SoundService } from '../services/audio';
import { StorageService } from '../services/storage';
import { PlayerFace } from '../components/PlayerFace';
import { FaceObstacle } from '../components/FaceObstacle';
import { GameBackground } from '../components/GameBackground';
import { GameHUD } from '../components/GameHUD';
import { GameOverModal } from '../components/GameOverModal';
import { WeddingPopupMessage } from '../components/wedding/WeddingPopup';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FUNNY_POPUP_MESSAGES = [
  '💕 Shruto approved!',
  '😂 Abhikasho is trying his best...',
  '💀 Bhai, shaadi mein itna easy nahi hai!',
  '💍 Rishta level: DANGEROUS!',
  '👰 Bride is watching your flaps...',
  '👵 "Beta, salary kitni hai?"',
  '👩 "Ladki wale gate par aa gaye!"',
  '🥁 DJ wale babu played Nagin music!',
  '🍛 Gulab jamun shortage detected!',
  '🕺 Baraat approaching the mandap!',
  '🔥 Flap speed: Pandit approved!',
  '❤️ Shaadi meter: OVER 9000!',
];

interface GameScreenProps {
  playerFaceUri: string | null;
  obstacleFaceUri: string | null;
  bestScore: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onUpdateBestScore: (newBest: number) => void;
  onToggleSound: () => void;
  onCustomize: () => void;
  onMainMenu: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  playerFaceUri,
  obstacleFaceUri,
  bestScore,
  soundEnabled,
  hapticsEnabled,
  onUpdateBestScore,
  onToggleSound,
  onCustomize,
  onMainMenu,
}) => {
  const [gameState, setGameState] = useState<GameState>('READY');
  const [score, setScore] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [, setRenderTrigger] = useState<number>(0);
  const [isFlapping, setIsFlapping] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<WeddingPopupMessage | null>(null);

  // Screen shake animation for collision impact
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Mutable Physics Refs for 60 FPS performance without React render lags
  const playerRef = useRef<PlayerState>({
    x: SCREEN_WIDTH * GAME_CONSTANTS.PLAYER_X_PERCENT,
    y: SCREEN_HEIGHT * 0.42,
    vy: 0,
    rotation: 0,
  });

  const obstaclesRef = useRef<ObstaclePair[]>([]);
  const groundOffsetRef = useRef<number>(0);
  const nextObstacleIdRef = useRef<number>(1);
  const animationFrameIdRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState>('READY');
  const scoreRef = useRef<number>(0);
  const flapTimeoutRef = useRef<any>(null);

  // Keep gameStateRef in sync
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Keep prop refs in sync to prevent restarting the game loop
  const bestScoreRef = useRef(bestScore);
  const soundEnabledRef = useRef(soundEnabled);
  const hapticsEnabledRef = useRef(hapticsEnabled);
  const onUpdateBestScoreRef = useRef(onUpdateBestScore);

  useEffect(() => {
    bestScoreRef.current = bestScore;
  }, [bestScore]);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);
  useEffect(() => {
    hapticsEnabledRef.current = hapticsEnabled;
  }, [hapticsEnabled]);
  useEffect(() => {
    onUpdateBestScoreRef.current = onUpdateBestScore;
  }, [onUpdateBestScore]);

  // Spawn an obstacle pair at a given X position
  const spawnObstaclePair = useCallback((startX: number): ObstaclePair => {
    const currentScore = scoreRef.current;
    const gap = Math.max(
      GAME_CONSTANTS.MIN_GAP_SIZE,
      GAME_CONSTANTS.INITIAL_GAP_SIZE - currentScore * GAME_CONSTANTS.GAP_DECREASE_PER_SCORE
    );

    const groundY = SCREEN_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
    const availableHeight = groundY - gap - GAME_CONSTANTS.CEILING_OFFSET - 20;

    // Random top height within safe bounds
    const topHeight =
      GAME_CONSTANTS.MIN_TOWER_HEIGHT +
      Math.random() * (availableHeight - GAME_CONSTANTS.MIN_TOWER_HEIGHT);

    const bottomY = topHeight + gap;
    const bottomHeight = groundY - bottomY;

    return {
      id: nextObstacleIdRef.current++,
      x: startX,
      topHeight,
      bottomY,
      bottomHeight,
      gapSize: gap,
      passed: false,
    };
  }, []);

  // Reset all game variables for a fresh round
  const resetGame = useCallback(() => {
    playerRef.current = {
      x: SCREEN_WIDTH * GAME_CONSTANTS.PLAYER_X_PERCENT,
      y: SCREEN_HEIGHT * 0.42,
      vy: 0,
      rotation: 0,
    };

    obstaclesRef.current = [
      spawnObstaclePair(SCREEN_WIDTH + 60),
      spawnObstaclePair(SCREEN_WIDTH + 60 + GAME_CONSTANTS.SPAWN_INTERVAL_DISTANCE + 70),
    ];

    groundOffsetRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    setIsNewBest(false);
    setPopupMessage(null);
    setGameState('READY');
    gameStateRef.current = 'READY';
    setRenderTrigger((prev) => prev + 1);
  }, [spawnObstaclePair]);

  // Initialize on mount
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Trigger camera shake effect on crash
  const triggerCameraShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
    ]).start();
  };

  // Primary Action: Tap anywhere to flap
  const handleFlap = () => {
    if (gameStateRef.current === 'PAUSED' || gameStateRef.current === 'GAME_OVER') {
      return;
    }

    if (gameStateRef.current === 'READY') {
      setGameState('PLAYING');
      gameStateRef.current = 'PLAYING';
    }

    // Apply upward jump impulse
    playerRef.current.vy = GAME_CONSTANTS.JUMP_IMPULSE;
    playerRef.current.rotation = GAME_CONSTANTS.MAX_UPWARD_TILT;

    // Trigger visual puff and audio
    setIsFlapping(true);
    if (flapTimeoutRef.current) clearTimeout(flapTimeoutRef.current);
    flapTimeoutRef.current = setTimeout(() => setIsFlapping(false), 120);

    SoundService.playFlap(soundEnabledRef.current, hapticsEnabledRef.current);
  };

  // 60 FPS Game Loop
  useEffect(() => {
    let lastTime = Date.now();

    const gameLoop = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (gameStateRef.current === 'PLAYING') {
        const player = playerRef.current;
        const currentSpeed = Math.min(
          GAME_CONSTANTS.MAX_SPEED,
          GAME_CONSTANTS.BASE_SPEED + scoreRef.current * GAME_CONSTANTS.SPEED_INCREASE_PER_SCORE
        );

        // 1. Update player physics
        player.vy += GAME_CONSTANTS.GRAVITY;
        if (player.vy > GAME_CONSTANTS.MAX_FALL_SPEED) {
          player.vy = GAME_CONSTANTS.MAX_FALL_SPEED;
        }
        player.y += player.vy;

        // Smooth rotation based on velocity
        if (player.vy < 0) {
          player.rotation = GAME_CONSTANTS.MAX_UPWARD_TILT;
        } else {
          player.rotation = Math.min(
            GAME_CONSTANTS.MAX_DOWNWARD_TILT,
            player.rotation + player.vy * GAME_CONSTANTS.TILT_VELOCITY_FACTOR * dt * 10
          );
        }

        // 2. Update Ground scrolling
        groundOffsetRef.current += currentSpeed;

        // 3. Move and spawn obstacles
        const obstacles = obstaclesRef.current;
        for (let i = 0; i < obstacles.length; i++) {
          const obs = obstacles[i];
          obs.x -= currentSpeed;

          // Score check: passed player center
          if (!obs.passed && obs.x + GAME_CONSTANTS.TOWER_WIDTH < player.x) {
            obs.passed = true;
            scoreRef.current += 1;
            const currentScore = scoreRef.current;
            setScore(currentScore);
            SoundService.playPoint(soundEnabledRef.current, hapticsEnabledRef.current);

            // Trigger funny popup at milestones or every 3-4 points
            if (currentScore === 2 || currentScore % 3 === 0) {
              const randomIndex = Math.floor(Math.random() * FUNNY_POPUP_MESSAGES.length);
              setPopupMessage({
                id: Date.now(),
                text: FUNNY_POPUP_MESSAGES[randomIndex],
              });
            }

            if (currentScore > bestScoreRef.current) {
              setIsNewBest(true);
              onUpdateBestScoreRef.current(currentScore);
              StorageService.saveBestScore(currentScore);
            }
          }
        }

        // Remove off-screen obstacles
        if (obstacles.length > 0 && obstacles[0].x + GAME_CONSTANTS.TOWER_WIDTH < -20) {
          obstacles.shift();
        }

        // Spawn next obstacle
        const lastObstacle = obstacles[obstacles.length - 1];
        if (
          !lastObstacle ||
          lastObstacle.x <= SCREEN_WIDTH - GAME_CONSTANTS.SPAWN_INTERVAL_DISTANCE
        ) {
          obstacles.push(spawnObstaclePair(SCREEN_WIDTH + 20));
        }

        // 4. Collision check
        const hasCollided = checkCollisions(player, obstacles, SCREEN_HEIGHT);
        if (hasCollided) {
          // Crash!
          triggerCameraShake();
          SoundService.playHit(soundEnabledRef.current, hapticsEnabledRef.current);
          SoundService.playGameOver(soundEnabledRef.current);
          setGameState('GAME_OVER');
          gameStateRef.current = 'GAME_OVER';
        }

        // Request re-render for visual elements
        setRenderTrigger((prev) => prev + 1);
      } else if (gameStateRef.current === 'READY') {
        // Gentle hover while waiting for first tap
        groundOffsetRef.current += 1;
        setRenderTrigger((prev) => prev + 1);
      }

      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [spawnObstaclePair]);

  return (
    <TouchableWithoutFeedback onPress={handleFlap}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        {/* Background & Scrolling Ground */}
        <GameBackground groundOffset={groundOffsetRef.current} />

        {/* Obstacle Face Towers (Mandap Pillars) */}
        {obstaclesRef.current.map((obs) => (
          <FaceObstacle
            key={`obs-${obs.id}`}
            obstacle={obs}
            faceUri={obstacleFaceUri}
          />
        ))}

        {/* Player Floating Face */}
        <PlayerFace
          x={playerRef.current.x}
          y={playerRef.current.y}
          rotation={playerRef.current.rotation}
          faceUri={playerFaceUri}
          isFlapping={isFlapping}
        />

        {/* In-Game HUD (Score, Best, Pause, Sound, WeddingPopup) */}
        <GameHUD
          score={score}
          bestScore={bestScore}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
          onPause={() => setGameState('PAUSED')}
          isPaused={gameState === 'PAUSED'}
          onResume={() => setGameState('PLAYING')}
          popupMessage={popupMessage}
        />

        {/* Ready State Wedding Prompt Overlay */}
        {gameState === 'READY' && (
          <View style={styles.readyPromptContainer} pointerEvents="none">
            <View style={styles.readyBadge}>
              <Text style={styles.readyTitle}>TAP TO FLAP 💍</Text>
              <Text style={styles.readySubtitle}>
                Reach the Mandap! Dodge Abhikasho's towers!
              </Text>
            </View>
          </View>
        )}

        {/* Paused Overlay */}
        {gameState === 'PAUSED' && (
          <View style={styles.pausedOverlay}>
            <View style={styles.pauseCard}>
              <Text style={styles.pauseTitle}>⏸️ SHAADI PAUSED</Text>
              <TouchableWithoutFeedback onPress={() => setGameState('PLAYING')}>
                <View style={styles.resumeBtn}>
                  <Text style={styles.resumeBtnText}>RESUME FLAPPING</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={onMainMenu}>
                <View style={styles.menuBtn}>
                  <Text style={styles.menuBtnText}>QUIT TO MANDAP</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}

        {/* Game Over Screen Modal */}
        {gameState === 'GAME_OVER' && (
          <GameOverModal
            score={score}
            bestScore={bestScore}
            isNewBest={isNewBest}
            onPlayAgain={resetGame}
            onCustomize={onCustomize}
            onMainMenu={onMainMenu}
          />
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E040D',
    overflow: 'hidden',
  },
  readyPromptContainer: {
    position: 'absolute',
    top: '32%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 40,
    paddingHorizontal: 20,
  },
  readyBadge: {
    backgroundColor: 'rgba(38, 4, 16, 0.92)',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  readyTitle: {
    color: '#FEF3C7',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(217, 27, 92, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  readySubtitle: {
    color: '#FDE68A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  pausedOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(20, 2, 8, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 24,
  },
  pauseCard: {
    width: '100%',
    maxWidth: 310,
    backgroundColor: 'rgba(38, 4, 16, 0.96)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F59E0B',
    padding: 24,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  pauseTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FEF3C7',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  resumeBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#D91B5C',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  menuBtn: {
    width: '100%',
    height: 46,
    backgroundColor: 'rgba(20, 2, 8, 0.85)',
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBtnText: {
    color: '#FDE68A',
    fontSize: 13,
    fontWeight: '700',
  },
});
