'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Target, Gamepad2, Tv, Sparkles, Keyboard, Bot, Zap } from 'lucide-react';

export default function Home() {
  const [automodeEnabled, setAutomodeEnabled] = useState(false);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-quiz-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-quiz-cyan/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-quiz-pink/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8 animate-float">
          <Target className="w-32 h-32 text-quiz-highlight" strokeWidth={2} />
        </div>

        <h1 className="text-7xl md:text-8xl font-black mb-4 text-center">
          <span className="gradient-text">Senior Quiz</span>
        </h1>

        <p className="text-2xl text-quiz-text/80 mb-16 text-center max-w-2xl flex items-center gap-3 justify-center">
          Barrierefreies Deutschland-Quiz mit Stil <Sparkles className="w-6 h-6 text-quiz-highlight" />
        </p>

        {/* Automode Toggle */}
        <div className="mb-8 glass-strong rounded-3xl p-8 max-w-2xl w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Bot className="w-10 h-10 text-quiz-purple" />
              <div>
                <h3 className="text-2xl font-bold text-white">Automode</h3>
                <p className="text-sm text-white/70">Automatischer Ablauf ohne Steuerung</p>
              </div>
            </div>
            <button
              onClick={() => {
                setAutomodeEnabled(!automodeEnabled);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('automodeEnabled', (!automodeEnabled).toString());
                }
              }}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all flex items-center gap-2 ${
                automodeEnabled
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-glow-green'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {automodeEnabled ? (
                <>
                  <Zap className="w-5 h-5" />
                  AN
                </>
              ) : (
                'AUS'
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full mb-12">
          <Link
            href="/presenter/quiz"
            className="group relative overflow-hidden glass-strong rounded-3xl p-12 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-glow"
          >
            <div className="absolute inset-0 bg-gradient-neutral opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <Gamepad2 className="w-24 h-24 mx-auto mb-4 text-white group-hover:animate-bounce-slow" strokeWidth={2} />
              <h2 className="text-4xl font-bold text-white mb-3">Presenter</h2>
              <p className="text-lg text-white/80">Steuerung am Laptop</p>
            </div>
          </Link>

          <Link
            href="/screen/quiz"
            className="group relative overflow-hidden glass-strong rounded-3xl p-12 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-glow"
          >
            <div className="absolute inset-0 bg-gradient-quiz opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <Tv className="w-24 h-24 mx-auto mb-4 text-white group-hover:animate-bounce-slow" strokeWidth={2} />
              <h2 className="text-4xl font-bold text-white mb-3">TV-Ansicht</h2>
              <p className="text-lg text-white/80">Anzeige für Beamer/TV</p>
            </div>
          </Link>
        </div>

        <div className="glass rounded-2xl px-8 py-4 text-center">
          <p className="text-xl text-quiz-text/70 flex items-center gap-3 justify-center">
            <Keyboard className="w-6 h-6 text-quiz-highlight" />
            <span className="text-quiz-highlight font-semibold">Tastenkürzel:</span> A/B/C/D • Space • Enter • R • ← • S
          </p>
        </div>
      </div>
    </main>
  );
}

