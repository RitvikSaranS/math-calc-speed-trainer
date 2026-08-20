import { useEffect, useState } from 'react';

export default function DecimalField({
  label,
  value,
  min,
  max,
  step = 0.1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  function commit(raw: string) {
    const parsed = Number(raw);
    if (raw.trim() === '' || Number.isNaN(parsed)) {
      setText(String(value));
      return;
    }
    const clamped = Math.round(Math.max(min, Math.min(max, parsed)) * 100) / 100;
    setText(String(clamped));
    if (clamped !== value) onChange(clamped);
  }

  return (
    <label className="custom-field">
      <span>
        {label} <span className="field-range">({min}-{max}s)</span>
      </span>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
        }}
      />
    </label>
  );
}
