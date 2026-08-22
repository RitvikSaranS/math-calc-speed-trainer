interface CrosswiseMultiplyDiagramProps {
  id: string;
  ariaLabel: string;
  caption: string;
  top: [number, number]; // [tens, units] of the top (first) number
  bottom: [number, number]; // [tens, units] of the bottom (second) number
}

const HUNDREDS_X = 46;
const TENS_X = 126;
const UNITS_X = 206;
const OPERATOR_X = 66;

export default function CrosswiseMultiplyDiagram({ id, ariaLabel, caption, top, bottom }: CrosswiseMultiplyDiagramProps) {
  const [topTens, topUnits] = top;
  const [bottomTens, bottomUnits] = bottom;

  const onesRaw = topUnits * bottomUnits;
  const onesDigit = onesRaw % 10;
  const onesCarry = Math.floor(onesRaw / 10);

  const crossRaw = topTens * bottomUnits + topUnits * bottomTens + onesCarry;
  const crossDigit = crossRaw % 10;
  const crossCarry = Math.floor(crossRaw / 10);

  const hundredsRaw = topTens * bottomTens + crossCarry;

  const answer = `${hundredsRaw}${crossDigit}${onesDigit}`;
  const arrowId = `guide-arrow-${id}`;
  const midOnesTens = (UNITS_X + TENS_X) / 2;
  const midTensHundreds = (TENS_X + HUNDREDS_X) / 2;

  return (
    <figure className="guide-diagram">
      <svg viewBox="0 0 280 300" role="img" aria-label={ariaLabel} className="guide-diagram-svg">
        <defs>
          <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--accent)" />
          </marker>
        </defs>

        <text x={TENS_X} y={16} textAnchor="middle" fontSize="11" fill="currentColor" opacity={0.6}>
          Tens
        </text>
        <text x={UNITS_X} y={16} textAnchor="middle" fontSize="11" fill="currentColor" opacity={0.6}>
          Units
        </text>

        <text x={TENS_X} y={44} textAnchor="middle" fontSize="24" fontWeight={700} fill="currentColor">
          {topTens}
        </text>
        <text x={UNITS_X} y={44} textAnchor="middle" fontSize="24" fontWeight={700} fill="currentColor">
          {topUnits}
        </text>

        <text x={OPERATOR_X} y={78} textAnchor="middle" fontSize="22" fill="currentColor">
          ×
        </text>
        <text x={TENS_X} y={78} textAnchor="middle" fontSize="24" fontWeight={700} fill="currentColor">
          {bottomTens}
        </text>
        <text x={UNITS_X} y={78} textAnchor="middle" fontSize="24" fontWeight={700} fill="currentColor">
          {bottomUnits}
        </text>

        <line x1={TENS_X} y1={92} x2={TENS_X} y2={155} stroke="var(--accent)" strokeWidth={2} />
        <line x1={UNITS_X} y1={92} x2={UNITS_X} y2={155} stroke="var(--accent)" strokeWidth={2} />
        <line x1={TENS_X} y1={92} x2={UNITS_X} y2={155} stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 3" opacity={0.85} />
        <line x1={UNITS_X} y1={92} x2={TENS_X} y2={155} stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 3" opacity={0.85} />

        <text x={TENS_X - 10} y={123} textAnchor="end" fontSize="11" fontWeight={600} fill="var(--accent)">
          {topTens}×{bottomTens}
        </text>
        <text x={UNITS_X + 10} y={123} textAnchor="start" fontSize="11" fontWeight={600} fill="var(--accent)">
          {topUnits}×{bottomUnits}
        </text>
        <text x={midOnesTens} y={172} textAnchor="middle" fontSize="11" fontWeight={600} fill="var(--accent)">
          {topTens}×{bottomUnits} + {topUnits}×{bottomTens}
        </text>

        <path
          d={`M ${UNITS_X - 8} 228 Q ${midOnesTens} 205 ${TENS_X + 18} 230`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          markerEnd={`url(#${arrowId})`}
        />
        <text x={midOnesTens} y={200} textAnchor="middle" fontSize="11" fontWeight={600} fill="var(--accent)">
          {`+${onesCarry}`}
        </text>

        <path
          d={`M ${TENS_X - 8} 228 Q ${midTensHundreds} 205 ${HUNDREDS_X + 18} 230`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          markerEnd={`url(#${arrowId})`}
        />
        <text x={midTensHundreds} y={200} textAnchor="middle" fontSize="11" fontWeight={600} fill="var(--accent)">
          {`+${crossCarry}`}
        </text>

        <text x={HUNDREDS_X} y={238} textAnchor="middle" fontSize="24" fontWeight={700} fill="var(--accent)">
          {hundredsRaw}
        </text>
        <text x={TENS_X} y={238} textAnchor="middle" fontSize="26" fontWeight={700} fill="var(--accent)">
          {crossDigit}
        </text>
        <text x={UNITS_X} y={238} textAnchor="middle" fontSize="26" fontWeight={700} fill="var(--accent)">
          {onesDigit}
        </text>

        <text x={(HUNDREDS_X + UNITS_X) / 2} y={272} textAnchor="middle" fontSize="20" fontWeight={700} fill="var(--accent)">
          {`= ${answer}`}
        </text>
      </svg>
      <figcaption className="guide-diagram-caption">{caption}</figcaption>
    </figure>
  );
}
