'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, MousePointer, Tag, BarChart3 } from 'lucide-react';
import questionsData from '@/lib/questions-data.json';

const TIMER_OPTIONS = [10, 15, 20, 25, 30];

const CATEGORIES = [
  'Deutschland',
  'Geografie',
  'Geschichte',
  'Kultur',
  'Politik',
  'Allgemeinwissen',
  'Natur',
  'Sport',
  'Musik',
  'Literatur',
  'Wissenschaft',
  'Tiere',
  'Lebensmittel',
  'Europa',
  'Buchstabensalat'
];

export default function SettingsPage() {
  const [timerDuration, setTimerDuration] = useState(20);
  const [interactiveAnswers, setInteractiveAnswers] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES);
  const [questionLimit, setQuestionLimit] = useState(200);

  // Calculate statistics
  const totalQuestions = questionsData.length;
  const categoryStats = CATEGORIES.map(category => {
    const count = questionsData.filter(q => q.tags.includes(category)).length;
    return { category, count };
  });

  // Calculate available questions based on selected categories
  const availableQuestions = selectedCategories.length > 0
    ? questionsData.filter(q => selectedCategories.some(cat => q.tags.includes(cat))).length
    : totalQuestions;

  // Question limit options based on available questions
  const getQuestionLimitOptions = () => {
    const options = [10, 20, 30, 50, 100];
    const validOptions = options.filter(opt => opt <= availableQuestions);
    if (!validOptions.includes(availableQuestions)) {
      validOptions.push(availableQuestions);
    }
    return validOptions.sort((a, b) => a - b);
  };

  // Load settings from localStorage on mount
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
          setSelectedCategories(JSON.parse(savedCategories));
        } catch (e) {
          setSelectedCategories([]);
        }
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quizTimerDuration', timerDuration.toString());
      localStorage.setItem('quizInteractiveAnswers', interactiveAnswers.toString());
      localStorage.setItem('quizCategories', JSON.stringify(selectedCategories));
      localStorage.setItem('quizQuestionLimit', questionLimit.toString());
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const selectAllCategories = () => {
    setSelectedCategories([...CATEGORIES]);
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  // Auto-save when settings change
  useEffect(() => {
    saveSettings();
  }, [timerDuration, interactiveAnswers, selectedCategories, questionLimit]);

  return (
    <main className="min-h-screen bg-quiz-bg p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="glass-strong rounded-2xl p-4 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-5xl font-black text-white">
            <span className="gradient-text">Einstellungen</span>
          </h1>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Timer Duration */}
          <div className="glass-strong rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-quiz-purple" />
              <h2 className="text-3xl font-bold text-white">Timer-Dauer</h2>
            </div>
            <p className="text-white/70 mb-6">Wähle die Zeit pro Frage in Sekunden</p>
            
            <div className="grid grid-cols-5 gap-4">
              {TIMER_OPTIONS.map(duration => (
                <button
                  key={duration}
                  onClick={() => setTimerDuration(duration)}
                  className={`
                    p-6 rounded-2xl font-bold text-2xl transition-all transform hover:scale-105
                    ${timerDuration === duration
                      ? 'bg-quiz-purple text-white shadow-glow'
                      : 'glass border-white/20 text-white hover:border-quiz-purple'
                    }
                  `}
                >
                  {duration}s
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Answers */}
          <div className="glass-strong rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MousePointer className="w-8 h-8 text-quiz-cyan" />
                <div>
                  <h2 className="text-3xl font-bold text-white">Interaktive Antworten</h2>
                  <p className="text-white/70 mt-2">Antworten während des Timers anklickbar machen</p>
                </div>
              </div>
              <button
                onClick={() => setInteractiveAnswers(!interactiveAnswers)}
                className={`
                  px-8 py-4 rounded-2xl font-bold text-xl transition-all flex items-center gap-2
                  ${interactiveAnswers
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-glow-green'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }
                `}
              >
                {interactiveAnswers ? 'AN' : 'AUS'}
              </button>
            </div>
          </div>

          {/* Question Limit */}
          <div className="glass-strong rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8 text-quiz-highlight" />
              <h2 className="text-3xl font-bold text-white">Anzahl der Fragen</h2>
            </div>
            <p className="text-white/70 mb-6">
              Wie viele Fragen sollen im Quiz erscheinen?
              {selectedCategories.length > 0 && (
                <span className="ml-2 text-quiz-cyan font-semibold">
                  (Max: {availableQuestions} verfügbar)
                </span>
              )}
            </p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {getQuestionLimitOptions().map((limit) => (
                <button
                  key={limit}
                  onClick={() => setQuestionLimit(limit)}
                  className={`
                    px-6 py-4 rounded-2xl font-bold text-xl transition-all
                    ${questionLimit === limit
                      ? 'bg-quiz-highlight text-quiz-bg shadow-glow'
                      : 'glass border-white/20 text-white hover:border-quiz-highlight'
                    }
                  `}
                >
                  {limit}
                </button>
              ))}
              <button
                onClick={() => setQuestionLimit(availableQuestions)}
                className={`
                  px-6 py-4 rounded-2xl font-bold text-xl transition-all
                  ${questionLimit === availableQuestions
                    ? 'bg-quiz-highlight text-quiz-bg shadow-glow'
                    : 'glass border-white/20 text-white hover:border-quiz-highlight'
                  }
                `}
              >
                Alle
              </button>
            </div>
          </div>

          {/* Question Categories */}
          <div className="glass-strong rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Tag className="w-8 h-8 text-quiz-pink" />
              <h2 className="text-3xl font-bold text-white">Fragenkategorien</h2>
            </div>
            <p className="text-white/70 mb-6">
              Wähle die Kategorien aus, die im Quiz erscheinen sollen
              {selectedCategories.length > 0 && (
                <span className="ml-2 text-quiz-highlight font-semibold">
                  ({selectedCategories.length} ausgewählt)
                </span>
              )}
            </p>

            {/* Select All / Clear All */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={selectAllCategories}
                className="px-6 py-3 rounded-xl bg-quiz-purple hover:bg-quiz-purple/80 text-white font-semibold transition-all"
              >
                Alle auswählen
              </button>
              <button
                onClick={clearAllCategories}
                className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-all"
              >
                Alle abwählen
              </button>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`
                    p-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105
                    ${selectedCategories.includes(category)
                      ? 'bg-quiz-pink text-white shadow-glow'
                      : 'glass border-white/20 text-white hover:border-quiz-pink'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="glass-strong rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8 text-quiz-highlight" />
              <h2 className="text-3xl font-bold text-white">Statistiken</h2>
            </div>

            {/* Total Questions */}
            <div className="mb-6 p-4 bg-white/5 rounded-2xl">
              <p className="text-2xl font-bold text-quiz-highlight">
                Gesamt: {totalQuestions} Fragen
              </p>
            </div>

            {/* Per Category Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoryStats.map(({ category, count }) => (
                <div
                  key={category}
                  className="flex justify-between items-center p-3 glass rounded-xl"
                >
                  <span className="text-white font-semibold">{category}</span>
                  <span className="text-quiz-cyan font-bold">{count} Fragen</span>
                </div>
              ))}
            </div>
          </div>

          {/* Save Confirmation */}
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-white/70 text-lg">
              ✓ Einstellungen werden automatisch gespeichert
            </p>
          </div>

          {/* Back to Home */}
          <Link
            href="/"
            className="block glass-strong rounded-3xl p-6 text-center hover:bg-white/10 transition-all"
          >
            <p className="text-2xl font-bold text-white">Zurück zur Startseite</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

