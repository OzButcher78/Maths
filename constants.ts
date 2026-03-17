
export const INITIAL_LIVES = 3;
export const POINTS_CORRECT = 2;
export const POINTS_INCORRECT = -2;

export const STREAK_BONUSES = [
  { streak: 3, bonus: 1 },
  { streak: 6, bonus: 2 },
  { streak: 10, bonus: 4 },
  { streak: 15, bonus: 6 },
  { streak: 20, bonus: 10 }
];

// FIX: Updated the type definition for SCORE_MULTIPLIERS to correctly include ai_tiers as a property.
// This resolves type errors where the property was being accessed and allows for correct type inference in App.tsx.
export const SCORE_MULTIPLIERS: {
    easy: number;
    medium: number;
    hard: number;
    ai: number;
    ai_tiers: { [key: number]: number };
} = {
    easy: 1,
    medium: 2,
    hard: 3,
    ai: 1, // Base multiplier for AI
    ai_tiers: { // Multiplier increases based on question count
        1: 1.5,
        21: 2.5,
        41: 3.5
    }
};

// New scoring system for multiplication based on row difficulty
export const MULTIPLICATION_ROW_POINTS = {
  easy: [1, 2, 5, 10],
  medium: [3, 4, 6, 7, 11],
  hard: [8, 9, 12],
};

export const MULTIPLICATION_ROW_SCORES = {
  easy: 2,
  medium: 3,
  hard: 5,
};


// Game Mode Constants
export const TIME_ATTACK_DURATION = 60; // seconds
export const SPLASH_MESSAGES = {
    streak: [
        "splashStreak1",
        "splashStreak2",
        "splashStreak3",
    ],
    progress: [
        "splashProgress1",
        "splashProgress2",
        "splashProgress3",
    ]
};