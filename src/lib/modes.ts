import { randomWithDigits, randomWithDigitsFromPool, randInt } from './random';
import type { ModeDef, Problem, Operation } from '../types';

export const DIGIT_SIZE_MIN = 1;
export const ALL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const ADD_SUB_DIGIT_RANGE = [1, 2, 3, 4, 5, 6];

const MULTIPLICATION_COMBOS: [number, number][] = [
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 2],
  [2, 3],
  [2, 4],
  [3, 3],
  [3, 4],
  [4, 4],
];

const DIVISION_COMBOS: [number, number][] = [
  [2, 1],
  [3, 1],
  [4, 2],
  [5, 2],
];

const ROOT_DIGIT_RANGE = [1, 2, 3];
const SQUARING_DIGIT_RANGE = [1, 2, 3];

// --- Problem generators ---

export function makeAdditionProblem(digitsA: number, digitsB: number): Problem {
  const a = randomWithDigits(digitsA);
  const b = randomWithDigits(digitsB);
  const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
  return { question: `${x} + ${y}`, answer: x + y, hasRemainder: false };
}

export function makeSubtractionProblem(subtrahendDigits: number, minuendDigits: number): Problem {
  let minuend: number;
  let subtrahend: number;

  if (minuendDigits === subtrahendDigits) {
    const a = randomWithDigits(minuendDigits);
    const b = randomWithDigits(subtrahendDigits);
    minuend = Math.max(a, b);
    subtrahend = Math.min(a, b);
    if (minuend === subtrahend) {
      subtrahend = subtrahend > 1 ? subtrahend - 1 : subtrahend;
    }
  } else {
    minuend = randomWithDigits(minuendDigits);
    subtrahend = randomWithDigits(subtrahendDigits);
  }

  return { question: `${minuend} - ${subtrahend}`, answer: minuend - subtrahend, hasRemainder: false };
}

export function makeMultiplicationProblem(digitsA: number, digitsB: number): Problem {
  const a = randomWithDigits(digitsA);
  const b = randomWithDigits(digitsB);
  const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
  return { question: `${x} × ${y}`, answer: x * y, hasRemainder: false };
}

export function makeExactDivisionProblem(dividendDigits: number, divisorDigits: number): Problem {
  const minDividend = 10 ** (dividendDigits - 1);
  const maxDividend = 10 ** dividendDigits - 1;

  for (let attempt = 0; attempt < 50; attempt++) {
    const divisor = randomWithDigits(divisorDigits);
    const qMin = Math.ceil(minDividend / divisor);
    const qMax = Math.floor(maxDividend / divisor);
    if (qMin <= qMax && qMin > 0) {
      const quotient = randInt(qMin, qMax);
      const dividend = divisor * quotient;
      return { question: `${dividend} ÷ ${divisor}`, answer: quotient, hasRemainder: false };
    }
  }

  const divisor = randomWithDigits(divisorDigits);
  const quotient = randomWithDigits(Math.max(1, dividendDigits - divisorDigits));
  const dividend = divisor * quotient;
  return { question: `${dividend} ÷ ${divisor}`, answer: quotient, hasRemainder: false };
}

export function makeRemainderDivisionProblem(dividendDigits: number, divisorDigits: number): Problem {
  for (let attempt = 0; attempt < 50; attempt++) {
    const dividend = randomWithDigits(dividendDigits);
    const divisor = randomWithDigits(divisorDigits);
    const remainder = dividend % divisor;
    if (remainder !== 0) {
      return {
        question: `${dividend} ÷ ${divisor}`,
        answer: Math.floor(dividend / divisor),
        remainder,
        hasRemainder: true,
        divisor,
      };
    }
  }

  const dividend = randomWithDigits(dividendDigits);
  const divisor = randomWithDigits(divisorDigits);
  return {
    question: `${dividend} ÷ ${divisor}`,
    answer: Math.floor(dividend / divisor),
    remainder: dividend % divisor,
    hasRemainder: true,
    divisor,
  };
}

export function makeSquaringProblem(digits: number): Problem {
  const n = randomWithDigits(digits);
  return { question: `${n}²`, answer: n * n, hasRemainder: false };
}

