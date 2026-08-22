import { useState } from 'react';
import type { ModeDef } from '../types';
import { DIGIT_SIZE_MIN, buildPairCustomNumberMode } from '../lib/modes';
import { OPERATION_META } from '../lib/operationMeta';
import type { DigitPair, PairOperation } from '../lib/storage';
import { loadPairDigitLength, loadPairs, savePairDigitLength, savePairs } from '../lib/storage';
import NumberField from '../components/NumberField';

function isSingleDigit(value: string): boolean {
  return /^[0-9]$/.test(value);
}

export default function PairCustomNumberConfig({
  operation,
  onContinue,
  onBack,
}: {
  operation: PairOperation;
  onContinue: (mode: ModeDef) => void;
  onBack: () => void;
}) {
  const meta = OPERATION_META[operation];
  const isSubtraction = operation === 'subtraction';

  const [pairs, setPairs] = useState<DigitPair[]>(() => loadPairs(operation));
  const [editing, setEditing] = useState(pairs.length === 0);
  const [firstDigitText, setFirstDigitText] = useState('');
  const [secondDigitText, setSecondDigitText] = useState('');
  const [numDigits, setNumDigits] = useState(() => loadPairDigitLength(operation) ?? Math.min(3, meta.sizeLimits.a));

  const canAddPair = isSingleDigit(firstDigitText) && isSingleDigit(secondDigitText);

  function addPair() {
    if (!canAddPair) return;
    const next: DigitPair = [Number(firstDigitText), Number(secondDigitText)];
    const updated = [...pairs, next];
    setPairs(updated);
    savePairs(operation, updated);
    setFirstDigitText('');
    setSecondDigitText('');
  }

  function removePair(index: number) {
    const updated = pairs.filter((_, i) => i !== index);
    setPairs(updated);
    savePairs(operation, updated);
  }

  function handleContinue() {
    savePairDigitLength(operation, numDigits);
    onContinue(buildPairCustomNumberMode(operation, numDigits, pairs));
  }

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <div className="pair-config-header">
        <h1 className="title">Custom Numbers {meta.label}</h1>
        {!editing && (
          <button type="button" className="edit-pairs-button" onClick={() => setEditing(true)}>
            Edit Pairs
          </button>
        )}
      </div>
      <p className="subtitle">{meta.customNumberNote}</p>

      <div className="custom-config-form">
        <NumberField
          label="Number of digits"
          value={numDigits}
          min={DIGIT_SIZE_MIN}
          max={meta.sizeLimits.a}
          onChange={setNumDigits}
        />
      </div>

      {editing ? (
        <>
          <h2 className="section-heading">Add a Digit Pair</h2>
          <p className="section-desc">
            {isSubtraction
              ? 'Enter the top digit (minuend) and the bottom digit (subtrahend) that should share a column.'
              : 'Enter the two digits that should share the same column when added.'}
          </p>

          <div className="pair-entry">
            <input
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="pair-digit-input"
              value={firstDigitText}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '' || isSingleDigit(v)) setFirstDigitText(v);
              }}
              placeholder="0-9"
            />
            <span className="pair-entry-symbol">{isSubtraction ? '−' : '+'}</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="pair-digit-input"
              value={secondDigitText}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '' || isSingleDigit(v)) setSecondDigitText(v);
              }}
              placeholder="0-9"
            />
            <button type="button" className="secondary-button" onClick={addPair} disabled={!canAddPair}>
              Enter
            </button>
          </div>

          <div className="hint-box">
            <p className="hint-title">{pairs.length > 0 ? 'Saved pairs (tap to remove)' : 'No pairs added yet'}</p>
            <div className="hint-chips">
              {pairs.map(([x, y], i) => (
                <button key={i} type="button" className="hint-chip" onClick={() => removePair(i)}>
                  {x} {isSubtraction ? '/' : '+'} {y}
                </button>
              ))}
            </div>
          </div>

          {pairs.length > 0 && (
            <button type="button" className="secondary-button" onClick={() => setEditing(false)}>
              Done Editing
            </button>
          )}
        </>
      ) : (
        <div className="hint-box">
          <p className="hint-title">Your saved pairs</p>
          <div className="hint-chips">
            {pairs.map(([x, y], i) => (
              <span key={i} className="hint-chip hint-chip-static">
                {x} {isSubtraction ? '/' : '+'} {y}
              </span>
            ))}
          </div>
        </div>
      )}

      <button className="primary-button" onClick={handleContinue} disabled={pairs.length === 0}>
        Continue
      </button>
    </div>
  );
}
