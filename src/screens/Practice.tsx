import { useEffect, useMemo, useRef, useState } from 'react';
import type { FlashConfig, FlashRound, MasterMode, ModeDef, Problem } from '../types';
import { formatAnswer, generateOptions } from '../lib/answer';
import { makeFlashRound } from '../lib/modes';

export interface SessionResult {
  correct: boolean;
  timeMs: number;
}

type Feedback = 'none' | 'correct' | 'incorrect';
type FlashPhase = 'flashing' | 'answering';

const FEEDBACK_DELAY_MS = 700;
const FLASH_ON_MS = 800;
const FLASH_GAP_MS = 200;

export default function Practice({
  mode,
  master,
  questionCount,
  flashConfig,
  onFinish,
  onQuit,
}: {
  mode: ModeDef;
  master: MasterMode;
  questionCount: number;
  flashConfig: FlashConfig;
  onFinish: (results: SessionResult[]) => void;
  onQuit: () => void;
}) {
  const isFlash = master === 'flash';

  const [index, setIndex] = useState(0);
  const [problem, setProblem] = useState<Problem>(() => mode.generate());
  const [results, setResults] = useState<SessionResult[]>([]);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [feedback, setFeedback] = useState<Feedback>('none');
  const [revealed, setRevealed] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [remainderInput, setRemainderInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [flashRound, setFlashRound] = useState<FlashRound | null>(() =>
    isFlash ? makeFlashRound(flashConfig.count, flashConfig.digitSize) : null,
  );
  const [flashPhase, setFlashPhase] = useState<FlashPhase>('flashing');
  const [flashTick, setFlashTick] = useState(0);
  const [flashAnswerInput, setFlashAnswerInput] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const flashInputRef = useRef<HTMLInputElement>(null);

  const options = useMemo(() => (master === 'options' ? generateOptions(problem) : []), [problem, master]);

  useEffect(() => {
    if (master === 'enter') {
      inputRef.current?.focus();
    }
  }, [problem, master]);

  useEffect(() => {
    if (isFlash && flashPhase === 'answering') {
      flashInputRef.current?.focus();
    }
  }, [isFlash, flashPhase]);

  useEffect(() => {
    if (!isFlash || !flashRound || flashPhase !== 'flashing') return;
    const numberIndex = Math.floor(flashTick / 2);
    if (numberIndex >= flashRound.numbers.length) {
      setFlashPhase('answering');
      return;
    }
    const isBlank = flashTick % 2 === 1;
    const timer = setTimeout(() => setFlashTick((t) => t + 1), isBlank ? FLASH_GAP_MS : FLASH_ON_MS);
    return () => clearTimeout(timer);
  }, [isFlash, flashRound, flashPhase, flashTick]);

  function advance(latestResults: SessionResult[]) {
    const newIndex = index + 1;
    if (newIndex >= questionCount) {
      onFinish(latestResults);
      return;
    }
    setIndex(newIndex);
    setStartTime(Date.now());
    setFeedback('none');

    if (isFlash) {
      setFlashRound(makeFlashRound(flashConfig.count, flashConfig.digitSize));
      setFlashPhase('flashing');
      setFlashTick(0);
      setFlashAnswerInput('');
    } else {
      setProblem(mode.generate());
      setRevealed(false);
      setAnswerInput('');
      setRemainderInput('');
      setSelectedOption(null);
    }
  }

  function recordAndAdvance(correct: boolean, delay: number) {
    const newResults = [...results, { correct, timeMs: Date.now() - startTime }];
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

  function handleFlashSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!flashRound || feedback !== 'none' || flashAnswerInput.trim() === '') return;
    const correct = parseInt(flashAnswerInput, 10) === flashRound.answer;
    setFeedback(correct ? 'correct' : 'incorrect');
    recordAndAdvance(correct, FEEDBACK_DELAY_MS);
  }

  const flashNumberIndex = Math.floor(flashTick / 2);
  const flashShowingNumber = flashTick % 2 === 0;
  const flashCurrentNumber = flashRound && flashNumberIndex < flashRound.numbers.length ? flashRound.numbers[flashNumberIndex] : null;

  return (
    <div className="screen practice-screen">
      <div className="practice-header">
        <button className="back-link" onClick={onQuit}>
          ← Quit
        </button>
        <span className="progress-label">
          {isFlash ? 'Round' : 'Question'} {index + 1} / {questionCount}
        </span>
      </div>

      <p className="mode-label">{isFlash ? 'Flash Add' : mode.label}</p>

      {!isFlash && <div className="question-display">{problem.question}</div>}

      {isFlash && flashRound && (
        <div className="flash-area">
          {flashPhase === 'flashing' ? (
            <>
              <div className="flash-number-display">{flashShowingNumber ? flashCurrentNumber : ''}</div>
              <p className="flash-progress">
                {Math.min(flashNumberIndex + 1, flashRound.numbers.length)} / {flashRound.numbers.length}
              </p>
            </>
          ) : (
            <form className="answer-form" onSubmit={handleFlashSubmit}>
              <p className="flash-prompt">What's the total?</p>
              <div className="answer-inputs">
                <input
                  ref={flashInputRef}
                  type="number"
                  inputMode="numeric"
                  className={`answer-input ${feedback}`}
                  value={flashAnswerInput}
                  onChange={(e) => setFlashAnswerInput(e.target.value)}
                  disabled={feedback !== 'none'}
                  placeholder="Sum"
                  autoFocus
                />
              </div>
              <button type="submit" className="primary-button" disabled={feedback !== 'none'}>
                Submit
              </button>
              {feedback === 'incorrect' && <p className="reveal-answer">Correct total: {flashRound.answer}</p>}
            </form>
          )}
        </div>
      )}

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
          {feedback === 'incorrect' && (
            <p className="reveal-answer">Correct answer: {formatAnswer(problem)}</p>
          )}
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
