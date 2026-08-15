import { useState } from 'react';
import type { ModeDef, Operation } from '../types';
import { DIGIT_SIZE_LIMITS, DIGIT_SIZE_MIN, buildCustomSizeMode } from '../lib/modes';
import NumberField from '../components/NumberField';

const FIELD_LABELS: Record<Operation, [string, string]> = {
  addition: ['First number — digits', 'Second number — digits'],
  subtraction: ['First number — digits', 'Second number — digits'],
  multiplication: ['First number — digits', 'Second number — digits'],
  division: ['Dividend — digits', 'Divisor — digits'],
};

const OPERATION_LABELS: Record<Operation, string> = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
};

export default function CustomConfig({
  operation,
  onContinue,
  onBack,
}: {
  operation: Operation;
  onContinue: (mode: ModeDef) => void;
  onBack: () => void;
}) {
  const limits = DIGIT_SIZE_LIMITS[operation];
  const [sizeA, setSizeA] = useState(operation === 'division' ? 5 : 3);
  const [sizeB, setSizeB] = useState(operation === 'division' ? 2 : 3);
  const [withRemainder, setWithRemainder] = useState(false);

  const [labelA, labelB] = FIELD_LABELS[operation];

  function handleContinue() {
    onContinue(buildCustomSizeMode(operation, sizeA, sizeB, withRemainder));
  }

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <h1 className="title">Custom Size {OPERATION_LABELS[operation]}</h1>
      <p className="subtitle">Pick the size of each number — they don't need to match.</p>

      <div className="custom-config-form">
        <NumberField label={labelA} value={sizeA} min={DIGIT_SIZE_MIN} max={limits.a} onChange={setSizeA} />
        <NumberField label={labelB} value={sizeB} min={DIGIT_SIZE_MIN} max={limits.b} onChange={setSizeB} />

        {operation === 'division' && (
          <label className="custom-field custom-field-checkbox">
            <input type="checkbox" checked={withRemainder} onChange={(e) => setWithRemainder(e.target.checked)} />
            <span>Include remainder</span>
          </label>
        )}
      </div>

      <button className="primary-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
