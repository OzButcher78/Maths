
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
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' },
];

// Minimal fallback so the UI never goes fully blank if locale files fail to load
const FALLBACK_TRANSLATIONS: Record<string, string> = {
  gameTitle: 'Math Master',
  startGame: 'Start Game!',
  playAgain: 'Play Again',
  back: 'Back',
  exitGame: 'Exit',
  score: 'Score',
  lives: 'Lives',
  streak: 'Streak',
  gameOver: 'Game Over!',
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('de');
  const [translations, setTranslations] = useState<Record<string, string>>(FALLBACK_TRANSLATIONS);

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
      // If English also fails, FALLBACK_TRANSLATIONS remain in state
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
