import { useEffect, useMemo, useRef, useState } from 'react';
import type { MasterMode, ModeDef, Problem } from '../types';
import { formatAnswer, generateOptions } from '../lib/answer';

export interface SessionResult {
  correct: boolean;
  timeMs: number;
  problem: Problem;
}

type Feedback = 'none' | 'correct' | 'incorrect';

const FEEDBACK_DELAY_MS = 300;

export default function Practice({
  mode,
  master,
  questionCount,
  fixedProblems,
  onFinish,
  onQuit,
}: {
  mode: ModeDef;
  master: MasterMode;
  questionCount: number;
  fixedProblems?: Problem[];
  onFinish: (results: SessionResult[]) => void;
  onQuit: () => void;
}) {
  const total = fixedProblems ? fixedProblems.length : questionCount;

  const [index, setIndex] = useState(0);
  const [problem, setProblem] = useState<Problem>(() => (fixedProblems ? fixedProblems[0] : mode.generate()));
  const [results, setResults] = useState<SessionResult[]>([]);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [feedback, setFeedback] = useState<Feedback>('none');
  const [revealed, setRevealed] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [remainderInput, setRemainderInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const options = useMemo(() => (master === 'options' ? generateOptions(problem) : []), [problem, master]);

  useEffect(() => {
    if (master === 'enter' && feedback === 'none') {
      inputRef.current?.focus();
    }
  }, [problem, master, feedback]);

  function advance(latestResults: SessionResult[]) {
    const newIndex = index + 1;
    if (newIndex >= total) {
      onFinish(latestResults);
      return;
    }
    setIndex(newIndex);
    setStartTime(Date.now());
    setFeedback('none');
    setProblem(fixedProblems ? fixedProblems[newIndex] : mode.generate());
    setRevealed(false);
    setAnswerInput('');
    setRemainderInput('');
    setSelectedOption(null);
  }

  function recordAndAdvance(correct: boolean, delay: number) {
    const newResults = [...results, { correct, timeMs: Date.now() - startTime, problem }];
    setResults(newResults);
    if (delay > 0) {
      setTimeout(() => advance(newResults), delay);
    } else {
      advance(newResults);
    }
  }

  function handleEnterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (feedback !== 'none' || answerInput.trim() === '') return;
    const correct = problem.hasRemainder
      ? parseInt(answerInput, 10) === problem.answer && parseInt(remainderInput, 10) === problem.remainder
      : parseInt(answerInput, 10) === problem.answer;
    setFeedback(correct ? 'correct' : 'incorrect');
    recordAndAdvance(correct, FEEDBACK_DELAY_MS);
  }

  function handleOptionClick(opt: string) {
    if (selectedOption) return;
    setSelectedOption(opt);
    const correct = opt === formatAnswer(problem);
    setFeedback(correct ? 'correct' : 'incorrect');
    recordAndAdvance(correct, FEEDBACK_DELAY_MS);
  }

  function handleFlashcardResult(correct: boolean) {
    recordAndAdvance(correct, 0);
  }

  return (
    <div className="screen practice-screen">
      <div className="practice-header">
        <button className="back-link" onClick={onQuit}>
          ← Quit
        </button>
        <span className="progress-label">
          Question {index + 1} / {total}
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
              className={`answer-input ${feedback}`}
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              disabled={feedback !== 'none'}
              placeholder={problem.hasRemainder ? 'Quotient' : 'Answer'}
              autoFocus
            />
            {problem.hasRemainder && (
              <input
                type="number"
                inputMode="numeric"
                className={`answer-input ${feedback}`}
                value={remainderInput}
                onChange={(e) => setRemainderInput(e.target.value)}
                disabled={feedback !== 'none'}
                placeholder="Remainder"
              />
            )}
          </div>
          <button type="submit" className="primary-button" disabled={feedback !== 'none'}>
            Submit
          </button>
          {feedback === 'incorrect' && <p className="reveal-answer">Correct answer: {formatAnswer(problem)}</p>}
        </form>
      )}

      {master === 'options' && (
        <div className="grid grid-2 options-grid">
          {options.map((opt) => {
            let cls = 'tile tile-option';
            if (selectedOption) {
              if (opt === formatAnswer(problem)) cls += ' correct';
              else if (opt === selectedOption) cls += ' incorrect';
            }
            return (
              <button key={opt} className={cls} onClick={() => handleOptionClick(opt)} disabled={!!selectedOption}>
                {opt}
              </button>
            );
          })}
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
