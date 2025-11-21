
import React, { useState, useEffect } from 'react';
import { Question, GameMode } from '../types';
import LifeIcon from './icons/LifeIcon';
import LostLifeIcon from './icons/LostLifeIcon';
import StarIcon from './icons/StarIcon';
import Keypad from './Keypad';
import { useLocalization } from '../context/LocalizationContext';
import { INITIAL_LIVES } from '../constants';
import TickIcon from './icons/TickIcon';
import CrossIcon from './icons/CrossIcon';
import StreakIndicator from './StreakIndicator';

interface GameScreenProps {
  question: Question;
  score: number;
  lives: number;
  streak: number;
  isBonusActive: boolean;
  onAnswerSubmit: (answer: number) => void;
  answerFeedback: 'correct' | 'incorrect' | null;
  showWrongAnswerOverlay: boolean;
  playButtonSound: () => void;
  gameMode: GameMode;
  timer: number;
  justLostLife: boolean;
  multiplier: number;
  correctTally: number;
  incorrectTally: number;
  playTickSound: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ question, score, lives, streak, isBonusActive, onAnswerSubmit, answerFeedback, showWrongAnswerOverlay, playButtonSound, gameMode, timer, justLostLife, multiplier, correctTally, incorrectTally, playTickSound }) => {
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
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.repeat) return; // Ignore repeated events from holding key down

        if (event.key >= '0' && event.key <= '9') {
            playButtonSound();
            handleDigitClick(event.key);
        } else if (event.key === 'Backspace') {
            playButtonSound();
            handleBackspaceClick();
        } else if (event.key === 'Enter') {
            playButtonSound();
            handleSubmit();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [answer, onAnswerSubmit, playButtonSound]);

  useEffect(() => {
    if (gameMode === 'timeAttack' && timer > 0 && timer <= 10) {
      playTickSound();
    }
  }, [timer, gameMode, playTickSound]);


  return (
    <div className="relative flex flex-col items-center gap-4 text-center animate-fade-in">
       {showWrongAnswerOverlay && (
        <div className="absolute inset-0 bg-red-500/95 backdrop-blur-sm rounded-3xl flex flex-col items-center z-20 animate-fade-in p-6">
            <div className="mt-8 md:mt-12">
                <p className="text-white/80 text-xl md:text-2xl font-bold uppercase tracking-widest">
                    {t('wrongAnswer')}
                </p>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center pb-20 space-y-6">
                <p className="text-white text-5xl md:text-6xl font-bold opacity-90">
                    {question.num1} {question.operator} {question.num2}
                </p>
                <p className="text-white text-7xl md:text-9xl font-black drop-shadow-2xl">
                    = {question.answer}
                </p>
            </div>
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
        {gameMode === 'timeAttack' && (
            <div className={`flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full text-xl md:text-2xl font-bold transition-all ${timer <= 10 && timer > 0 ? 'animate-flash-red' : ''}`}>
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
        <p className="text-5xl md:text-7xl font-black tracking-wider text-blue-900 drop-shadow-lg">
          {question.num1} {question.operator} {question.num2}
        </p>
      </div>

      <div className="w-full max-w-xs h-16 bg-white/90 rounded-lg flex items-center justify-center">
        <span className="text-4xl font-bold text-blue-800">{answer || '?'}</span>
      </div>
      
      <Keypad
        onDigitClick={handleDigitClick}
        onBackspaceClick={handleBackspaceClick}
        onSubmitClick={handleSubmit}
        playButtonSound={playButtonSound}
      />

      <div className="w-full max-w-xs flex justify-between items-center mt-4 h-12 px-2">
        <StreakIndicator streak={streak} isBonusActive={isBonusActive} />
        <div className="flex items-center bg-black/20 rounded-full overflow-hidden shadow-inner border border-white/10">
            <div 
                className="flex items-center justify-center gap-1.5 px-3 py-1 bg-green-500/50" 
                title={`${correctTally} ${t('correct')}`}
            >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold text-base text-white">{correctTally}</span>
            </div>
            <div 
                className="flex items-center justify-center gap-1.5 px-3 py-1 bg-red-500/50" 
                title={`${incorrectTally} ${t('incorrect')}`}
            >
                <span className="font-bold text-base text-white">{incorrectTally}</span>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
      </div>

      <div className="h-10 flex items-center justify-center gap-4">
        {answerFeedback === 'correct' && (
            <div className="animate-fade-in">
                <TickIcon />
            </div>
        )}
        {answerFeedback === 'incorrect' && !showWrongAnswerOverlay && (
            <div className="animate-fade-in">
                <CrossIcon />
            </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
