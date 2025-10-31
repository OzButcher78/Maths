export const INITIAL_LIVES = 3;
export const POINTS_CORRECT = 2;
export const POINTS_INCORRECT = -2;

export const STREAK_BONUSES = [
  { streak: 3, bonus: 2 },
  { streak: 6, bonus: 4 },
  { streak: 10, bonus: 6 }
];

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
