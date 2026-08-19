const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function DigitPoolPicker({
  selected,
  onChange,
  min = 1,
}: {
  selected: number[];
  onChange: (digits: number[]) => void;
  min?: number;
}) {
  function toggle(d: number) {
    if (selected.includes(d)) {
      if (selected.length <= min) return;
      onChange(selected.filter((x) => x !== d));
    } else {
      onChange([...selected, d].sort((a, b) => a - b));
    }
  }

  return (
    <div className="digit-pool">
      {DIGITS.map((d) => (
        <button
          key={d}
          type="button"
          className={`digit-chip ${selected.includes(d) ? 'selected' : ''}`}
          onClick={() => toggle(d)}
        >
          {d}
        </button>
      ))}
    </div>
  );
}
