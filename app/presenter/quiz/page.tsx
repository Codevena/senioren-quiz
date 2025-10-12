'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTimer } from '@/lib/useTimer';
import { useSounds } from '@/lib/useSounds';
import { TeamScoring } from '@/components/TeamScoring';
import {
  Gamepad2,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Timer,
  Bot,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  fact: string | null;
  tags: string[];
  difficulty: string;
}

export default function PresenterQuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [timerDuration, setTimerDuration] = useState(30);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [showTeamScoring, setShowTeamScoring] = useState(false);
  const [teamAName, setTeamAName] = useState('Team A');
  const [teamBName, setTeamBName] = useState('Team B');
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [isWaitingAfterReveal, setIsWaitingAfterReveal] = useState(false);

  const { playSuccess, playFailure, playIntro } = useSounds();

  const timer = useTimer({
    duration: timerDuration,
    onComplete: () => {
      // Auto-reveal on timeout
      if (correctIndex === null && !isWaitingAfterReveal) {
        handleReveal();

        // If autopilot is enabled, wait 7 seconds then go to next question
        if (autopilotEnabled) {
          setIsWaitingAfterReveal(true);
          setTimeout(() => {
            setIsWaitingAfterReveal(false);
            handleNextQuestion();
          }, 7000);
        }
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
          // Use session-based seed for consistent shuffle across presenter and TV
          let seed = sessionStorage.getItem('quizSeed');
          if (!seed) {
            seed = Date.now().toString();
            sessionStorage.setItem('quizSeed', seed);
          }

          // Seeded shuffle
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

          // Load automode setting from localStorage
          const savedAutomode = localStorage.getItem('automodeEnabled');
          if (savedAutomode === 'true') {
            setAutopilotEnabled(true);
          }
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);



  // Broadcast state to screen view
  useEffect(() => {
    const channel = new BroadcastChannel('quiz-sync');
    channel.postMessage({
      currentQuestionIndex,
      selectedIndex,
      correctIndex,
      timerState: timer.state,
      timeRemaining: timer.timeRemaining,
      progress: timer.progress,
      teamAScore,
      teamBScore,
      teamAName,
      teamBName,
    });
    return () => channel.close();
  }, [currentQuestionIndex, selectedIndex, correctIndex, timer.state, timer.timeRemaining, timer.progress, teamAScore, teamBScore, teamAName, teamBName]);

  const handleReveal = useCallback(() => {
    if (correctIndex !== null) return; // Already revealed
    const current = questions[currentQuestionIndex];
    if (!current) return;

    setCorrectIndex(current.answerIndex);
    timer.pause();

    // Play sound based on whether answer was correct
    if (selectedIndex === current.answerIndex) {
      playSuccess();
    } else if (selectedIndex !== null) {
      playFailure();
    } else if (autopilotEnabled) {
      // In autopilot mode without selection, play success
      playSuccess();
    }
  }, [correctIndex, questions, currentQuestionIndex, timer, selectedIndex, autopilotEnabled, playSuccess, playFailure]);

  const handleSelectAnswer = useCallback((index: number) => {
    if (correctIndex !== null) return; // Already revealed
    
    setSelectedIndex(index);
    handleReveal();
  }, [correctIndex, handleReveal]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1 && !isWaitingAfterReveal) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedIndex(null);
      setCorrectIndex(null);
      setIsWaitingAfterReveal(false);
      timer.reset();
    }
  }, [currentQuestionIndex, questions.length, timer, isWaitingAfterReveal]);

  // Auto-start timer when autopilot is enabled (only once per question)
  useEffect(() => {
    if (autopilotEnabled && timer.state === 'idle' && !loading && !isWaitingAfterReveal && correctIndex === null) {
      const timeoutId = setTimeout(() => {
        timer.start();
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  }, [autopilotEnabled, timer.state, loading, currentQuestionIndex, isWaitingAfterReveal, correctIndex]);

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedIndex(null);
      setCorrectIndex(null);
      timer.reset();
    }
  }, [currentQuestionIndex, timer]);

  const toggleTimerDuration = useCallback(() => {
    setTimerDuration(prev => prev === 30 ? 45 : 30);
    timer.reset();
  }, [timer]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for our shortcuts
      const key = e.key.toLowerCase();
      
      if (['a', 'b', 'c', 'd', ' ', 'enter', 'r', 's', 'arrowleft', 'backspace'].includes(key)) {
        e.preventDefault();
      }

      switch (key) {
        case 'a':
          handleSelectAnswer(0);
          break;
        case 'b':
          handleSelectAnswer(1);
          break;
        case 'c':
          handleSelectAnswer(2);
          break;
        case 'd':
          if (questions[currentQuestionIndex]?.choices.length > 3) {
            handleSelectAnswer(3);
          }
          break;
        case ' ': // Space
          if (timer.state === 'running') {
            timer.pause();
          } else if (timer.state === 'paused') {
            timer.resume();
          } else {
            timer.start();
          }
          break;
        case 'enter':
          handleNextQuestion();
          break;
        case 'arrowleft':
        case 'backspace':
          handlePrevQuestion();
          break;
        case 'r':
          timer.reset();
          timer.start();
          break;
        case 's':
          handleReveal();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectAnswer, handleNextQuestion, handlePrevQuestion, handleReveal, timer, questions, currentQuestionIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-quiz-bg">
        <div className="text-4xl font-bold text-quiz-text animate-pulse">
          Lädt Quiz...
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-quiz-bg">
        <div className="text-center">
          <div className="text-4xl font-bold text-quiz-wrong mb-4">
            Keine Fragen gefunden
          </div>
          <div className="text-xl text-quiz-text/70">
            Bitte führen Sie <code className="bg-quiz-text/10 px-3 py-1 rounded">npm run db:seed</code> aus
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      {/* Compact Header */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            Presenter
          </h1>
          <div className="text-white/70 text-sm">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-3">
          {/* Question Preview - Compact */}
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <div className="text-lg font-bold text-white mb-2">
              {currentQuestion.prompt}
            </div>
            <div className="flex gap-1 flex-wrap">
              {currentQuestion.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">
                  {tag}
                </span>
              ))}
              <span className={`px-2 py-0.5 rounded text-xs ${
                currentQuestion.difficulty === 'EASY' ? 'bg-green-500/20 text-green-300' :
                currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>

          {/* Choices Preview - Compact */}
          <div className="bg-gray-800 rounded-lg p-3 shadow-lg">
            <div className="grid grid-cols-2 gap-2">
              {currentQuestion.choices.map((choice, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = selectedIndex === index;
                const isCorrect = correctIndex === index;
                const isWrong = correctIndex !== null && selectedIndex === index && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={correctIndex !== null}
                    className={`p-2 rounded-lg text-left transition-all text-sm ${
                      isCorrect ? 'bg-green-500 text-white font-bold' :
                      isWrong ? 'bg-red-500 text-white' :
                      isSelected ? 'bg-yellow-500 text-gray-900 font-bold' :
                      'bg-gray-700 text-white hover:bg-gray-600'
                    } ${correctIndex !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="font-bold">{letter}:</span> {choice}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fun Fact - Compact */}
          {correctIndex !== null && currentQuestion.fact && (
            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3 shadow-lg animate-in fade-in">
              <div className="text-xs text-blue-300 mb-1">💡 Wussten Sie:</div>
              <div className="text-sm text-white">{currentQuestion.fact}</div>
            </div>
          )}

          {/* Quick Controls under Question */}
          <div className="grid grid-cols-3 gap-2">
            {/* Navigation */}
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Zurück
            </button>

            <button
              onClick={handleReveal}
              disabled={correctIndex !== null}
              className="py-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Lightbulb className="w-3 h-3" />
              Lösung
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
            >
              Weiter
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Team Scoring Toggle & Display */}
          <div className="bg-gray-800 rounded-lg p-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-white/50">Team-Modus</div>
              <button
                onClick={() => setShowTeamScoring(!showTeamScoring)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  showTeamScoring
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {showTeamScoring ? 'AN' : 'AUS'}
              </button>
            </div>

            {showTeamScoring && (
              <TeamScoring
                onScoreUpdate={(scoreA, scoreB) => {
                  setTeamAScore(scoreA);
                  setTeamBScore(scoreB);
                }}
              />
            )}
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-gray-800 rounded-lg p-3 shadow-lg">
            <div className="text-xs text-white/50 mb-2">Tastenkürzel</div>
            <div className="grid grid-cols-3 gap-1 text-xs text-white/70">
              <div><kbd className="bg-gray-700 px-1 py-0.5 rounded text-xs">A-D</kbd> Antwort</div>
              <div><kbd className="bg-gray-700 px-1 py-0.5 rounded text-xs">Space</kbd> Timer</div>
              <div><kbd className="bg-gray-700 px-1 py-0.5 rounded text-xs">Enter</kbd> Weiter</div>
              <div><kbd className="bg-gray-700 px-1 py-0.5 rounded text-xs">←</kbd> Zurück</div>
              <div><kbd className="bg-gray-700 px-1 py-0.5 rounded text-xs">R</kbd> Reset</div>
              <div><kbd className="bg-gray-700 px-1 py-0.5 rounded text-xs">S</kbd> Lösung</div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls - Compact */}
        <div className="space-y-3">
          {/* Autopilot Mode - Compact */}
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-3 shadow-lg border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-white/70 flex items-center gap-1">
                <Bot className="w-4 h-4" />
                Autopilot
              </div>
              <button
                onClick={() => {
                  setAutopilotEnabled(!autopilotEnabled);
                  if (!autopilotEnabled && timer.state === 'idle') {
                    timer.start();
                  }
                }}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                  autopilotEnabled
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-glow-green'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {autopilotEnabled ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    AN
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    AUS
                  </>
                )}
              </button>
            </div>
            {autopilotEnabled && isWaitingAfterReveal && (
              <div className="text-xs text-yellow-400 animate-pulse flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Warte 7s...
              </div>
            )}
          </div>

          {/* Timer Controls - Compact */}
          <div className="bg-gray-800 rounded-lg p-3 shadow-lg">
            <div className="text-xs text-white/50 mb-2 flex items-center gap-1">
              <Timer className="w-3 h-3" />
              Timer
            </div>
            <div className="text-center mb-3">
              <div className={`text-4xl font-bold ${
                timer.state === 'completed' ? 'text-red-500' :
                timer.timeRemaining <= 10 && timer.state === 'running' ? 'text-yellow-500 animate-pulse' :
                'text-white'
              }`}>
                {Math.ceil(timer.timeRemaining)}s
              </div>
              <div className="text-xs text-white/50 mt-1">
                {timer.state === 'idle' && 'Bereit'}
                {timer.state === 'running' && 'Läuft'}
                {timer.state === 'paused' && 'Pausiert'}
                {timer.state === 'completed' && 'Abgelaufen'}
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => timer.state === 'running' ? timer.pause() : timer.state === 'paused' ? timer.resume() : timer.start()}
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
                disabled={autopilotEnabled}
              >
                {timer.state === 'running' ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Start
                  </>
                )}
              </button>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => { timer.reset(); timer.start(); }}
                  className="py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
                <button
                  onClick={toggleTimerDuration}
                  className="py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs flex items-center justify-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  {timerDuration}s
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>
    </main>
  );
}

