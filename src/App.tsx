import { useState } from 'react';
import type { FlashConfig, MasterMode, ModeDef, Operation } from './types';
import { useTheme } from './lib/theme';
import ThemeToggle from './components/ThemeToggle';
import Home from './screens/Home';
import ModeSelect from './screens/ModeSelect';
import CustomConfig from './screens/CustomConfig';
import DigitComboConfig from './screens/DigitComboConfig';
import MasterSelect from './screens/MasterSelect';
import Practice, { type SessionResult } from './screens/Practice';
import Summary from './screens/Summary';
import './App.css';

type Screen = 'home' | 'modes' | 'customConfig' | 'digitCombo' | 'master' | 'practice' | 'summary';

function App() {
  const { preference, setThemePreference } = useTheme();
  const [screen, setScreen] = useState<Screen>('home');
  const [operation, setOperation] = useState<Operation | null>(null);
  const [mode, setMode] = useState<ModeDef | null>(null);
  const [master, setMaster] = useState<MasterMode>('enter');
  const [questionCount, setQuestionCount] = useState(10);
  const [flashConfig, setFlashConfig] = useState<FlashConfig>({ digitSize: 2, count: 10 });
  const [results, setResults] = useState<SessionResult[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  function selectOperation(op: Operation) {
    setOperation(op);
    setScreen('modes');
  }

  function selectMode(m: ModeDef) {
    setMode(m);
    setScreen('master');
  }

  function openCustomConfig(op: Operation) {
    setOperation(op);
    setScreen('customConfig');
  }

  function openDigitCombo(op: Operation) {
    setOperation(op);
    setScreen('digitCombo');
  }

  function startPractice(masterMode: MasterMode, count: number, flash: FlashConfig) {
    setMaster(masterMode);
    setQuestionCount(count);
    setFlashConfig(flash);
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

  return (
    <div className="app-shell">
      <ThemeToggle preference={preference} onChange={setThemePreference} />

      {screen === 'home' && <Home onSelect={selectOperation} />}

      {screen === 'modes' && operation && (
        <ModeSelect
          operation={operation}
          onSelect={selectMode}
          onCustomSize={openCustomConfig}
          onDigitCombo={openDigitCombo}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'customConfig' && operation && (
        <CustomConfig
          operation={operation}
          onContinue={selectMode}
          onBack={() => setScreen('modes')}
        />
      )}

      {screen === 'digitCombo' && (operation === 'addition' || operation === 'subtraction') && (
        <DigitComboConfig
          operation={operation}
          onContinue={selectMode}
          onBack={() => setScreen('modes')}
        />
      )}

      {screen === 'master' && mode && (
        <MasterSelect
          mode={mode}
          onStart={startPractice}
          onBack={() => setScreen('modes')}
        />
      )}

      {screen === 'practice' && mode && (
        <Practice
          key={sessionKey}
          mode={mode}
          master={master}
          questionCount={questionCount}
          flashConfig={flashConfig}
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
    </div>
  );
}

export default App;
