import { GAME_CONSTANTS } from './constants';
import { ObstaclePair, PlayerState } from './types';

/**
 * Circle vs Axis-Aligned Bounding Box (AABB) collision test.
 * Returns true if the player circle overlaps the rectangle.
 */
function circleRectCollision(
  cx: number,
  cy: number,
  radius: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  // Find closest point on rectangle to circle center
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));

  const distanceX = cx - closestX;
  const distanceY = cy - closestY;

  return distanceX * distanceX + distanceY * distanceY < radius * radius;
}

/**
 * Checks all collisions: ground, ceiling, and tower obstacles.
 */
export function checkCollisions(
  player: PlayerState,
  obstacles: ObstaclePair[],
  screenHeight: number
): boolean {
  const radius = GAME_CONSTANTS.PLAYER_COLLISION_RADIUS;
  const groundY = screenHeight - GAME_CONSTANTS.GROUND_HEIGHT;

  // 1. Ceiling collision
  if (player.y - radius <= GAME_CONSTANTS.CEILING_OFFSET) {
    return true;
  }

  // 2. Ground collision
  if (player.y + radius >= groundY) {
    return true;
  }

  // 3. Obstacle towers collision
  for (const obs of obstacles) {
    // Check top tower
    if (
      circleRectCollision(
        player.x,
        player.y,
        radius,
        obs.x,
        0,
        GAME_CONSTANTS.TOWER_WIDTH,
        obs.topHeight
      )
    ) {
      return true;
    }

    // Check bottom tower
    if (
      circleRectCollision(
        player.x,
        player.y,
        radius,
        obs.x,
        obs.bottomY,
        GAME_CONSTANTS.TOWER_WIDTH,
        obs.bottomHeight
      )
    ) {
      return true;
    }
  }

  return false;
}
