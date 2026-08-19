import { useState } from 'react';
import type { ModeDef, Operation } from '../types';
import { DIGIT_SIZE_MIN, buildCustomNumberMode } from '../lib/modes';
import { OPERATION_META } from '../lib/operationMeta';
import NumberField from '../components/NumberField';
import DigitPoolPicker from '../components/DigitPoolPicker';

export default function CustomNumberConfig({
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
  const [sizeA, setSizeA] = useState(operation === 'division' ? Math.min(4, meta.sizeLimits.a) : Math.min(2, meta.sizeLimits.a));
  const [sizeB, setSizeB] = useState(operation === 'division' ? Math.min(2, meta.sizeLimits.b) : Math.min(2, meta.sizeLimits.b));
  const [withRemainder, setWithRemainder] = useState(false);
  const [pool, setPool] = useState<number[]>([7, 8, 9]);

  const [labelA, labelB] = meta.fieldLabels;

  function handleContinue() {
    onContinue(buildCustomNumberMode(operation, { a: sizeA, b: isTwoOperand ? sizeB : sizeA, withRemainder }, pool));
  }

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <h1 className="title">Custom Numbers {meta.label}</h1>
      <p className="subtitle">{meta.customNumberNote}</p>

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

      <h2 className="section-heading">Digits to Use</h2>
      <p className="section-desc">Pick at least one digit — problems will be built only from the digits you select here.</p>
      <DigitPoolPicker selected={pool} onChange={setPool} />

      <button className="primary-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
