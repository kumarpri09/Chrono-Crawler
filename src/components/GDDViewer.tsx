/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Download, Copy, Check, Sparkles, Layers, Volume2, Globe } from 'lucide-react';

const gddMarkdownContent = `# GAME DESIGN DOCUMENT (GDD)
## Project Title: Chrono Crawler
Genre: Sci-Fi Arcade Roguelike / Twin-Stick Shooter
Platform: Web Browser (HTML5 Canvas / React) - Optimized for Itch.io
Target Audience: Indie gamers, arcade enthusiasts, quick-session players

---

### 1. Executive Summary & Concept
Chrono Crawler is a high-octane top-down arcade shooter set inside a collapsing temporal anomaly. Players pilot an experimental chronal interceptor spacecraft tasked with repelling waves of rogue autonomous defense units, harvesting energy cores, and surviving escalating incursions. Designed specifically for instant browser play on itch.io, the game requires zero installation, loads in milliseconds, and provides deep arcade replayability through wave-based progression and ship upgrades.

### 2. Core Gameplay Loop & Mechanics
1. Combat & Maneuverability: The player moves freely within a bounded 960x600 arena using WASD/Arrow keys while aiming and firing plasma projectiles with the mouse.
2. Enemy Waves & Spawning: Enemies spawn in progressive waves around the perimeter. Enemy types include fast Drones, agile Hunters, armored Tanks, and devastating Wave Bosses.
3. Credit Economy & Upgrades: Destroying enemies rewards credits. Between waves, players access an upgrade shop to boost armor hull integrity or thruster speed.
4. Power-ups: Dropped energy and health capsules help sustain players through tougher later waves.

### 3. Controls & Interface
- Movement: WASD or Arrow Keys
- Aim & Shoot: Mouse Cursor + Left Click
- Dash / Burst: Spacebar
- Pause: P key

### 4. Art Style & Audio Design
- Visual Aesthetic: Retropunk neon wireframes against dark obsidian grids (60% dark neutral canvas, 30% structural panels, 10% cyan/emerald/rose accent budget).
- Audio Design: Procedural Web Audio API sound generator producing crisp retro square/sawtooth synth sounds for shooting, explosions, power-ups, and dash bursts without external audio asset loading bottlenecks.

### 5. Itch.io Publication & Distribution Strategy
- Embedding: Formatted at 1280x720 / 960x600 widescreen resolution, perfectly suited for itch.io iframe embedding ("Embedded HTML5 game").
- Tags & Discoverability: Tagged with arcade, shooter, sci-fi, html5, roguelike, singleplayer, keyboard.
- Packaging: Bundled as a standalone static HTML5 package ready for ZIP upload to itch.io.
`;

export const GDDViewer: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'summary' | 'mechanics' | 'art' | 'itch'>('summary');

  const handleCopy = () => {
    navigator.clipboard.writeText(gddMarkdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([gddMarkdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Chrono_Crawler_GDD.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Game Design Document (GDD)
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Comprehensive design specification for Chrono Crawler.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            {copied ? 'Copied Markdown' : 'Copy Markdown'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-lg shadow-cyan-400/20"
          >
            <Download className="w-4 h-4" />
            Download .MD
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveSection('summary')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeSection === 'summary'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          01. Executive Summary & Concept
        </button>
        <button
          onClick={() => setActiveSection('mechanics')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeSection === 'mechanics'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          02. Core Loop & Mechanics
        </button>
        <button
          onClick={() => setActiveSection('art')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeSection === 'art'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          03. Art & Audio Design
        </button>
        <button
          onClick={() => setActiveSection('itch')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeSection === 'itch'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          04. Itch.io Release Strategy
        </button>
      </div>

      {/* Content panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-slate-300 text-sm leading-relaxed space-y-6 shadow-xl backdrop-blur-md">
        {activeSection === 'summary' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Executive Summary & High-Concept
            </h2>
            <p>
              <strong>Chrono Crawler</strong> is an immersive web-based sci-fi arcade roguelike designed from the ground up for frictionless deployment and viral engagement on itch.io. Players pilot an advanced temporal interceptor spacecraft trapped within a collapsing quantum rift.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">Target Genre</span>
                Arcade Twin-Stick Shooter / Sci-Fi Roguelite
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">Platform Architecture</span>
                HTML5 Canvas + React 19 + TypeScript (Zero Plugin Dependency)
              </div>
            </div>
          </div>
        )}

        {activeSection === 'mechanics' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Core Gameplay Loop & Systems
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Wave-Based Incursions:</strong> Enemies spawn in escalating waves with increasing variety (Drones, Hunters, Tanks, and Bosses).</li>
              <li><strong>Economy & Upgrading:</strong> Earning credits from defeated enemies allows players to purchase critical hull repairs and thruster upgrades between waves.</li>
              <li><strong>Dynamic Power-ups:</strong> Health and energy capsules drop randomly to reward aggressive positioning and combat engagement.</li>
            </ul>
          </div>
        )}

        {activeSection === 'art' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-amber-400" />
              Art Style & Audio Direction
            </h2>
            <p>
              The visual language embraces a refined retropunk aesthetic featuring glowing vector lines, deep obsidian canvas fields, and responsive particle explosions. Sound effects are synthesized dynamically via the browser Web Audio API, eliminating audio loading lag and ensuring crisp tactile feedback.
            </p>
          </div>
        )}

        {activeSection === 'itch' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              Itch.io Publishing Specification
            </h2>
            <p>
              Designed to meet all itch.io HTML5 publishing criteria. The game viewport scales gracefully inside iframe embeddings at 960x600 resolution. Suggested tags: <code className="text-cyan-400">html5</code>, <code className="text-cyan-400">arcade</code>, <code className="text-cyan-400">shooter</code>, <code className="text-cyan-400">scifi</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
