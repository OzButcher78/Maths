import React, { useState } from 'react';
import { ScoreEntry, Difficulty, GameMode, PerformanceStats, Operation } from '../types';
import Leaderboard from './Leaderboard';
import { useLocalization } from '../context/LocalizationContext';

interface GameOverScreenProps {
  score: number;
  leaderboard: ScoreEntry[];
  onAddToLeaderboard: (name: string) => Promise<string>;
  onPlayAgain: () => void;
  onShowStats: () => void;
  difficulty: Difficulty | null;
  gameMode: GameMode | null;
  stats: PerformanceStats;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, leaderboard, onAddToLeaderboard, onPlayAgain, onShowStats, difficulty, gameMode, stats }) => {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLocalization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError(t('nameValidationError'));
      return;
    }
    setError('');
    setLoading(true);
    const result = await onAddToLeaderboard(name);
    setLoading(false);
    if (result === "Success") {
        setSubmitted(true);
    } else {
        setError(result);
    }
  };

  const allOps: Operation[] = ['addition', 'subtraction', 'multiplication', 'division', 'random'];
  const totalQuestions = allOps.reduce((sum, op) => sum + (stats[op]?.total || 0), 0);
  const totalCorrect = allOps.reduce((sum, op) => sum + (stats[op]?.correct || 0), 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;


  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-black text-yellow-300">{t('gameOver')}</h2>
      <p className="text-xl md:text-2xl">{t('finalScore')}</p>
      <p className="text-6xl md:text-7xl font-black">{score}</p>
      
      <div className="w-full max-w-sm bg-black/20 p-3 rounded-xl">
        <h3 className="text-xl font-bold mb-2">{t('gameSummary')}</h3>
        <div className="flex justify-around text-center">
            {gameMode === 'regular' && (
                <div>
                    <p className="text-3xl font-bold">{accuracy}%</p>
                    <p className="text-sm opacity-80">{t('accuracy')}</p>
                </div>
            )}
             {(gameMode === 'timeAttack' || gameMode === 'beatTheClock') && (
                <>
                    <div>
                        <p className="text-3xl font-bold">{totalQuestions}</p>
                        <p className="text-sm opacity-80">{t('questionsAnswered')}</p>
                    </div>
                     <div>
                        <p className="text-3xl font-bold text-green-400">{totalCorrect}</p>
                        <p className="text-sm opacity-80">{t('correctAnswers')}</p>
                    </div>
                </>
            )}
        </div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 items-center mt-2">
          <p className="text-lg">{t('enterNamePrompt')}</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={15}
            className="w-full text-center text-2xl p-2 rounded-lg bg-white/90 text-indigo-800 placeholder-indigo-400/50 focus:outline-none focus:ring-4 focus:ring-yellow-400"
            placeholder={t('namePlaceholder')}
          />
          {error && <p className="text-red-300 font-bold">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 text-xl font-bold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 disabled:bg-gray-400">
            {loading ? t('checking') : t('submitScore')}
          </button>
        </form>
      ) : (
        <p className="text-xl font-bold text-green-300">{t('scoreAdded')}</p>
      )}

      <div className="w-full mt-4">
        <Leaderboard scores={leaderboard} />
      </div>

      <div className="w-full max-w-sm mt-4 flex flex-col gap-3">
        <button onClick={onPlayAgain} className="py-3 text-xl font-bold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
          {t('playAgain')}
        </button>
        {difficulty === 'ai' && (
            <button onClick={onShowStats} className="py-3 text-xl font-bold text-white bg-purple-500 rounded-lg shadow-lg hover:bg-purple-600 transition-transform transform hover:scale-105">
                {t('aiStats')}
            </button>
        )}
      </div>
    </div>
  );
};

export default GameOverScreen;