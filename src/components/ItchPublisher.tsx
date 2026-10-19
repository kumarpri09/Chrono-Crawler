/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Share2, Code, Download, Check, Copy, ExternalLink, ShieldCheck, Sparkles, Monitor } from 'lucide-react';

export const ItchPublisher: React.FC = () => {
  const [embedWidth, setEmbedWidth] = useState<number>(960);
  const [embedHeight, setEmbedHeight] = useState<number>(600);
  const [copiedEmbed, setCopiedEmbed] = useState<boolean>(false);
  const [copiedDesc, setCopiedDesc] = useState<boolean>(false);

  const embedCode = `<iframe src="https://itch.io/embed-upload/chrono-crawler?color=090d16" width="${embedWidth}" height="${embedHeight}" frameborder="0"><a href="https://itch.io/game/chrono-crawler">Play Chrono Crawler on itch.io</a></iframe>`;

  const itchDescription = `## 🌌 Chrono Crawler
**Navigate the temporal void. Defeat rogue AI drones, harvest quantum energy cells, and survive endless arcade incursions!**

### 🎮 Controls
* **Movement:** WASD or Arrow Keys
* **Aim & Shoot:** Mouse Cursor + Left Click
* **Dash:** Spacebar

### 🚀 Features
* **Zero-Install HTML5 Gameplay:** Instant play directly in your browser.
* **Wave-Based Roguelite Progression:** Purchase critical armor and thruster upgrades between waves.
* **Procedural Synth Audio:** Immersive retro sound effects powered by the Web Audio API.

*Built for itch.io with React, TypeScript, and HTML5 Canvas.*`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleCopyDesc = () => {
    navigator.clipboard.writeText(itchDescription);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Itch.io Publisher Toolkit
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Generate iframe embeds, format game page descriptions, and prepare your ZIP bundle for upload.
            </p>
          </div>
        </div>
        <a
          href="https://itch.io/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-lg shadow-cyan-400/20 whitespace-nowrap"
        >
          Open Itch.io Dashboard
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Grid: Embed Code Generator & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Embed Code Generator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                HTML Embed Generator
              </h2>
              <button
                onClick={handleCopyEmbed}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                {copiedEmbed ? 'Copied' : 'Copy HTML'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Configure your game viewport dimensions for the itch.io embed player.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={embedWidth}
                  onChange={(e) => setEmbedWidth(parseInt(e.target.value) || 960)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={embedHeight}
                  onChange={(e) => setEmbedHeight(parseInt(e.target.value) || 600)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap break-all">
              {embedCode}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <Monitor className="w-4 h-4 text-cyan-400 shrink-0" />
            Recommended itch.io upload setting: <strong className="text-white">This file will be played in the browser</strong>.
          </div>
        </div>

        {/* Upload Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Itch.io Upload Checklist
            </h2>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>ZIP Packaging:</strong> Ensure your static build index.html is at the root of the ZIP archive.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Viewport Dimensions:</strong> Set iframe dimensions to match your game canvas aspect ratio (e.g., 960x600).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Fullscreen Support:</strong> Check "Mobile friendly" and "Allows fullscreen" in itch.io upload settings.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Cover Image:</strong> Upload a 630x500px promotional cover graphic for your game card.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Ready for publication</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 100% Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Itch.io Game Page Description Markdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Itch.io Page Description Markdown
          </h2>
          <button
            onClick={handleCopyDesc}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            {copiedDesc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            {copiedDesc ? 'Copied Description' : 'Copy Description'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Paste this directly into your itch.io project editor "Description" field.
        </p>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
          {itchDescription}
        </div>
      </div>
    </div>
  );
};
