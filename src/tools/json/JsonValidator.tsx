import { useDeferredValue, useMemo, useState } from 'react';
import { Alert, ClearButton, CopyButton, Editor, Toolbar } from '../../components/ui';
import { tooLarge } from '../../lib/files';
import { checkJson } from './logic';

const SAMPLE = `{
  "id": 1024,
  "name": "DevTools Hub",
  "tags": ["json", "validator"],
  "active": true,
  "owner": { "role": "admin", "since": "2024-01-15" }
}`;

export default function JsonValidator() {
  const [input, setInput] = useState('');
  const deferred = useDeferredValue(input);
  const result = useMemo(() => {
    if (!deferred.trim()) return null;
    const big = tooLarge(deferred);
    if (big) return { ok: false as const, message: big };
    return checkJson(deferred);
  }, [deferred]);

  const summary = !result ? '' : result.ok ? 'Valid JSON' : result.message;
  const detail = result?.ok ? describe(result.value) : '';

  return (
    <div className="tool">
      <Editor label="JSON to validate" placeholder="Paste your JSON here… It is checked as you type." value={input}
        onChange={(e) => setInput(e.target.value)} invalid={result ? !result.ok : false} errorId="val-status" />
      <Toolbar>
        <button type="button" className="btn" onClick={() => setInput(SAMPLE)}>Load example</button>
        <ClearButton onClear={() => setInput('')} disabled={!input} />
        <span className="toolbar-gap" />
        <CopyButton text={summary} label="Copy result" />
      </Toolbar>
      {!result && <p className="empty-note">Paste JSON above to check it.</p>}
      {result && (result.ok
        ? <Alert id="val-status" kind="success" title="Valid JSON">{detail}</Alert>
        : <Alert id="val-status" kind="error" title={result.message}>{'excerpt' in result && result.excerpt && <pre className="excerpt">{result.excerpt}</pre>}</Alert>)}
    </div>
  );
}

function describe(v: unknown): string {
  if (Array.isArray(v)) return `Top level: array with ${v.length} item${v.length === 1 ? '' : 's'}.`;
  if (v && typeof v === 'object') { const k = Object.keys(v).length; return `Top level: object with ${k} key${k === 1 ? '' : 's'}.`; }
  return `Top level: ${v === null ? 'null' : typeof v}.`;
}
