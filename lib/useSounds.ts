import { useEffect, useRef } from 'react';

export function useSounds() {
  const successSound = useRef<HTMLAudioElement | null>(null);
  const failureSound = useRef<HTMLAudioElement | null>(null);
  const introSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    successSound.current = new Audio('/sounds/success.wav');
    failureSound.current = new Audio('/sounds/failure.wav');
    introSound.current = new Audio('/sounds/intro.wav');

    // Preload
    successSound.current.load();
    failureSound.current.load();
    introSound.current.load();

    return () => {
      // Cleanup
      successSound.current?.pause();
      failureSound.current?.pause();
      introSound.current?.pause();
    };
  }, []);

  const playSuccess = () => {
    if (successSound.current) {
      successSound.current.currentTime = 0;
      successSound.current.play().catch(err => console.log('Sound play failed:', err));
    }
  };

  const playFailure = () => {
    if (failureSound.current) {
      failureSound.current.currentTime = 0;
      failureSound.current.play().catch(err => console.log('Sound play failed:', err));
    }
  };

  const playIntro = () => {
    if (introSound.current) {
      introSound.current.currentTime = 0;
      introSound.current.play().catch(err => console.log('Sound play failed:', err));
    }
  };

  return {
    playSuccess,
    playFailure,
    playIntro,
  };
}

