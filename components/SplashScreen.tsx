import React, { useState, useEffect } from 'react';
import WizardAvatar from './WizardAvatar';

interface SplashScreenProps {
  message: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ message }) => {
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowWizard(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center p-8 flex flex-col items-center gap-4">
        <div style={{ minHeight: 150 }} className="flex items-center justify-center">
          {showWizard && <WizardAvatar state="attack2" size={150} />}
        </div>
        <p className="text-5xl md:text-7xl font-black text-yellow-300 drop-shadow-lg animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
