interface ColumnFlowDiagramProps {
  id: string;
  ariaLabel: string;
  caption: string;
  operator: string;
  columnLabels: [string, string];
  topDigits: [string, string];
  bottomDigits: [string, string];
  rawLabels: [string, string];
  mechanismLabel: string;
  finalDigits: [string, string];
  answer: string;
}

const TENS_X = 108;
const UNITS_X = 196;
const MID_X = (TENS_X + UNITS_X) / 2;
const RAW_Y = 120;

export default function ColumnFlowDiagram({
  id,
  ariaLabel,
  caption,
  operator,
  columnLabels,
  topDigits,
  bottomDigits,
  rawLabels,
  mechanismLabel,
  finalDigits,
  answer,
}: ColumnFlowDiagramProps) {
  const arrowId = `guide-arrow-${id}`;

  return (
    <figure className="guide-diagram">
      <svg viewBox="0 0 304 250" role="img" aria-label={ariaLabel} className="guide-diagram-svg">
        <defs>
          <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--accent)" />
          </marker>
        </defs>

        <text x={TENS_X} y={16} textAnchor="middle" fontSize="11" fill="currentColor" opacity={0.6}>
          {columnLabels[0]}
        </text>
        <text x={UNITS_X} y={16} textAnchor="middle" fontSize="11" fill="currentColor" opacity={0.6}>
          {columnLabels[1]}
        </text>

        <text x={TENS_X} y={46} textAnchor="middle" fontSize="24" fontWeight={700} fill="currentColor">
          {topDigits[0]}
        </text>
        <text x={UNITS_X} y={46} textAnchor="middle" fontSize="24" fontWeight={700} fill="currentColor">
          {topDigits[1]}
        </text>

        <text x={44} y={80} textAnchor="middle" fontSize="22" fill="currentColor">
          {operator}
        </text>
        <text x={TENS_X} y={80} textAnchor="middle" fontSize="24" fontWeight={700} fill="currentColor">
          {bottomDigits[0]}
        </text>
        <text x={UNITS_X} y={80} textAnchor="middle" fontSize="24" fontWeight={700} fill="currentColor">
          {bottomDigits[1]}
        </text>

        <line x1={30} y1={94} x2={234} y2={94} stroke="currentColor" strokeWidth={2} />

        <text x={TENS_X} y={RAW_Y} textAnchor="middle" fontSize="14" fill="currentColor" opacity={0.55}>
          {rawLabels[0]}
        </text>
        <text x={UNITS_X} y={RAW_Y} textAnchor="middle" fontSize="14" fill="currentColor" opacity={0.55}>
          {rawLabels[1]}
        </text>

        <path
          d={`M ${UNITS_X - 12} ${RAW_Y + 10} Q ${MID_X} ${RAW_Y + 40} ${TENS_X + 20} ${RAW_Y + 12}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          markerEnd={`url(#${arrowId})`}
        />
        <text x={MID_X} y={RAW_Y + 50} textAnchor="middle" fontSize="12" fontWeight={600} fill="var(--accent)">
          {mechanismLabel}
        </text>

        <text x={TENS_X} y={200} textAnchor="middle" fontSize="26" fontWeight={700} fill="var(--accent)">
          {finalDigits[0]}
        </text>
        <text x={UNITS_X} y={200} textAnchor="middle" fontSize="26" fontWeight={700} fill="var(--accent)">
          {finalDigits[1]}
        </text>

        <text x={MID_X} y={234} textAnchor="middle" fontSize="20" fontWeight={700} fill="var(--accent)">
          {`= ${answer}`}
        </text>
      </svg>
      <figcaption className="guide-diagram-caption">{caption}</figcaption>
    </figure>
  );
}
