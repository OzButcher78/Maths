import React from 'react';

interface SplashScreenProps {
  message: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center p-8">
        <p className="text-5xl md:text-7xl font-black text-yellow-300 drop-shadow-lg animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
