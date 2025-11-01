import React, { useState, useEffect } from 'react';
import { Question, GameMode } from '../types';
import LifeIcon from './icons/LifeIcon';
import LostLifeIcon from './icons/LostLifeIcon';
import StarIcon from './icons/StarIcon';
import Keypad from './Keypad';
import { useLocalization } from '../context/LocalizationContext';
import { INITIAL_LIVES } from '../constants';

interface GameScreenProps {
  question: Question;
  score: number;
  lives: number;
  streak: number;
  lastBonus: string | null;
  onAnswerSubmit: (answer: number) => void;
  answerFeedback: 'correct' | 'incorrect' | null;
  showWrongAnswerOverlay: boolean;
  playButtonSound: () => void;
  gameMode: GameMode;
  timer: number;
  justLostLife: boolean;
  multiplier: number;
}

const GameScreen: React.FC<GameScreenProps> = ({ question, score, lives, streak, lastBonus, onAnswerSubmit, answerFeedback, showWrongAnswerOverlay, playButtonSound, gameMode, timer, justLostLife, multiplier }) => {
  const [answer, setAnswer] = useState('');
  const { t } = useLocalization();

  useEffect(() => {
    setAnswer('');
  }, [question]);
  
  const handleSubmit = () => {
    if (answer === '') return;
    const userAnswer = parseInt(answer, 10);
    if (!isNaN(userAnswer)) {
      onAnswerSubmit(userAnswer);
    }
  };
  
  const handleDigitClick = (digit: string) => {
    if (answer.length < 6) {
        setAnswer(answer + digit);
    }
  };
  
  const handleBackspaceClick = () => {
      setAnswer(a => a.slice(0, -1));
  };


  return (
    <div className="relative flex flex-col items-center gap-4 text-center animate-fade-in">
       {showWrongAnswerOverlay && (
        <div className="absolute inset-0 bg-red-500/70 rounded-3xl flex items-center justify-center z-10 animate-fade-in">
            <svg className="w-32 h-32 md:w-48 md:h-48 text-white" fill="none" stroke="currentColor" strokeWidth="12" viewBox="0 0 100 100">
                <line x1="10" y1="10" x2="90" y2="90" />
                <line x1="90" y1="10" x2="10" y2="90" />
            </svg>
        </div>
      )}
      
      <div className="w-full flex justify-between items-center px-4 pt-2">
        <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full">
          <StarIcon />
          <span className="text-xl md:text-2xl font-bold">{score}</span>
          {multiplier > 1 && (
            <span className="text-sm md:text-base font-bold text-yellow-300 bg-yellow-600/50 px-2 rounded-full">
              x{multiplier}
            </span>
          )}
        </div>
        {(gameMode === 'timeAttack' || gameMode === 'beatTheClock') && (
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full text-xl md:text-2xl font-bold">
                <span>⏱️</span>
                <span>{timer}</span>
            </div>
        )}
        {gameMode === 'regular' && (
            <div className="flex items-center gap-2">
                {[...Array(INITIAL_LIVES)].map((_, i) => (
                    i < lives
                        ? <LifeIcon key={i} isFlashing={justLostLife} />
                        : <LostLifeIcon key={i} />
                ))}
            </div>
        )}
      </div>
      
      <div className="bg-white/30 p-6 rounded-2xl shadow-lg w-full">
        <p className="text-5xl md:text-7xl font-black tracking-wider text-indigo-900 drop-shadow-lg">
          {question.num1} {question.operator} {question.num2}
        </p>
      </div>

      <div className="w-full max-w-xs h-16 bg-white/90 rounded-lg flex items-center justify-center">
        <span className="text-4xl font-bold text-indigo-800">{answer || '?'}</span>
      </div>
      
      <Keypad
        onDigitClick={handleDigitClick}
        onBackspaceClick={handleBackspaceClick}
        onSubmitClick={handleSubmit}
        playButtonSound={playButtonSound}
      />

      <div className="h-10 text-xl font-bold text-yellow-300">
        {streak > 1 && <span>🔥 {streak} {t('inARow')}</span>}
        {lastBonus && <span className="block animate-ping-once">{lastBonus}</span>}
      </div>
    </div>
  );
};

export default GameScreen;