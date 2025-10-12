'use client';

interface ResultRevealProps {
  fact: string | null;
  isCorrect: boolean | null;
  autoMode?: boolean; // Für Autopilot-Modus
}

export function ResultReveal({ fact, isCorrect, autoMode = false }: ResultRevealProps) {
  if (isCorrect === null) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 animate-slide-up">
      <div className="relative group">
        {/* Glow effect */}
        <div className={`
          absolute -inset-1 rounded-3xl blur-xl opacity-75 transition-opacity duration-300 animate-pulse
          ${autoMode ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' :
            isCorrect ? 'bg-gradient-correct' : 'bg-gradient-wrong'}
        `}></div>

        {/* Card */}
        <div className={`
          relative glass-strong rounded-3xl p-10 border-2 shadow-2xl
          ${autoMode
            ? 'border-blue-500 shadow-glow-blue'
            : isCorrect
              ? 'border-quiz-correct shadow-glow-green'
              : 'border-quiz-wrong shadow-glow-red'
          }
        `}>
          {!autoMode && (
            <div className="flex items-center gap-6 mb-6">
              <div className={`
                text-7xl animate-bounce-slow
                ${isCorrect ? 'animate-wiggle' : ''}
              `}>
                {isCorrect ? '🎉' : '💭'}
              </div>
              <h2 className={`
                text-6xl font-black
                ${isCorrect ? 'text-quiz-correct' : 'text-quiz-wrong'}
              `}>
                {isCorrect ? 'Richtig!' : 'Leider falsch!'}
              </h2>
            </div>
          )}

          {fact && (
            <div className="glass rounded-2xl p-6 mt-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">💡</div>
                <div className="text-3xl text-white leading-relaxed">
                  <span className="font-bold text-quiz-highlight">Wussten Sie:</span>
                  <br />
                  {fact}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

