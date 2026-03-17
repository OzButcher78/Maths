
import React, { useState } from 'react';
import { ScoreEntry, Difficulty, GameMode, PerformanceStats, Operation } from '../types';
import Leaderboard from './Leaderboard';
import { useLocalization } from '../context/LocalizationContext';
import PlayIcon from './icons/PlayIcon';
import ThumbsUpIcon from './icons/ThumbsUpIcon';
import WizardAvatar from './WizardAvatar';

interface GameOverScreenProps {
  score: number;
  leaderboard: ScoreEntry[];
  onAddToLeaderboard: (name: string) => Promise<string>;
  onPlayAgain: () => void;
  onShowStats: () => void;
  difficulty: Difficulty | null;
  gameMode: GameMode | null;
  stats: PerformanceStats;
  gameOverReason: 'lives' | 'timeout' | 'exit';
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, leaderboard, onAddToLeaderboard, onPlayAgain, onShowStats, difficulty, gameMode, stats, gameOverReason }) => {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLocalization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError(t('nameValidationError'));
      return;
    }
    setError('');
    const result = await onAddToLeaderboard(name);
    if (result === 'Success') {
      setSubmitted(true);
    } else {
      setError(result);
    }
  };

  const allOps: Operation[] = ['addition', 'subtraction', 'multiplication', 'division', 'random'];
  const totalQuestions = allOps.reduce((sum, op) => sum + (stats[op]?.total || 0), 0);
  const totalCorrect = allOps.reduce((sum, op) => sum + (stats[op]?.correct || 0), 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const wizardState = gameOverReason === 'lives' ? 'die' : gameOverReason === 'timeout' ? 'attack2' : 'idle';

  return (
    <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
      <h2 className="text-3xl font-black text-yellow-300">{t('gameOver')}</h2>

      {/* Score centred, wizard anchored to the left */}
      <div className="w-full flex items-center">
        <div className="flex-none"><WizardAvatar state={wizardState} size={130} /></div>
        <div className="flex-1 flex flex-col items-center">
          <p className="text-base opacity-80">{t('finalScore')}</p>
          <p className="text-5xl md:text-6xl font-black">{score}</p>
        </div>
        <div className="flex-none" style={{ width: 130 }} />
      </div>

      {/* Summary box */}
      <div className="w-full max-w-sm bg-black/20 p-2 rounded-xl">
        <h3 className="text-sm font-bold mb-1">{t('gameSummary')}</h3>
        <div className="flex justify-around text-center">
          {gameMode === 'regular' && (
            <div>
              <p className="text-2xl font-bold">{accuracy}%</p>
              <p className="text-xs opacity-80">{t('accuracy')}</p>
            </div>
          )}
          {gameMode === 'timeAttack' && (
            <>
              <div>
                <p className="text-2xl font-bold">{totalQuestions}</p>
                <p className="text-xs opacity-80">{t('questionsAnswered')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{totalCorrect}</p>
                <p className="text-xs opacity-80">{t('correctAnswers')}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Name form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-2 items-center">
          <p className="text-base">{t('enterNamePrompt')}</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={15}
            className="w-full text-center text-xl p-1.5 rounded-lg bg-white/90 text-blue-800 placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-yellow-400"
            placeholder={t('namePlaceholder')}
          />
          {error && <p className="text-red-300 font-bold text-sm">{error}</p>}
          <div className="w-full grid grid-cols-2 gap-2">
            <button
              type="submit"
              className="py-2.5 text-base font-bold text-white bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg hover:from-yellow-500 hover:to-orange-600 transition-all focus:outline-none focus:ring-4 focus:ring-yellow-300 flex items-center justify-center gap-1"
            >
              {t('submitScore')}
              <ThumbsUpIcon />
            </button>
            <button
              type="button"
              onClick={onPlayAgain}
              className="py-2.5 text-base font-bold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center justify-center gap-1"
            >
              {t('playAgain')}
              <PlayIcon />
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-3">
          <p className="text-base font-bold text-green-300">{t('scoreAdded')}</p>
          <button
            onClick={onPlayAgain}
            className="py-2 px-4 text-base font-bold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center gap-1"
          >
            {t('playAgain')}
            <PlayIcon />
          </button>
        </div>
      )}

      <div className="w-full">
        <Leaderboard scores={leaderboard} />
      </div>

      {difficulty === 'ai' && (
        <button
          onClick={onShowStats}
          className="w-full max-w-sm py-2.5 text-base font-bold text-white bg-sky-500 rounded-lg shadow-lg hover:bg-sky-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300"
        >
          {t('aiStats')}
        </button>
      )}
    </div>
  );
};

export default GameOverScreen;
