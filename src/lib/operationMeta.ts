import type { Operation } from '../types';

export interface OperationMeta {
  id: Operation;
  label: string;
  symbol: string;
  homeDescription: string;
  modeDescription: string;
  operandCount: 1 | 2;
  fieldLabels: [string] | [string, string];
  sizeLimits: { a: number; b: number };
  customNumberNote: string;
  supportsRemainder: boolean;
}

export const OPERATION_ORDER: Operation[] = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
  'squareRoot',
  'cubeRoot',
  'squaring',
];

export const OPERATION_META: Record<Operation, OperationMeta> = {
  addition: {
    id: 'addition',
    label: 'Addition',
    symbol: '+',
    homeDescription: 'Add numbers of any size, from single digits to large sums.',
    modeDescription: 'Practice adding two numbers together.',
    operandCount: 2,
    fieldLabels: ['First number — digits', 'Second number — digits'],
    sizeLimits: { a: 12, b: 12 },
    customNumberNote:
      "Both numbers are built only from the digits you pick, so the same digits line up column by column — perfect for drilling exact combinations like 7 + 8.",
    supportsRemainder: false,
  },
  subtraction: {
    id: 'subtraction',
    label: 'Subtraction',
    symbol: '−',
    homeDescription: 'Subtract with borrowing, from small differences to big ones.',
    modeDescription: 'Practice subtracting one number from another.',
    operandCount: 2,
    fieldLabels: ['First number — digits', 'Second number — digits'],
    sizeLimits: { a: 12, b: 12 },
    customNumberNote:
      'Both numbers are built only from the digits you pick, so the tricky borrow pairs you want to drill line up column by column.',
    supportsRemainder: false,
  },
  multiplication: {
    id: 'multiplication',
    label: 'Multiplication',
    symbol: '×',
    homeDescription: 'Multiply single and multi-digit numbers.',
    modeDescription: 'Practice multiplying two numbers together.',
    operandCount: 2,
    fieldLabels: ['First number — digits', 'Second number — digits'],
    sizeLimits: { a: 7, b: 7 },
    customNumberNote:
      'Both numbers are built only from the digits you pick — load up on the big, tricky ones like 7, 8, 9 to drill the hardest products.',
    supportsRemainder: false,
  },
  division: {
    id: 'division',
    label: 'Division',
    symbol: '÷',
    homeDescription: 'Divide with or without remainders.',
    modeDescription: 'Practice dividing one number by another.',
    operandCount: 2,
    fieldLabels: ['Dividend — digits', 'Divisor — digits'],
    sizeLimits: { a: 12, b: 6 },
    customNumberNote:
      'The dividend and divisor are built only from the digits you pick — great for practicing division by the larger, harder digits.',
    supportsRemainder: true,
  },
  squareRoot: {
    id: 'squareRoot',
    label: 'Square Root',
    symbol: '√',
    homeDescription: 'Find the square root of perfect squares.',
    modeDescription: 'Every problem is a perfect square — the answer is always a whole number.',
    operandCount: 1,
    fieldLabels: ['Root — digits'],
    sizeLimits: { a: 6, b: 6 },
    customNumberNote: 'The hidden root is built only from the digits you pick — great for drilling roots with tricky digits.',
    supportsRemainder: false,
  },
  cubeRoot: {
    id: 'cubeRoot',
    label: 'Cube Root',
    symbol: '∛',
    homeDescription: 'Find the cube root of perfect cubes.',
    modeDescription: 'Every problem is a perfect cube — the answer is always a whole number.',
    operandCount: 1,
    fieldLabels: ['Root — digits'],
    sizeLimits: { a: 5, b: 5 },
    customNumberNote: 'The hidden root is built only from the digits you pick.',
    supportsRemainder: false,
  },
  squaring: {
    id: 'squaring',
    label: 'Squaring',
    symbol: 'x²',
    homeDescription: 'Square numbers up to 3 digits.',
    modeDescription: 'Practice squaring a number (multiplying it by itself).',
    operandCount: 1,
    fieldLabels: ['Number — digits'],
    sizeLimits: { a: 3, b: 3 },
    customNumberNote: 'The number being squared is built only from the digits you pick.',
    supportsRemainder: false,
  },
};
