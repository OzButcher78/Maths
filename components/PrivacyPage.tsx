
import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import BackIcon from './icons/BackIcon';

interface PrivacyPageProps {
  onBack: () => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  const { t } = useLocalization();

  const Section: React.FC<{ title: string; text: string }> = ({ title, text }) => (
    <div className="mb-4">
      <h4 className="font-bold text-yellow-300 text-lg mb-1">{title}</h4>
      <p className="text-white/90 whitespace-pre-line text-sm">{text}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in max-w-lg mx-auto">
      <h2 className="text-3xl md:text-4xl font-black text-yellow-300">{t('privacyTitle')}</h2>
      
      <div className="w-full bg-black/20 p-6 rounded-xl text-left max-h-[60vh] overflow-y-auto custom-scrollbar">
        <p className="text-white font-bold mb-4">{t('privacyIntro')}</p>
        
        <Section title={t('privacyStorageTitle')} text={t('privacyStorageText')} />
        <Section title={t('privacyNameCheckTitle')} text={t('privacyNameCheckText')} />
        <Section title={t('privacyTrackingTitle')} text={t('privacyTrackingText')} />
        <Section title={t('privacyChildTitle')} text={t('privacyChildText')} />
        <Section title={t('privacyLegalTitle')} text={t('privacyLegalText')} />
        <Section title={t('privacyContactTitle')} text={t('privacyContactText')} />

      </div>

      <button onClick={onBack} className="w-full max-w-sm mt-4 py-3 text-xl font-bold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
        <BackIcon />
        {t('backToMenu')}
      </button>
    </div>
  );
};

export default PrivacyPage;
