import React from 'react';
import { ScoreEntry, GameMode, Difficulty, Operation } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface LeaderboardProps {
  scores: ScoreEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  const { t } = useLocalization();

  const operationSymbols: Record<Operation, string> = {
    addition: '+',
    subtraction: '-',
    multiplication: 'x',
    division: '÷',
    random: 'MIX',
  };

  const gameModeDisplay: Record<GameMode, string> = {
    regular: '🏆',
    timeAttack: '⏱️',
  };
  const gameModeTitle: Record<GameMode, string> = {
    regular: t('regular'),
    timeAttack: t('timeAttack'),
  };

  const difficultyColors: Record<Difficulty, string> = {
    easy: 'bg-green-500/80 text-white',
    medium: 'bg-blue-500/80 text-white',
    hard: 'bg-orange-500/80 text-white',
    ai: 'bg-purple-600/80 text-white',
  };

  const getDifficultyDisplay = (difficulty: Difficulty) => {
    if (difficulty === 'ai') return t('ai');
    return t(difficulty);
  }

  const topScores = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return (
    <div className="w-full bg-black/20 p-4 rounded-xl">
      <h3 className="text-xl md:text-2xl font-bold mb-4 text-center text-yellow-300">{t('leaderboardTitle')}</h3>
      {topScores.length === 0 ? (
        <p className="text-center text-white/70 py-4">{t('noScores')}</p>
      ) : (
        <ol className="space-y-2">
          {topScores.map((entry, index) => (
            <li key={index} className={`sm:flex sm:items-center sm:justify-between p-2 rounded-lg transition-colors ${index < 3 ? 'bg-blue-500/40' : 'bg-blue-400/20'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-bold text-lg w-6 text-right flex-shrink-0">{index + 1}.</span>
                  <span className="font-bold text-white truncate">{entry.name}</span>
                </div>
                <span className="font-black text-xl text-yellow-300 w-12 text-right sm:hidden">{entry.score}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm flex-shrink-0 justify-end mt-1 sm:mt-0">
                 {entry.operation !== 'multiplication' && (
                    <span 
                        className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full uppercase ${difficultyColors[entry.difficulty]}`}
                        title={getDifficultyDisplay(entry.difficulty)}
                    >
                        {getDifficultyDisplay(entry.difficulty)}
                    </span>
                 )}
                 <span title={gameModeTitle[entry.gameMode]} className="bg-white/20 px-2 py-0.5 rounded-full text-base">{gameModeDisplay[entry.gameMode]}</span>
                 <span className={`bg-white/20 px-2 py-0.5 rounded-full font-black ${entry.operation === 'random' ? 'text-xs' : 'text-lg'}`}>{operationSymbols[entry.operation]}</span>
                 <span className="font-black text-xl text-yellow-300 w-12 text-right hidden sm:inline">{entry.score}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;