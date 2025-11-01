import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, Operation, GameState, Question, ScoreEntry, GameMode, PerformanceStats } from './types';
import { INITIAL_LIVES, POINTS_CORRECT, POINTS_INCORRECT, STREAK_BONUSES, TIME_ATTACK_DURATION, BEAT_THE_CLOCK_START_TIME, BEAT_THE_CLOCK_ADD_TIME, BEAT_THE_CLOCK_SUBTRACT_TIME, SPLASH_MESSAGES, SCORE_MULTIPLIERS } from './constants';
import { generateQuestion } from './services/gameLogic';
import { isNameInappropriate } from './services/geminiService';
import MenuScreen from './components/MenuScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import StatsScreen from './components/StatsScreen';
import RulesPage from './components/RulesPage';
import AboutPage from './components/AboutPage';
import PrivacyPage from './components/PrivacyPage';
import LanguageSelector from './components/LanguageSelector';
import SplashScreen from './components/SplashScreen';
import useSounds from './hooks/useSounds';
import { useLocalization } from './context/LocalizationContext';

const initialStats: PerformanceStats = {
  addition: { correct: 0, total: 0 },
  subtraction: { correct: 0, total: 0 },
  multiplication: { correct: 0, total: 0 },
  division: { correct: 0, total: 0 },
  random: { correct: 0, total: 0 },
};

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showWrongAnswerOverlay, setShowWrongAnswerOverlay] = useState(false);

  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [lastBonus, setLastBonus] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>(initialStats);
  const [splashData, setSplashData] = useState<{ messageKey: string; count?: number } | null>(null);
  const [justLostLife, setJustLostLife] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { t } = useLocalization();
  const { playCorrectSound, playIncorrectSound, playStreakSound, playGameOverSound, playButtonPressSound, playSplashScreenSound, unlockAudio } = useSounds();

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('mathWhizLeaderboard');
      if (savedScores) {
        setLeaderboard(JSON.parse(savedScores));
      }
    } catch (error) {
      console.error("Failed to load leaderboard from localStorage", error);
      setLeaderboard([]);
    }
  }, []);
  
  const clearTimer = () => {
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && (gameMode === 'timeAttack' || gameMode === 'beatTheClock')) {
        timerIntervalRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearTimer();
                    playGameOverSound();
                    setGameState('gameOver');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    return () => clearTimer();
  }, [gameState, gameMode, playGameOverSound]);


  const saveLeaderboard = (newLeaderboard: ScoreEntry[]) => {
    try {
      const sorted = newLeaderboard.sort((a, b) => b.score - a.score).slice(0, 20);
      setLeaderboard(sorted);
      localStorage.setItem('mathWhizLeaderboard', JSON.stringify(sorted));
    } catch (error) {
      console.error("Failed to save leaderboard to localStorage", error);
    }
  };

  const resetGame = useCallback(() => {
    setLives(INITIAL_LIVES);
    setScore(0);
    setStreak(0);
    setLastBonus(null);
    setQuestionCount(0);
    setAnswerFeedback(null);
    setPerformanceStats(initialStats);
    setSplashData(null);
    setShowWrongAnswerOverlay(false);
    setJustLostLife(false);
    setCurrentMultiplier(1);
    clearTimer();
  }, []);

  const startGame = useCallback((selectedDifficulty: Difficulty, selectedOperation: Operation, selectedGameMode: GameMode) => {
    unlockAudio();
    resetGame();
    setDifficulty(selectedDifficulty);
    setOperation(selectedOperation);
    setGameMode(selectedGameMode);
    
    const initialMultiplier = SCORE_MULTIPLIERS[selectedDifficulty] || 1;
    setCurrentMultiplier(initialMultiplier);

    const isAiMode = selectedDifficulty === 'ai';
    const firstQuestionCount = isAiMode ? 1 : 0;
    setQuestionCount(1);
    
    if (selectedGameMode === 'timeAttack') setTimer(TIME_ATTACK_DURATION);
    if (selectedGameMode === 'beatTheClock') setTimer(BEAT_THE_CLOCK_START_TIME);

    setQuestion(generateQuestion(selectedDifficulty, selectedOperation, firstQuestionCount));

    setGameState('playing');
  }, [resetGame, unlockAudio]);

  const showSplashScreen = (messages: string[], count?: number) => {
    const messageKey = messages[Math.floor(Math.random() * messages.length)];
    setSplashData({ messageKey, count });
    playSplashScreenSound();
    setTimeout(() => setSplashData(null), 1500);
  };

  const handleAnswer = (userAnswer: number) => {
    if (!question || !operation || !difficulty || !gameMode) return;
    
    setLastBonus(null);
    const isCorrect = userAnswer === question.answer;

    setPerformanceStats(prevStats => {
        const op = question.operation;
        const newOpStats = {
            total: prevStats[op].total + 1,
            correct: prevStats[op].correct + (isCorrect ? 1 : 0)
        };
        return { ...prevStats, [op]: newOpStats };
    });
    
    let splashScreenWillShow = false;
    
    let multiplier = currentMultiplier;
    if(difficulty === 'ai') {
        const tiers = Object.keys(SCORE_MULTIPLIERS.ai_tiers).map(Number).sort((a,b) => a-b);
        for(const tier of tiers) {
            if(questionCount >= tier) {
                multiplier = SCORE_MULTIPLIERS.ai_tiers[tier];
            }
        }
        setCurrentMultiplier(multiplier);
    }


    if (isCorrect) {
      setAnswerFeedback('correct');
      playCorrectSound();
      const newStreak = streak + 1;
      let bonusPoints = 0;
      const streakBonus = STREAK_BONUSES.find(b => b.streak === newStreak);
      
      if (streakBonus) {
          playStreakSound();
          bonusPoints = streakBonus.bonus;
          setLastBonus(`+${bonusPoints} ${t('streakBonus')}`);
      }

      setScore(score + (POINTS_CORRECT + bonusPoints) * multiplier);
      setStreak(newStreak);
      if(gameMode === 'beatTheClock') setTimer(t => t + BEAT_THE_CLOCK_ADD_TIME);
      
      const isStreakMilestone = newStreak === 5 || newStreak === 10 || newStreak === 15;
      const isProgressMilestone = (questionCount + 1) % 10 === 0 && (questionCount + 1) > 0;
      
      if (isStreakMilestone) {
        showSplashScreen(SPLASH_MESSAGES.streak);
        splashScreenWillShow = true;
      } else if (isProgressMilestone) {
        // Prevent showing progress splash if a streak splash is imminent on the next question.
        const willHitStreakMilestoneNext = (newStreak + 1) === 5 || (newStreak + 1) === 10 || (newStreak + 1) === 15;
        if (!willHitStreakMilestoneNext) {
          showSplashScreen(SPLASH_MESSAGES.progress, questionCount + 1);
          splashScreenWillShow = true;
        }
      }

    } else {
      setAnswerFeedback('incorrect');
      setShowWrongAnswerOverlay(true);
      playIncorrectSound();
      setScore(Math.max(0, score + (POINTS_INCORRECT * multiplier)));
      setStreak(0);
      
      if (gameMode === 'regular') {
        const newLives = lives - 1;
        setLives(newLives);
        setJustLostLife(true);
        setTimeout(() => setJustLostLife(false), 2000);
        if (newLives <= 0) {
            playGameOverSound();
            setGameState('gameOver');
            return;
        }
      }
      if (gameMode === 'beatTheClock') {
          setTimer(t => Math.max(0, t - BEAT_THE_CLOCK_SUBTRACT_TIME));
      }
    }
    
    setQuestionCount(prev => prev + 1);
    
    const delay = splashScreenWillShow ? 1500 : (isCorrect ? 500 : 500);

    setTimeout(() => {
        const nextQCountForAI = difficulty === 'ai' ? questionCount + 1 : undefined;
        setQuestion(generateQuestion(difficulty, operation, nextQCountForAI));
        setAnswerFeedback(null);
        setShowWrongAnswerOverlay(false);
    }, delay);
  };
  
  const handleAddToLeaderboard = async (name: string): Promise<string> => {
    if(!difficulty || !operation || !gameMode) return "Error: Game settings not found.";

    const inappropriate = await isNameInappropriate(name);
    if (inappropriate) return t('nameInappropriateError');

    const newEntry: ScoreEntry = { name, score, difficulty, operation, gameMode };
    saveLeaderboard([...leaderboard, newEntry]);
    return "Success";
  };
  
  const handlePlayAgain = () => {
    resetGame();
    setDifficulty(null);
    setOperation(null);
    setGameMode(null);
    setGameState('menu');
  };
  
  const handleExitGame = () => {
    playButtonPressSound();
    clearTimer();
    handlePlayAgain();
  };

  const handleShowStats = () => setGameState('stats');
  const handleBackToGameOver = () => setGameState('gameOver');

  const handleShowPage = (page: GameState) => {
    playButtonPressSound();
    setGameState(page);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'playing':
        return question && gameMode && (
          <GameScreen
            question={question}
            score={score}
            lives={lives}
            streak={streak}
            lastBonus={lastBonus}
            onAnswerSubmit={handleAnswer}
            answerFeedback={answerFeedback}
            showWrongAnswerOverlay={showWrongAnswerOverlay}
            playButtonSound={playButtonPressSound}
            gameMode={gameMode}
            timer={timer}
            justLostLife={justLostLife}
            multiplier={currentMultiplier}
          />
        );
      case 'gameOver':
        return (
            <GameOverScreen 
                score={score}
                leaderboard={leaderboard}
                onAddToLeaderboard={handleAddToLeaderboard}
                onPlayAgain={handlePlayAgain}
                onShowStats={handleShowStats}
                difficulty={difficulty}
                gameMode={gameMode}
                stats={performanceStats}
            />
        );
      case 'stats':
        return <StatsScreen stats={performanceStats} onBack={handleBackToGameOver} />;
      case 'rules':
        return <RulesPage onBack={handlePlayAgain} />;
      case 'about':
        return <AboutPage onBack={handlePlayAgain} />;
      case 'privacy':
        return <PrivacyPage onBack={handlePlayAgain} />;
      case 'menu':
      default:
        return <MenuScreen onStartGame={startGame} playButtonSound={playButtonPressSound} leaderboard={leaderboard} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-400 to-blue-600 min-h-screen text-white flex flex-col items-center justify-center p-4">
      {splashData && <SplashScreen message={splashData.count ? t(splashData.messageKey).replace('{count}', splashData.count.toString()) : t(splashData.messageKey)} />}
      <main className="w-full max-w-lg mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-4 text-white drop-shadow-lg">
          {t('gameTitle')}
        </h1>
        {renderGameState()}
      </main>
      <footer className="w-full max-w-lg mx-auto pt-4 text-center">
        {gameState === 'playing' && (
             <button onClick={handleExitGame} className="bg-red-500/80 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition-colors">
                {t('exitGame')}
             </button>
        )}
        {gameState === 'menu' && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center items-center gap-2 md:gap-4 text-sm font-semibold text-white/80">
              <button onClick={() => handleShowPage('rules')} className="hover:underline">{t('rules')}</button>
              <span>&bull;</span>
              <button onClick={() => handleShowPage('about')} className="hover:underline">{t('about')}</button>
              <span>&bull;</span>
              <button onClick={() => handleShowPage('privacy')} className="hover:underline">{t('privacy')}</button>
            </div>
             <LanguageSelector />
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;
