import { useState } from 'react';
import type { ModeDef, Operation } from '../types';
import { DIGIT_SIZE_MIN, buildCustomSizeMode } from '../lib/modes';
import { OPERATION_META } from '../lib/operationMeta';
import { loadCustomSize, saveCustomSize } from '../lib/storage';
import NumberField from '../components/NumberField';

export default function CustomConfig({
  operation,
  onContinue,
  onBack,
}: {
  operation: Operation;
  onContinue: (mode: ModeDef) => void;
  onBack: () => void;
}) {
  const meta = OPERATION_META[operation];
  const isTwoOperand = meta.operandCount === 2;
  const saved = loadCustomSize(operation);

  const [sizeA, setSizeA] = useState(
    saved?.a ?? (operation === 'division' ? Math.min(5, meta.sizeLimits.a) : Math.min(3, meta.sizeLimits.a)),
  );
  const [sizeB, setSizeB] = useState(
    saved?.b ?? (operation === 'division' ? Math.min(2, meta.sizeLimits.b) : Math.min(3, meta.sizeLimits.b)),
  );
  const [withRemainder, setWithRemainder] = useState(saved?.withRemainder ?? false);

  const [labelA, labelB] = meta.fieldLabels;

  function handleContinue() {
    const settings = { a: sizeA, b: isTwoOperand ? sizeB : sizeA, withRemainder };
    saveCustomSize(operation, settings);
    onContinue(buildCustomSizeMode(operation, settings));
  }

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <h1 className="title">Custom Size {meta.label}</h1>
      <p className="subtitle">
        {isTwoOperand ? "Pick the size of each number — they don't need to match." : 'Pick the digit length to practice with.'}
      </p>

      <div className="custom-config-form">
        <NumberField label={labelA} value={sizeA} min={DIGIT_SIZE_MIN} max={meta.sizeLimits.a} onChange={setSizeA} />
        {isTwoOperand && labelB && (
          <NumberField label={labelB} value={sizeB} min={DIGIT_SIZE_MIN} max={meta.sizeLimits.b} onChange={setSizeB} />
        )}

        {meta.supportsRemainder && (
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
