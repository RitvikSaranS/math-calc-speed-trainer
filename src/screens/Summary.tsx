import type { SessionResult } from './Practice';

export default function Summary({
  results,
  modeLabel,
  onRestart,
  onRetryWrong,
  onChangeMode,
  onHome,
}: {
  results: SessionResult[];
  modeLabel: string;
  onRestart: () => void;
  onRetryWrong: () => void;
  onChangeMode: () => void;
  onHome: () => void;
}) {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const wrongCount = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const totalTimeMs = results.reduce((sum, r) => sum + r.timeMs, 0);
  const avgTimeMs = total > 0 ? totalTimeMs / total : 0;

  return (
    <div className="screen">
      <h1 className="title">Session Complete</h1>
      <p className="subtitle">{modeLabel}</p>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{correct}/{total}</span>
          <span className="stat-label">Correct</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{accuracy}%</span>
          <span className="stat-label">Accuracy</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{(totalTimeMs / 1000).toFixed(1)}s</span>
          <span className="stat-label">Total Time</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{(avgTimeMs / 1000).toFixed(1)}s</span>
          <span className="stat-label">Avg / Question</span>
        </div>
      </div>

      <div className="summary-actions">
        <button className="primary-button" onClick={onRestart}>
          Retry
        </button>
        {wrongCount > 0 && (
          <button className="secondary-button" onClick={onRetryWrong}>
            Retry Wrong Ones ({wrongCount})
          </button>
        )}
        <button className="secondary-button" onClick={onChangeMode}>
          Change Mode
        </button>
        <button className="secondary-button" onClick={onHome}>
          Home
        </button>
      </div>
    </div>
  );
}
