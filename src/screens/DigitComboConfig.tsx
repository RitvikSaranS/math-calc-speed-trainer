import { useState } from 'react';
import type { ModeDef } from '../types';
import {
  CUSTOM_ADDITION_COMBOS,
  DIGIT_COMBO_MAX_DIGITS,
  DIGIT_SIZE_MIN,
  CUSTOM_SUBTRACTION_COMBOS,
  buildDigitComboAdditionMode,
  buildDigitComboSubtractionMode,
} from '../lib/modes';
import NumberField from '../components/NumberField';

export default function DigitComboConfig({
  operation,
  onContinue,
  onBack,
}: {
  operation: 'addition' | 'subtraction';
  onContinue: (mode: ModeDef) => void;
  onBack: () => void;
}) {
  const isAddition = operation === 'addition';
  const [numDigits, setNumDigits] = useState(3);
  const combos = isAddition ? CUSTOM_ADDITION_COMBOS : CUSTOM_SUBTRACTION_COMBOS;

  function handleContinue() {
    const mode = isAddition ? buildDigitComboAdditionMode(numDigits) : buildDigitComboSubtractionMode(numDigits);
    onContinue(mode);
  }

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <h1 className="title">Digit Combo {isAddition ? 'Addition' : 'Subtraction'}</h1>
      <p className="subtitle">
        Each digit position is filled using one of the pairs below — pick how many digits the numbers should have.
      </p>

      <div className="custom-config-form">
        <NumberField
          label="Number of digits"
          value={numDigits}
          min={DIGIT_SIZE_MIN}
          max={DIGIT_COMBO_MAX_DIGITS}
          onChange={setNumDigits}
        />
      </div>

      <div className="hint-box">
        <p className="hint-title">{isAddition ? 'Digit pairs in use' : 'Digit pairs in use (top digit, bottom digit)'}</p>
        <div className="hint-chips">
          {combos.map(([x, y]) => (
            <span key={`${x}-${y}`} className="hint-chip hint-chip-static">
              {x} {isAddition ? '+' : '−'} {y}
            </span>
          ))}
        </div>
      </div>

      <button className="primary-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
