import type { ModeDef, Operation } from '../types';
import { modesByOperation } from '../lib/modes';
import { OPERATION_META } from '../lib/operationMeta';

export default function ModeSelect({
  operation,
  onSelect,
  onCustomSize,
  onCustomNumbers,
  onBack,
}: {
  operation: Operation;
  onSelect: (mode: ModeDef) => void;
  onCustomSize: (operation: Operation) => void;
  onCustomNumbers: (operation: Operation) => void;
  onBack: () => void;
}) {
  const meta = OPERATION_META[operation];
  const defaults = modesByOperation[operation];

  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <h1 className="title">{meta.label}</h1>
      <p className="subtitle">{meta.modeDescription}</p>

      <h2 className="section-heading">Default</h2>
      <p className="section-desc">Ready-made digit sizes — pick one and start practicing right away.</p>
      <div className="grid grid-3">
        {defaults.map((m) => (
          <button key={m.id} className="tile tile-small" onClick={() => onSelect(m)}>
            {m.label}
          </button>
        ))}
      </div>

      <h2 className="section-heading">Custom Size</h2>
      <p className="section-desc">Choose your own digit length, within the allowed range.</p>
      <div className="grid grid-3">
        <button className="tile tile-small tile-accent" onClick={() => onCustomSize(operation)}>
          Custom Size
        </button>
      </div>

      <h2 className="section-heading">Custom Numbers</h2>
      <p className="section-desc">{meta.customNumberNote}</p>
      <div className="grid grid-3">
        <button className="tile tile-small tile-accent" onClick={() => onCustomNumbers(operation)}>
          Custom Numbers
        </button>
      </div>
    </div>
  );
}
