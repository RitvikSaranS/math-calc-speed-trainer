export type Operation =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'squareRoot'
  | 'cubeRoot'
  | 'squaring';

export type MasterMode = 'enter' | 'options' | 'flashcard';

export type ConfigGroup = 'default' | 'customSize' | 'customNumbers';

export interface Problem {
  question: string;
  answer: number;
  hasRemainder: boolean;
  remainder?: number;
  divisor?: number;
}

export interface ModeDef {
  id: string;
  label: string;
  operation: Operation;
  group: ConfigGroup;
  generate: () => Problem;
}
