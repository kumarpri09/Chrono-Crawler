/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateScoreIncrement,
  checkCollision,
  createInitialGameState,
  updatePlayerPosition,
  spawnWaveEnemies,
} from './gameEngine.ts';

test('calculateScoreIncrement returns correct points per enemy type', () => {
  assert.equal(calculateScoreIncrement('drone'), 100);
  assert.equal(calculateScoreIncrement('hunter'), 250);
  assert.equal(calculateScoreIncrement('tank'), 500);
  assert.equal(calculateScoreIncrement('boss'), 2000);
});

test('checkCollision correctly detects overlapping circles', () => {
  assert.equal(checkCollision(0, 0, 10, 15, 0, 10), true);
  assert.equal(checkCollision(0, 0, 10, 30, 0, 10), false);
});

test('createInitialGameState initializes player and dimensions properly', () => {
  const state = createInitialGameState(800, 600);
  assert.equal(state.canvasWidth, 800);
  assert.equal(state.canvasHeight, 600);
  assert.equal(state.player.health, 100);
  assert.equal(state.status, 'menu');
});

test('updatePlayerPosition respects canvas boundaries', () => {
  const state = createInitialGameState(800, 600);
  state.player.x = 10;
  state.player.y = 10;
  
  // Try moving outside top-left boundary
  updatePlayerPosition(state.player, { KeyW: true, KeyA: true }, 800, 600);
  assert.ok(state.player.x >= state.player.radius);
  assert.ok(state.player.y >= state.player.radius);
});

test('spawnWaveEnemies generates enemies based on wave number', () => {
  const enemies = spawnWaveEnemies(1, 800, 600);
  assert.ok(enemies.length >= 5);
  assert.equal(enemies[0].type, 'drone');
});
