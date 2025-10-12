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
          onSelect={null}
          disabled={true}
        />

        {correctIndex !== null && (
          <ResultReveal
            fact={currentQuestion.fact}
            isCorrect={selectedIndex === correctIndex}
          />
        )}

        {isWaitingAfterReveal && (
          <div className="text-center">
            <div className="glass rounded-full px-8 py-4 inline-block">
              <div className="text-3xl text-yellow-400 animate-pulse">
                ⏳ Nächste Frage in 7s...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timer Bar at Bottom */}
      <div className="w-full max-w-7xl mt-auto">
        <div className="relative w-full h-4 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-linear ${
              timer.state === 'completed' ? 'bg-red-500' :
              timer.progress < 0.33 ? 'bg-yellow-500 animate-pulse' :
              'bg-gradient-to-r from-green-500 to-emerald-500'
            }`}
            style={{ width: `${timer.progress * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm drop-shadow-lg">
              {Math.ceil(timer.timeRemaining)}s
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

