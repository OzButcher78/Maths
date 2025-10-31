import React, { useState } from 'react';
import { ScoreEntry, Difficulty } from '../types';
import Leaderboard from './Leaderboard';
import { useLocalization } from '../context/LocalizationContext';

interface GameOverScreenProps {
  score: number;
  leaderboard: ScoreEntry[];
  onAddToLeaderboard: (name: string) => Promise<string>;
  onPlayAgain: () => void;
  onShowStats: () => void;
  difficulty: Difficulty | null;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, leaderboard, onAddToLeaderboard, onPlayAgain, onShowStats, difficulty }) => {
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

  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in">
      <h2 className="text-5xl font-black text-yellow-300">{t('gameOver')}</h2>
      <p className="text-2xl">{t('finalScore')}</p>
      <p className="text-7xl font-black">{score}</p>
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 items-center mt-4">
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

      <div className="w-full mt-6">
        <Leaderboard scores={leaderboard} />
      </div>

      <div className="w-full max-w-sm mt-6 flex flex-col gap-3">
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