
import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import BackIcon from './icons/BackIcon';

interface ScoringPageProps {
  onBack: () => void;
}

const ScoringPage: React.FC<ScoringPageProps> = ({ onBack }) => {
  const { t } = useLocalization();

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-black/20 p-4 rounded-xl text-left">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <div className="space-y-1 text-white/90">{children}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 text-center animate-fade-in max-w-lg mx-auto">
      <h2 className="text-3xl md:text-4xl font-black text-yellow-300">{t('scoringTitle')}</h2>
      
      <div className="w-full space-y-4">
        <p className="text-white/90">{t('scoringIntro')}</p>

        <Section title={t('standardOperationsTitle')}>
            <h4 className="font-bold text-white">{t('basePointsSection')}</h4>
            <p>{t('basePointsCorrect')}</p>
            <p>{t('basePointsIncorrect')}</p>
            <h4 className="font-bold text-white mt-2">{t('difficultyMultiplierSection')}</h4>
            <p>{t('difficultyMultiplierDesc')}</p>
            <ul className="list-disc list-inside ml-2">
                <li>{t('difficultyEasy')}</li>
                <li>{t('difficultyMedium')}</li>
                <li>{t('difficultyHard')}</li>
            </ul>
        </Section>
        
        <Section title={t('multiplicationModeTitle')}>
            <p>{t('multiplicationModeDesc')}</p>
            <ul className="list-disc list-inside ml-2 mt-2">
                <li>{t('multiplicationEasyRows')}</li>
                <li>{t('multiplicationMediumRows')}</li>
                <li>{t('multiplicationHardRows')}</li>
            </ul>
            <p className="mt-2">{t('multiplicationStreakDesc')}</p>
        </Section>

        <Section title={t('streakBonusSection')}>
             <p>{t('streakBonusDesc')}</p>
            <ul className="list-disc list-inside ml-2">
                <li>{t('streak3')}</li>
                <li>{t('streak6')}</li>
                <li>{t('streak10')}</li>
                <li>{t('streak15')}</li>
                <li>{t('streak20')}</li>
            </ul>
        </Section>
      </div>

      <button onClick={onBack} className="w-full max-w-sm mt-4 py-3 text-xl font-bold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
        <BackIcon />
        {t('backToMenu')}
      </button>
    </div>
  );
};

export default ScoringPage;