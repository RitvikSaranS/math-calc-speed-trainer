import type { ThemePreference } from '../lib/theme';

const OPTIONS: { id: ThemePreference; icon: string; label: string }[] = [
  { id: 'system', icon: '💻', label: 'System theme' },
  { id: 'light', icon: '☀️', label: 'Light theme' },
  { id: 'dark', icon: '🌙', label: 'Dark theme' },
];

export default function ThemeToggle({
  preference,
  onChange,
}: {
  preference: ThemePreference;
  onChange: (pref: ThemePreference) => void;
}) {
  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          className={`theme-toggle-btn ${preference === opt.id ? 'active' : ''}`}
          aria-label={opt.label}
          title={opt.label}
          onClick={() => onChange(opt.id)}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
