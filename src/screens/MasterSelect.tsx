import { useState } from 'react';
import type { MasterMode, ModeDef } from '../types';
import NumberField from '../components/NumberField';

const MASTER_MODES: { id: MasterMode; label: string; description: string }[] = [
  { id: 'enter', label: 'Enter Answer', description: 'Type the answer yourself.' },
  { id: 'options', label: 'Options', description: 'Pick the correct answer from choices.' },
  { id: 'flashcard', label: 'Flashcard', description: 'Reveal the answer by tapping the card.' },
];

const ROUND_COUNT_MIN = 1;
const ROUND_COUNT_MAX = 100;

export default function MasterSelect({
  mode,
  onStart,
  onBack,
}: {
  mode: ModeDef;
  onStart: (master: MasterMode, count: number) => void;
  onBack: () => void;
}) {
  const [master, setMaster] = useState<MasterMode>('enter');
  const [count, setCount] = useState(10);

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

      <h2 className="section-heading">Question Count</h2>
      <div className="custom-config-form">
        <NumberField label="Count" value={count} min={ROUND_COUNT_MIN} max={ROUND_COUNT_MAX} onChange={setCount} />
      </div>

      <button className="primary-button" onClick={() => onStart(master, count)}>
        Start Practice
      </button>
    </div>
  );
}
