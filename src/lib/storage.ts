import type { Operation } from '../types';
import type { PoolCustomNumberOperation } from './modes';
import type { FlashVariant } from './flash';

export type PairOperation = 'addition' | 'subtraction';
export type DigitPair = [number, number];

export interface CustomSizeSettings {
  a: number;
  b: number;
  withRemainder: boolean;
}

export interface CustomNumberPoolSettings {
  a: number;
  b: number;
  withRemainder: boolean;
  pool: number[];
}

export interface FlashPersistedSettings {
  iterations: number;
  intervalSeconds: number;
  startingNumber: number;
  numberDigits: number;
  usePairs: boolean;
}

interface AppState {
  version: 1;
  pairs: Partial<Record<PairOperation, DigitPair[]>>;
  pairDigitLength: Partial<Record<PairOperation, number>>;
  customSize: Partial<Record<Operation, CustomSizeSettings>>;
  customNumberPool: Partial<Record<PoolCustomNumberOperation, CustomNumberPoolSettings>>;
  flash: Partial<Record<FlashVariant, FlashPersistedSettings>>;
}

const STORAGE_KEY = 'mathTrainer.state';

function emptyState(): AppState {
  return { version: 1, pairs: {}, pairDigitLength: {}, customSize: {}, customNumberPool: {}, flash: {} };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return { ...emptyState(), ...parsed };
  } catch {
    return emptyState();
  }
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — settings just won't persist.
  }
}

function isDigitPair(value: unknown): value is DigitPair {
  return Array.isArray(value) && value.length === 2 && value.every((d) => Number.isInteger(d) && d >= 0 && d <= 9);
}

export function loadPairs(operation: PairOperation): DigitPair[] {
  const stored = loadState().pairs[operation];
  if (!Array.isArray(stored)) return [];
  return stored.filter(isDigitPair);
}

export function savePairs(operation: PairOperation, pairs: DigitPair[]): void {
  const state = loadState();
  state.pairs[operation] = pairs;
  saveState(state);
}

export function loadPairDigitLength(operation: PairOperation): number | undefined {
  return loadState().pairDigitLength[operation];
}

export function savePairDigitLength(operation: PairOperation, numDigits: number): void {
  const state = loadState();
  state.pairDigitLength[operation] = numDigits;
  saveState(state);
}

export function flattenDigits(pairs: DigitPair[]): number[] {
  const set = new Set<number>();
  pairs.forEach(([a, b]) => {
    set.add(a);
    set.add(b);
  });
  return Array.from(set).sort((a, b) => a - b);
}

export function loadCustomSize(operation: Operation): CustomSizeSettings | undefined {
  return loadState().customSize[operation];
}

export function saveCustomSize(operation: Operation, settings: CustomSizeSettings): void {
  const state = loadState();
  state.customSize[operation] = settings;
  saveState(state);
}

export function loadCustomNumberPool(operation: PoolCustomNumberOperation): CustomNumberPoolSettings | undefined {
  return loadState().customNumberPool[operation];
}

export function saveCustomNumberPool(operation: PoolCustomNumberOperation, settings: CustomNumberPoolSettings): void {
  const state = loadState();
  state.customNumberPool[operation] = settings;
  saveState(state);
}

export function loadFlashSettings(variant: FlashVariant): FlashPersistedSettings | undefined {
  return loadState().flash[variant];
}

export function saveFlashSettings(variant: FlashVariant, settings: FlashPersistedSettings): void {
  const state = loadState();
  state.flash[variant] = settings;
  saveState(state);
}
