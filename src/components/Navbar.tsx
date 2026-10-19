/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gamepad2, FileText, Share2, Trophy } from 'lucide-react';

interface NavbarProps {
  activeTab: 'game' | 'gdd' | 'itch';
  setActiveTab: (tab: 'game' | 'gdd' | 'itch') => void;
  highScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, highScore }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-8 py-4 bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-lg">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
          <Gamepad2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
            Chrono Crawler
          </span>
          <span className="block text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
            Itch.io Studio & GDD
          </span>
        </div>
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('game')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'game'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          Play Game
        </button>
        <button
          onClick={() => setActiveTab('gdd')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'gdd'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          Game Design Doc (GDD)
        </button>
        <button
          onClick={() => setActiveTab('itch')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'itch'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Share2 className="w-4 h-4" />
          Itch.io Publisher
        </button>
      </nav>

      {/* Zone 3: 1 primary action / high score badge */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs font-mono text-cyan-300">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>BEST: {highScore.toLocaleString()}</span>
        </div>
        <button
          onClick={() => setActiveTab('game')}
          className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0 shadow-lg shadow-cyan-400/20"
        >
          Launch Arcade
        </button>
      </div>
    </header>
  );
};
