'use client';

interface QuestionCardProps {
  prompt: string;
  questionNumber?: number;
  totalQuestions?: number;
}

export function QuestionCard({ prompt, questionNumber, totalQuestions }: QuestionCardProps) {
  return (
    <div className="w-full max-w-6xl mx-auto animate-scale-in">
      {questionNumber !== undefined && totalQuestions !== undefined && (
        <div className="glass rounded-full px-6 py-2 mb-4 inline-block">
          <div className="text-xl font-bold text-white">
            <span className="text-quiz-highlight">Frage {questionNumber}</span>
            <span className="text-white/50 mx-2">/</span>
            <span className="text-white/70">{totalQuestions}</span>
          </div>
        </div>
      )}

      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-quiz rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

        {/* Card */}
        <div className="relative glass-strong rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-white text-center leading-tight">
            {prompt}
          </h1>
        </div>
      </div>
    </div>
  );
}

