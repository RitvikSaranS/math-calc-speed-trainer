import { randomWithDigits, randomWithDigitsFromPool } from './random';

export type FlashVariant = 'addition' | 'subtraction';

export interface FlashSettings {
  iterations: number;
  intervalSeconds: number;
  startingNumber: number;
  numberDigits: number;
  digitPool?: number[];
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

// Minimum on-screen time (ms) for the blank blink between flashed numbers,
// so two identical numbers in a row still read as two distinct flashes.
const FLASH_BLINK_MIN_MS = 80;
const FLASH_BLINK_MAX_MS = 200;
const FLASH_BLINK_SHARE = 0.35;

export function getFlashTiming(intervalSeconds: number): { blinkMs: number; showMs: number } {
  const totalMs = intervalSeconds * 1000;
  const blinkMs = Math.min(FLASH_BLINK_MAX_MS, Math.max(FLASH_BLINK_MIN_MS, totalMs * FLASH_BLINK_SHARE));
  return { blinkMs, showMs: Math.max(50, totalMs - blinkMs) };
}

export function generateFlashSequence(
  variant: FlashVariant,
  iterations: number,
  startingNumber: number,
  numberDigits: number,
  digitPool?: number[],
): FlashSequence {
  const numbers = Array.from({ length: iterations }, () =>
    digitPool && digitPool.length > 0 ? randomWithDigitsFromPool(numberDigits, digitPool) : randomWithDigits(numberDigits),
  );
  const sum = numbers.reduce((total, n) => total + n, 0);
  const base = variant === 'addition' ? 0 : startingNumber;
  const answer = variant === 'addition' ? sum : startingNumber - sum;
  return { numbers, answer, startingNumber: base };
}
