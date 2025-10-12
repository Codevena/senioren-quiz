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
  const [teamAName, setTeamAName] = useState('Team A');
  const [teamBName, setTeamBName] = useState('Team B');
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [isWaitingAfterReveal, setIsWaitingAfterReveal] = useState(false);

  const { playSuccess, playFailure, playIntro } = useSounds();

  const timer = useTimer({
    duration: timerDuration,
    onComplete: () => {
      // Auto-reveal on timeout
      if (correctIndex === null) {
        handleReveal();

        // If autopilot is enabled, wait 5 seconds then go to next question
        if (autopilotEnabled) {
          setIsWaitingAfterReveal(true);
          setTimeout(() => {
            setIsWaitingAfterReveal(false);
            handleNextQuestion();
          }, 5000);
        }
      }
    },
  });

  // Load questions and play intro
  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await fetch('/api/quiz?limit=30');
        const data = await response.json();
        if (data.success) {
          setQuestions(data.data);

          // Load automode setting from localStorage
          const savedAutomode = localStorage.getItem('automodeEnabled');
          if (savedAutomode === 'true') {
            setAutopilotEnabled(true);
          }

          // Play intro sound when questions are loaded
          setTimeout(() => {
            playIntro();
          }, 500);
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [playIntro]);

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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedIndex(null);
      setCorrectIndex(null);
      setIsWaitingAfterReveal(false);
      timer.reset();

      // Auto-start timer if autopilot is enabled
      if (autopilotEnabled) {
        setTimeout(() => {
          timer.start();
        }, 500);
      }
    }
  }, [currentQuestionIndex, questions.length, timer, autopilotEnabled]);

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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Gamepad2 className="w-7 h-7" />
            Presenter-Steuerung
          </h1>
          <div className="text-white/70">
            Frage {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Preview */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-sm text-white/50 mb-2">Frage</div>
            <div className="text-2xl font-bold text-white mb-4">
              {currentQuestion.prompt}
            </div>
            <div className="flex gap-2 flex-wrap">
              {currentQuestion.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  {tag}
                </span>
              ))}
              <span className={`px-3 py-1 rounded-full text-sm ${
                currentQuestion.difficulty === 'EASY' ? 'bg-green-500/20 text-green-300' :
                currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>

          {/* Choices Preview */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-sm text-white/50 mb-4">Antwortmöglichkeiten</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    className={`p-4 rounded-lg text-left transition-all ${
                      isCorrect ? 'bg-green-500 text-white' :
                      isWrong ? 'bg-red-500 text-white' :
                      isSelected ? 'bg-yellow-500 text-gray-900' :
                      'bg-gray-700 text-white hover:bg-gray-600'
                    } ${correctIndex !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="font-bold">{letter}:</span> {choice}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fun Fact */}
          {correctIndex !== null && currentQuestion.fact && (
            <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4">
              <div className="text-sm text-blue-300 mb-2">💡 Wussten Sie:</div>
              <div className="text-lg text-white">{currentQuestion.fact}</div>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          {/* Autopilot Mode */}
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-6 shadow-lg border-2 border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-white/70 flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Autopilot
              </div>
              <button
                onClick={() => {
                  setAutopilotEnabled(!autopilotEnabled);
                  if (!autopilotEnabled && timer.state === 'idle') {
                    timer.start();
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  autopilotEnabled
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-glow-green'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {autopilotEnabled ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    AN
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    AUS
                  </>
                )}
              </button>
            </div>
            <div className="text-xs text-white/50">
              {autopilotEnabled ? (
                <>
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Auto-Start Timer
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Auto-Reveal nach {timerDuration}s
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Auto-Weiter nach 5s
                  </div>
                  {isWaitingAfterReveal && (
                    <div className="mt-3 text-yellow-400 animate-pulse flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Warte 5s...
                    </div>
                  )}
                </>
              ) : (
                'Manuelle Steuerung aktiv'
              )}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-sm text-white/50 mb-4 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Timer
            </div>
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold ${
                timer.state === 'completed' ? 'text-red-500' :
                timer.timeRemaining <= 10 && timer.state === 'running' ? 'text-yellow-500 animate-pulse' :
                'text-white'
              }`}>
                {Math.ceil(timer.timeRemaining)}s
              </div>
              <div className="text-sm text-white/50 mt-2">
                {timer.state === 'idle' && 'Bereit'}
                {timer.state === 'running' && 'Läuft'}
                {timer.state === 'paused' && 'Pausiert'}
                {timer.state === 'completed' && 'Abgelaufen'}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => timer.state === 'running' ? timer.pause() : timer.state === 'paused' ? timer.resume() : timer.start()}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                disabled={autopilotEnabled}
              >
                {timer.state === 'running' ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause (Space)
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start (Space)
                  </>
                )}
              </button>
              <button
                onClick={() => { timer.reset(); timer.start(); }}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset (R)
              </button>
              <button
                onClick={toggleTimerDuration}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                {timerDuration}s / {timerDuration === 30 ? '45s' : '30s'}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-sm text-white/50 mb-4">Navigation</div>
            <div className="space-y-2">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Zurück (←/Backspace)
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                Weiter (Enter)
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleReveal}
                disabled={correctIndex !== null}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-5 h-5" />
                Lösung zeigen (S)
              </button>
            </div>
          </div>

          {/* Team Scoring */}
          <TeamScoring
            onScoreUpdate={(scoreA, scoreB) => {
              setTeamAScore(scoreA);
              setTeamBScore(scoreB);
            }}
          />

          {/* Keyboard Shortcuts */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-sm text-white/50 mb-4">Tastenkürzel</div>
            <div className="space-y-2 text-sm text-white/70">
              <div><kbd className="bg-gray-700 px-2 py-1 rounded">A/B/C/D</kbd> Antwort wählen</div>
              <div><kbd className="bg-gray-700 px-2 py-1 rounded">Space</kbd> Timer Start/Pause</div>
              <div><kbd className="bg-gray-700 px-2 py-1 rounded">Enter</kbd> Nächste Frage</div>
              <div><kbd className="bg-gray-700 px-2 py-1 rounded">←</kbd> Vorherige Frage</div>
              <div><kbd className="bg-gray-700 px-2 py-1 rounded">R</kbd> Timer Reset</div>
              <div><kbd className="bg-gray-700 px-2 py-1 rounded">S</kbd> Lösung zeigen</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

