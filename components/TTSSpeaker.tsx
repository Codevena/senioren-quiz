'use client';

import { useState, useEffect } from 'react';

interface TTSSpeakerProps {
  text: string;
  autoSpeak?: boolean;
}

export function TTSSpeaker({ text, autoSpeak = false }: TTSSpeakerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Web Speech API is supported
    setIsSupported('speechSynthesis' in window);
  }, []);

  useEffect(() => {
    if (autoSpeak && isSupported && text) {
      speak();
    }
  }, [text, autoSpeak, isSupported]);

  const speak = () => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!isSupported) {
    return null; // Don't show button if not supported
  }

  return (
    <button
      onClick={isSpeaking ? stop : speak}
      className={`
        min-w-[100px] min-h-[100px] p-6 rounded-2xl
        font-bold text-2xl
        transition-all transform hover:scale-105
        ${isSpeaking 
          ? 'bg-quiz-wrong hover:bg-red-600 text-white animate-pulse' 
          : 'bg-quiz-neutral hover:bg-blue-600 text-white'
        }
      `}
      aria-label={isSpeaking ? 'Vorlesen stoppen' : 'Text vorlesen'}
    >
      {isSpeaking ? '🔇 Stop' : '🔊 Vorlesen'}
    </button>
  );
}

