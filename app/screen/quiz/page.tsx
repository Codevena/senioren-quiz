'use client';

import { useEffect, useState } from 'react';
import { QuestionCard } from '@/components/QuestionCard';
import { Choices } from '@/components/Choices';
import { ResultReveal } from '@/components/ResultReveal';
import { TeamScoreDisplay } from '@/components/TeamScoreDisplay';

interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  fact: string | null;
  tags: string[];
  difficulty: string;
}

interface QuizState {
  currentQuestionIndex: number;
  selectedIndex: number | null;
  correctIndex: number | null;
  timerState: 'idle' | 'running' | 'paused' | 'completed';
  timeRemaining: number;
  progress: number;
  teamAScore?: number;
  teamBScore?: number;
  teamAName?: string;
  teamBName?: string;
}

export default function ScreenQuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedIndex: null,
    correctIndex: null,
    timerState: 'idle',
    timeRemaining: 30,
    progress: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load questions
  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await fetch('/api/quiz?limit=121');
        const data = await response.json();
        if (data.success) {
          // Shuffle questions randomly (same order as presenter)
          const shuffled = [...data.data].sort(() => Math.random() - 0.5);
          setQuestions(shuffled);
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  // Listen for state updates from presenter via BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('quiz-sync');
    
    channel.onmessage = (event) => {
      setQuizState(event.data);
    };

    return () => {
      channel.close();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-quiz-bg">
        <div className="text-6xl font-bold text-quiz-text animate-pulse">
          Lädt Quiz...
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-quiz-bg">
        <div className="text-center">
          <div className="text-6xl font-bold text-quiz-wrong mb-8">
            Keine Fragen gefunden
          </div>
          <div className="text-3xl text-quiz-text/70">
            Bitte führen Sie <code className="bg-quiz-text/10 px-4 py-2 rounded">npm run db:seed</code> aus
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];
  if (!currentQuestion) return null;

  const isCorrect = quizState.selectedIndex !== null && quizState.correctIndex !== null
    ? quizState.selectedIndex === quizState.correctIndex
    : null;

  return (
    <main className="min-h-screen p-8 flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-quiz-purple/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-quiz-cyan/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-quiz-pink/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Team Scores - Top */}
        {quizState.teamAScore !== undefined && quizState.teamBScore !== undefined && (
          <div className="mb-8 animate-fade-in">
            <TeamScoreDisplay
              teamAName={quizState.teamAName || 'Team A'}
              teamBName={quizState.teamBName || 'Team B'}
              teamAScore={quizState.teamAScore}
              teamBScore={quizState.teamBScore}
            />
          </div>
        )}

        {/* Content */}

      {/* Question */}
      <div className="mb-12">
        <QuestionCard
          prompt={currentQuestion.prompt}
          questionNumber={quizState.currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      </div>

      {/* Choices */}
      <div className="mb-12">
        <Choices
          choices={currentQuestion.choices}
          selectedIndex={quizState.selectedIndex}
          correctIndex={quizState.correctIndex}
          disabled={true}
        />
      </div>

      {/* Result */}
      {quizState.correctIndex !== null && (
        <ResultReveal
          fact={currentQuestion.fact}
          isCorrect={isCorrect}
        />
      )}

        {/* Timer Bar at Bottom */}
        <div className="mt-auto">
          <div className="relative w-full h-4 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-linear ${
                quizState.timerState === 'completed' ? 'bg-red-500' :
                quizState.progress < 0.33 ? 'bg-yellow-500 animate-pulse' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
              style={{ width: `${quizState.progress * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-sm drop-shadow-lg">
                {Math.ceil(quizState.timeRemaining)}s
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

