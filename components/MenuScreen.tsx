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
        <div className="flex flex-col items-center gap-4 animate-fade-in">
            <Leaderboard scores={leaderboard} />
            <button
                onClick={handleBackToMenu}
                className="w-full max-w-sm py-3 text-lg font-bold text-white bg-indigo-500 rounded-xl shadow-lg hover:bg-indigo-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
                {t('backToMenu')}
            </button>
        </div>
    );
  }
  
  const SelectionButton: React.FC<{onClick: () => void; isSelected: boolean; children: React.ReactNode; className?: string}> = ({ onClick, isSelected, children, className }) => (
    <button
      onClick={onClick}
      className={`w-full py-2.5 px-2 text-base font-bold rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-white/50 border
      ${isSelected 
        ? 'bg-white text-blue-700 scale-105 border-white/75' 
        : 'bg-white/10 text-white hover:bg-white/20 border-white/50'} 
      ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-5 animate-fade-in">
      
      <div className="w-full">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider text-center mb-3">{t('chooseGameMode')}</h2>
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2.5">
          {gameModes.map(m => (
            <SelectionButton
              key={m}
              onClick={() => { playButtonSound(); setSelectedGameMode(m); }}
              isSelected={selectedGameMode === m}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">{gameModeIcons[m]}</span>
                <span>{gameModeDisplay[m]}</span>
              </div>
            </SelectionButton>
          ))}
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider text-center mb-3">{t('chooseDifficulty')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {difficulties.map(d => (
            <SelectionButton
              key={d}
              onClick={() => { playButtonSound(); setSelectedDifficulty(d); }}
              isSelected={selectedDifficulty === d}
            >
              {difficultyDisplay[d]}
            </SelectionButton>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider text-center mb-3">{t('chooseOperation')}</h2>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {operations.map(o => (
             <button
              key={o}
              onClick={() => { playButtonSound(); setSelectedOperation(o); }}
              className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl font-black rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-white/50 border
              ${selectedOperation === o 
                ? 'bg-white text-blue-700 scale-105 border-white/75' 
                : 'bg-white/10 text-white hover:bg-white/20 border-white/50'}`}
            >
              {operationSymbols[o]}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-3 mt-2">
        <button
            onClick={handleStart}
            disabled={!selectedOperation || !selectedDifficulty || !selectedGameMode}
            className="w-full py-3 text-xl font-bold text-green-900 bg-green-400 rounded-xl shadow-lg hover:bg-green-500 transition-colors duration-200 ease-in-out disabled:bg-slate-500/40 disabled:text-white/60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-green-300"
        >
            {t('startGame')}
        </button>
        <button
            onClick={handleShowLeaderboard}
            className="w-full py-3 text-lg font-bold text-white bg-indigo-500 rounded-xl shadow-lg hover:bg-indigo-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
            {t('viewLeaderboard')}
        </button>
      </div>
    </div>
  );
};

export default MenuScreen;
