import { useState, useCallback, useRef } from 'react';

// Frequencies for musical notes to create simple melodies
const NOTE_FREQ = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.00,
  B5: 987.77,
  C6: 1046.50,
  E6: 1318.51,
  G6: 1567.98,
};

const useSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const wavBufferCache = useRef<Record<string, AudioBuffer | null>>({});
  const [isMuted, setIsMuted] = useState(false);

  const preloadWav = useCallback((path: string, context: AudioContext) => {
    fetch(path)
      .then(res => res.arrayBuffer())
      .then(buf => context.decodeAudioData(buf))
      .then(decoded => { wavBufferCache.current[path] = decoded; })
      .catch(() => {});
  }, []);

  // This function MUST be called after a user interaction to allow audio playback in browsers.
  const unlockAudio = useCallback(() => {
    if (audioContextRef.current) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContext();
      // If the context is in a suspended state, it needs to be resumed.
      if (context.state === 'suspended') {
        context.resume();
      }
      audioContextRef.current = context;
      console.log("AudioContext initialized successfully.");

      // Preload wav files so they play instantly on first use
      ['/wizard/wrong.wav', '/wizard/magic.wav', '/wizard/defeat.wav', '/wizard/powerup.wav'].forEach(p => preloadWav(p, context));
    } catch (e) {
      console.error("Web Audio API is not supported in this browser.", e);
    }
  }, [preloadWav]);

  const playWav = useCallback((path: string, volume: number = 0.5) => {
    if (isMuted) return;
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
    if (audioContext.state === 'suspended') audioContext.resume();

    const cached = wavBufferCache.current[path];
    if (cached) {
      const source = audioContext.createBufferSource();
      const gain = audioContext.createGain();
      gain.gain.value = volume;
      source.buffer = cached;
      source.connect(gain).connect(audioContext.destination);
      source.start();
      return;
    }

    fetch(path)
      .then(res => res.arrayBuffer())
      .then(buf => audioContext.decodeAudioData(buf))
      .then(decoded => {
        wavBufferCache.current[path] = decoded;
        const source = audioContext.createBufferSource();
        const gain = audioContext.createGain();
        gain.gain.value = volume;
        source.buffer = decoded;
        source.connect(gain).connect(audioContext.destination);
        source.start();
      })
      .catch(() => {});
  }, [isMuted]);

  const playSound = useCallback((notes: { freq: number, start: number, duration: number, type?: OscillatorType, vol?: number }[]) => {
    if (isMuted) return;
    const audioContext = audioContextRef.current;
    if (!audioContext) {
      // Don't warn on every button press before audio is unlocked
      // console.warn("AudioContext not available. Cannot play sound.");
      return;
    }
    
    // Ensure context is running
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const now = audioContext.currentTime;
    
    notes.forEach(note => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = note.type || 'sine';
      oscillator.frequency.setValueAtTime(note.freq, now + note.start);

      const volume = note.vol || 0.3;
      gainNode.gain.setValueAtTime(volume, now + note.start);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.start + note.duration);

      oscillator.start(now + note.start);
      oscillator.stop(now + note.start + note.duration);
    });
  }, [isMuted]);

  // Pleasant ascending two-note sound for a correct answer
  const playCorrectSound = useCallback(() => {
    playSound([
      { freq: NOTE_FREQ.C5, start: 0, duration: 0.15 },
      { freq: NOTE_FREQ.G5, start: 0.1, duration: 0.2 },
    ]);
  }, [playSound]);

  // Wrong answer sound effect
  const playIncorrectSound = useCallback(() => {
    playWav('/wizard/wrong.wav', 0.4);
  }, [playWav]);

  // Streak power-up sound (shared across all streak milestones)
  const playStreak3Sound = useCallback(() => {
    playWav('/wizard/powerup.wav', 0.35);
  }, [playWav]);

  const playStreak6Sound = useCallback(() => {
    playWav('/wizard/powerup.wav', 0.4);
  }, [playWav]);

  const playStreak10Sound = useCallback(() => {
    playWav('/wizard/powerup.wav', 0.45);
  }, [playWav]);

  const playStreak15Sound = useCallback(() => {
    playWav('/wizard/powerup.wav', 0.5);
  }, [playWav]);

  const playStreak20Sound = useCallback(() => {
    playWav('/wizard/powerup.wav', 0.55);
  }, [playWav]);

  // Game over defeat sound
  const playGameOverSound = useCallback(() => {
    playWav('/wizard/defeat.wav', 0.5);
  }, [playWav]);

  // A short, sharp click for button presses
  const playButtonPressSound = useCallback(() => {
    playSound([
        { freq: 200, start: 0, duration: 0.05, type: 'sine', vol: 0.1 }
    ]);
  }, [playSound]);

  // Magic spell sound for splash screens / milestones
  const playSplashScreenSound = useCallback(() => {
    playWav('/wizard/magic.wav', 0.45);
  }, [playWav]);

  // A quick rising sound for multiplier increase
  const playMultiplierSound = useCallback(() => {
    playSound([
      { freq: NOTE_FREQ.E5, start: 0, duration: 0.08, type: 'triangle', vol: 0.2 },
      { freq: NOTE_FREQ.A4, start: 0.08, duration: 0.12, type: 'triangle', vol: 0.25 },
    ]);
  }, [playSound]);

  // A pleasant sound for hitting a 10-question milestone
  const playMilestoneSound = useCallback(() => {
    playSound([
        { freq: NOTE_FREQ.G4, start: 0, duration: 0.1, vol: 0.3 },
        { freq: NOTE_FREQ.C5, start: 0.1, duration: 0.1, vol: 0.3 },
        { freq: NOTE_FREQ.E5, start: 0.2, duration: 0.2, vol: 0.4 },
    ]);
  }, [playSound]);

  // A short, sharp tick for the timer countdown
  const playTickSound = useCallback(() => {
    playSound([
        { freq: NOTE_FREQ.C6, start: 0, duration: 0.05, type: 'triangle', vol: 0.2 }
    ]);
  }, [playSound]);

  const toggleMute = useCallback(() => setIsMuted(m => !m), []);

  return {
    playCorrectSound, 
    playIncorrectSound, 
    playStreak3Sound,
    playStreak6Sound,
    playStreak10Sound,
    playStreak15Sound,
    playStreak20Sound,
    playGameOverSound, 
    playButtonPressSound, 
    playSplashScreenSound, 
    unlockAudio, 
    playMultiplierSound, 
    playMilestoneSound,
    playTickSound,
    isMuted,
    toggleMute,
  };
};

export default useSounds;