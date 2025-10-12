'use client';

import { useEffect, useState, useCallback } from 'react';
import { QuestionCard } from '@/components/QuestionCard';
import { Choices } from '@/components/Choices';
import { ResultReveal } from '@/components/ResultReveal';
import { useTimer } from '@/lib/useTimer';
import { useSounds } from '@/lib/useSounds';

interface Question {
  id: number;
  prompt: string;
  choices: string[];
  answerIndex: number;
  fact: string;
  tags: string[];
  difficulty: string;
}

export default function StandaloneQuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [timerDuration, setTimerDuration] = useState(30);
  const [isWaitingAfterReveal, setIsWaitingAfterReveal] = useState(false);

  const { playSuccess, playFailure } = useSounds();

  const timer = useTimer({
    duration: timerDuration,
    onComplete: () => {
      if (correctIndex === null && !isWaitingAfterReveal) {
        handleReveal();
        setIsWaitingAfterReveal(true);
        setTimeout(() => {
          setIsWaitingAfterReveal(false);
          handleNextQuestion();
        }, 7000);
      }
    },
  });

  // Load questions
  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await fetch('/api/quiz?limit=200');
        const data = await response.json();
        if (data.success) {
          let seed = sessionStorage.getItem('quizSeed');
          if (!seed) {
            seed = Date.now().toString();
            sessionStorage.setItem('quizSeed', seed);
          }
          
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

  // Auto-start timer
  useEffect(() => {
    if (!loading && questions.length > 0 && timer.state === 'idle' && !isWaitingAfterReveal && correctIndex === null) {
      const timeoutId = setTimeout(() => {
        timer.start();
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  }, [loading, questions.length, timer.state, currentQuestionIndex, isWaitingAfterReveal, correctIndex]);

  const handleReveal = useCallback(() => {
    const current = questions[currentQuestionIndex];
    if (!current) return;
    
    setCorrectIndex(current.answerIndex);
    timer.pause();

    if (selectedIndex === current.answerIndex) {
      playSuccess();
    } else if (selectedIndex !== null) {
      playFailure();
    } else {
      playSuccess();
    }
  }, [currentQuestionIndex, questions, selectedIndex, timer, playSuccess, playFailure]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1 && !isWaitingAfterReveal) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedIndex(null);
      setCorrectIndex(null);
      setIsWaitingAfterReveal(false);
      timer.reset();
    }
  }, [currentQuestionIndex, questions.length, timer, isWaitingAfterReveal]);

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
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  return (
    <main className="min-h-screen bg-quiz-bg flex flex-col items-center justify-between p-8">
      {/* Content */}
      <div className="w-full max-w-7xl flex-1 flex flex-col justify-center space-y-8">
        <QuestionCard
          prompt={currentQuestion.prompt}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <Choices
          choices={currentQuestion.choices}
          selectedIndex={selectedIndex}
          correctIndex={correctIndex}
          onSelect={undefined}
          disabled={true}
        />

        {correctIndex !== null && (
          <ResultReveal
            fact={currentQuestion.fact}
            isCorrect={selectedIndex === correctIndex}
            autoMode={true}
          />
        )}

        {isWaitingAfterReveal && (
          <div className="w-full max-w-4xl mx-auto mt-8 animate-slide-up">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 rounded-3xl blur-xl opacity-75 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>

              {/* Card */}
              <div className="relative glass-strong rounded-3xl p-8 border-2 border-blue-500 shadow-glow-blue">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-5xl animate-bounce-slow">⏳</div>
                  <div className="text-4xl font-black text-white">
                    Nächste Frage in <span className="text-blue-400 animate-pulse">7s</span>
                  </div>
                  <div className="text-5xl animate-bounce-slow">⏳</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spektakuläre Timer Bar at Bottom */}
      <div className="w-full mt-auto">
        <div className="relative w-full h-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden shadow-2xl">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>

          {/* Progress Bar */}
          <div
            className={`absolute inset-y-0 left-0 transition-all duration-300 ease-out ${
              timer.state === 'completed'
                ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse'
                : timer.progress < 0.33
                  ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse shadow-glow-red'
                  : timer.progress < 0.66
                    ? 'bg-gradient-to-r from-yellow-500 via-green-400 to-green-500 shadow-glow-yellow'
                    : 'bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-500 shadow-glow-green'
            }`}
            style={{ width: `${(1 - timer.progress) * 100}%` }}
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
                timer.state === 'completed' ? 'bg-red-400' :
                timer.progress < 0.33 ? 'bg-red-400' :
                timer.progress < 0.66 ? 'bg-yellow-400' :
                'bg-green-400'
              }`}></div>
              <span className="text-white font-black text-3xl drop-shadow-2xl tracking-wider">
                {Math.ceil(timer.timeRemaining)}s
              </span>
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                timer.state === 'completed' ? 'bg-red-400' :
                timer.progress < 0.33 ? 'bg-red-400' :
                timer.progress < 0.66 ? 'bg-yellow-400' :
                'bg-green-400'
              }`}></div>
            </div>
          </div>

          {/* Bottom Glow */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 blur-sm ${
            timer.state === 'completed' ? 'bg-red-500' :
            timer.progress < 0.33 ? 'bg-red-500' :
            timer.progress < 0.66 ? 'bg-yellow-500' :
            'bg-green-500'
          }`}></div>
        </div>
      </div>
    </main>
  );
}

