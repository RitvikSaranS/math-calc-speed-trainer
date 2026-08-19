import type { Problem } from '../types';
import { shuffle } from './random';

export function formatAnswer(p: Problem): string {
  return p.hasRemainder ? `${p.answer} r ${p.remainder}` : `${p.answer}`;
}

// Distinct, non-negative deltas ordered roughly by closeness: 1,-1,2,-2,3,-3,...
function deltaSequence(limit: number): number[] {
  const seq: number[] = [];
  for (let d = 1; d <= limit; d++) {
    seq.push(d, -d);
  }
  return seq;
}

export function generateOptions(p: Problem, count = 4): string[] {
  const correct = formatAnswer(p);
  const options = new Set<string>([correct]);
  const needed = count - 1;

  if (p.hasRemainder && p.remainder !== undefined) {
    const divisor = p.divisor ?? 10;
    const quotientDeltas = shuffle(deltaSequence(Math.max(3, needed * 2)));
    const remainderDeltas = shuffle(deltaSequence(Math.max(2, divisor)));
    outer: for (const qDelta of quotientDeltas) {
      const newQuotient = p.answer + qDelta;
      if (newQuotient < 0) continue;
      for (const rDelta of remainderDeltas) {
        const newRemainder = ((p.remainder + rDelta) % divisor + divisor) % divisor;
        if (options.size >= count) break outer;
        options.add(`${newQuotient} r ${newRemainder}`);
      }
    }
    // Widen further if the divisor/quotient range was too small to fill count.
    let extra = quotientDeltas.length + 1;
    while (options.size < count) {
      options.add(`${p.answer + extra} r 0`);
      extra++;
    }
  } else {
    const magnitude = Math.max(needed * 3, Math.round(Math.abs(p.answer) * 0.05) + needed);
    for (const delta of deltaSequence(magnitude)) {
      if (options.size >= count) break;
      const candidate = p.answer + delta;
      if (candidate >= 0) options.add(`${candidate}`);
    }
    // Guaranteed fallback: strictly larger values are always distinct and non-negative.
    let extra = magnitude + 1;
    while (options.size < count) {
      options.add(`${p.answer + extra}`);
      extra++;
    }
  }

  return shuffle(Array.from(options));
}
