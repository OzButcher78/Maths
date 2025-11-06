

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, Operation, GameState, Question, ScoreEntry, GameMode, PerformanceStats, MultiplicationTableOption } from './types';
import { INITIAL_LIVES, POINTS_CORRECT, POINTS_INCORRECT, STREAK_BONUSES, TIME_ATTACK_DURATION, SPLASH_MESSAGES, SCORE_MULTIPLIERS, MULTIPLICATION_ROW_POINTS, MULTIPLICATION_ROW_SCORES } from './constants';
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
import MultiplicationSetupScreen from './components/MultiplicationSetupScreen';
import ScoringPage from './components/ScoringPage';
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
  const [isBonusActive, setIsBonusActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>(initialStats);
  const [splashData, setSplashData] = useState<{ messageKey: string; count?: number } | null>(null);
  const [justLostLife, setJustLostLife] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  
  const [pendingGameMode, setPendingGameMode] = useState<GameMode | null>(null);
  const [multiplicationTable, setMultiplicationTable] = useState<MultiplicationTableOption | null>(null);

  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { t } = useLocalization();
  const { playCorrectSound, playIncorrectSound, playStreakSound, playGameOverSound, playButtonPressSound, playSplashScreenSound, unlockAudio, playMultiplierSound, playMilestoneSound, playTickSound } = useSounds();

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
    if (gameState === 'playing' && gameMode === 'timeAttack') {
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
    setIsBonusActive(false);
    setQuestionCount(0);
    setAnswerFeedback(null);
    setPerformanceStats(initialStats);
    setSplashData(null);
    setShowWrongAnswerOverlay(false);
    setJustLostLife(false);
    setCurrentMultiplier(1);
    setMultiplicationTable(null);
    clearTimer();
  }, []);

  const startGame = useCallback((selectedDifficulty: Difficulty | null, selectedOperation: Operation, selectedGameMode: GameMode, selectedMultiplicationTable: MultiplicationTableOption | null) => {
    unlockAudio();
    resetGame();
    setDifficulty(selectedDifficulty);
    setOperation(selectedOperation);
    setGameMode(selectedGameMode);
    setMultiplicationTable(selectedMultiplicationTable);
    
    if (selectedDifficulty) {
      const initialMultiplier = SCORE_MULTIPLIERS[selectedDifficulty] || 1;
      setCurrentMultiplier(initialMultiplier);
    } else {
      setCurrentMultiplier(1);
    }

    const isAiMode = selectedDifficulty === 'ai';
    const firstQuestionCount = isAiMode ? 1 : 0;
    setQuestionCount(1);
    
    if (selectedGameMode === 'timeAttack') setTimer(TIME_ATTACK_DURATION);

    setQuestion(generateQuestion(selectedDifficulty, selectedOperation, firstQuestionCount, selectedMultiplicationTable, null));

    setGameState('playing');
  }, [resetGame, unlockAudio]);

  const handleGameSelection = (selectedOperation: Operation, selectedDifficulty: Difficulty | null, selectedGameMode: GameMode) => {
    playButtonPressSound();
    if (selectedOperation === 'multiplication') {
        setPendingGameMode(selectedGameMode);
        setGameState('multiplicationSetup');
    } else if (selectedDifficulty) {
        startGame(selectedDifficulty, selectedOperation, selectedGameMode, null);
    }
  };

  const handleStartMultiplicationGame = (tables: MultiplicationTableOption) => {
    if (pendingGameMode) {
       startGame(null, 'multiplication', pendingGameMode, tables);
       setPendingGameMode(null);
    }
  };

  const showSplashScreen = (messages: string[], count?: number) => {
    const messageKey = messages[Math.floor(Math.random() * messages.length)];
    setSplashData({ messageKey, count });
    playSplashScreenSound();
    setTimeout(() => setSplashData(null), 1500);
  };

  const handleAnswer = (userAnswer: number) => {
    if (!question || !operation || !gameMode) return;
    
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
        let newMultiplier = 1;
        for(const tier of tiers) {
            if(questionCount >= tier) {
                newMultiplier = SCORE_MULTIPLIERS.ai_tiers[tier];
            }
        }

        if (newMultiplier !== currentMultiplier) {
            playMultiplierSound();
        }

        multiplier = newMultiplier;
        setCurrentMultiplier(multiplier);
    }


    if (isCorrect) {
      setAnswerFeedback('correct');
      playCorrectSound();
      if (gameMode === 'timeAttack') {
        setTimer(prev => prev + 2);
      }
      const newStreak = streak + 1;
      let bonusPoints = 0;
      const streakBonus = STREAK_BONUSES.find(b => b.streak === newStreak);
      const maxStreak = STREAK_BONUSES.length > 0 ? Math.max(...STREAK_BONUSES.map(b => b.streak)) : 0;
      
      if (streakBonus) {
          playStreakSound();
          bonusPoints = streakBonus.bonus;
          setIsBonusActive(true);
          setTimeout(() => setIsBonusActive(false), 1000);
      }

      let pointsToAdd = 0;
      if (operation === 'multiplication' && difficulty === null) {
        let basePoints = 1; // Default points
        if (MULTIPLICATION_ROW_POINTS.easy.includes(question.num1)) {
          basePoints = MULTIPLICATION_ROW_SCORES.easy;
        } else if (MULTIPLICATION_ROW_POINTS.medium.includes(question.num1)) {
          basePoints = MULTIPLICATION_ROW_SCORES.medium;
        } else if (MULTIPLICATION_ROW_POINTS.hard.includes(question.num1)) {
          basePoints = MULTIPLICATION_ROW_SCORES.hard;
        }
        pointsToAdd = basePoints + bonusPoints;
      } else {
        pointsToAdd = (POINTS_CORRECT + bonusPoints) * multiplier;
      }

      setScore(score + pointsToAdd);

      if (maxStreak > 0 && newStreak >= maxStreak) {
        setStreak(0);
      } else {
        setStreak(newStreak);
      }
      
      const isStreakMilestone = !!streakBonus;
      const isProgressMilestone = (questionCount + 1) % 10 === 0 && (questionCount + 1) > 0;
      
      if (isStreakMilestone) {
        showSplashScreen(SPLASH_MESSAGES.streak);
        splashScreenWillShow = true;
      } else if (isProgressMilestone) {
        // Prevent showing progress splash if a streak splash is imminent on the next question.
        const willHitStreakMilestoneNext = STREAK_BONUSES.some(b => b.streak === newStreak + 1);
        if (!willHitStreakMilestoneNext) {
          playMilestoneSound();
          showSplashScreen(SPLASH_MESSAGES.progress, questionCount + 1);
          splashScreenWillShow = true;
        }
      }

    } else {
      setAnswerFeedback('incorrect');
      setShowWrongAnswerOverlay(true);
      playIncorrectSound();
      setScore(Math.max(0, score + (POINTS_INCORRECT * (operation === 'multiplication' && difficulty === null ? 1 : multiplier))));
      setStreak(0);
      
      if (gameMode === 'timeAttack') {
        setTimer(prev => Math.max(0, prev - 2));
      }

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
    }
    
    setQuestionCount(prev => prev + 1);
    
    const delay = splashScreenWillShow ? 1500 : (isCorrect ? 500 : 500);

    setTimeout(() => {
        const nextQCountForAI = difficulty === 'ai' ? questionCount + 1 : undefined;
        setQuestion(generateQuestion(difficulty, question.operation as Operation, nextQCountForAI, multiplicationTable, question));
        setAnswerFeedback(null);
        setShowWrongAnswerOverlay(false);
    }, delay);
  };
  
  const handleAddToLeaderboard = async (name: string): Promise<string> => {
    if(!gameMode) return "Error: Game settings not found.";

    const inappropriate = await isNameInappropriate(name);
    if (inappropriate) return t('nameInappropriateError');
    
    const currentDifficulty = difficulty || 'hard'; // Default for leaderboard if multiplication
    const currentOperation = operation || 'random';

    const newEntry: ScoreEntry = { name, score, difficulty: currentDifficulty, operation: currentOperation, gameMode };
    saveLeaderboard([...leaderboard, newEntry]);
    return "Success";
  };
  
  const handlePlayAgain = () => {
    resetGame();
    setDifficulty(null);
    setOperation(null);
    setGameMode(null);
    setPendingGameMode(null);
    setGameState('menu');
  };
  
  const handleExitGame = () => {
    playButtonPressSound();
    clearTimer();
    setGameState('gameOver');
  };

  const handleShowStats = () => setGameState('stats');
  const handleBackToGameOver = () => setGameState('gameOver');

  const handleShowPage = (page: GameState) => {
    playButtonPressSound();
    setGameState(page);
  };
  
  const handleBackToMenuFromSetup = () => {
    playButtonPressSound();
    setPendingGameMode(null);
    setGameState('menu');
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'playing': {
        const allOps: Operation[] = ['addition', 'subtraction', 'multiplication', 'division', 'random'];
        const totalCorrect = allOps.reduce((sum, op) => sum + (performanceStats[op]?.correct || 0), 0);
        const totalQuestions = allOps.reduce((sum, op) => sum + (performanceStats[op]?.total || 0), 0);
        const totalIncorrect = totalQuestions - totalCorrect;

        return question && gameMode && (
          <GameScreen
            question={question}
            score={score}
            lives={lives}
            streak={streak}
            isBonusActive={isBonusActive}
            onAnswerSubmit={handleAnswer}
            answerFeedback={answerFeedback}
            showWrongAnswerOverlay={showWrongAnswerOverlay}
            playButtonSound={playButtonPressSound}
            gameMode={gameMode}
            timer={timer}
            justLostLife={justLostLife}
            multiplier={currentMultiplier}
            correctTally={totalCorrect}
            incorrectTally={totalIncorrect}
            playTickSound={playTickSound}
          />
        );
      }
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
      case 'scoring':
        return <ScoringPage onBack={handlePlayAgain} />;
      case 'about':
        return <AboutPage onBack={handlePlayAgain} />;
      case 'privacy':
        return <PrivacyPage onBack={handlePlayAgain} />;
      case 'multiplicationSetup':
        return <MultiplicationSetupScreen onStart={handleStartMultiplicationGame} onBack={handleBackToMenuFromSetup} playButtonSound={playButtonPressSound} />;
      case 'menu':
      default:
        return <MenuScreen onStartGame={handleGameSelection} playButtonSound={playButtonPressSound} leaderboard={leaderboard} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-400 to-blue-600 min-h-screen text-white flex flex-col items-center justify-center sm:p-4">
      {splashData && <SplashScreen message={splashData.count ? t(splashData.messageKey).replace('{count}', splashData.count.toString()) : t(splashData.messageKey)} />}
      <div className="w-full max-w-lg mx-auto sm:p-8 bg-white/10 backdrop-blur-xl sm:rounded-3xl sm:shadow-2xl sm:border sm:border-white/20 flex flex-col justify-between min-h-screen sm:min-h-0 sm:h-auto">
        <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
                <h1 className="text-4xl sm:text-5xl md:text-5xl font-black text-center mb-4 text-white drop-shadow-lg">
                {t('gameTitle')}
                </h1>
                <div className="flex-grow flex flex-col justify-center">
                    {renderGameState()}
                </div>
            </div>
            <footer className="pt-4 text-center">
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
                    <button onClick={() => handleShowPage('scoring')} className="hover:underline">{t('scoring')}</button>
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
      </div>
    </div>
  );
}

export default App;