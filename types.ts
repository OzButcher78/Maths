
export type Difficulty = 'easy' | 'medium' | 'hard' | 'ai';
export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'random';
export type GameState = 'menu' | 'playing' | 'gameOver' | 'stats' | 'rules' | 'about' | 'privacy' | 'impressum' | 'terms' | 'multiplicationSetup' | 'scoring';
export type GameMode = 'regular' | 'timeAttack';

export type MultiplicationTableOption = number[];

export interface Question {
  num1: number;
  num2: number;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  operator: 'x' | '÷' | '+' | '-';
  answer: number;
}

export interface AiTierProgress {
  tier: number;          // 1-5, current difficulty tier
  questionsInTier: number;
  correctInTier: number;
}

export interface ScoreEntry {
  name: string;
  score: number;
  difficulty: Difficulty;
  operation: Operation;
  gameMode: GameMode;
}

export interface RangeStats {
  [range: string]: { correct: number; total: number };
}

export type PerformanceStats = {
  [key in Operation]?: {
    correct: number;
    total: number;
  };
} & {
  rangeStats: RangeStats;
};
