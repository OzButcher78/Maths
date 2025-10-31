export const INITIAL_LIVES = 3;
export const POINTS_CORRECT = 2;
export const POINTS_INCORRECT = -2;

export const STREAK_BONUSES = [
  { streak: 3, bonus: 2 },
  { streak: 6, bonus: 4 },
  { streak: 10, bonus: 6 }
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
    medium: 1.5,
    hard: 2,
    ai: 1, // Base multiplier for AI
    ai_tiers: { // Multiplier increases based on question count
        1: 1,
        21: 1.5,
        41: 2
    }
};


// Game Mode Constants
export const TIME_ATTACK_DURATION = 60; // seconds
export const BEAT_THE_CLOCK_START_TIME = 30; // seconds
export const BEAT_THE_CLOCK_ADD_TIME = 2; // seconds added for correct answer
export const BEAT_THE_CLOCK_SUBTRACT_TIME = 3; // seconds subtracted for incorrect answer

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