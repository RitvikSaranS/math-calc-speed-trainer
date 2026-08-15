import type { Operation } from '../types';

const OPERATIONS: { id: Operation; label: string; symbol: string }[] = [
  { id: 'addition', label: 'Addition', symbol: '+' },
  { id: 'subtraction', label: 'Subtraction', symbol: '−' },
  { id: 'multiplication', label: 'Multiplication', symbol: '×' },
  { id: 'division', label: 'Division', symbol: '÷' },
];

export default function Home({ onSelect }: { onSelect: (op: Operation) => void }) {
  return (
    <div className="screen">
      <h1 className="title">Mental Math Trainer</h1>
      <p className="subtitle">Pick an operation to start practicing.</p>
      <div className="grid grid-2">
        {OPERATIONS.map((op) => (
          <button key={op.id} className="tile" onClick={() => onSelect(op.id)}>
            <span className="tile-symbol">{op.symbol}</span>
            <span className="tile-label">{op.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
