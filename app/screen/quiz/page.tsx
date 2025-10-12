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
        const response = await fetch('/api/quiz?limit=200');
        const data = await response.json();
        if (data.success) {
          // Use same session-based seed as presenter for consistent shuffle
          let seed = sessionStorage.getItem('quizSeed');
          if (!seed) {
            seed = Date.now().toString();
            sessionStorage.setItem('quizSeed', seed);
          }

          // Seeded shuffle (same algorithm as presenter)
          const shuffled = [...data.data].sort((a, b) => {
            const hash = (str: string) => {
              let h = 0;
              for (let i = 0; i < str.length; i++) {
                h = ((h << 5) - h) + str.charCodeAt(i);
                h = h & h;
              }
              return h;
            };
            return hash(seed + a.id) - hash(seed + b.id);
          });

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

        {/* Spektakuläre Timer Bar at Bottom */}
        <div className="mt-auto w-full">
          <div className="relative w-full h-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden shadow-2xl">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>

            {/* Progress Bar */}
            <div
              className={`absolute inset-y-0 left-0 transition-all ease-linear ${
                quizState.timerState === 'completed'
                  ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse'
                  : quizState.progress < 0.33
                    ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse shadow-glow-red'
                    : quizState.progress < 0.66
                      ? 'bg-gradient-to-r from-yellow-500 via-green-400 to-green-500 shadow-glow-yellow'
                      : 'bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-500 shadow-glow-green'
              }`}
              style={{
                width: `${quizState.progress * 100}%`,
                transitionDuration: '100ms'
              }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>

              {/* Glow Effect */}
              <div className="absolute inset-0 shadow-inner"></div>
            </div>

            {/* Timer Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  quizState.timerState === 'completed' ? 'bg-red-400' :
                  quizState.progress < 0.33 ? 'bg-red-400' :
                  quizState.progress < 0.66 ? 'bg-yellow-400' :
                  'bg-green-400'
                }`}></div>
                <span className="text-white font-black text-3xl drop-shadow-2xl tracking-wider">
                  {Math.ceil(quizState.timeRemaining)}s
                </span>
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  quizState.timerState === 'completed' ? 'bg-red-400' :
                  quizState.progress < 0.33 ? 'bg-red-400' :
                  quizState.progress < 0.66 ? 'bg-yellow-400' :
                  'bg-green-400'
                }`}></div>
              </div>
            </div>

            {/* Bottom Glow */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 blur-sm ${
              quizState.timerState === 'completed' ? 'bg-red-500' :
              quizState.progress < 0.33 ? 'bg-red-500' :
              quizState.progress < 0.66 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}></div>
          </div>
        </div>
      </div>
    </main>
  );
}

