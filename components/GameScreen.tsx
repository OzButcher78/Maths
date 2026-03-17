
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
import ConfettiEffect from './ConfettiEffect';
import FloatingScore from './FloatingScore';
import WizardAvatar from './WizardAvatar';

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
  playTickSound: () => void;
  lastPoints?: number | null;
  showPointsPopup?: boolean;
  onPopupComplete?: () => void;
  timerTotal?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ question, score, lives, streak, isBonusActive, onAnswerSubmit, answerFeedback, showWrongAnswerOverlay, playButtonSound, gameMode, timer, justLostLife, multiplier, playTickSound, lastPoints = null, showPointsPopup = false, onPopupComplete = () => {}, timerTotal = 60 }) => {
  const [answer, setAnswer] = useState('');
  const [triggerConfetti, setTriggerConfetti] = useState(false);
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

  useEffect(() => {
    if (answerFeedback === 'correct') {
      setTriggerConfetti(true);
      const t = setTimeout(() => setTriggerConfetti(false), 50);
      return () => clearTimeout(t);
    }
  }, [answerFeedback]);

  return (
    <div className="relative flex flex-col items-center gap-4 text-center animate-fade-in">
      <ConfettiEffect trigger={triggerConfetti} />
      <FloatingScore amount={lastPoints} visible={showPointsPopup} onComplete={onPopupComplete} />
       {showWrongAnswerOverlay && (
        <div className="absolute inset-0 bg-red-500/95 backdrop-blur-sm rounded-3xl flex flex-col items-center z-20 animate-fade-in p-6">
            <div className="mt-8 md:mt-12 flex flex-col items-center gap-2">
                <WizardAvatar state="dizzy" size={130} />
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

      {gameMode === 'timeAttack' && (
        <div className="w-full px-1">
          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timer / timerTotal > 0.6
                  ? 'bg-green-400'
                  : timer / timerTotal > 0.3
                  ? 'bg-yellow-400'
                  : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${Math.max(0, (timer / timerTotal) * 100)}%` }}
            />
          </div>
        </div>
      )}

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

      <div className="w-full max-w-xs flex justify-center items-center mt-4 h-12 px-2">
        <StreakIndicator streak={streak} isBonusActive={isBonusActive} />
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
