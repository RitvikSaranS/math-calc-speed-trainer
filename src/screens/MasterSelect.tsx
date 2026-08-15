import { useState } from 'react';
import type { FlashConfig, MasterMode, ModeDef } from '../types';
import { FLASH_MAX_DIGITS, DIGIT_SIZE_MIN } from '../lib/modes';
import NumberField from '../components/NumberField';

const MASTER_MODES: { id: MasterMode; label: string; description: string }[] = [
  { id: 'enter', label: 'Enter Answer', description: 'Type the answer yourself.' },
  { id: 'options', label: 'Options', description: 'Pick the correct answer from choices.' },
  { id: 'flashcard', label: 'Flashcards', description: 'Reveal the answer by tapping the card.' },
  { id: 'flash', label: 'Flash Add', description: 'Numbers flash by one at a time — add them all up.' },
];

const ROUND_COUNT_MIN = 1;
const ROUND_COUNT_MAX = 100;
const FLASH_COUNT_MIN = 2;
const FLASH_COUNT_MAX = 30;

export default function MasterSelect({
  mode,
  onStart,
  onBack,
}: {
  mode: ModeDef;
  onStart: (master: MasterMode, count: number, flashConfig: FlashConfig) => void;
  onBack: () => void;
}) {
  const [master, setMaster] = useState<MasterMode>('enter');
  const [count, setCount] = useState(10);
  const [flashDigitSize, setFlashDigitSize] = useState(2);
  const [flashCount, setFlashCount] = useState(10);

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <h1 className="title">{mode.label}</h1>
      <p className="subtitle">Choose how you want to practice.</p>

      <div className="grid grid-3">
        {MASTER_MODES.map((m) => (
          <button
            key={m.id}
            className={`tile tile-small ${master === m.id ? 'tile-selected' : ''}`}
            onClick={() => setMaster(m.id)}
          >
            <span className="tile-label">{m.label}</span>
            <span className="tile-desc">{m.description}</span>
          </button>
        ))}
      </div>

      {master === 'flash' && (
        <>
          <h2 className="section-heading">Flash Settings</h2>
          <div className="custom-config-form">
            <NumberField
              label="Digit size of each number"
              value={flashDigitSize}
              min={DIGIT_SIZE_MIN}
              max={FLASH_MAX_DIGITS}
              onChange={setFlashDigitSize}
            />
            <NumberField
              label="How many numbers to flash"
              value={flashCount}
              min={FLASH_COUNT_MIN}
              max={FLASH_COUNT_MAX}
              onChange={setFlashCount}
            />
          </div>
        </>
      )}

      <h2 className="section-heading">{master === 'flash' ? 'Number of Rounds' : 'Question Count'}</h2>
      <div className="custom-config-form">
        <NumberField label="Count" value={count} min={ROUND_COUNT_MIN} max={ROUND_COUNT_MAX} onChange={setCount} />
      </div>

      <button
        className="primary-button"
        onClick={() => onStart(master, count, { digitSize: flashDigitSize, count: flashCount })}
      >
        Start Practice
      </button>
    </div>
  );
}
