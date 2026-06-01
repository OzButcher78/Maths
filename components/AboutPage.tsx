
import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import BackIcon from './icons/BackIcon';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in max-w-lg mx-auto">
      <h2 className="text-3xl md:text-4xl font-black text-yellow-300">{t('aboutTitle')}</h2>
      
      <div className="w-full bg-black/20 p-6 rounded-xl space-y-4 text-center">
        <p className="text-lg text-white/90">{t('aboutAppDescription')}</p>
        <div className="pt-4 text-sm text-white/70 flex flex-col gap-1">
            <p className="font-bold">{t('version')}</p>
            <p>{t('copyright')}</p>

            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="font-bold mb-2 text-white/90">{t('changelog24Title')}</p>
                <ul className="text-xs space-y-1.5 text-white/80 list-none">
                    <li>• {t('changelog24_1')}</li>
                    <li>• {t('changelog24_2')}</li>
                </ul>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
                <p className="font-bold mb-2 text-white/90">{t('changelogTitle')}</p>
                <ul className="text-xs space-y-1.5 text-white/80 list-none">
                    <li>• {t('changelog1')}</li>
                    <li>• {t('changelog2')}</li>
                    <li>• {t('changelog3')}</li>
                    <li>• {t('changelog4')}</li>
                    <li>• {t('changelog5')}</li>
                </ul>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
                <p className="font-bold mb-2 text-white/90">{t('changelog22Title')}</p>
                <ul className="text-xs space-y-1.5 text-white/80 list-none">
                    <li>• {t('changelog22_1')}</li>
                    <li>• {t('changelog22_2')}</li>
                    <li>• {t('changelog22_3')}</li>
                    <li>• {t('changelog22_4')}</li>
                    <li>• {t('changelog22_5')}</li>
                </ul>
                <p className="text-yellow-100/90 mt-3 text-xs">{t('credits')}</p>
            </div>
        </div>
      </div>

      <button onClick={onBack} className="w-full max-w-sm mt-4 py-3 text-xl font-bold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
        <BackIcon />
        {t('backToMenu')}
      </button>
    </div>
  );
};

export default AboutPage;