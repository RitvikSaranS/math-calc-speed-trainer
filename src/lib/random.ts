export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomWithDigits(digits: number): number {
  if (digits <= 1) return randInt(1, 9);
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return randInt(min, max);
}

// Builds a number with the given digit count, drawing each digit only from
// `pool`. Falls back to the full 0-9 range if the pool is empty, and avoids a
// leading zero (unless the pool has no nonzero digits at all, or the caller
// opts in via allowLeadingZero).
export function randomWithDigitsFromPool(digits: number, pool: number[], allowLeadingZero = false): number {
  if (digits <= 0) return 0;
  const safePool = pool.length > 0 ? pool : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const result: number[] = [];
  for (let i = 0; i < digits; i++) {
    let choices = safePool;
    if (i === 0 && !allowLeadingZero) {
      const nonZero = safePool.filter((d) => d !== 0);
      choices = nonZero.length > 0 ? nonZero : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    result.push(pick(choices));
  }
  return parseInt(result.join(''), 10);
}

export function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
