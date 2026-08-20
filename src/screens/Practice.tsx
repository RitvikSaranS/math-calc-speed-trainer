import { useEffect, useMemo, useRef, useState } from 'react';
import type { MasterMode, ModeDef, Problem } from '../types';
import { formatAnswer, generateOptions } from '../lib/answer';

export interface SessionResult {
  correct: boolean;
  timeMs: number;
}

export default function Practice({
  mode,
  master,
  questionCount,
  onFinish,
  onQuit,
}: {
  mode: ModeDef;
  master: MasterMode;
  questionCount: number;
  onFinish: (results: SessionResult[]) => void;
  onQuit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [problem, setProblem] = useState<Problem>(() => mode.generate());
  const [results, setResults] = useState<SessionResult[]>([]);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [revealed, setRevealed] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [remainderInput, setRemainderInput] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const options = useMemo(() => (master === 'options' ? generateOptions(problem) : []), [problem, master]);

  useEffect(() => {
    if (master === 'enter') {
      inputRef.current?.focus();
    }
  }, [problem, master]);

  function recordAndAdvance(correct: boolean) {
    const newResults = [...results, { correct, timeMs: Date.now() - startTime }];
    setResults(newResults);

    const newIndex = index + 1;
    if (newIndex >= questionCount) {
      onFinish(newResults);
      return;
    }
    setIndex(newIndex);
    setStartTime(Date.now());
    setProblem(mode.generate());
    setRevealed(false);
    setAnswerInput('');
    setRemainderInput('');
  }

  function handleEnterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answerInput.trim() === '') return;
    const correct = problem.hasRemainder
      ? parseInt(answerInput, 10) === problem.answer && parseInt(remainderInput, 10) === problem.remainder
      : parseInt(answerInput, 10) === problem.answer;
    recordAndAdvance(correct);
  }

  function handleOptionClick(opt: string) {
    recordAndAdvance(opt === formatAnswer(problem));
  }

  function handleFlashcardResult(correct: boolean) {
    recordAndAdvance(correct);
  }

  return (
    <div className="screen practice-screen">
      <div className="practice-header">
        <button className="back-link" onClick={onQuit}>
          ← Quit
        </button>
        <span className="progress-label">
          Question {index + 1} / {questionCount}
        </span>
      </div>

      <p className="mode-label">{mode.label}</p>

      <div className="question-display">{problem.question}</div>

      {master === 'enter' && (
        <form className="answer-form" onSubmit={handleEnterSubmit}>
          <div className="answer-inputs">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              className="answer-input"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder={problem.hasRemainder ? 'Quotient' : 'Answer'}
              autoFocus
            />
            {problem.hasRemainder && (
              <input
                type="number"
                inputMode="numeric"
                className="answer-input"
                value={remainderInput}
                onChange={(e) => setRemainderInput(e.target.value)}
                placeholder="Remainder"
              />
            )}
          </div>
          <button type="submit" className="primary-button">
            Submit
          </button>
        </form>
      )}

      {master === 'options' && (
        <div className="grid grid-2 options-grid">
          {options.map((opt) => (
            <button key={opt} className="tile tile-option" onClick={() => handleOptionClick(opt)}>
              {opt}
            </button>
          ))}
        </div>
      )}

      {master === 'flashcard' && (
        <div className="flashcard-area">
          {!revealed ? (
            <button className="flashcard" onClick={() => setRevealed(true)}>
              Tap to reveal
            </button>
          ) : (
            <>
              <div className="flashcard revealed">{formatAnswer(problem)}</div>
              <div className="flashcard-actions">
                <button className="secondary-button incorrect-button" onClick={() => handleFlashcardResult(false)}>
                  I got it wrong
                </button>
                <button className="primary-button" onClick={() => handleFlashcardResult(true)}>
                  I got it right
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
