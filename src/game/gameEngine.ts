/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Player {
  x: number;
  y: number;
  radius: number;
  speed: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  score: number;
  level: number;
  dashCooldown: number;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  type: 'drone' | 'hunter' | 'tank' | 'boss';
  radius: number;
  speed: number;
  health: number;
  maxHealth: number;
  damage: number;
  points: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  isPlayer: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  size: number;
}

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: 'heal' | 'energy' | 'score' | 'speed';
  radius: number;
}

export interface GameState {
  status: 'menu' | 'playing' | 'paused' | 'gameover' | 'victory';
  score: number;
  highScore: number;
  wave: number;
  timeElapsed: number;
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  particles: Particle[];
  powerUps: PowerUp[];
  canvasWidth: number;
  canvasHeight: number;
  keys: { [key: string]: boolean };
  mouse: { x: number; y: number; down: boolean };
}

export function createInitialGameState(width: number = 800, height: number = 600): GameState {
  let highScore = 0;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      highScore = parseInt(localStorage.getItem('chrono_crawler_highscore') || '0', 10);
    }
  } catch (e) {
    // fallback
  }

  return {
    status: 'menu',
    score: 0,
    highScore,
    wave: 1,
    timeElapsed: 0,
    player: {
      x: width / 2,
      y: height / 2,
      radius: 16,
      speed: 4.5,
      health: 100,
      maxHealth: 100,
      energy: 100,
      maxEnergy: 100,
      score: 0,
      level: 1,
      dashCooldown: 0,
    },
    enemies: [],
    projectiles: [],
    particles: [],
    powerUps: [],
    canvasWidth: width,
    canvasHeight: height,
    keys: {},
    mouse: { x: 0, y: 0, down: false },
  };
}

export function calculateScoreIncrement(enemyType: Enemy['type']): number {
  switch (enemyType) {
    case 'drone': return 100;
    case 'hunter': return 250;
    case 'tank': return 500;
    case 'boss': return 2000;
    default: return 50;
  }
}

export function checkCollision(
  x1: number, y1: number, r1: number,
  x2: number, y2: number, r2: number
): boolean {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < r1 + r2;
}

export function spawnWaveEnemies(wave: number, width: number, height: number): Enemy[] {
  const enemies: Enemy[] = [];
  const count = 3 + wave * 2;
  
  for (let i = 0; i < count; i++) {
    // Spawn along border
    let x = 0, y = 0;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? -20 : width + 20;
      y = Math.random() * height;
    } else {
      x = Math.random() * width;
      y = Math.random() < 0.5 ? -20 : height + 20;
    }

    const rand = Math.random();
    let type: Enemy['type'] = 'drone';
    let radius = 12;
    let speed = 2.2;
    let health = 30;
    let damage = 10;

    if (wave >= 3 && rand > 0.7) {
      type = 'hunter';
      radius = 14;
      speed = 3.2;
      health = 50;
      damage = 15;
    } else if (wave >= 5 && rand > 0.9) {
      type = 'tank';
      radius = 24;
      speed = 1.2;
      health = 150;
      damage = 30;
    }

    if (wave % 5 === 0 && i === 0) {
      type = 'boss';
      x = width / 2;
      y = -50;
      radius = 36;
      speed = 1.0;
      health = 500 + wave * 100;
      damage = 40;
    }

    enemies.push({
      id: `enemy_${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      type,
      radius,
      speed,
      health,
      maxHealth: health,
      damage,
      points: calculateScoreIncrement(type),
    });
  }

  return enemies;
}

export function updatePlayerPosition(player: Player, keys: { [key: string]: boolean }, width: number, height: number): void {
  let dx = 0;
  let dy = 0;

  if (keys['KeyW'] || keys['ArrowUp'] || keys['KeyK']) dy -= 1;
  if (keys['KeyS'] || keys['ArrowDown'] || keys['KeyJ']) dy += 1;
  if (keys['KeyA'] || keys['ArrowLeft'] || keys['KeyH']) dx -= 1;
  if (keys['KeyD'] || keys['ArrowRight'] || keys['KeyL']) dx += 1;

  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071;
    dy *= 0.7071;
  }

  player.x += dx * player.speed;
  player.y += dy * player.speed;

  // Clamp within canvas boundaries
  player.x = Math.max(player.radius, Math.min(width - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(height - player.radius, player.y));

  if (player.dashCooldown > 0) {
    player.dashCooldown -= 1;
  }
}
