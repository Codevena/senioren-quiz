'use client';

import { useEffect, useState, useCallback } from 'react';
import { QuestionCard } from '@/components/QuestionCard';
import { Choices } from '@/components/Choices';
import { ResultReveal } from '@/components/ResultReveal';
import { useTimer } from '@/lib/useTimer';
import { useSounds } from '@/lib/useSounds';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, Home, Trophy, PartyPopper, Menu, X } from 'lucide-react';

interface Question {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  fact: string;
  tags: string[];
  difficulty: string;
  type?: string; // For scrambled letters
}

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [timerDuration, setTimerDuration] = useState(20);
  const [interactiveAnswers, setInteractiveAnswers] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [questionLimit, setQuestionLimit] = useState(200);
  const [isWaitingAfterReveal, setIsWaitingAfterReveal] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTimer = localStorage.getItem('quizTimerDuration');
      const savedInteractive = localStorage.getItem('quizInteractiveAnswers');
      const savedCategories = localStorage.getItem('quizCategories');
      const savedLimit = localStorage.getItem('quizQuestionLimit');

      if (savedTimer) setTimerDuration(parseInt(savedTimer));
      if (savedInteractive) setInteractiveAnswers(savedInteractive === 'true');
      if (savedLimit) setQuestionLimit(parseInt(savedLimit));
      if (savedCategories) {
        try {
          const categories = JSON.parse(savedCategories);
          setSelectedCategories(categories);
        } catch (e) {
          setSelectedCategories([]);
        }
      }
      setSettingsLoaded(true);
    }
  }, []);

  // Load questions (only after settings are loaded)
  useEffect(() => {
    if (!settingsLoaded) return;

    async function loadQuestions() {
      try {
        // Build query params for category filtering
        // Use a high limit to get all matching questions, then slice to questionLimit
        let url = '/api/quiz?limit=5000';
        if (selectedCategories.length > 0) {
          url += `&tags=${selectedCategories.join(',')}`;
        }

        const response = await fetch(url);
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

          // Limit to the configured number of questions
          const limited = shuffled.slice(0, questionLimit);
          setQuestions(limited);
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [selectedCategories, settingsLoaded, questionLimit]);

  // Auto-start timer
  useEffect(() => {
    if (!loading && questions.length > 0 && timer.state === 'idle' && !isWaitingAfterReveal && correctIndex === null) {
      const timeoutId = setTimeout(() => {
        timer.start();
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  }, [loading, questions.length, timer, currentQuestionIndex, isWaitingAfterReveal, correctIndex]);

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
  }, [questions, currentQuestionIndex, timer, selectedIndex, playSuccess, playFailure]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedIndex(null);
      setCorrectIndex(null);
      timer.reset();
    } else {
      // Quiz completed - show outro
      setShowOutro(true);
    }
  }, [currentQuestionIndex, questions.length, timer]);

  const handleSelectAnswer = useCallback((index: number) => {
    if (interactiveAnswers && correctIndex === null) {
      setSelectedIndex(index);
    }
  }, [interactiveAnswers, correctIndex]);

  // Auto-redirect after outro
  useEffect(() => {
    if (showOutro) {
      const redirectTimer = setTimeout(() => {
        router.push('/');
      }, 5000); // 5 seconds

      return () => clearTimeout(redirectTimer);
    }
  }, [showOutro, router]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

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
          <p className="text-2xl text-white/70 mb-8">
            Bitte wähle mindestens eine Kategorie in den Einstellungen aus.
          </p>
          <Link
            href="/settings"
            className="inline-block glass-strong rounded-2xl px-8 py-4 text-2xl font-bold text-white hover:bg-white/10 transition-all"
          >
            Zu den Einstellungen
          </Link>
        </div>
      </div>
    );
  }

  // Outro screen when quiz is completed
  if (showOutro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-quiz-bg relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-quiz-purple/20 via-quiz-pink/20 to-quiz-cyan/20 animate-pulse"></div>

        {/* Celebration icons */}
        <div className="absolute top-20 left-20 animate-bounce">
          <Trophy className="w-24 h-24 text-quiz-highlight" />
        </div>
        <div className="absolute top-32 right-32 animate-bounce delay-100">
          <PartyPopper className="w-20 h-20 text-quiz-pink" />
        </div>
        <div className="absolute bottom-32 left-32 animate-bounce delay-200">
          <PartyPopper className="w-20 h-20 text-quiz-cyan" />
        </div>
        <div className="absolute bottom-20 right-20 animate-bounce delay-300">
          <Trophy className="w-24 h-24 text-quiz-purple" />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center glass-strong rounded-3xl p-16 max-w-3xl mx-4">
          <div className="mb-8">
            <Trophy className="w-32 h-32 text-quiz-highlight mx-auto mb-6 animate-pulse" />
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 animate-pulse">
            Quiz abgeschlossen!
          </h1>

          <p className="text-4xl text-quiz-highlight mb-8 font-semibold">
            Gut gemacht! 🎉
          </p>

          <div className="glass rounded-2xl p-8 mb-8">
            <p className="text-3xl text-white/90 mb-2">
              Du hast <span className="text-quiz-cyan font-bold">{questions.length}</span> Fragen beantwortet
            </p>
            <p className="text-xl text-white/70">
              Weiterleitung zur Startseite in 5 Sekunden...
            </p>
          </div>

          <Link
            href="/"
            className="inline-block glass-strong rounded-2xl px-12 py-6 text-3xl font-bold text-white hover:bg-white/10 transition-all border-2 border-quiz-highlight"
          >
            Jetzt zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  return (
    <main className="min-h-screen bg-quiz-bg flex flex-col items-center justify-between p-8">
      {/* Hamburger Menu */}
      <div className="w-full max-w-7xl flex justify-end items-center mb-4 relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="glass-strong rounded-2xl p-3 hover:bg-white/10 transition-all z-50"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Menu Dropdown */}
        {menuOpen && (
          <>
            {/* Backdrop - click outside to close */}
            <div
              className="fixed inset-0 z-30"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Content */}
            <div className="absolute top-16 right-0 glass-strong rounded-2xl p-4 min-w-[200px] z-40 shadow-2xl">
              <nav className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-lg font-semibold">Startseite</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-lg font-semibold">Einstellungen</span>
                </Link>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl flex-1 flex flex-col justify-center space-y-8">
        <QuestionCard
          prompt={currentQuestion.prompt}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        {/* Conditional rendering based on question type */}
        {currentQuestion.type === 'scrambled' ? (
          // Buchstabensalat: Show underscores or revealed word
          <div className="flex justify-center items-center min-h-[200px]">
            {correctIndex === null ? (
              // Show empty boxes with yellow borders (no underscore characters)
              <div className="flex gap-4">
                {Array.from({ length: currentQuestion.choices[currentQuestion.answerIndex].length }).map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-20 md:w-20 md:h-24 flex items-center justify-center border-b-4 border-quiz-highlight"
                  >
                  </div>
                ))}
              </div>
            ) : (
              // Show revealed word
              <div className="glass-strong rounded-3xl p-12 text-center">
                <div className="text-7xl md:text-8xl font-bold text-quiz-highlight mb-4 tracking-wider animate-pulse">
                  {currentQuestion.choices[currentQuestion.answerIndex]}
                </div>
                <div className="text-2xl text-white/70">
                  Das richtige Wort!
                </div>
              </div>
            )}
          </div>
        ) : (
          // Regular questions: Show choice buttons
          <Choices
            choices={currentQuestion.choices}
            selectedIndex={selectedIndex}
            correctIndex={correctIndex}
            onSelect={interactiveAnswers ? handleSelectAnswer : undefined}
            disabled={!interactiveAnswers || correctIndex !== null}
          />
        )}

        {correctIndex !== null && (
          <ResultReveal
            fact={currentQuestion.fact}
            isCorrect={selectedIndex === correctIndex}
            autoMode={true}
          />
        )}
      </div>

      {/* Timer Bar at Bottom */}
      <div className="w-full max-w-7xl mt-8">
        <div className="relative w-full h-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden shadow-2xl rounded-2xl">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          
          {/* Progress Bar */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-quiz-purple via-quiz-pink to-quiz-cyan transition-all duration-100 ease-linear"
            style={{
              width: `${timer.progress * 100}%`,
              opacity: timer.state === 'running' ? 1 : 0.3,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>

          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-black text-white drop-shadow-glow">
              {Math.ceil(timer.timeRemaining)}s
            </div>
          </div>

          {/* Glow Effect */}
          {timer.state === 'running' && (
            <div className="absolute inset-0 shadow-inner-glow pointer-events-none"></div>
          )}
        </div>
      </div>
    </main>
  );
}

