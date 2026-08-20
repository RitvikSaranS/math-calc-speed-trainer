import { randInt } from './random';

export type FlashVariant = 'addition' | 'subtraction';

export interface FlashSettings {
  iterations: number;
  intervalSeconds: number;
  startingNumber: number;
}

export interface FlashSequence {
  numbers: number[];
  answer: number;
  startingNumber: number;
}

const FLASH_NUMBER_MIN = 1;
const FLASH_NUMBER_MAX = 99;

export const FLASH_ITERATIONS_MIN = 2;
export const FLASH_ITERATIONS_MAX = 40;
export const FLASH_INTERVAL_MIN = 0.2;
export const FLASH_INTERVAL_MAX = 5;
export const FLASH_STARTING_NUMBER_MIN = 10;
export const FLASH_STARTING_NUMBER_MAX = 1_000_000;

export function generateFlashSequence(variant: FlashVariant, iterations: number, startingNumber: number): FlashSequence {
  const numbers = Array.from({ length: iterations }, () => randInt(FLASH_NUMBER_MIN, FLASH_NUMBER_MAX));
  const sum = numbers.reduce((total, n) => total + n, 0);
  const base = variant === 'addition' ? 0 : startingNumber;
  const answer = variant === 'addition' ? sum : startingNumber - sum;
  return { numbers, answer, startingNumber: base };
}
