import React, { useState, useEffect, useRef } from 'react';

export type WizardState = 'idle' | 'attack' | 'attack2' | 'hurt' | 'dizzy' | 'die' | 'jump';

interface WizardAvatarProps {
  state: WizardState;
  size?: number;
}

const FRAMES: Record<WizardState, string[]> = {
  idle:    Array.from({ length: 8 }, (_, i) => `/wizard/idle-${i + 1}.png`),
  attack:  Array.from({ length: 4 }, (_, i) => `/wizard/attack-${i + 1}.png`),
  attack2: Array.from({ length: 5 }, (_, i) => `/wizard/attack-2-${i + 1}.png`),
  hurt:    ['/wizard/hurt.png'],
  dizzy:   Array.from({ length: 3 }, (_, i) => `/wizard/dizzy-${i + 1}.png`),
  die:     Array.from({ length: 5 }, (_, i) => `/wizard/die-${i + 1}.png`),
  jump:    ['/wizard/jump.png'],
};

const SPEED_MS: Record<WizardState, number> = {
  idle:    150,
  attack:   80,
  attack2:  80,
  hurt:      0, // static single frame
  dizzy:   200,
  die:     220,
  jump:      0, // static single frame
};

const LOOPING: Record<WizardState, boolean> = {
  idle:    true,
  attack:  false,
  attack2: false,
  hurt:    false,
  dizzy:   true,
  die:     false,
  jump:    false,
};

const WizardAvatar: React.FC<WizardAvatarProps> = ({ state, size = 80 }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setFrameIndex(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const frames = FRAMES[state];
    const speed = SPEED_MS[state];
    const loop = LOOPING[state];

    // Single frame or explicitly static — nothing to animate
    if (frames.length <= 1 || speed === 0) return;

    let current = 0;
    intervalRef.current = setInterval(() => {
      current += 1;
      if (current >= frames.length) {
        if (loop) {
          current = 0;
        } else {
          // Freeze on last frame
          current = frames.length - 1;
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }
      }
      setFrameIndex(current);
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state]);

  const src = FRAMES[state][frameIndex] ?? FRAMES[state][0];

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
      draggable={false}
    />
  );
};

export default WizardAvatar;
