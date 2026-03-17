
import React from 'react';
import { useLocalization } from '../context/LocalizationContext';

interface StreakIndicatorProps {
  streak: number;
  isBonusActive: boolean;
}

const StreakIndicator: React.FC<StreakIndicatorProps> = ({ streak, isBonusActive }) => {
  const { t } = useLocalization();

  if (streak === 0) return null;

  let flameEmoji: string;
  let sizeClass: string;
  let colorClass: string;
  let animClass: string;
  let inlineStyle: React.CSSProperties | undefined;

  if (streak >= 20) {
    flameEmoji = '🔥🔥';
    sizeClass = 'text-5xl';
    colorClass = 'text-red-500';
    animClass = 'animate-bounce';
    inlineStyle = { filter: 'drop-shadow(0 0 16px red)' };
  } else if (streak >= 15) {
    flameEmoji = '🔥';
    sizeClass = 'text-4xl';
    colorClass = 'text-red-400';
    animClass = 'animate-bounce';
    inlineStyle = { filter: 'drop-shadow(0 0 12px red)' };
  } else if (streak >= 10) {
    flameEmoji = '🔥';
    sizeClass = 'text-4xl';
    colorClass = 'text-orange-500';
    animClass = 'animate-pulse';
    inlineStyle = { filter: 'drop-shadow(0 0 8px orange)' };
  } else if (streak >= 6) {
    flameEmoji = '🔥';
    sizeClass = 'text-3xl';
    colorClass = 'text-orange-400';
    animClass = 'animate-pulse';
    inlineStyle = undefined;
  } else if (streak >= 3) {
    flameEmoji = '🔥';
    sizeClass = 'text-2xl';
    colorClass = 'text-yellow-300';
    animClass = 'animate-pulse';
    inlineStyle = undefined;
  } else {
    // streak 1-2
    flameEmoji = '🔥';
    sizeClass = 'text-2xl';
    colorClass = 'text-white/70';
    animClass = '';
    inlineStyle = undefined;
  }

  return (
    <div className="flex flex-col items-start h-full">
      {isBonusActive && (
        <span className="text-sm font-bold text-yellow-300 uppercase tracking-wider animate-pulse">{t('streakBonus')}</span>
      )}
      <div className="flex items-center gap-1">
        <span
          className={`${sizeClass} ${colorClass} ${animClass}`}
          style={inlineStyle}
        >
          {flameEmoji}
        </span>
        <span className="font-bold text-white">{streak}</span>
      </div>
    </div>
  );
};

export default StreakIndicator;
