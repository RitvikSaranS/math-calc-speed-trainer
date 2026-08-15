import type { ModeDef, Operation } from '../types';
import { modesByOperation } from '../lib/modes';

const OPERATION_LABELS: Record<Operation, string> = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
};

const DIGIT_COMBO_OPERATIONS: Operation[] = ['addition', 'subtraction'];

export default function ModeSelect({
  operation,
  onSelect,
  onCustomSize,
  onDigitCombo,
  onBack,
}: {
  operation: Operation;
  onSelect: (mode: ModeDef) => void;
  onCustomSize: (operation: Operation) => void;
  onDigitCombo: (operation: Operation) => void;
  onBack: () => void;
}) {
  const modes = modesByOperation[operation];
  const standard = modes.filter((m) => m.group === 'Standard');
  const hasDigitCombo = DIGIT_COMBO_OPERATIONS.includes(operation);

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <h1 className="title">{OPERATION_LABELS[operation]}</h1>
      <p className="subtitle">Choose a mode.</p>

      <h2 className="section-heading">Standard</h2>
      <div className="grid grid-3">
        {standard.map((m) => (
          <button key={m.id} className="tile tile-small" onClick={() => onSelect(m)}>
            {m.label}
          </button>
        ))}
      </div>

      <h2 className="section-heading">Custom</h2>
      <div className="grid grid-3">
        <button className="tile tile-small tile-accent" onClick={() => onCustomSize(operation)}>
          Custom Size
        </button>
        {hasDigitCombo && (
          <button className="tile tile-small tile-accent" onClick={() => onDigitCombo(operation)}>
            Digit Combo
          </button>
        )}
      </div>
    </div>
  );
}
