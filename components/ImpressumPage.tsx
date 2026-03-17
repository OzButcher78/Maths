
import React from 'react';
import { useLocalization } from '../context/LocalizationContext';
import BackIcon from './icons/BackIcon';

interface ImpressumPageProps {
  onBack: () => void;
}

const ImpressumPage: React.FC<ImpressumPageProps> = ({ onBack }) => {
  const { t } = useLocalization();
  const content = t('impressumBody');

  // Split content by double newlines to create sections
  const sections = content.split('\n\n').map((section, index) => {
      // Split the section by the first newline. 
      // The first line is treated as the subtitle/header.
      const parts = section.split('\n');
      const title = parts[0];
      const body = parts.slice(1).join('\n');
      return { title, body, key: index };
  });

  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in max-w-lg mx-auto">
      <h2 className="text-3xl md:text-4xl font-black text-yellow-300">{t('impressumTitle')}</h2>
      
      <div className="w-full bg-black/20 p-6 rounded-xl text-left text-white/90 max-h-[60vh] overflow-y-auto custom-scrollbar">
         {sections.map(s => (
             <div key={s.key} className="mb-5 last:mb-0">
                 {s.title && <h4 className="font-bold text-yellow-300 text-lg mb-1">{s.title}</h4>}
                 {s.body && <p className="whitespace-pre-line text-sm">{s.body}</p>}
                 {!s.body && !s.title && <p className="whitespace-pre-line text-sm">{s.title}</p>} 
                 {/* Fallback if logic produces empty body but title has content that should be body, 
                     though standard logic puts everything in title if no newline. 
                     If body is empty, it means it's a single line paragraph, so we render title as body if it doesn't look like a header? 
                     Actually, strictly following the logic: First line is Yellow. 
                     If the text is just a sentence, it becomes yellow. 
                     Let's assume the input format follows Header:\nBody. 
                     If body is empty, we render the title as a styled header.
                  */}
             </div>
         ))}
      </div>

      <img src="/locales/8214.png" alt="" width={80} className="opacity-70" draggable={false} />

      <button onClick={onBack} className="w-full max-w-sm py-3 text-xl font-bold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
        <BackIcon />
        {t('backToMenu')}
      </button>
    </div>
  );
};

export default ImpressumPage;
