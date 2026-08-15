export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type MasterMode = 'enter' | 'options' | 'flashcard' | 'flash';

export interface FlashConfig {
  digitSize: number;
  count: number;
}

export interface FlashRound {
  numbers: number[];
  digitSize: number;
  answer: number;
}

export interface Problem {
  question: string;
  operands: [number, number];
  operation: Operation;
  answer: number;
  remainder?: number;
  hasRemainder: boolean;
}

export interface ModeDef {
  id: string;
  label: string;
  operation: Operation;
  group: 'Standard' | 'Custom';
  generate: () => Problem;
}
