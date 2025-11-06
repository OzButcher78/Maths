import { Difficulty, Operation, Question, MultiplicationTableOption } from '../types';

const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateQuestion = (difficulty: Difficulty | null, operation: Operation, questionCount?: number, multiplicationTable?: MultiplicationTableOption | null, previousQuestion?: Question | null): Question => {
  let newQuestion: Question;
  
  do {
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
          easy: { add: [1, 9], sub: [1, 9], mul: [1, 9], div: { result: [2, 5], num2: [2, 5] } },
          medium: { add: [10, 100], sub: [10, 60], mul: [2, 12], div: { result: [2, 10], num2: [2, 6] } },
          hard: { add: [50, 200], sub: [50, 200], mul: [10, 25], div: { result: [5, 20], num2: [2, 9] } },
          ai: { add: [1, 9], sub: [1, 9], mul: [1, 5], div: { result: [1, 5], num2: [1, 5] } }, // Fallback for AI if no questionCount
      };
      // Use 'easy' as a fallback if difficulty is null (like in the new multiplication mode)
      r = standardRanges[difficulty || 'easy'];
    }

    switch (currentOperation) {
      case 'addition':
        if (difficulty === 'medium') {
            num1 = randomNumber(10, 99);
            num2 = randomNumber(1, 9);
        } else {
            num1 = randomNumber(r.add[0], r.add[1]);
            num2 = randomNumber(r.add[0], r.add[1]);
        }
        answer = num1 + num2;
        newQuestion = { num1, num2, operation: 'addition', operator: '+', answer };
        break;
      
      case 'subtraction':
        if (difficulty === 'medium') {
            num1 = randomNumber(10, 99);
            num2 = randomNumber(1, 9);
        } else {
            // Existing logic for easy, hard, and AI difficulties
            num1 = randomNumber(r.sub[0], r.sub[1]);
            num2 = randomNumber(r.sub[0], num1); // Ensure num2 is not greater than num1
        }
        answer = num1 - num2;
        newQuestion = { num1, num2, operation: 'subtraction', operator: '-', answer };
        break;

      case 'multiplication':
        if (Array.isArray(multiplicationTable) && multiplicationTable.length > 0) {
          // New logic for custom table selection
          num1 = multiplicationTable[randomNumber(0, multiplicationTable.length - 1)];
          num2 = randomNumber(1, 12);
        } else {
          // Old logic for 'random' mode or other cases
          let maxNum2;
          switch(difficulty) {
            case 'easy': maxNum2 = 4; break;
            case 'medium': maxNum2 = 7; break;
            case 'hard': maxNum2 = 12; break;
            case 'ai': 
                if (typeof questionCount === 'number') {
                    if (questionCount <= 10) maxNum2 = 4;
                    else if (questionCount <= 20) maxNum2 = 7;
                    else if (questionCount <= 40) maxNum2 = 10;
                    else maxNum2 = 12;
                } else {
                    maxNum2 = 4; // Fallback for AI if no question count
                }
                break;
            default: maxNum2 = 12;
          }
          num1 = randomNumber(r.mul[0], r.mul[1]);
          num2 = randomNumber(1, maxNum2);
        }
        
        answer = num1 * num2;
        newQuestion = { num1, num2, operation: 'multiplication', operator: 'x', answer };
        break;

      case 'division':
        const result = randomNumber(r.div.result[0], r.div.result[1]);
        num2 = randomNumber(r.div.num2[0], r.div.num2[1]);
        if (num2 === 0) num2 = 1; // Safeguard against division by zero
        num1 = result * num2;
        answer = result;
        newQuestion = { num1, num2, operation: 'division', operator: '÷', answer };
        break;
      
      default:
          // Fallback to addition in an unlikely edge case
          num1 = randomNumber(r.add[0], r.add[1]);
          num2 = randomNumber(r.add[0], r.add[1]);
          answer = num1 + num2;
          newQuestion = { num1, num2, operation: 'addition', operator: '+', answer };
          break;
    }
  } while (
    previousQuestion &&
    newQuestion.num1 === previousQuestion.num1 &&
    newQuestion.num2 === previousQuestion.num2 &&
    newQuestion.operation === previousQuestion.operation
  );

  return newQuestion;
};
