import type { Operation } from '../types';
import { OPERATION_META, OPERATION_ORDER } from '../lib/operationMeta';

export default function Home({
  onSelect,
  onGuide,
}: {
  onSelect: (op: Operation) => void;
  onGuide: () => void;
}) {
  return (
    <div className="screen">
      <h1 className="title">Mental Math Trainer</h1>
      <p className="subtitle">Pick a section to start practicing.</p>

      <button className="guide-tile" onClick={onGuide}>
        <span className="guide-tile-label">Guide</span>
        <span className="guide-tile-desc">Learn the fastest way to solve each operation in your head, before you practice.</span>
      </button>

      <div className="grid grid-2 operation-grid">
        {OPERATION_ORDER.map((id) => {
          const meta = OPERATION_META[id];
          return (
            <button key={id} className="tile" onClick={() => onSelect(id)}>
              <span className="tile-symbol">{meta.symbol}</span>
              <span className="tile-label">{meta.label}</span>
              <span className="tile-desc">{meta.homeDescription}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
