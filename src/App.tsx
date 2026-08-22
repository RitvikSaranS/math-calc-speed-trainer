import { useState } from 'react';
import type { MasterMode, ModeDef, Operation } from './types';
import type { FlashSettings, FlashVariant } from './lib/flash';
import { useTheme } from './lib/theme';
import ThemeToggle from './components/ThemeToggle';
import Home from './screens/Home';
import Guide from './screens/Guide';
import ModeSelect from './screens/ModeSelect';
import CustomConfig from './screens/CustomConfig';
import CustomNumberConfig from './screens/CustomNumberConfig';
import PairCustomNumberConfig from './screens/PairCustomNumberConfig';
import MasterSelect from './screens/MasterSelect';
import Practice, { type SessionResult } from './screens/Practice';
import Summary from './screens/Summary';
import FlashSetup from './screens/FlashSetup';
import FlashRound from './screens/FlashRound';
import './App.css';

type Screen =
  | 'home'
  | 'guide'
  | 'modes'
  | 'customSize'
  | 'customNumbers'
  | 'customNumberPairs'
  | 'master'
  | 'practice'
  | 'summary'
  | 'flashSetup'
  | 'flashRound';

const PAIR_OPERATIONS: Operation[] = ['addition', 'subtraction'];

function App() {
  const { preference, setThemePreference } = useTheme();
  const [screen, setScreen] = useState<Screen>('home');
  const [operation, setOperation] = useState<Operation | null>(null);
  const [mode, setMode] = useState<ModeDef | null>(null);
  const [master, setMaster] = useState<MasterMode>('enter');
  const [questionCount, setQuestionCount] = useState(10);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [sessionKey, setSessionKey] = useState(0);
  const [flashVariant, setFlashVariant] = useState<FlashVariant>('addition');
  const [flashSettings, setFlashSettings] = useState<FlashSettings | null>(null);

  function selectOperation(op: Operation) {
    setOperation(op);
    setScreen('modes');
  }

  function selectMode(m: ModeDef) {
    setMode(m);
    setScreen('master');
  }

  function openCustomSize(op: Operation) {
    setOperation(op);
    setScreen('customSize');
  }

  function openCustomNumbers(op: Operation) {
    setOperation(op);
    setScreen(PAIR_OPERATIONS.includes(op) ? 'customNumberPairs' : 'customNumbers');
  }

  function startPractice(masterMode: MasterMode, count: number) {
    setMaster(masterMode);
    setQuestionCount(count);
    setSessionKey((k) => k + 1);
    setScreen('practice');
  }

  function finishPractice(res: SessionResult[]) {
    setResults(res);
    setScreen('summary');
  }

  function restart() {
    setSessionKey((k) => k + 1);
    setScreen('practice');
  }

  function openFlash(variant: FlashVariant) {
    setFlashVariant(variant);
    setScreen('flashSetup');
  }

  function startFlash(settings: FlashSettings) {
    setFlashSettings(settings);
    setScreen('flashRound');
  }

  return (
    <div className="app-shell">
      <ThemeToggle preference={preference} onChange={setThemePreference} />

      {screen === 'home' && <Home onSelect={selectOperation} onGuide={() => setScreen('guide')} onFlash={openFlash} />}

      {screen === 'guide' && <Guide onBack={() => setScreen('home')} />}

      {screen === 'modes' && operation && (
        <ModeSelect
          operation={operation}
          onSelect={selectMode}
          onCustomSize={openCustomSize}
          onCustomNumbers={openCustomNumbers}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'customSize' && operation && (
        <CustomConfig operation={operation} onContinue={selectMode} onBack={() => setScreen('modes')} />
      )}

      {screen === 'customNumbers' && operation && operation !== 'addition' && operation !== 'subtraction' && (
        <CustomNumberConfig operation={operation} onContinue={selectMode} onBack={() => setScreen('modes')} />
      )}

      {screen === 'customNumberPairs' && (operation === 'addition' || operation === 'subtraction') && (
        <PairCustomNumberConfig operation={operation} onContinue={selectMode} onBack={() => setScreen('modes')} />
      )}

      {screen === 'master' && mode && (
        <MasterSelect mode={mode} onStart={startPractice} onBack={() => setScreen('modes')} />
      )}

      {screen === 'practice' && mode && (
        <Practice
          key={sessionKey}
          mode={mode}
          master={master}
          questionCount={questionCount}
          onFinish={finishPractice}
          onQuit={() => setScreen('master')}
        />
      )}

      {screen === 'summary' && mode && (
        <Summary
          results={results}
          modeLabel={mode.label}
          onRestart={restart}
          onChangeMode={() => setScreen('modes')}
          onHome={() => {
            setOperation(null);
            setMode(null);
            setScreen('home');
          }}
        />
      )}

      {screen === 'flashSetup' && (
        <FlashSetup variant={flashVariant} onContinue={startFlash} onBack={() => setScreen('home')} />
      )}

      {screen === 'flashRound' && flashSettings && (
        <FlashRound
          variant={flashVariant}
          settings={flashSettings}
          onChangeSettings={() => setScreen('flashSetup')}
          onHome={() => setScreen('home')}
        />
      )}
    </div>
  );
}

export default App;
