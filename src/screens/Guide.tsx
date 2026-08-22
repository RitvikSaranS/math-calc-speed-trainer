import { OPERATION_META } from '../lib/operationMeta';
import ColumnFlowDiagram from '../components/ColumnFlowDiagram';
import CrosswiseMultiplyDiagram from '../components/CrosswiseMultiplyDiagram';

const COMING_SOON: { operation: keyof typeof OPERATION_META; note: string }[] = [
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

        <p className="guide-intro">
          This method lets you read a problem once, left to right, and say the answer as you go — no scratch paper, no going
          back to fix a digit. It takes a little practice to feel natural, but once the single-digit sums are automatic,
          most 2-3 digit additions take a few seconds. We'll use <strong>57 + 78</strong> as our running example.
        </p>

        <ol className="guide-steps">
          <li>
            <strong>Memorize your single-digit sums.</strong> Every combination from 0+0 to 9+9 should eventually be instant
            recall — the same way you know your times tables, not something you count out on your fingers. See "7 + 8" and
            "15" should just pop into your head. Don't have these memorized yet? That's fine for now — just add normally;
            memorizing them is what makes this method <em>fast</em>, not what makes it work.
          </li>
          <li>
            <strong>Work left to right, not right to left.</strong> In school you probably learned to start from the ones
            digit (the rightmost, smallest one) and move left. Here we flip it: start from the leftmost digit (the biggest
            one) and move right. For 57 + 78, that means starting with the tens digits, <strong>5 and 7</strong> — not the
            units digits, 7 and 8.
          </li>
          <li>
            <strong>Before you settle on a column's answer, peek at the column just to its right.</strong> If those two
            digits add up to 10 or more, you already know a carry is about to arrive — so add 1 to your current column right
            now, instead of writing it down and fixing it later. Working on the tens column of 57 + 78 (5 + 7 = 12), peek at
            the units column: 7 + 8 = 15. Since that's 10 or more, a carry is coming — so write <strong>13</strong>, not 12.
          </li>
          <li>
            <strong>The last column (farthest right) has nothing to peek at.</strong> Just add its two digits and write down
            only the last digit of that sum. For 57 + 78, the units are 7 + 8 = 15 — you write only the <strong>5</strong>.
            (The 10 hiding inside that 15 was already carried into the tens column in the step before.)
          </li>
        </ol>

        <p className="guide-lead-in">Put it all together, start to finish:</p>

        <div className="guide-example">
          <p className="guide-example-title">Example — 57 + 78</p>
          <p className="guide-line">Tens: 5 + 7 = 12</p>
          <p className="guide-line">Peek units: 7 + 8 = 15 → ≥ 10, so a carry is coming → 12 + 1 = <strong>13</strong></p>
          <p className="guide-line">Units: 7 + 8 = 15 → write just the ones digit, <strong>5</strong></p>
          <p className="guide-result">13, then 5 → 135</p>
          <ColumnFlowDiagram
            id="add"
            ariaLabel="Column diagram of 57 plus 78: the units column sums to 15, which sends a carry of 1 into the tens column, turning 12 into 13; the final answer is 135."
            caption="The units carry (7+8=15) flows left and bumps the tens sum from 12 to 13 before you ever write a digit."
            operator="+"
            columnLabels={['Tens', 'Units']}
            topDigits={['5', '7']}
            bottomDigits={['7', '8']}
            rawLabels={['5+7=12', '7+8=15']}
            mechanismLabel="carries 1 left"
            finalDigits={['13', '5']}
            answer="135"
          />
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

        <p className="guide-intro">
          Subtraction uses the exact same left-to-right rhythm as addition — you're just watching for "borrows" instead of
          "carries." We'll use <strong>82 − 47</strong> as our running example. Throughout, "top digit" means the digit from
          the number you're starting with (82), and "bottom digit" means the digit from the number you're taking away (47).
        </p>

        <ol className="guide-steps">
          <li>
            <strong>Learn the "borrow" trick.</strong> Whenever a column's top digit is smaller than its bottom digit, you
            can't subtract normally — the answer is top + (10 − bottom). Example: top 7, bottom 9 → 10 − 9 = 1, then
            7 + 1 = 8. So "top 7, bottom 9" instantly gives "8" (and you'll owe 1 to the column on the left — more on that in
            step 3). Like addition's number pairs, this becomes instant recall with practice — until then, just work out
            top + (10 − bottom) directly; it still works, just a little slower.
          </li>
          <li>
            <strong>Work left to right</strong>, same as addition — start from the biggest digit and move toward the
            smallest. For 82 − 47, that means starting with the tens digits, <strong>8 and 4</strong> — not the units
            digits, 2 and 7.
          </li>
          <li>
            <strong>Before you settle on a column's answer, peek at the column just to its right.</strong> If its top digit
            is smaller than its bottom digit, that column is about to borrow from yours — so subtract 1 from your current
            column right now. Working on the tens column of 82 − 47 (8 − 4 = 4), peek at the units column: top 2, bottom 7.
            Since 2 is smaller than 7, the units column needs to borrow — so write <strong>3</strong>, not 4.
          </li>
          <li>
            <strong>The last column (farthest right) has nothing to peek at.</strong> If its top digit is smaller than its
            bottom digit, use the trick from step 1: top + (10 − bottom). For 82 − 47, the units are top 2, bottom 7 →
            2 + (10 − 7) = <strong>5</strong>.
          </li>
        </ol>

        <p className="guide-lead-in">Put it all together, start to finish:</p>

        <div className="guide-example">
          <p className="guide-example-title">Example — 82 − 47</p>
          <p className="guide-line">Tens: 8 − 4 = 4. Peek units: 2 vs 7 → 2 &lt; 7, borrow coming → 4 − 1 = <strong>3</strong></p>
          <p className="guide-line">Units: 2 &lt; 7, so 2 + (10 − 7) = <strong>5</strong></p>
          <p className="guide-result">3, then 5 → 35</p>
          <ColumnFlowDiagram
            id="sub"
            ariaLabel="Column diagram of 82 minus 47: the units column needs to borrow because 2 is less than 7, which pulls 1 away from the tens result, turning 4 into 3; the final answer is 35."
            caption="Units needs a borrow (2 < 7), which pulls 1 away from the tens result before you write a digit."
            operator="−"
            columnLabels={['Tens', 'Units']}
            topDigits={['8', '2']}
            bottomDigits={['4', '7']}
            rawLabels={['8−4=4', '2 < 7']}
            mechanismLabel="borrows 1 left"
            finalDigits={['3', '5']}
            answer="35"
          />
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
        <h2 className="guide-heading">
          <span className="guide-symbol">×</span> Multiplication — Vertically and Crosswise
        </h2>

        <p className="guide-intro">
          This is a <strong>general method</strong> — it works for multiplying any two natural numbers, no matter what the
          digits are. But it's not always the <em>fastest</em> option: before reaching for it, check whether one of your
          numbers is "special" — a multiple or power of 5 (5, 25, 50, 250...), a repeated 1 (1, 11, 111, 1111...), or a
          repeated 9 (9, 99, 999, 9999...). Numbers like these usually have a much quicker shortcut (those are coming soon).
          If neither number is special, use the general method below. We'll use <strong>78 × 36</strong> as our running
          example.
        </p>

        <ol className="guide-steps">
          <li>
            <strong>Line up the two numbers by place value</strong>, one above the other — just like normal multiplication.
            For 78 × 36, that's <strong>7, 8</strong> on top and <strong>3, 6</strong> underneath: tens above tens, units
            above units.
          </li>
          <li>
            <strong>Multiply straight down the units column.</strong> This "vertical" pass gives the units digit of the
            answer, plus however many tens you need to carry. For 78 × 36: 8 × 6 = 48 → the units digit of the answer is
            <strong> 8</strong>, and you carry 4 tens.
          </li>
          <li>
            <strong>Multiply crosswise, add the two results, then add the carry.</strong> "Crosswise" means top-left ×
            bottom-right, plus top-right × bottom-left. For 78 × 36: 7 × 6 = 42, and 8 × 3 = 24. Add those together with the
            4 tens you carried: 42 + 24 + 4 = 70. The tens digit of the answer is <strong>0</strong>, and you carry
            7 hundreds.
          </li>
          <li>
            <strong>Multiply straight down the tens column</strong> — the last vertical pass — then add the carry from the
            crosswise step. For 78 × 36: 7 × 3 = 21, plus the 7 hundreds carried = <strong>28</strong>. Since this is the
            leftmost step, write the full number as-is — don't worry that it's two digits.
          </li>
        </ol>

        <p className="guide-lead-in">Put it all together, start to finish:</p>

        <div className="guide-example">
          <p className="guide-example-title">Example — 78 × 36</p>
          <p className="guide-line">Units (vertical): 8 × 6 = 48 → write <strong>8</strong>, carry 4</p>
          <p className="guide-line">Tens (crosswise): 7×6 + 8×3 = 42 + 24 = 66, + 4 carried = 70 → write <strong>0</strong>, carry 7</p>
          <p className="guide-line">Hundreds (vertical): 7 × 3 = 21, + 7 carried = <strong>28</strong></p>
          <p className="guide-result">28, then 0, then 8 → 2808</p>
          <CrosswiseMultiplyDiagram
            id="mul"
            ariaLabel="Crosswise diagram of 78 times 36: units 8 times 6 makes 48, carrying 4; crosswise 7 times 6 plus 8 times 3 plus the carried 4 makes 70, carrying 7; tens 7 times 3 plus the carried 7 makes 28; the final answer is 2808."
            caption="Straight down (8×6), crosswise (7×6 + 8×3), straight down again (7×3) — each pass carries into the next one to the left."
            top={[7, 8]}
            bottom={[3, 6]}
          />
        </div>

        <p className="guide-tip">
          Tip: this scales to more digits too — a 3-digit × 3-digit multiplication just adds more crosswise passes (each one
          wider than the last, then narrowing back down), always carrying into the pass to its left. The rhythm never
          changes: multiply, add the crossing pairs, add the carry, write the last digit, carry the rest.
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
