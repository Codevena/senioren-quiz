import { useEffect, useRef, useState } from 'react';

export function useSounds() {
  const successSound = useRef<HTMLAudioElement | null>(null);
  const failureSound = useRef<HTMLAudioElement | null>(null);
  const introSound = useRef<HTMLAudioElement | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize audio elements
    successSound.current = new Audio('/sounds/success.wav');
    failureSound.current = new Audio('/sounds/failure.mp3');
    introSound.current = new Audio('/sounds/intro.wav');

    // Set volume
    if (successSound.current) successSound.current.volume = 0.7;
    if (failureSound.current) failureSound.current.volume = 0.7;
    if (introSound.current) introSound.current.volume = 0.5;

    // Preload
    successSound.current.load();
    failureSound.current.load();
    introSound.current.load();

    // Enable audio on first user interaction
    const enableAudio = () => {
      if (!initialized) {
        successSound.current?.play().then(() => successSound.current?.pause()).catch(() => {});
        failureSound.current?.play().then(() => failureSound.current?.pause()).catch(() => {});
        introSound.current?.play().then(() => introSound.current?.pause()).catch(() => {});
        setInitialized(true);
      }
    };

    // Listen for any user interaction
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });

    return () => {
      // Cleanup
      successSound.current?.pause();
      failureSound.current?.pause();
      introSound.current?.pause();
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };
  }, [initialized]);

  const playSuccess = () => {
    if (successSound.current) {
      successSound.current.currentTime = 0;
      successSound.current.play().catch(err => console.log('Success sound play failed:', err));
    }
  };

  const playFailure = () => {
    if (failureSound.current) {
      failureSound.current.currentTime = 0;
      failureSound.current.play().catch(err => console.log('Failure sound play failed:', err));
    }
  };

  const playIntro = () => {
    if (introSound.current) {
      introSound.current.currentTime = 0;
      introSound.current.play().catch(err => console.log('Intro sound play failed:', err));
    }
  };

  return {
    playSuccess,
    playFailure,
    playIntro,
  };
}

