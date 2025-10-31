import React, { useState } from 'react';
import { Difficulty, Operation, ScoreEntry, GameMode } from '../types';
import Leaderboard from './Leaderboard';
import { useLocalization } from '../context/LocalizationContext';

interface MenuScreenProps {
  onStartGame: (difficulty: Difficulty, operation: Operation, gameMode: GameMode) => void;
  playButtonSound: () => void;
  leaderboard: ScoreEntry[];
}

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'ai'];
const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division', 'random'];
const gameModes: GameMode[] = ['regular', 'timeAttack', 'beatTheClock'];

const operationSymbols = {
    addition: '+',
    subtraction: '-',
    multiplication: 'x',
    division: '÷',
    random: '?',
};

const gameModeIcons: Record<GameMode, string> = {
    regular: '🏆',
    timeAttack: '⏱️',
    beatTheClock: '⏳',
};

const MenuScreen: React.FC<MenuScreenProps> = ({ onStartGame, playButtonSound, leaderboard }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { t } = useLocalization();

  const handleStart = () => {
    playButtonSound();
    if (selectedDifficulty && selectedOperation && selectedGameMode) {
      onStartGame(selectedDifficulty, selectedOperation, selectedGameMode);
    }
  };

  const handleShowLeaderboard = () => {
      playButtonSound();
      setShowLeaderboard(true);
  }

  const handleBackToMenu = () => {
      playButtonSound();
      setShowLeaderboard(false);
  }

  const difficultyDisplay = {
    easy: t('easy'),
    medium: t('medium'),
    hard: t('hard'),
    ai: t('ai'),
  };

  const gameModeDisplay = {
    regular: t('regular'),
    timeAttack: t('timeAttack'),
    beatTheClock: t('beatTheClock'),
  };

  if (showLeaderboard) {
    return (
        <div className="flex flex-col items-center gap-6 animate-fade-in">
            <Leaderboard scores={leaderboard} />
            <button
                onClick={handleBackToMenu}
                className="w-full max-w-xs py-3 text-xl font-bold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
                {t('backToMenu')}
            </button>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      
      <div className="w-full">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4">{t('chooseGameMode')}</h2>
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
          {gameModes.map(m => (
            <button
              key={m}
              onClick={() => { playButtonSound(); setSelectedGameMode(m); }}
              className={`flex flex-row items-center justify-center w-full py-2 sm:py-3 px-2 text-sm sm:text-base font-bold rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 text-center
              ${selectedGameMode === m ? 'bg-yellow-400 text-indigo-800 scale-105 ring-yellow-300' : 'bg-white/30 text-white hover:bg-white/50'}`}
            >
              <span className="text-lg mr-2">{gameModeIcons[m]}</span>
              <span>{gameModeDisplay[m]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4">{t('chooseDifficulty')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => { playButtonSound(); setSelectedDifficulty(d); }}
              className={`w-full py-3 px-4 text-xl font-bold rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50
              ${selectedDifficulty === d ? 'bg-yellow-400 text-indigo-800 scale-105 ring-yellow-300' : 'bg-white/30 text-white hover:bg-white/50'}`}
            >
              {difficultyDisplay[d]}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4">{t('chooseOperation')}</h2>
        <div className="grid grid-cols-5 gap-3">
          {operations.map(o => (
            <button
              key={o}
              onClick={() => { playButtonSound(); setSelectedOperation(o); }}
              className={`w-full py-4 text-3xl font-black rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50
              ${selectedOperation === o ? 'bg-yellow-400 text-indigo-800 scale-105 ring-yellow-300' : 'bg-white/30 text-white hover:bg-white/50'}`}
            >
              {operationSymbols[o]}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-3">
        <button
            onClick={handleStart}
            disabled={!selectedOperation || !selectedDifficulty || !selectedGameMode}
            className="w-full py-4 text-2xl font-black text-white bg-green-500 rounded-xl shadow-lg hover:bg-green-600 transition-transform duration-200 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50"
        >
            {t('startGame')}
        </button>
        <button
            onClick={handleShowLeaderboard}
            className="w-full py-3 text-xl font-bold text-white bg-indigo-500 rounded-xl shadow-lg hover:bg-indigo-600 transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
            {t('viewLeaderboard')}
        </button>
      </div>
    </div>
  );
};

export default MenuScreen;