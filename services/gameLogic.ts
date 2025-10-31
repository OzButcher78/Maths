import { Difficulty, Operation, Question } from '../types';

const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateQuestion = (difficulty: Difficulty, operation: Operation, questionCount?: number): Question => {
  let currentOperation = operation;
  if (operation === 'random') {
    const availableOps: ('addition' | 'subtraction' | 'multiplication' | 'division')[] = ['addition', 'subtraction', 'multiplication', 'division'];
    currentOperation = availableOps[Math.floor(Math.random() * availableOps.length)];
  }

  let num1: number, num2: number, answer: number;

  let r; // The range object for number generation

  if (difficulty === 'ai' && typeof questionCount === 'number') {
    // AI mode uses a tiered progression based on the number of questions answered
    if (questionCount <= 10) { // Tier 1: Very Easy
        r = { add: [1, 9], sub: [1, 9], mul: [1, 5], div: { result: [1, 5], num2: [1, 5] } };
    } else if (questionCount <= 20) { // Tier 2: Easy
        r = { add: [10, 25], sub: [10, 25], mul: [2, 10], div: { result: [2, 10], num2: [2, 10] } };
    } else if (questionCount <= 30) { // Tier 3: Medium
        r = { add: [25, 50], sub: [25, 50], mul: [3, 12], div: { result: [3, 12], num2: [3, 12] } };
    } else if (questionCount <= 40) { // Tier 4: Hard
        r = { add: [50, 100], sub: [50, 100], mul: [5, 15], div: { result: [5, 15], num2: [5, 15] } };
    } else { // Tier 5: Very Hard
        r = { add: [50, 200], sub: [50, 200], mul: [10, 25], div: { result: [5, 25], num2: [5, 25] } };
    }
  } else {
    // Standard modes use fixed ranges
    const standardRanges = {
        easy: { add: [1, 9], sub: [1, 9], mul: [1, 9], div: { result: [1, 9], num2: [1, 9] } },
        medium: { add: [10, 100], sub: [10, 100], mul: [2, 12], div: { result: [2, 12], num2: [2, 12] } },
        hard: { add: [50, 200], sub: [50, 200], mul: [10, 25], div: { result: [5, 25], num2: [5, 25] } },
        ai: { add: [1, 9], sub: [1, 9], mul: [1, 5], div: { result: [1, 5], num2: [1, 5] } }, // Fallback for AI if no questionCount
    };
    r = standardRanges[difficulty];
  }


  switch (currentOperation) {
    case 'addition':
      num1 = randomNumber(r.add[0], r.add[1]);
      num2 = randomNumber(r.add[0], r.add[1]);
      answer = num1 + num2;
      return { num1, num2, operation: 'addition', operator: '+', answer };
    
    case 'subtraction':
      num1 = randomNumber(r.sub[0], r.sub[1]);
      num2 = randomNumber(r.sub[0], num1); // Ensure num2 is not greater than num1
      answer = num1 - num2;
      return { num1, num2, operation: 'subtraction', operator: '-', answer };

    case 'multiplication':
      num1 = randomNumber(r.mul[0], r.mul[1]);
      num2 = randomNumber(r.mul[0], r.mul[1]);
      answer = num1 * num2;
      return { num1, num2, operation: 'multiplication', operator: 'x', answer };

    case 'division':
      const result = randomNumber(r.div.result[0], r.div.result[1]);
      num2 = randomNumber(r.div.num2[0], r.div.num2[1]);
      if (num2 === 0) num2 = 1; // Safeguard against division by zero
      num1 = result * num2;
      answer = result;
      return { num1, num2, operation: 'division', operator: '÷', answer };
    
    default:
        // Fallback to addition in an unlikely edge case
        num1 = randomNumber(r.add[0], r.add[1]);
        num2 = randomNumber(r.add[0], r.add[1]);
        answer = num1 + num2;
        return { num1, num2, operation: 'addition', operator: '+', answer };
  }
};