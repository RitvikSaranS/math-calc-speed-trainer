import { useEffect, useRef, useState } from 'react';
import type { FlashSequence, FlashSettings, FlashVariant } from '../lib/flash';
import { generateFlashSequence } from '../lib/flash';

type Phase = 'flashing' | 'answering' | 'result';

export default function FlashRound({
  variant,
  settings,
  onChangeSettings,
  onHome,
}: {
  variant: FlashVariant;
  settings: FlashSettings;
  onChangeSettings: () => void;
  onHome: () => void;
}) {
  const isSubtraction = variant === 'subtraction';

  const [sequence, setSequence] = useState<FlashSequence>(() =>
    generateFlashSequence(variant, settings.iterations, settings.startingNumber),
  );
  const [phase, setPhase] = useState<Phase>('flashing');
  const [index, setIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [correct, setCorrect] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== 'flashing') return;
    if (index >= sequence.numbers.length) {
      setPhase('answering');
      return;
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), settings.intervalSeconds * 1000);
    return () => clearTimeout(timer);
  }, [phase, index, sequence, settings.intervalSeconds]);

  useEffect(() => {
    if (phase === 'answering') inputRef.current?.focus();
  }, [phase]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answerInput.trim() === '') return;
    setCorrect(parseInt(answerInput, 10) === sequence.answer);
    setPhase('result');
  }

  function practiceAgain() {
    setSequence(generateFlashSequence(variant, settings.iterations, settings.startingNumber));
    setIndex(0);
    setAnswerInput('');
    setPhase('flashing');
  }

  return (
    <div className="screen practice-screen">
      <div className="practice-header">
        <button className="back-link" onClick={onHome}>
          ← Quit
        </button>
        {phase === 'flashing' && (
          <span className="progress-label">
            {Math.min(index + 1, sequence.numbers.length)} / {sequence.numbers.length}
          </span>
        )}
      </div>

      <p className="mode-label">{isSubtraction ? 'Flash Subtraction' : 'Flash Addition'}</p>

      {phase !== 'result' && (
        <div className="flash-start-banner">
          <span className="flash-start-value">{sequence.startingNumber}</span>
          <span className={`flash-sign-badge ${isSubtraction ? 'subtract' : 'add'}`}>
            {isSubtraction ? '− subtract each number' : '+ add each number'}
          </span>
        </div>
      )}

      {phase === 'flashing' && (
        <div className="flash-area">
          <div className="flash-number-display">{sequence.numbers[index]}</div>
        </div>
      )}

      {phase === 'answering' && (
        <form className="answer-form" onSubmit={handleSubmit}>
          <p className="flash-prompt">What's the final total?</p>
          <div className="answer-inputs">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              className="answer-input"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Answer"
              autoFocus
            />
          </div>
          <button type="submit" className="primary-button">
            Submit
          </button>
        </form>
      )}

      {phase === 'result' && (
        <div className="flash-result">
          <p className={`flash-result-headline ${correct ? 'correct' : 'incorrect'}`}>
            {correct ? 'Correct!' : 'Not quite'}
          </p>
          <p className="flash-result-answer">
            Answer: <strong>{sequence.answer}</strong>
          </p>
          <div className="summary-actions">
            <button className="primary-button" onClick={practiceAgain}>
              Practice Again
            </button>
            <button className="secondary-button" onClick={onChangeSettings}>
              Change Settings
            </button>
            <button className="secondary-button" onClick={onHome}>
              Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
