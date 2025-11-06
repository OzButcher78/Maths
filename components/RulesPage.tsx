import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import BackIcon from './icons/BackIcon';

interface RulesPageProps {
  onBack: () => void;
}

const RulesPage: React.FC<RulesPageProps> = ({ onBack }) => {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in max-w-lg mx-auto">
      <h2 className="text-3xl md:text-4xl font-black text-yellow-300">{t('rulesTitle')}</h2>
      
      <div className="w-full bg-black/20 p-4 rounded-xl space-y-4 text-left">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{t('regularModeTitle')}</h3>
          <p className="text-white/90">{t('regularModeDesc')}</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{t('timeAttackModeTitle')}</h3>
          <p className="text-white/90">{t('timeAttackModeDesc')}</p>
        </div>
      </div>

      <button onClick={onBack} className="w-full max-w-sm mt-4 py-3 text-xl font-bold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
        <BackIcon />
        {t('backToMenu')}
      </button>
    </div>
  );
};

export default RulesPage;