export function makeSquareRootProblem(rootDigits: number): Problem {
  const root = randomWithDigits(rootDigits);
  return { question: `√${root * root}`, answer: root, hasRemainder: false };
}

export function makeCubeRootProblem(rootDigits: number): Problem {
  const root = randomWithDigits(rootDigits);
  return { question: `∛${root ** 3}`, answer: root, hasRemainder: false };
}

// --- Custom Numbers generators (digits drawn only from a chosen pool) ---

export function makeAdditionCustomNumberProblem(digits: number, pool: number[]): Problem {
  const a = randomWithDigitsFromPool(digits, pool);
  const b = randomWithDigitsFromPool(digits, pool);
  const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
  return { question: `${x} + ${y}`, answer: x + y, hasRemainder: false };
}

export function makeSubtractionCustomNumberProblem(digits: number, pool: number[]): Problem {
  const a = randomWithDigitsFromPool(digits, pool);
  const b = randomWithDigitsFromPool(digits, pool);
  let minuend = Math.max(a, b);
  let subtrahend = Math.min(a, b);
  if (minuend === subtrahend) {
    subtrahend = subtrahend > 1 ? subtrahend - 1 : subtrahend;
  }
  return { question: `${minuend} - ${subtrahend}`, answer: minuend - subtrahend, hasRemainder: false };
}

export function makeMultiplicationCustomNumberProblem(digitsA: number, digitsB: number, pool: number[]): Problem {
  const a = randomWithDigitsFromPool(digitsA, pool);
  const b = randomWithDigitsFromPool(digitsB, pool);
  const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
  return { question: `${x} × ${y}`, answer: x * y, hasRemainder: false };
}

export function makeExactDivisionCustomNumberProblem(dividendDigits: number, divisorDigits: number, pool: number[]): Problem {
  const minDividend = 10 ** (dividendDigits - 1);
  const maxDividend = 10 ** dividendDigits - 1;

  for (let attempt = 0; attempt < 50; attempt++) {
    const divisor = randomWithDigitsFromPool(divisorDigits, pool);
    const qMin = Math.ceil(minDividend / divisor);
    const qMax = Math.floor(maxDividend / divisor);
    if (qMin <= qMax && qMin > 0) {
      const quotient = randInt(qMin, qMax);
      const dividend = divisor * quotient;
      return { question: `${dividend} ÷ ${divisor}`, answer: quotient, hasRemainder: false };
    }
  }

  const divisor = randomWithDigitsFromPool(divisorDigits, pool);
  const quotient = randomWithDigits(Math.max(1, dividendDigits - divisorDigits));
  const dividend = divisor * quotient;
  return { question: `${dividend} ÷ ${divisor}`, answer: quotient, hasRemainder: false };
}

export function makeRemainderDivisionCustomNumberProblem(dividendDigits: number, divisorDigits: number, pool: number[]): Problem {
  for (let attempt = 0; attempt < 50; attempt++) {
    const dividend = randomWithDigitsFromPool(dividendDigits, pool);
    const divisor = randomWithDigitsFromPool(divisorDigits, pool);
    const remainder = dividend % divisor;
    if (remainder !== 0) {
      return {
        question: `${dividend} ÷ ${divisor}`,
        answer: Math.floor(dividend / divisor),
        remainder,
        hasRemainder: true,
        divisor,
      };
    }
  }

  const dividend = randomWithDigitsFromPool(dividendDigits, pool);
  const divisor = randomWithDigitsFromPool(divisorDigits, pool);
  return {
    question: `${dividend} ÷ ${divisor}`,
    answer: Math.floor(dividend / divisor),
    remainder: dividend % divisor,
    hasRemainder: true,
    divisor,
  };
}

export function makeSquaringCustomNumberProblem(digits: number, pool: number[]): Problem {
  const n = randomWithDigitsFromPool(digits, pool);
  return { question: `${n}²`, answer: n * n, hasRemainder: false };
}

