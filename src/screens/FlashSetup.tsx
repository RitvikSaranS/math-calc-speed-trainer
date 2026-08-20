import { useState } from 'react';
import type { FlashSettings, FlashVariant } from '../lib/flash';
import {
  FLASH_ITERATIONS_MAX,
  FLASH_ITERATIONS_MIN,
  FLASH_INTERVAL_MAX,
  FLASH_INTERVAL_MIN,
  FLASH_STARTING_NUMBER_MAX,
  FLASH_STARTING_NUMBER_MIN,
  FLASH_DIGITS_MAX,
  FLASH_DIGITS_MIN,
} from '../lib/flash';
import NumberField from '../components/NumberField';
import DecimalField from '../components/DecimalField';

export default function FlashSetup({
  variant,
  onContinue,
  onBack,
}: {
  variant: FlashVariant;
  onContinue: (settings: FlashSettings) => void;
  onBack: () => void;
}) {
  const isSubtraction = variant === 'subtraction';
  const [iterations, setIterations] = useState(10);
  const [intervalSeconds, setIntervalSeconds] = useState(1);
  const [startingNumber, setStartingNumber] = useState(1000);
  const [numberDigits, setNumberDigits] = useState(2);

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <h1 className="title">{isSubtraction ? 'Flash Subtraction' : 'Flash Addition'}</h1>
      <p className="subtitle">
        {isSubtraction
          ? 'Numbers flash on screen one at a time — subtract each one from your starting number and keep a running total in your head.'
          : 'Numbers flash on screen one at a time, starting from zero — add each one and keep a running total in your head.'}
      </p>

      <div className="custom-config-form">
        {isSubtraction && (
          <NumberField
            label="Starting number"
            value={startingNumber}
            min={FLASH_STARTING_NUMBER_MIN}
            max={FLASH_STARTING_NUMBER_MAX}
            onChange={setStartingNumber}
          />
        )}
        <NumberField
          label="Number of iterations"
          value={iterations}
          min={FLASH_ITERATIONS_MIN}
          max={FLASH_ITERATIONS_MAX}
          onChange={setIterations}
        />
        <NumberField
          label="Digits per flashed number"
          value={numberDigits}
          min={FLASH_DIGITS_MIN}
          max={FLASH_DIGITS_MAX}
          onChange={setNumberDigits}
        />
        <DecimalField
          label="Time between numbers"
          value={intervalSeconds}
          min={FLASH_INTERVAL_MIN}
          max={FLASH_INTERVAL_MAX}
          onChange={setIntervalSeconds}
        />
      </div>

      <button
        className="primary-button"
        onClick={() =>
          onContinue({ iterations, intervalSeconds, startingNumber: isSubtraction ? startingNumber : 0, numberDigits })
        }
      >
        Start
      </button>
    </div>
  );
}
