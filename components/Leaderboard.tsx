import React from 'react';
import { ScoreEntry, GameMode } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface LeaderboardProps {
  scores: ScoreEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  const { t } = useLocalization();

  const operationSymbols = {
    addition: '+',
    subtraction: '-',
    multiplication: 'x',
    division: '÷',
    random: '?',
  };

  const getDifficultyDisplay = (difficulty: 'easy' | 'medium' | 'hard' | 'ai') => {
    if (difficulty === 'ai') return t('ai');
    return t(difficulty);
  }

  const gameModeDisplay: Record<GameMode, string> = {
    regular: '🏆',
    timeAttack: '⏱️',
    beatTheClock: '⏳'
  };
  const gameModeTitle: Record<GameMode, string> = {
    regular: t('regular'),
    timeAttack: t('timeAttack'),
    beatTheClock: t('beatTheClock')
  };

  return (
    <div className="w-full bg-black/20 p-4 rounded-xl">
      <h3 className="text-xl md:text-2xl font-bold mb-4 text-center text-yellow-300">{t('leaderboardTitle')}</h3>
      {scores.length === 0 ? (
        <p className="text-center text-white/70">{t('noScores')}</p>
      ) : (
        <ol className="space-y-2">
          {scores.map((entry, index) => (
            <li key={index} className={`flex items-center justify-between p-2 rounded-md ${index < 3 ? 'bg-yellow-500/30' : 'bg-black/20'}`}>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg w-6 text-right">{index + 1}.</span>
                <span className="font-bold text-white">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                 <span title={gameModeTitle[entry.gameMode]} className="hidden md:inline-block bg-white/20 px-2 py-0.5 rounded-full text-base">{gameModeDisplay[entry.gameMode]}</span>
                 <span className="hidden sm:inline-block capitalize bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">{getDifficultyDisplay(entry.difficulty)}</span>
                 <span className="bg-white/20 px-2 py-0.5 rounded-full text-lg font-black">{operationSymbols[entry.operation]}</span>
                 <span className="font-black text-xl text-yellow-300">{entry.score}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;