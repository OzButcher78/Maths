export type Difficulty = 'easy' | 'medium' | 'hard' | 'ai';
export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'random';
export type GameState = 'menu' | 'playing' | 'gameOver' | 'stats' | 'rules' | 'about' | 'privacy' | 'multiplicationSetup' | 'scoring';
export type GameMode = 'regular' | 'timeAttack';

export type MultiplicationTableOption = number[];

export interface Question {
  num1: number;
  num2: number;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  operator: 'x' | '÷' | '+' | '-';
  answer: number;
}

export interface ScoreEntry {
  name: string;
  score: number;
  difficulty: Difficulty;
  operation: Operation;
  gameMode: GameMode;
}

export type PerformanceStats = {
  [key in Operation]?: {
    correct: number;
    total: number;
  };
};