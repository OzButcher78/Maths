import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Define the shape of the context
interface LocalizationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

// Create the context with a default value
const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Define supported languages
export const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'hr', name: 'Hrvatski' },
];

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const fetchTranslations = useCallback(async (lang: string) => {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Could not load ${lang}.json`);
      }
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error(error);
      // Fallback to English if the selected language file fails to load
      if (lang !== 'en') {
        fetchTranslations('en');
      }
    }
  }, []);


  useEffect(() => {
    fetchTranslations(language);
  }, [language, fetchTranslations]);
  
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

// Custom hook to use the localization context
export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};