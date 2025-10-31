import React from 'react';
import { PerformanceStats, Operation } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface StatsScreenProps {
  stats: PerformanceStats;
  onBack: () => void;
}

const operationSymbols: Record<string, string> = {
    addition: '+',
    subtraction: '-',
    multiplication: 'x',
    division: '÷',
};

const StatsScreen: React.FC<StatsScreenProps> = ({ stats, onBack }) => {
  const { t } = useLocalization();

  const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];

  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-black text-yellow-300">{t('statsTitle')}</h2>
      
      <div className="w-full bg-black/20 p-4 rounded-xl space-y-3">
        {operations.map(op => {
          const opStats = stats[op];
          if (!opStats || opStats.total === 0) return null;
          
          const accuracy = Math.round((opStats.correct / opStats.total) * 100);
          const accuracyColor = accuracy >= 80 ? 'text-green-400' : accuracy >= 50 ? 'text-yellow-400' : 'text-red-400';

          return (
            <div key={op} className="bg-black/20 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black w-10 h-10 flex items-center justify-center bg-white/20 rounded-full">{operationSymbols[op]}</span>
                <div>
                  <p className="text-xl font-bold capitalize text-left">{t(op)}</p>
                  <p className="text-sm text-white/70">{`${t('correct')}: ${opStats.correct} / ${t('questions')}: ${opStats.total}`}</p>
                </div>
              </div>
              <p className={`text-3xl font-bold ${accuracyColor}`}>{accuracy}%</p>
            </div>
          );
        })}
      </div>

      <button onClick={onBack} className="w-full max-w-sm mt-4 py-3 text-xl font-bold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
        {t('back')}
      </button>
    </div>
  );
};

export default StatsScreen;