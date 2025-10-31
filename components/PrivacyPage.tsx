import React from 'react';
import { useLocalization } from '../context/LocalizationContext';

interface PrivacyPageProps {
  onBack: () => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in max-w-lg mx-auto">
      <h2 className="text-3xl md:text-4xl font-black text-yellow-300">{t('privacyTitle')}</h2>
      
      <div className="w-full bg-black/20 p-6 rounded-xl space-y-4 text-left">
        <p className="text-white/90">{t('privacyPolicyText')}</p>
      </div>

      <button onClick={onBack} className="w-full max-w-sm mt-4 py-3 text-xl font-bold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
        {t('backToMenu')}
      </button>
    </div>
  );
};

export default PrivacyPage;