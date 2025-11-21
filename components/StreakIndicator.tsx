
import React from 'react';
import { STREAK_BONUSES } from '../constants';
import { useLocalization } from '../context/LocalizationContext';

interface StreakIndicatorProps {
  streak: number;
  isBonusActive: boolean;
}

interface StreakIconProps {
    achieved: boolean;
    index: number;
}

const StreakIcon: React.FC<StreakIconProps> = ({ achieved, index }) => {
    let classes = "w-6 h-6 transition-all duration-300 ";
    const style: React.CSSProperties = {};
    
    if (achieved) {
        classes += "text-yellow-300 animate-glow-svg ";
        // Make higher streaks glow slightly faster/more intensely
        style.animationDuration = `${Math.max(0.5, 2.0 - (index * 0.3))}s`;
    } else {
        classes += "text-white/20";
    }

    return (
        <svg 
            className={classes}
            style={style}
            fill="currentColor" 
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );
};

const StreakIndicator: React.FC<StreakIndicatorProps> = ({ streak, isBonusActive }) => {
  const { t } = useLocalization();
  
  if (isBonusActive) {
    return (
      <div className="flex flex-col items-start h-full">
        <span className="text-sm font-bold text-yellow-300 uppercase tracking-wider animate-pulse">{t('streakBonus')}</span>
        <div className="flex items-center gap-2 mt-1">
          {STREAK_BONUSES.map((_, i) => (
            <div key={i} className="animate-flash-bright">
                <svg 
                    className="w-6 h-6 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start h-full" title={`${streak} ${t('streak')}`}>
      <span className="text-sm font-bold text-white/80 uppercase tracking-wider">{t('streak')}</span>
      <div className="flex items-center gap-2 mt-1">
        {STREAK_BONUSES.map((bonus, i) => {
            const achieved = streak >= bonus.streak;
            return (
                <StreakIcon key={i} index={i} achieved={achieved} />
            );
        })}
      </div>
    </div>
  );
};

export default StreakIndicator;