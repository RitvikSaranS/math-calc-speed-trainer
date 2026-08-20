import type { Operation } from '../types';
import type { FlashVariant } from '../lib/flash';
import { OPERATION_META, OPERATION_ORDER } from '../lib/operationMeta';

export default function Home({
  onSelect,
  onGuide,
  onFlash,
}: {
  onSelect: (op: Operation) => void;
  onGuide: () => void;
  onFlash: (variant: FlashVariant) => void;
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

      <h2 className="section-heading">Flash Rounds</h2>
      <p className="section-desc">Numbers flash on screen automatically — keep a running total in your head.</p>
      <div className="grid grid-2">
        <button className="tile" onClick={() => onFlash('addition')}>
          <span className="tile-symbol">+</span>
          <span className="tile-label">Flash Addition</span>
          <span className="tile-desc">Starts at zero — add each flashed number as it appears.</span>
        </button>
        <button className="tile" onClick={() => onFlash('subtraction')}>
          <span className="tile-symbol">−</span>
          <span className="tile-label">Flash Subtraction</span>
          <span className="tile-desc">Starts at a number you choose — subtract each flashed number as it appears.</span>
        </button>
      </div>
    </div>
  );
}
