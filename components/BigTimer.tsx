'use client';

interface BigTimerProps {
  timeRemaining: number;
  progress: number;
  state: 'idle' | 'running' | 'paused' | 'completed';
}

export function BigTimer({ timeRemaining, progress, state }: BigTimerProps) {
  const seconds = Math.ceil(timeRemaining);
  const isLowTime = seconds <= 10 && state === 'running';
  const isCompleted = state === 'completed';

  const getGlowColor = () => {
    if (isCompleted) return 'shadow-glow-red';
    if (isLowTime) return 'shadow-glow-yellow';
    return 'shadow-glow-green';
  };

  const getStrokeColor = () => {
    if (isCompleted) return '#f43f5e';
    if (isLowTime) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Circular Progress Ring */}
      <div className={`relative w-72 h-72 ${getGlowColor()} rounded-full transition-all duration-300`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-300"
            style={{
              filter: `drop-shadow(0 0 10px ${getStrokeColor()})`
            }}
          />
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-huge font-black transition-all duration-300 ${
            isCompleted ? 'text-quiz-wrong animate-pulse' :
            isLowTime ? 'text-quiz-highlight animate-pulse' :
            'text-white'
          }`}
          style={{
            textShadow: `0 0 30px ${getStrokeColor()}`
          }}>
            {seconds}
          </div>
        </div>
      </div>

      {/* State Indicator */}
      <div className="glass rounded-full px-8 py-3">
        <div className="text-2xl font-bold">
          {state === 'idle' && <span className="text-quiz-text/70">⏸ Bereit</span>}
          {state === 'running' && <span className="text-quiz-correct">▶ Läuft</span>}
          {state === 'paused' && <span className="text-quiz-highlight">⏸ Pausiert</span>}
          {state === 'completed' && <span className="text-quiz-wrong animate-pulse">⏰ Zeit abgelaufen!</span>}
        </div>
      </div>
    </div>
  );
}

