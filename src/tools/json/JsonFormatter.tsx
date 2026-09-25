import { useState } from 'react';
import { Alert, ClearButton, CopyButton, DownloadButton, Editor, Kbd, Toolbar } from '../../components/ui';
import { modKey, useRunShortcut } from '../../lib/shortcuts';
import { tooLarge } from '../../lib/files';
import { checkJson, formatJson, type JsonCheck } from './logic';

const INDENTS: Record<string, string> = { '2': '  ', '4': '    ', tab: '\t' };

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState('2');
  const [sortKeys, setSortKeys] = useState(false);
  const [status, setStatus] = useState<{ kind: 'error' | 'success'; text: string; excerpt?: string } | null>(null);

  const parse = (): JsonCheck | null => {
    const big = tooLarge(input);
    if (big) { setStatus({ kind: 'error', text: big }); return null; }
    const r = checkJson(input);
    if (!r.ok) { setStatus({ kind: 'error', text: r.message, excerpt: r.excerpt }); setOutput(''); return null; }
    return r;
  };
  const format = () => {
    const r = parse();
    if (r?.ok) { setOutput(formatJson(r.value, INDENTS[indent], sortKeys)); setStatus({ kind: 'success', text: 'Formatted. Your JSON is valid.' }); }
  };
  const minify = () => {
    const r = parse();
    if (r?.ok) {
      const out = formatJson(r.value, '', sortKeys);
      setOutput(out);
      setStatus({ kind: 'success', text: `Minified: ${input.length.toLocaleString()} → ${out.length.toLocaleString()} characters.` });
    }
  };
  const validate = () => { if (parse()?.ok) setStatus({ kind: 'success', text: 'Valid JSON.' }); };
  const clear = () => { setInput(''); setOutput(''); setStatus(null); };
  useRunShortcut(format);

  return (
    <div className="tool">
      <div className="options">
        <label>Indentation{' '}
          <select value={indent} onChange={(e) => setIndent(e.target.value)}>
            <option value="2">2 spaces</option><option value="4">4 spaces</option><option value="tab">Tab</option>
          </select>
        </label>
        <label className="check"><input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} /> Sort keys A–Z</label>
      </div>
      <div className="split">
        <Editor label="Input JSON" placeholder="Paste your JSON here…" value={input} onChange={(e) => setInput(e.target.value)}
          invalid={status?.kind === 'error'} errorId="json-status" hint={<><Kbd>{modKey}</Kbd>+<Kbd>Enter</Kbd> to format</>} />
        <Editor label="Output" placeholder="Formatted JSON will appear here…" value={output} readOnly />
      </div>
      <Toolbar>
        <button type="button" className="btn btn-primary" onClick={format}>Format</button>
        <button type="button" className="btn" onClick={minify}>Minify</button>
        <button type="button" className="btn" onClick={validate}>Validate</button>
        <ClearButton onClear={clear} disabled={!input && !output} />
        <span className="toolbar-gap" />
        <CopyButton text={output} label="Copy output" />
        <DownloadButton text={output} filename="formatted.json" type="application/json" />
      </Toolbar>
      {status && (
        <Alert id="json-status" kind={status.kind} title={status.text}>
          {status.excerpt && <pre className="excerpt">{status.excerpt}</pre>}
        </Alert>
      )}
    </div>
  );
}
