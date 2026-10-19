/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Shield, Zap, Crosshair, Heart, Volume2, VolumeX, Sparkles, Award } from 'lucide-react';
import {
  GameState,
  Player,
  Enemy,
  Projectile,
  Particle,
  PowerUp,
  createInitialGameState,
  spawnWaveEnemies,
  checkCollision,
  updatePlayerPosition,
} from '../game/gameEngine.ts';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState(960, 600));
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [upgradesAvailable, setUpgradesAvailable] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(0);
  const stateRef = useRef<GameState>(gameState);
  stateRef.current = gameState;

  // Web Audio Synth for retro sound effects
  const playSound = useCallback((type: 'shoot' | 'hit' | 'explosion' | 'powerup' | 'dash') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'shoot') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'explosion') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'powerup') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'dash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch {
      // AudioContext policy error or not supported
    }
  }, [soundEnabled]);

  const startGame = () => {
    const fresh = createInitialGameState(960, 600);
    fresh.status = 'playing';
    fresh.enemies = spawnWaveEnemies(1, 960, 600);
    setGameState(fresh);
    setUpgradesAvailable(false);
  };

  // Keyboard and Mouse listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setGameState((prev) => {
        const keys = { ...prev.keys, [e.code]: true };
        
        // Dash with Space
        if (e.code === 'Space' && prev.status === 'playing' && prev.player.dashCooldown === 0) {
          playSound('dash');
          // Dash forward or burst
          return {
            ...prev,
            keys,
            player: { ...prev.player, dashCooldown: 45, energy: Math.max(0, prev.player.energy - 20) }
          };
        }

        if (e.code === 'KeyP') {
          return {
            ...prev,
            status: prev.status === 'playing' ? 'paused' : prev.status === 'paused' ? 'playing' : prev.status
          };
        }

        return { ...prev, keys };
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setGameState((prev) => ({
        ...prev,
        keys: { ...prev.keys, [e.code]: false }
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playSound]);

  // Main game loop
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const state = stateRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear screen
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);

      // Draw grid background
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < state.canvasWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, state.canvasHeight);
        ctx.stroke();
      }
      for (let y = 0; y < state.canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(state.canvasWidth, y);
        ctx.stroke();
      }

      if (state.status === 'playing') {
        // Update player position
        updatePlayerPosition(state.player, state.keys, state.canvasWidth, state.canvasHeight);

        // Recharge energy slowly
        if (state.player.energy < state.player.maxEnergy) {
          state.player.energy = Math.min(state.player.maxEnergy, state.player.energy + 0.2);
        }

        // Handle shooting on mouse down or auto fire
        if (state.mouse.down) {
          const dx = state.mouse.x - state.player.x;
          const dy = state.mouse.y - state.player.y;
          const angle = Math.atan2(dy, dx);
          const speed = 10;

          // Rate limit shooting
          if (Math.random() < 0.35) {
            playSound('shoot');
            state.projectiles.push({
              id: `proj_${Math.random()}`,
              x: state.player.x,
              y: state.player.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              radius: 5,
              damage: 25,
              isPlayer: true,
            });
          }
        }

        // Update enemies
        for (let i = state.enemies.length - 1; i >= 0; i--) {
          const enemy = state.enemies[i];
          const dx = state.player.x - enemy.x;
          const dy = state.player.y - enemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 1) {
            enemy.x += (dx / dist) * enemy.speed;
            enemy.y += (dy / dist) * enemy.speed;
          }

          // Check player collision
          if (checkCollision(state.player.x, state.player.y, state.player.radius, enemy.x, enemy.y, enemy.radius)) {
            state.player.health -= enemy.damage * 0.05;
            playSound('hit');

            if (state.player.health <= 0) {
              state.status = 'gameover';
              if (state.score > state.highScore) {
                state.highScore = state.score;
                try {
                  localStorage.setItem('chrono_crawler_highscore', state.score.toString());
                } catch {}
              }
            }
          }
        }

        // Update projectiles
        for (let i = state.projectiles.length - 1; i >= 0; i--) {
          const p = state.projectiles[i];
          p.x += p.vx;
          p.y += p.vy;

          // Out of bounds
          if (p.x < 0 || p.x > state.canvasWidth || p.y < 0 || p.y > state.canvasHeight) {
            state.projectiles.splice(i, 1);
            continue;
          }

          // Check collision with enemies
          if (p.isPlayer) {
            let hit = false;
            for (let j = state.enemies.length - 1; j >= 0; j--) {
              const enemy = state.enemies[j];
              if (checkCollision(p.x, p.y, p.radius, enemy.x, enemy.y, enemy.radius)) {
                enemy.health -= p.damage;
                hit = true;

                // Spawn spark particles
                for (let k = 0; k < 4; k++) {
                  state.particles.push({
                    x: p.x,
                    y: p.y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    color: '#06b6d4',
                    alpha: 1,
                    life: 0,
                    maxLife: 20,
                    size: 3,
                  });
                }

                if (enemy.health <= 0) {
                  playSound('explosion');
                  state.score += enemy.points;
                  setCredits((c) => c + Math.floor(enemy.points / 10));

                  // Spawn powerup chance
                  if (Math.random() < 0.25) {
                    state.powerUps.push({
                      id: `pow_${Math.random()}`,
                      x: enemy.x,
                      y: enemy.y,
                      type: Math.random() < 0.5 ? 'heal' : 'energy',
                      radius: 10,
                    });
                  }

                  state.enemies.splice(j, 1);
                }
                break;
              }
            }
            if (hit) {
              state.projectiles.splice(i, 1);
              continue;
            }
          }
        }

        // Wave completion check
        if (state.enemies.length === 0) {
          state.wave += 1;
          state.enemies = spawnWaveEnemies(state.wave, state.canvasWidth, state.canvasHeight);
          setUpgradesAvailable(true);
        }

        // Update powerups
        for (let i = state.powerUps.length - 1; i >= 0; i--) {
          const pow = state.powerUps[i];
          if (checkCollision(state.player.x, state.player.y, state.player.radius, pow.x, pow.y, pow.radius)) {
            playSound('powerup');
            if (pow.type === 'heal') {
              state.player.health = Math.min(state.player.maxHealth, state.player.health + 30);
            } else {
              state.player.energy = state.player.maxEnergy;
            }
            state.powerUps.splice(i, 1);
          }
        }

        // Update particles
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const pt = state.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life += 1;
          pt.alpha = 1 - pt.life / pt.maxLife;
          if (pt.life >= pt.maxLife) {
            state.particles.splice(i, 1);
          }
        }
      }

      // Draw Powerups
      for (const pow of state.powerUps) {
        ctx.beginPath();
        ctx.arc(pow.x, pow.y, pow.radius, 0, Math.PI * 2);
        ctx.fillStyle = pow.type === 'heal' ? '#10b981' : '#3b82f6';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Enemies
      for (const enemy of state.enemies) {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.beginPath();
        if (enemy.type === 'drone') {
          ctx.fillStyle = '#ef4444';
          ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'hunter') {
          ctx.fillStyle = '#f97316';
          ctx.moveTo(0, -enemy.radius);
          ctx.lineTo(enemy.radius, enemy.radius);
          ctx.lineTo(-enemy.radius, enemy.radius);
          ctx.closePath();
          ctx.fill();
        } else if (enemy.type === 'tank') {
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(-enemy.radius, -enemy.radius, enemy.radius * 2, enemy.radius * 2);
        } else {
          // Boss
          ctx.fillStyle = '#ec4899';
          ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Health bar above enemy
        if (enemy.health < enemy.maxHealth) {
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(enemy.x - 15, enemy.y - enemy.radius - 10, 30, 4);
          ctx.fillStyle = '#10b981';
          ctx.fillRect(enemy.x - 15, enemy.y - enemy.radius - 10, 30 * (enemy.health / enemy.maxHealth), 4);
        }
      }

      // Draw Projectiles
      for (const p of state.projectiles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isPlayer ? '#06b6d4' : '#ef4444';
        ctx.fill();
      }

      // Draw Particles
      for (const pt of state.particles) {
        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
        ctx.restore();
      }

      // Draw Player
      if (state.status === 'playing' || state.status === 'paused') {
        ctx.save();
        ctx.translate(state.player.x, state.player.y);
        const aimAngle = Math.atan2(state.mouse.y - state.player.y, state.mouse.x - state.player.x);
        ctx.rotate(aimAngle);

        // Ship hull
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(-12, -12);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-12, 12);
        ctx.closePath();
        ctx.fillStyle = '#0ea5e9';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [playSound]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGameState((prev) => ({
      ...prev,
      mouse: { ...prev.mouse, x, y }
    }));
  };

  const handleMouseDown = () => {
    setGameState((prev) => ({
      ...prev,
      mouse: { ...prev.mouse, down: true }
    }));
  };

  const handleMouseUp = () => {
    setGameState((prev) => ({
      ...prev,
      mouse: { ...prev.mouse, down: false }
    }));
  };

  const buyUpgrade = (type: 'health' | 'speed' | 'damage') => {
    const cost = 50;
    if (credits < cost) return;
    setCredits((c) => c - cost);
    setGameState((prev) => {
      const p = { ...prev.player };
      if (type === 'health') {
        p.maxHealth += 25;
        p.health = p.maxHealth;
      } else if (type === 'speed') {
        p.speed += 0.5;
      }
      return { ...prev, player: p };
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* HUD Header */}
      <div className="w-full max-w-[960px] flex items-center justify-between mb-4 bg-slate-900/90 border border-slate-800 rounded-xl px-6 py-3 text-white shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-mono font-bold">
              {Math.max(0, Math.ceil(gameState.player.health))}/{gameState.player.maxHealth}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-mono font-bold">
              {Math.ceil(gameState.player.energy)}/{gameState.player.maxEnergy}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-mono font-bold">WAVE {gameState.wave}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-sm font-mono">
            SCORE: <span className="text-cyan-400 font-bold">{gameState.score}</span>
          </div>
          <div className="text-sm font-mono text-emerald-400">
            CREDITS: {credits}¢
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        <canvas
          ref={canvasRef}
          width={960}
          height={600}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="cursor-crosshair block"
        />

        {/* Menu Overlay */}
        {gameState.status === 'menu' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/30">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Chrono Crawler
            </h1>
            <p className="text-slate-400 max-w-md text-sm mb-8 leading-relaxed">
              Navigate the temporal void. Blast rogue drones, harvest energy cells, survive endless enemy waves, and conquer the leaderboard.
            </p>
            <div className="flex gap-4">
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-400/25 text-sm"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Start Mission
              </button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-slate-400 font-mono">
              <span>WASD / Arrow Keys: Move</span>
              <span>·</span>
              <span>Mouse: Aim & Shoot</span>
              <span>·</span>
              <span>Space: Dash</span>
            </div>
          </div>
        )}

        {/* Paused Overlay */}
        {gameState.status === 'paused' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Game Paused</h2>
            <button
              onClick={() => setGameState((prev) => ({ ...prev, status: 'playing' }))}
              className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl transition-all text-sm mb-4"
            >
              Resume Game
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState.status === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-4xl font-extrabold text-rose-500 tracking-tight mb-2">
              Mission Terminated
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              You survived {gameState.wave - 1} waves and scored {gameState.score.toLocaleString()} points.
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-400/25 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Wave Upgrade Modal overlay */}
        {upgradesAvailable && gameState.status === 'playing' && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md z-20 flex flex-col items-center max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-1">Wave {gameState.wave - 1} Cleared!</h3>
            <p className="text-xs text-slate-400 mb-4">Spend credits to upgrade your ship before the next wave.</p>
            <div className="grid grid-cols-2 gap-3 w-full mb-4">
              <button
                onClick={() => buyUpgrade('health')}
                disabled={credits < 50}
                className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded-xl text-left transition-colors"
              >
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Armor Hull</span>
                  <span className="text-cyan-400">50¢</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">+25 Max Health</div>
              </button>
              <button
                onClick={() => buyUpgrade('speed')}
                disabled={credits < 50}
                className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded-xl text-left transition-colors"
              >
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Thrusters</span>
                  <span className="text-cyan-400">50¢</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">+0.5 Speed</div>
              </button>
            </div>
            <button
              onClick={() => setUpgradesAvailable(false)}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              Deploy to Wave {gameState.wave}
            </button>
          </div>
        )}
      </div>

      {/* Instructions footer */}
      <div className="mt-6 w-full max-w-[960px] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="font-bold text-white mb-1 flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            Combat Controls
          </div>
          Use WASD or Arrow Keys to maneuver. Aim with your mouse cursor and left-click to fire plasma projectiles.
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="font-bold text-white mb-1 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Power-ups & Waves
          </div>
          Defeat invading drones, hunters, and tanks to earn credits and spawn health/energy capsules.
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="font-bold text-white mb-1 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Itch.io Optimized
          </div>
          Built with 16:9 widescreen layout, perfect for embedding into itch.io game pages with full iframe support.
        </div>
      </div>
    </div>
  );
};
