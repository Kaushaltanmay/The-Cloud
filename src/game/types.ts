export type GameState = 'MENU' | 'CUSTOMIZE' | 'READY' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface PlayerState {
  x: number;
  y: number;
  vy: number;
  rotation: number;
}

export interface ObstaclePair {
  id: number;
  x: number;
  topHeight: number;
  bottomY: number;
  bottomHeight: number;
  gapSize: number;
  passed: boolean;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
}

export interface GameSettings {
  bestScore: number;
  playerFaceUri: string | null;
  obstacleFaceUri: string | null;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}
