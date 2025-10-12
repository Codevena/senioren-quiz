'use client';

import { useEffect, useState } from 'react';
import { BigTimer } from '@/components/BigTimer';
import { QuestionCard } from '@/components/QuestionCard';
import { Choices } from '@/components/Choices';
import { ResultReveal } from '@/components/ResultReveal';
import { TTSSpeaker } from '@/components/TTSSpeaker';
import { TeamScoreDisplay } from '@/components/TeamScoreDisplay';
import { Tv, Keyboard } from 'lucide-react';

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
        const response = await fetch('/api/quiz?limit=30');
        const data = await response.json();
        if (data.success) {
          setQuestions(data.data);
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

        {/* Header with Timer */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-6">
            <div className="glass rounded-full px-8 py-4">
              <div className="text-4xl font-bold text-white flex items-center gap-3">
                <Tv className="w-10 h-10" />
                TV-Ansicht
              </div>
            </div>
            <TTSSpeaker
              text={`${currentQuestion.prompt}. ${currentQuestion.choices.map((c, i) => `${String.fromCharCode(65 + i)}: ${c}`).join('. ')}`}
            />
          </div>
          <BigTimer
            timeRemaining={quizState.timeRemaining}
            progress={quizState.progress}
            state={quizState.timerState}
          />
        </div>

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

        {/* Footer Hint */}
        <div className="mt-auto text-center">
          <div className="glass rounded-full px-8 py-3 inline-block">
            <div className="text-2xl text-white/70 flex items-center gap-3">
              <Keyboard className="w-6 h-6" />
              Steuerung über Presenter-Ansicht
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

