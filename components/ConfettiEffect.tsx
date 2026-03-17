import React, { useEffect, useState } from 'react';

interface ConfettiEffectProps {
  trigger: boolean;
}

const COLORS = ['bg-yellow-400', 'bg-pink-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-orange-400', 'bg-red-400', 'bg-cyan-400'];

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ trigger }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setActive(true);
      const t = setTimeout(() => setActive(false), 900);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  if (!active) return null;

  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 360;
    const distance = 60 + Math.random() * 40;
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * distance;
    const y = Math.sin(rad) * distance;
    const color = COLORS[i % COLORS.length];
    const size = 6 + Math.floor(Math.random() * 6);
    return { x, y, color, size, delay: Math.random() * 0.1 };
  });

  return (
    <div
      className="pointer-events-none fixed inset-0 flex items-center justify-center z-50"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${p.color}`}
          style={{
            width: p.size,
            height: p.size,
            animation: `confetti-fly 0.8s ease-out ${p.delay}s forwards`,
            '--tx': `${p.x}px`,
            '--ty': `${p.y}px`,
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes confetti-fly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ConfettiEffect;
