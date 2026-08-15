import { randomWithDigits, randInt, pick } from './random';
import type { ModeDef, Problem, Operation, FlashRound } from '../types';

export function makeFlashRound(count: number, digitSize: number): FlashRound {
  const numbers = Array.from({ length: count }, () => randomWithDigits(digitSize));
  return {
    numbers,
    digitSize,
    answer: numbers.reduce((sum, n) => sum + n, 0),
  };
}

const DIGIT_RANGE = [2, 3, 4, 5, 6, 7];

// Digit Combo mode: at each digit position, the two numbers' digits are drawn
// as a pair from this set — e.g. for 3-digit addition, three pairs are drawn
// (one per position) and assembled left-to-right into the two numbers.
// (digitA, digitB) — order is randomized per position when applied.
export const CUSTOM_ADDITION_COMBOS: [number, number][] = [
  [3, 8],
  [5, 8],
  [6, 7],
  [7, 8],
  [5, 7],
];

// (topDigit, bottomDigit) — order is fixed (top = minuend digit, bottom =
// subtrahend digit) when applied. Most pairs have top < bottom (needs a
// borrow); the one pair with top > bottom, (6,2), is reserved for the leading
// digit position so the overall number never goes negative.
export const CUSTOM_SUBTRACTION_COMBOS: [number, number][] = [
  [2, 5],
  [3, 7],
  [1, 4],
  [2, 6],
  [6, 2],
];

// Digit-size caps for free-entry number inputs. Kept well under
// Number.MAX_SAFE_INTEGER (~15-16 digits) so sums/products/differences never
// lose precision — multiplication's cap is tighter since two factors compound.
export const DIGIT_SIZE_MIN = 1;
export const DIGIT_SIZE_LIMITS: Record<Operation, { a: number; b: number }> = {
  addition: { a: 12, b: 12 },
  subtraction: { a: 12, b: 12 },
  multiplication: { a: 7, b: 7 },
  division: { a: 12, b: 6 },
};
export const DIGIT_COMBO_MAX_DIGITS = 12;
export const FLASH_MAX_DIGITS = 9;

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

const DIVISION_DIVIDEND_RANGE = [3, 4, 5, 6, 7];
const DIVISION_DIVISOR_RANGE = [1, 2];

export function makeAdditionProblem(digitsA: number, digitsB: number): Problem {
  const a = randomWithDigits(digitsA);
  const b = randomWithDigits(digitsB);
  const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
  return {
    question: `${x} + ${y}`,
    operands: [x, y],
    operation: 'addition',
    answer: x + y,
    hasRemainder: false,
  };
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

  return {
    question: `${minuend} - ${subtrahend}`,
    operands: [minuend, subtrahend],
    operation: 'subtraction',
    answer: minuend - subtrahend,
    hasRemainder: false,
  };
}

export function makeMultiplicationProblem(digitsA: number, digitsB: number): Problem {
  const a = randomWithDigits(digitsA);
  const b = randomWithDigits(digitsB);
  const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
  return {
    question: `${x} × ${y}`,
    operands: [x, y],
    operation: 'multiplication',
    answer: x * y,
    hasRemainder: false,
  };
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
      return {
        question: `${dividend} ÷ ${divisor}`,
        operands: [dividend, divisor],
        operation: 'division',
        answer: quotient,
        hasRemainder: false,
      };
    }
  }

  const divisor = randomWithDigits(divisorDigits);
  const quotient = randomWithDigits(Math.max(1, dividendDigits - divisorDigits));
  const dividend = divisor * quotient;
  return {
    question: `${dividend} ÷ ${divisor}`,
    operands: [dividend, divisor],
    operation: 'division',
    answer: quotient,
    hasRemainder: false,
  };
}

