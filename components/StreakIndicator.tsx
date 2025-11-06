import React from 'react';
import { STREAK_BONUSES } from '../constants';
import { useLocalization } from '../context/LocalizationContext';

interface StreakIndicatorProps {
  streak: number;
  isBonusActive: boolean;
}

const StreakIndicator: React.FC<StreakIndicatorProps> = ({ streak, isBonusActive }) => {
  const { t } = useLocalization();

  if (isBonusActive) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-2xl font-black text-yellow-300 animate-ping-once drop-shadow-lg">
          BONUS!
        </p>
      </div>
    );
  }
  
  const milestones = STREAK_BONUSES.map(b => b.streak);
  const maxMilestone = milestones[milestones.length - 1];

  let prevMilestone = 0;
  let nextMilestone = milestones[0];

  for (const m of milestones) {
    if (streak < m) {
      nextMilestone = m;
      break;
    }
    prevMilestone = m;
  }

  if (streak >= maxMilestone) {
    nextMilestone = maxMilestone;
    prevMilestone = milestones[milestones.length - 2] || 0;
  }

  const totalSteps = nextMilestone - prevMilestone;
  const currentStep = streak - prevMilestone;

  return (
    <div className="flex flex-col items-start h-full" title={`${currentStep} / ${totalSteps} ${t('streak')}`}>
      <span className="text-sm font-bold text-white/80 uppercase tracking-wider">{t('streak')}</span>
      <div className="flex items-center gap-1.5 mt-1">
        {[...Array(totalSteps)].map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-300
              ${i < currentStep
                ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                : 'bg-black/20'
              }`
            }
          />
        ))}
      </div>
    </div>
  );
};

export default StreakIndicator;
