import { OPERATION_META } from '../lib/operationMeta';

const COMING_SOON: { operation: keyof typeof OPERATION_META; note: string }[] = [
  { operation: 'multiplication', note: 'Coming soon.' },
  { operation: 'division', note: 'The vertical-and-crosswise method — workable left-to-right or right-to-left — is coming soon.' },
  { operation: 'squareRoot', note: 'Coming soon.' },
  { operation: 'cubeRoot', note: 'Coming soon.' },
  { operation: 'squaring', note: 'Coming soon.' },
];

export default function Guide({ onBack }: { onBack: () => void }) {
  return (
    <div className="screen guide-screen">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <h1 className="title">Speed Guide</h1>
      <p className="subtitle">The fastest way to solve each operation in your head — learn it here, then drill it in practice.</p>

      <section className="guide-section">
        <h2 className="guide-heading">
          <span className="guide-symbol">+</span> Addition — Left-to-Right with Carry Lookahead
        </h2>

        <ol className="guide-steps">
          <li>
            <strong>Know your pairs instantly.</strong> Memorize every single-digit sum (0-9 + 0-9) so it's instant recall, not
            counting. See "7 + 8" and instantly think "15" — never count up.
          </li>
          <li>
            <strong>Work left to right</strong> — start from the highest place value, not the ones column like the school
            method.
          </li>
          <li>
            <strong>Peek one position to the right</strong> before you commit a digit. If that pair sums to 10 or more, a
            carry is coming — add 1 to your current result right now, instead of fixing it later.
          </li>
          <li>
            <strong>At the last (rightmost) position</strong>, there's nothing left to peek at — just write down the ones
            digit of that final sum. Its carry was already applied to the position before it.
          </li>
        </ol>

        <div className="guide-example">
          <p className="guide-example-title">Example — 57 + 78</p>
          <p className="guide-line">Tens: 5 + 7 = 12</p>
          <p className="guide-line">Peek units: 7 + 8 = 15 → ≥ 10, so a carry is coming → 12 + 1 = <strong>13</strong></p>
          <p className="guide-line">Units: 7 + 8 = 15 → write just the ones digit, <strong>5</strong></p>
          <p className="guide-result">13, then 5 → 135</p>
        </div>

        <div className="guide-example">
          <p className="guide-example-title">Example — 456 + 389</p>
          <p className="guide-line">Hundreds: 4 + 3 = 7. Peek tens: 5 + 8 = 13 → ≥ 10, carry coming → 7 + 1 = <strong>8</strong></p>
          <p className="guide-line">Tens: 5 + 8 = 13. Peek units: 6 + 9 = 15 → ≥ 10, carry coming → 13 + 1 = 14 → write <strong>4</strong></p>
          <p className="guide-line">Units: 6 + 9 = 15 → write just the ones digit, <strong>5</strong></p>
          <p className="guide-result">8, 4, 5 → 845</p>
        </div>

        <p className="guide-tip">
          Tip: only the leftmost block can end up more than one digit — that's normal, it's just the front of your answer.
          Every block after that, you only ever write its ones digit.
        </p>
      </section>

      <section className="guide-section">
        <h2 className="guide-heading">
          <span className="guide-symbol">−</span> Subtraction — Left-to-Right with Borrow Lookahead
        </h2>

        <ol className="guide-steps">
          <li>
            <strong>Know your borrow pairs instantly.</strong> Whenever the top digit is smaller than the bottom digit, the
            result is top + (10 − bottom) — memorize this like an addition fact. Example: top 7, bottom 9 → 10 − 9 = 1, then
            7 + 1 = 8. So "7 and 9" instantly gives "8, borrow 1".
          </li>
          <li>
            <strong>Work left to right</strong>, same rhythm as addition.
          </li>
          <li>
            <strong>Peek one position to the right</strong> before you commit a digit. If its top digit is smaller than its
            bottom digit, a borrow is coming — subtract 1 from your current result right now.
          </li>
          <li>
            <strong>At the last (rightmost) position</strong>, if its top digit is smaller than its bottom digit, use the
            complement trick from step 1: top + (10 − bottom).
          </li>
        </ol>

        <div className="guide-example">
          <p className="guide-example-title">Example — 82 − 47</p>
          <p className="guide-line">Tens: 8 − 4 = 4. Peek units: 2 vs 7 → 2 &lt; 7, borrow coming → 4 − 1 = <strong>3</strong></p>
          <p className="guide-line">Units: 2 &lt; 7, so 2 + (10 − 7) = <strong>5</strong></p>
          <p className="guide-result">3, then 5 → 35</p>
        </div>

        <div className="guide-example">
          <p className="guide-example-title">Example — 923 − 457</p>
          <p className="guide-line">Hundreds: 9 − 4 = 5. Peek tens: 2 vs 5 → 2 &lt; 5, borrow coming → 5 − 1 = <strong>4</strong></p>
          <p className="guide-line">Tens: 2 &lt; 5, so 2 + (10 − 5) = 7. Peek units: 3 vs 7 → 3 &lt; 7, borrow coming → 7 − 1 = <strong>6</strong></p>
          <p className="guide-line">Units: 3 &lt; 7, so 3 + (10 − 7) = <strong>6</strong></p>
          <p className="guide-result">4, 6, 6 → 466</p>
        </div>

        <p className="guide-tip">
          Tip: this mirrors the addition trick exactly — carries become borrows, but the "peek one ahead, adjust now" rhythm
          is identical.
        </p>
      </section>

      <section className="guide-section">
        <h2 className="guide-heading">More Techniques</h2>
        <div className="coming-soon-grid">
          {COMING_SOON.map(({ operation, note }) => {
            const meta = OPERATION_META[operation];
            return (
              <div key={operation} className="coming-soon-card">
                <span className="coming-soon-symbol">{meta.symbol}</span>
                <span className="coming-soon-label">{meta.label}</span>
                <span className="coming-soon-note">{note}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