export function makeRemainderDivisionProblem(dividendDigits: number, divisorDigits: number): Problem {
  for (let attempt = 0; attempt < 50; attempt++) {
    const dividend = randomWithDigits(dividendDigits);
    const divisor = randomWithDigits(divisorDigits);
    const remainder = dividend % divisor;
    if (remainder !== 0) {
      return {
        question: `${dividend} ÷ ${divisor}`,
        operands: [dividend, divisor],
        operation: 'division',
        answer: Math.floor(dividend / divisor),
        remainder,
        hasRemainder: true,
      };
    }
  }

  const dividend = randomWithDigits(dividendDigits);
  const divisor = randomWithDigits(divisorDigits);
  return {
    question: `${dividend} ÷ ${divisor}`,
    operands: [dividend, divisor],
    operation: 'division',
    answer: Math.floor(dividend / divisor),
    remainder: dividend % divisor,
    hasRemainder: true,
  };
}

export const additionModes: ModeDef[] = [
  ...DIGIT_RANGE.map((d) => ({
    id: `add-${d}`,
    label: `${d}-Digit Addition`,
    operation: 'addition' as const,
    group: 'Standard' as const,
    generate: () => makeAdditionProblem(d, d),
  })),
  {
    id: 'add-mixed',
    label: 'Mixed-Digit Addition',
    operation: 'addition',
    group: 'Standard',
    generate: () => {
      const d1 = pick(DIGIT_RANGE);
      let d2 = pick(DIGIT_RANGE);
      while (d2 === d1) d2 = pick(DIGIT_RANGE);
      return makeAdditionProblem(d1, d2);
    },
  },
];

export const subtractionModes: ModeDef[] = [
  ...DIGIT_RANGE.map((d) => ({
    id: `sub-${d}`,
    label: `${d}-Digit Subtraction`,
    operation: 'subtraction' as const,
    group: 'Standard' as const,
    generate: () => makeSubtractionProblem(d, d),
  })),
  {
    id: 'sub-mixed',
    label: 'Mixed-Digit Subtraction',
    operation: 'subtraction',
    group: 'Standard',
    generate: () => {
      const d1 = pick(DIGIT_RANGE);
      let d2 = pick(DIGIT_RANGE);
      while (d2 === d1) d2 = pick(DIGIT_RANGE);
      const minuendDigits = Math.max(d1, d2);
      const subtrahendDigits = Math.min(d1, d2);
      return makeSubtractionProblem(subtrahendDigits, minuendDigits);
    },
  },
];

export const multiplicationModes: ModeDef[] = MULTIPLICATION_COMBOS.map(([d1, d2]) => ({
  id: `mul-${d1}-${d2}`,
  label: `${d1}-Digit × ${d2}-Digit`,
  operation: 'multiplication' as const,
  group: 'Standard' as const,
  generate: () => makeMultiplicationProblem(d1, d2),
}));

export const divisionModes: ModeDef[] = [];
for (const dd of DIVISION_DIVIDEND_RANGE) {
  for (const ds of DIVISION_DIVISOR_RANGE) {
    divisionModes.push({
      id: `div-${dd}-${ds}-exact`,
      label: `${dd}-Digit ÷ ${ds}-Digit — Exact`,
      operation: 'division',
      group: 'Standard',
      generate: () => makeExactDivisionProblem(dd, ds),
    });
    divisionModes.push({
      id: `div-${dd}-${ds}-rem`,
      label: `${dd}-Digit ÷ ${ds}-Digit — With Remainder`,
      operation: 'division',
      group: 'Standard',
      generate: () => makeRemainderDivisionProblem(dd, ds),
    });
  }
}

// --- Custom Size: free, independent digit-length pick per number, all 4 ops, no value restriction ---

