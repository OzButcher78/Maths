import React from 'react';
import { useLocalization } from '../context/LocalizationContext';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in max-w-lg mx-auto">
      <h2 className="text-4xl font-black text-yellow-300">{t('aboutTitle')}</h2>
      
      <div className="w-full bg-black/20 p-6 rounded-xl space-y-4 text-center">
        <p className="text-lg text-white/90">{t('aboutAppDescription')}</p>
        <p className="text-2xl font-bold text-yellow-200 mt-4">{t('builtWithLove')}</p>
        <div className="pt-4 text-sm text-white/70">
            <p>{t('version')}</p>
            <p>{t('author')}</p>
            <p>{t('copyright')}</p>
        </div>
      </div>

      <button onClick={onBack} className="w-full max-w-sm mt-4 py-3 text-xl font-bold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
        {t('backToMenu')}
      </button>
    </div>
  );
};

export default AboutPage;
