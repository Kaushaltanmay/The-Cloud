export const GAME_CONSTANTS = {
  // Player physics
  GRAVITY: 0.44,
  JUMP_IMPULSE: -8.0,
  MAX_FALL_SPEED: 10.5,
  PLAYER_DIAMETER: 58,
  PLAYER_COLLISION_RADIUS: 25,
  PLAYER_X_PERCENT: 0.28, // 28% from left edge
  
  // Obstacle towers
  TOWER_WIDTH: 74,
  FACE_TILE_SIZE: 74,
  INITIAL_GAP_SIZE: 185,
  MIN_GAP_SIZE: 140,
  MIN_TOWER_HEIGHT: 65,
  SPAWN_INTERVAL_DISTANCE: 185,
  BASE_SPEED: 2.6,
  MAX_SPEED: 4.4,
  SPEED_INCREASE_PER_SCORE: 0.05,
  GAP_DECREASE_PER_SCORE: 1.2,

  // Ground & boundaries
  GROUND_HEIGHT: 75,
  CEILING_OFFSET: 10,

  // Tilt/rotation
  MAX_UPWARD_TILT: -24,  // degrees
  MAX_DOWNWARD_TILT: 70, // degrees
  TILT_VELOCITY_FACTOR: 5.5,

  // Storage keys
  STORAGE_KEYS: {
    BEST_SCORE: '@faceflap_best_score',
    PLAYER_FACE: '@faceflap_player_face',
    OBSTACLE_FACE: '@faceflap_obstacle_face',
    SOUND_ENABLED: '@faceflap_sound_enabled',
    HAPTICS_ENABLED: '@faceflap_haptics_enabled',
  }
};