export function makeSquareRootCustomNumberProblem(rootDigits: number, pool: number[]): Problem {
  const root = randomWithDigitsFromPool(rootDigits, pool);
  return { question: `√${root * root}`, answer: root, hasRemainder: false };
}

export function makeCubeRootCustomNumberProblem(rootDigits: number, pool: number[]): Problem {
  const root = randomWithDigitsFromPool(rootDigits, pool);
  return { question: `∛${root ** 3}`, answer: root, hasRemainder: false };
}

// --- Default (preset) modes ---

export const additionModes: ModeDef[] = ADD_SUB_DIGIT_RANGE.map((d) => ({
  id: `add-${d}`,
  label: `${d}-Digit Addition`,
  operation: 'addition',
  group: 'default',
  generate: () => makeAdditionProblem(d, d),
}));

export const subtractionModes: ModeDef[] = ADD_SUB_DIGIT_RANGE.map((d) => ({
  id: `sub-${d}`,
  label: `${d}-Digit Subtraction`,
  operation: 'subtraction',
  group: 'default',
  generate: () => makeSubtractionProblem(d, d),
}));

export const multiplicationModes: ModeDef[] = MULTIPLICATION_COMBOS.map(([d1, d2]) => ({
  id: `mul-${d1}-${d2}`,
  label: `${d1}-Digit × ${d2}-Digit`,
  operation: 'multiplication',
  group: 'default',
  generate: () => makeMultiplicationProblem(d1, d2),
}));

export const divisionModes: ModeDef[] = DIVISION_COMBOS.flatMap(([dd, ds]) => [
  {
    id: `div-${dd}-${ds}-exact`,
    label: `${dd}-Digit ÷ ${ds}-Digit — Exact`,
    operation: 'division' as const,
    group: 'default' as const,
    generate: () => makeExactDivisionProblem(dd, ds),
  },
  {
    id: `div-${dd}-${ds}-rem`,
    label: `${dd}-Digit ÷ ${ds}-Digit — With Remainder`,
    operation: 'division' as const,
    group: 'default' as const,
    generate: () => makeRemainderDivisionProblem(dd, ds),
  },
]);

export const squareRootModes: ModeDef[] = ROOT_DIGIT_RANGE.map((d) => ({
  id: `sqrt-${d}`,
  label: `${d}-Digit Root`,
  operation: 'squareRoot',
  group: 'default',
  generate: () => makeSquareRootProblem(d),
}));

export const cubeRootModes: ModeDef[] = ROOT_DIGIT_RANGE.map((d) => ({
  id: `cbrt-${d}`,
  label: `${d}-Digit Root`,
  operation: 'cubeRoot',
  group: 'default',
  generate: () => makeCubeRootProblem(d),
}));

export const squaringModes: ModeDef[] = SQUARING_DIGIT_RANGE.map((d) => ({
  id: `sq-${d}`,
  label: `${d}-Digit Numbers`,
  operation: 'squaring',
  group: 'default',
  generate: () => makeSquaringProblem(d),
}));

export const modesByOperation: Record<Operation, ModeDef[]> = {
  addition: additionModes,
  subtraction: subtractionModes,
  multiplication: multiplicationModes,
  division: divisionModes,
  squareRoot: squareRootModes,
  cubeRoot: cubeRootModes,
  squaring: squaringModes,
};

// --- Custom Size: pick digit length(s) within the operation's limit ---

export interface SizeParams {
  a: number;
  b: number;
  withRemainder?: boolean;
}

