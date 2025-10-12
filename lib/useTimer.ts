'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

interface UseTimerOptions {
  duration: number; // in seconds
  onComplete?: () => void;
  onTick?: (remaining: number) => void;
}

interface UseTimerReturn {
  timeRemaining: number;
  state: TimerState;
  progress: number; // 0-100
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  stop: () => void;
}

export function useTimer({
  duration,
  onComplete,
  onTick,
}: UseTimerOptions): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [state, setState] = useState<TimerState>('idle');
  
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(duration);
  const animationFrameRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  const progress = timeRemaining / duration; // 0 to 1

  const updateTimer = useCallback(() => {
    if (!startTimeRef.current) return;

    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000; // Convert to seconds
    const remaining = Math.max(0, pausedTimeRef.current - elapsed);

    setTimeRemaining(remaining);
    onTick?.(remaining);

    if (remaining <= 0) {
      setState('completed');
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    } else {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  }, [onComplete, onTick]);

  const start = useCallback(() => {
    if (state === 'running') return;
    
    hasCompletedRef.current = false;
    startTimeRef.current = performance.now();
    pausedTimeRef.current = duration;
    setState('running');
    setTimeRemaining(duration);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [duration, state, updateTimer]);

  const pause = useCallback(() => {
    if (state !== 'running') return;
    
    setState('paused');
    pausedTimeRef.current = timeRemaining;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [state, timeRemaining]);

  const resume = useCallback(() => {
    if (state !== 'paused') return;
    
    setState('running');
    startTimeRef.current = performance.now();
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [state, updateTimer]);

  const reset = useCallback(() => {
    hasCompletedRef.current = false;
    setState('idle');
    setTimeRemaining(duration);
    pausedTimeRef.current = duration;
    startTimeRef.current = null;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [duration]);

  const stop = useCallback(() => {
    setState('idle');
    setTimeRemaining(duration);
    pausedTimeRef.current = duration;
    startTimeRef.current = null;
    hasCompletedRef.current = false;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    timeRemaining,
    state,
    progress,
    start,
    pause,
    resume,
    reset,
    stop,
  };
}

