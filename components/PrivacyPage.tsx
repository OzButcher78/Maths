import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import BackIcon from './icons/BackIcon';

interface PrivacyPageProps {
  onBack: () => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in max-w-lg mx-auto">
      <h2 className="text-3xl md:text-4xl font-black text-yellow-300">{t('privacyTitle')}</h2>
      
      <div className="w-full bg-black/20 p-6 rounded-xl space-y-4 text-left">
        <p className="text-white/90 mb-4">{t('privacySummary')}</p>
        <ul className="space-y-4">
            <li>
                <h4 className="font-bold text-yellow-300">{t('privacyPoint1Title')}</h4>
                <p className="text-white/80">{t('privacyPoint1Desc')}</p>
            </li>
            <li>
                <h4 className="font-bold text-yellow-300">{t('privacyPoint2Title')}</h4>
                <p className="text-white/80">{t('privacyPoint2Desc')}</p>
            </li>
            <li>
                <h4 className="font-bold text-yellow-300">{t('privacyPoint3Title')}</h4>
                <p className="text-white/80">{t('privacyPoint3Desc')}</p>
            </li>
        </ul>
      </div>

      <button onClick={onBack} className="w-full max-w-sm mt-4 py-3 text-xl font-bold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
        <BackIcon />
        {t('backToMenu')}
      </button>
    </div>
  );
};

export default PrivacyPage;