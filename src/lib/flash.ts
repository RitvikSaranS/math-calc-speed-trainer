import { randomWithDigits } from './random';

export type FlashVariant = 'addition' | 'subtraction';

export interface FlashSettings {
  iterations: number;
  intervalSeconds: number;
  startingNumber: number;
  numberDigits: number;
}

export interface FlashSequence {
  numbers: number[];
  answer: number;
  startingNumber: number;
}

export const FLASH_ITERATIONS_MIN = 2;
export const FLASH_ITERATIONS_MAX = 40;
export const FLASH_INTERVAL_MIN = 0.2;
export const FLASH_INTERVAL_MAX = 5;
export const FLASH_STARTING_NUMBER_MIN = 10;
export const FLASH_STARTING_NUMBER_MAX = 1_000_000;
export const FLASH_DIGITS_MIN = 1;
export const FLASH_DIGITS_MAX = 3;

export function generateFlashSequence(
  variant: FlashVariant,
  iterations: number,
  startingNumber: number,
  numberDigits: number,
): FlashSequence {
  const numbers = Array.from({ length: iterations }, () => randomWithDigits(numberDigits));
  const sum = numbers.reduce((total, n) => total + n, 0);
  const base = variant === 'addition' ? 0 : startingNumber;
  const answer = variant === 'addition' ? sum : startingNumber - sum;
  return { numbers, answer, startingNumber: base };
}
