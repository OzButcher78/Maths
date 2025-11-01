import React from 'react';
import { ScoreEntry, GameMode, Difficulty } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface LeaderboardProps {
  scores: ScoreEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  const { t } = useLocalization();
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'ai'];

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
      <div className="space-y-6">
        {difficulties.map(difficulty => {
          const filteredScores = scores
            .filter(score => score.difficulty === difficulty)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

          return (
            <div key={difficulty}>
              <h4 className="text-lg font-bold mb-2 text-center text-white capitalize border-b-2 border-white/20 pb-1">{getDifficultyDisplay(difficulty)}</h4>
              {filteredScores.length === 0 ? (
                <p className="text-center text-white/70 py-2">{t('noScores')}</p>
              ) : (
                <ol className="space-y-2">
                  {filteredScores.map((entry, index) => (
                    <li key={index} className={`flex items-center justify-between p-2 rounded-md ${index < 3 ? 'bg-yellow-500/30' : 'bg-black/20'}`}>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg w-6 text-right">{index + 1}.</span>
                        <span className="font-bold text-white">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                         <span title={gameModeTitle[entry.gameMode]} className="hidden md:inline-block bg-white/20 px-2 py-0.5 rounded-full text-base">{gameModeDisplay[entry.gameMode]}</span>
                         <span className="bg-white/20 px-2 py-0.5 rounded-full text-lg font-black">{operationSymbols[entry.operation]}</span>
                         <span className="font-black text-xl text-yellow-300">{entry.score}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;