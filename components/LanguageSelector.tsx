import React from 'react';
import { useLocalization, supportedLanguages } from '../context/LocalizationContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLocalization();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="flex justify-center">
      <select 
        value={language} 
        onChange={handleChange}
        className="bg-white/20 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        {supportedLanguages.map(lang => (
          <option key={lang.code} value={lang.code} className="text-black">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;