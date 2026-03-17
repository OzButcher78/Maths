import React, { useState } from 'react';
import { MultiplicationTableOption } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface MultiplicationSetupScreenProps {
  onStart: (tables: MultiplicationTableOption) => void;
  onBack: () => void;
  playButtonSound: () => void;
}

const MultiplicationSetupScreen: React.FC<MultiplicationSetupScreenProps> = ({ onStart, onBack, playButtonSound }) => {
  const { t } = useLocalization();
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const allTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const handleToggleTable = (tableNumber: number) => {
    playButtonSound();
    setSelectedTables(prev => 
      prev.includes(tableNumber)
        ? prev.filter(n => n !== tableNumber)
        : [...prev, tableNumber]
    );
  };

  const handleStart = () => {
    if (selectedTables.length > 0) {
      playButtonSound();
      onStart(selectedTables);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-white">{t('chooseTimesTable')}</h2>
      <p className="text-sm text-white/80 -mt-4 text-center">{t('multiplicationSetupHint')}</p>
      
      <div className="w-full grid grid-cols-4 gap-3">
        {allTables.map(num => {
          const isSelected = selectedTables.includes(num);
          return (
            <button
              key={num}
              onClick={() => handleToggleTable(num)}
              className={`w-full h-14 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-black rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 border
              ${isSelected 
                ? 'bg-green-400 text-green-900 scale-105 border-green-500/75' 
                : 'bg-white/10 text-white hover:bg-white/20 border-white/50'}`}
            >
              {num}
            </button>
          )
        })}
      </div>

      <div className="w-full flex flex-col gap-3 mt-4">
        <button
          onClick={handleStart}
          disabled={selectedTables.length === 0}
          className="w-full py-3 text-xl font-bold text-green-900 bg-green-400 rounded-xl shadow-lg hover:bg-green-500 transition-colors duration-200 ease-in-out disabled:bg-slate-500/40 disabled:text-white/60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          {t('startGame')}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 text-lg font-bold text-white bg-green-500 rounded-xl shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          {t('backToMenu')}
        </button>
      </div>
    </div>
  );
};

export default MultiplicationSetupScreen;