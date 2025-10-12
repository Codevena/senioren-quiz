import { useEffect, useRef } from 'react';

export function useSounds() {
  const successSound = useRef<HTMLAudioElement | null>(null);
  const failureSound = useRef<HTMLAudioElement | null>(null);
  const introSound = useRef<HTMLAudioElement | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Initialize audio elements only once
    if (!successSound.current) {
      successSound.current = new Audio('/sounds/success.wav');
      successSound.current.volume = 0.8;
      successSound.current.load();
    }

    if (!failureSound.current) {
      failureSound.current = new Audio('/sounds/failure.mp3');
      failureSound.current.volume = 0.8;
      failureSound.current.load();
    }

    if (!introSound.current) {
      introSound.current = new Audio('/sounds/intro.wav');
      introSound.current.volume = 0.6;
      introSound.current.load();
    }

    // Enable audio on first user interaction
    const enableAudio = () => {
      if (!initializedRef.current) {
        console.log('🔊 Enabling audio...');
        // Unlock audio by playing and pausing
        const unlockPromises = [
          successSound.current?.play().then(() => successSound.current?.pause()),
          failureSound.current?.play().then(() => failureSound.current?.pause()),
          introSound.current?.play().then(() => introSound.current?.pause()),
        ];

        Promise.all(unlockPromises)
          .then(() => {
            console.log('✅ Audio unlocked!');
            initializedRef.current = true;
          })
          .catch(err => console.log('Audio unlock failed:', err));
      }
    };

    // Listen for any user interaction
    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('keydown', enableAudio, { once: true });
    window.addEventListener('touchstart', enableAudio, { once: true });

    return () => {
      // Cleanup
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('keydown', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
    };
  }, []);

  const playSuccess = () => {
    console.log('🎵 Playing success sound...');
    if (successSound.current) {
      successSound.current.currentTime = 0;
      successSound.current.play()
        .then(() => console.log('✅ Success sound played'))
        .catch(err => console.error('❌ Success sound failed:', err));
    }
  };

  const playFailure = () => {
    console.log('🎵 Playing failure sound...');
    if (failureSound.current) {
      failureSound.current.currentTime = 0;
      failureSound.current.play()
        .then(() => console.log('✅ Failure sound played'))
        .catch(err => console.error('❌ Failure sound failed:', err));
    }
  };

  const playIntro = () => {
    console.log('🎵 Playing intro sound...');
    if (introSound.current) {
      introSound.current.currentTime = 0;
      introSound.current.play()
        .then(() => console.log('✅ Intro sound played'))
        .catch(err => console.error('❌ Intro sound failed:', err));
    }
  };

  return {
    playSuccess,
    playFailure,
    playIntro,
  };
}

