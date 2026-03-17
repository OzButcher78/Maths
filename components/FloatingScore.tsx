import React, { useEffect, useState } from 'react';

interface FloatingScoreProps {
  amount: number | null;
  visible: boolean;
  onComplete: () => void;
}

const FloatingScore: React.FC<FloatingScoreProps> = ({ amount, visible, onComplete }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible && amount !== null) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        onComplete();
      }, 1600);
      return () => clearTimeout(t);
    }
  }, [visible, amount]);

  if (!show || amount === null) return null;

  const isBonus = amount > 4;
  const color = isBonus ? 'text-yellow-300' : 'text-green-300';

  return (
    <div
      className={`pointer-events-none fixed left-1/2 z-50 font-black text-6xl drop-shadow-lg select-none ${color}`}
      style={{
        transform: 'translateX(-50%)',
        bottom: '40%',
        animation: 'float-up 1.6s ease-out forwards',
      }}
      aria-hidden="true"
    >
      +{amount}
      <style>{`
        @keyframes float-up {
          0% { transform: translateX(-50%) translateY(0); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(-50%) translateY(-90px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FloatingScore;
