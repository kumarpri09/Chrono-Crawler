/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { GameCanvas } from './components/GameCanvas.tsx';
import { GDDViewer } from './components/GDDViewer.tsx';
import { ItchPublisher } from './components/ItchPublisher.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'gdd' | 'itch'>('game');
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chrono_crawler_highscore');
      if (saved) {
        setHighScore(parseInt(saved, 10));
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} highScore={highScore} />

      <main className="flex-1 pb-16">
        {activeTab === 'game' && <GameCanvas />}
        {activeTab === 'gdd' && <GDDViewer />}
        {activeTab === 'itch' && <ItchPublisher />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>Chrono Crawler — Built for itch.io with React, TypeScript & HTML5 Canvas.</p>
      </footer>
    </div>
  );
}