export function buildCustomSizeMode(operation: Operation, params: SizeParams): ModeDef {
  const { a, b, withRemainder } = params;
  switch (operation) {
    case 'addition':
      return {
        id: `add-size-${a}-${b}`,
        label: `Custom Size Addition (${a} + ${b} digits)`,
        operation,
        group: 'customSize',
        generate: () => makeAdditionProblem(a, b),
      };
    case 'subtraction': {
      const minuendDigits = Math.max(a, b);
      const subtrahendDigits = Math.min(a, b);
      return {
        id: `sub-size-${a}-${b}`,
        label: `Custom Size Subtraction (${minuendDigits} − ${subtrahendDigits} digits)`,
        operation,
        group: 'customSize',
        generate: () => makeSubtractionProblem(subtrahendDigits, minuendDigits),
      };
    }
    case 'multiplication':
      return {
        id: `mul-size-${a}-${b}`,
        label: `Custom Size Multiplication (${a} × ${b} digits)`,
        operation,
        group: 'customSize',
        generate: () => makeMultiplicationProblem(a, b),
      };
    case 'division':
      return {
        id: `div-size-${a}-${b}-${withRemainder ? 'rem' : 'exact'}`,
        label: `Custom Size Division (${a} ÷ ${b} digits${withRemainder ? ', with remainder' : ', exact'})`,
        operation,
        group: 'customSize',
        generate: () => (withRemainder ? makeRemainderDivisionProblem(a, b) : makeExactDivisionProblem(a, b)),
      };
    case 'squareRoot':
      return {
        id: `sqrt-size-${a}`,
        label: `Custom Size Square Root (${a}-digit root)`,
        operation,
        group: 'customSize',
        generate: () => makeSquareRootProblem(a),
      };
    case 'cubeRoot':
      return {
        id: `cbrt-size-${a}`,
        label: `Custom Size Cube Root (${a}-digit root)`,
        operation,
        group: 'customSize',
        generate: () => makeCubeRootProblem(a),
      };
    case 'squaring':
      return {
        id: `sq-size-${a}`,
        label: `Custom Size Squaring (${a}-digit number)`,
        operation,
        group: 'customSize',
        generate: () => makeSquaringProblem(a),
      };
  }
}

// --- Custom Numbers: pick a digit pool + digit length(s) ---

export function buildCustomNumberMode(operation: Operation, params: SizeParams, pool: number[]): ModeDef {
  const { a, b, withRemainder } = params;
  switch (operation) {
    case 'addition':
      return {
        id: `add-nums-${a}-${pool.join('')}`,
        label: `Custom Numbers Addition (${a}-digit)`,
        operation,
        group: 'customNumbers',
        generate: () => makeAdditionCustomNumberProblem(a, pool),
      };
    case 'subtraction':
      return {
        id: `sub-nums-${a}-${pool.join('')}`,
        label: `Custom Numbers Subtraction (${a}-digit)`,
        operation,
        group: 'customNumbers',
        generate: () => makeSubtractionCustomNumberProblem(a, pool),
      };
    case 'multiplication':
      return {
        id: `mul-nums-${a}-${b}-${pool.join('')}`,
        label: `Custom Numbers Multiplication (${a} × ${b} digits)`,
        operation,
        group: 'customNumbers',
        generate: () => makeMultiplicationCustomNumberProblem(a, b, pool),
      };
    case 'division':
      return {
        id: `div-nums-${a}-${b}-${pool.join('')}-${withRemainder ? 'rem' : 'exact'}`,
        label: `Custom Numbers Division (${a} ÷ ${b} digits${withRemainder ? ', with remainder' : ', exact'})`,
        operation,
        group: 'customNumbers',
        generate: () =>
          withRemainder
            ? makeRemainderDivisionCustomNumberProblem(a, b, pool)
            : makeExactDivisionCustomNumberProblem(a, b, pool),
      };
    case 'squareRoot':
      return {
        id: `sqrt-nums-${a}-${pool.join('')}`,
        label: `Custom Numbers Square Root (${a}-digit root)`,
        operation,
        group: 'customNumbers',
        generate: () => makeSquareRootCustomNumberProblem(a, pool),
      };
    case 'cubeRoot':
      return {
        id: `cbrt-nums-${a}-${pool.join('')}`,
        label: `Custom Numbers Cube Root (${a}-digit root)`,
        operation,
        group: 'customNumbers',
        generate: () => makeCubeRootCustomNumberProblem(a, pool),
      };
    case 'squaring':
      return {
        id: `sq-nums-${a}-${pool.join('')}`,
        label: `Custom Numbers Squaring (${a}-digit number)`,
        operation,
        group: 'customNumbers',
        generate: () => makeSquaringCustomNumberProblem(a, pool),
      };
  }
}
