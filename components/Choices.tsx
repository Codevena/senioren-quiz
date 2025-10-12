'use client';

interface ChoicesProps {
  choices: string[];
  selectedIndex: number | null;
  correctIndex: number | null;
  onSelect?: (index: number) => void;
  disabled?: boolean;
}

const CHOICE_LETTERS = ['A', 'B', 'C', 'D'];

export function Choices({
  choices,
  selectedIndex,
  correctIndex,
  onSelect,
  disabled = false,
}: ChoicesProps) {
  const getChoiceStyle = (index: number) => {
    const isSelected = selectedIndex === index;
    const isCorrect = correctIndex === index;
    const isWrong = correctIndex !== null && selectedIndex === index && !isCorrect;
    const isRevealed = correctIndex !== null;

    if (isCorrect && isRevealed) {
      return {
        container: 'bg-gradient-correct border-quiz-correct shadow-glow-green',
        text: 'text-white',
        icon: '✓',
      };
    }
    if (isWrong) {
      return {
        container: 'bg-gradient-wrong border-quiz-wrong shadow-glow-red',
        text: 'text-white',
        icon: '✗',
      };
    }
    if (isSelected && !isRevealed) {
      return {
        container: 'bg-quiz-highlight/20 border-quiz-highlight shadow-glow-yellow',
        text: 'text-white',
        icon: '',
      };
    }
    return {
      container: 'glass border-white/20 hover:border-quiz-purple hover:shadow-glow',
      text: 'text-white',
      icon: '',
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl mx-auto">
      {choices.map((choice, index) => {
        const style = getChoiceStyle(index);
        const isRevealed = correctIndex !== null;

        return (
          <button
            key={index}
            onClick={() => !disabled && onSelect?.(index)}
            disabled={disabled}
            className={`
              group relative min-h-[100px] p-6 rounded-3xl border-3
              transition-all duration-300 transform
              ${disabled ? 'cursor-not-allowed' : 'hover:scale-105 cursor-pointer active:scale-95'}
              ${style.container}
              ${isRevealed && correctIndex === index ? 'animate-pulse' : ''}
            `}
          >
            {/* Animated background on hover */}
            {!isRevealed && (
              <div className="absolute inset-0 bg-gradient-quiz opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-300"></div>
            )}

            <div className="relative flex items-center gap-4">
              {/* Letter badge */}
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center
                text-2xl font-black
                ${isRevealed && correctIndex === index ? 'bg-white/20' : 'bg-white/10'}
              `}>
                {CHOICE_LETTERS[index]}
              </div>

              {/* Choice text */}
              <span className={`flex-1 text-2xl md:text-3xl font-bold text-left ${style.text}`}>
                {choice}
              </span>

              {/* Result icon */}
              {style.icon && (
                <div className="flex-shrink-0 text-4xl animate-scale-in">
                  {style.icon}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