export function buildCustomSizeMode(operation: Operation, sizeA: number, sizeB: number, withRemainder = false): ModeDef {
  switch (operation) {
    case 'addition':
      return {
        id: `add-size-${sizeA}-${sizeB}`,
        label: `Custom Size Addition (${sizeA} + ${sizeB} digits)`,
        operation,
        group: 'Custom',
        generate: () => makeAdditionProblem(sizeA, sizeB),
      };
    case 'subtraction': {
      const minuendDigits = Math.max(sizeA, sizeB);
      const subtrahendDigits = Math.min(sizeA, sizeB);
      return {
        id: `sub-size-${sizeA}-${sizeB}`,
        label: `Custom Size Subtraction (${minuendDigits} − ${subtrahendDigits} digits)`,
        operation,
        group: 'Custom',
        generate: () => makeSubtractionProblem(subtrahendDigits, minuendDigits),
      };
    }
    case 'multiplication':
      return {
        id: `mul-size-${sizeA}-${sizeB}`,
        label: `Custom Size Multiplication (${sizeA} × ${sizeB} digits)`,
        operation,
        group: 'Custom',
        generate: () => makeMultiplicationProblem(sizeA, sizeB),
      };
    case 'division':
      return {
        id: `div-size-${sizeA}-${sizeB}-${withRemainder ? 'rem' : 'exact'}`,
        label: `Custom Size Division (${sizeA} ÷ ${sizeB} digits${withRemainder ? ', with remainder' : ', exact'})`,
        operation,
        group: 'Custom',
        generate: () => (withRemainder ? makeRemainderDivisionProblem(sizeA, sizeB) : makeExactDivisionProblem(sizeA, sizeB)),
      };
  }
}

// --- Digit Combo: pick a digit-count, each digit position is filled from the hardcoded value-pair set ---

function makeDigitComboAdditionProblem(numDigits: number): Problem {
  const digitsA: number[] = [];
  const digitsB: number[] = [];
  for (let i = 0; i < numDigits; i++) {
    const [x, y] = pick(CUSTOM_ADDITION_COMBOS);
    if (Math.random() < 0.5) {
      digitsA.push(x);
      digitsB.push(y);
    } else {
      digitsA.push(y);
      digitsB.push(x);
    }
  }
  const a = parseInt(digitsA.join(''), 10);
  const b = parseInt(digitsB.join(''), 10);
  return {
    question: `${a} + ${b}`,
    operands: [a, b],
    operation: 'addition',
    answer: a + b,
    hasRemainder: false,
  };
}

function makeDigitComboSubtractionProblem(numDigits: number): Problem {
  const leadingPool = CUSTOM_SUBTRACTION_COMBOS.filter(([top, bottom]) => top > bottom);
  const topDigits: number[] = [];
  const bottomDigits: number[] = [];
  for (let i = 0; i < numDigits; i++) {
    const pool = i === 0 && leadingPool.length > 0 ? leadingPool : CUSTOM_SUBTRACTION_COMBOS;
    const [top, bottom] = pick(pool);
    topDigits.push(top);
    bottomDigits.push(bottom);
  }
  const minuend = parseInt(topDigits.join(''), 10);
  const subtrahend = parseInt(bottomDigits.join(''), 10);
  return {
    question: `${minuend} - ${subtrahend}`,
    operands: [minuend, subtrahend],
    operation: 'subtraction',
    answer: minuend - subtrahend,
    hasRemainder: false,
  };
}

export function buildDigitComboAdditionMode(numDigits: number): ModeDef {
  return {
    id: `add-digitcombo-${numDigits}`,
    label: `Digit Combo Addition (${numDigits}-digit)`,
    operation: 'addition',
    group: 'Custom',
    generate: () => makeDigitComboAdditionProblem(numDigits),
  };
}

export function buildDigitComboSubtractionMode(numDigits: number): ModeDef {
  return {
    id: `sub-digitcombo-${numDigits}`,
    label: `Digit Combo Subtraction (${numDigits}-digit)`,
    operation: 'subtraction',
    group: 'Custom',
    generate: () => makeDigitComboSubtractionProblem(numDigits),
  };
}

export const modesByOperation: Record<Operation, ModeDef[]> = {
  addition: additionModes,
  subtraction: subtractionModes,
  multiplication: multiplicationModes,
  division: divisionModes,
};
