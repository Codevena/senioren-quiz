'use client';

import Link from 'next/link';
import { Settings, Play, Sparkles } from 'lucide-react';

export default function Home() {
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
        <h1 className="text-7xl md:text-8xl font-black mb-4 text-center">
          <span className="gradient-text">Senior Quiz</span>
        </h1>

        <p className="text-2xl text-quiz-text/80 mb-16 text-center max-w-2xl flex items-center gap-3 justify-center">
          Deutschland-Quiz für Jung und Alt <Sparkles className="w-6 h-6 text-quiz-highlight" />
        </p>

        {/* Main Action Buttons */}
        <div className="flex flex-col gap-6 max-w-md w-full mb-12">
          <Link
            href="/quiz"
            className="group relative overflow-hidden glass-strong rounded-3xl p-10 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-glow border-2 border-green-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center gap-4">
              <Play className="w-16 h-16 text-green-400 group-hover:animate-bounce-slow" strokeWidth={2} fill="currentColor" />
              <h2 className="text-5xl font-bold text-white">Quiz Starten</h2>
            </div>
          </Link>

          <Link
            href="/settings"
            className="group relative overflow-hidden glass-strong rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-glow"
          >
            <div className="absolute inset-0 bg-gradient-neutral opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center gap-4">
              <Settings className="w-12 h-12 text-quiz-purple group-hover:rotate-90 transition-transform duration-500" strokeWidth={2} />
              <h2 className="text-4xl font-bold text-white">Einstellungen</h2>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

