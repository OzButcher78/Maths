import React from 'react';
import { useLocalization, supportedLanguages } from '../context/LocalizationContext';
import ChevronDownIcon from './icons/ChevronDownIcon';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLocalization();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="relative inline-block text-left">
      <select 
        value={language} 
        onChange={handleChange}
        className="font-semibold py-2 pl-4 pr-10 rounded-lg text-white bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
      >
        {supportedLanguages.map(lang => (
          <option key={lang.code} value={lang.code} className="text-black font-semibold">
            {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
        <ChevronDownIcon />
      </div>
    </div>
  );
};

export default LanguageSelector;