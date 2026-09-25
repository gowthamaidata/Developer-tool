import { useState } from 'react';
import { Alert, ClearButton, CopyButton, DownloadButton, Editor, Kbd, Toolbar } from '../components/ui';
import { modKey, useRunShortcut } from '../lib/shortcuts';
import { tooLarge } from '../lib/files';

interface Props {
  language: string;
  placeholder: string;
  format: (src: string, indent: string) => string;
  minify: (src: string) => string;
  filename: string;
  mime: string;
}

/** Shared UI for code formatters (HTML, CSS, and future JS/XML/SQL formatters). */
export function FormatterTool({ language, placeholder, format, minify, filename, mime }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState('  ');
  const [status, setStatus] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const run = (mode: 'format' | 'minify') => {
    if (!input.trim()) { setStatus({ kind: 'error', text: `Input is empty. Paste some ${language} first.` }); return; }
    const big = tooLarge(input);
    if (big) { setStatus({ kind: 'error', text: big }); return; }
    try {
      const out = mode === 'format' ? format(input, indent) : minify(input);
      setOutput(out);
      setStatus({ kind: 'success', text: mode === 'format' ? `Formatted ${language}.` : `Minified: ${input.length.toLocaleString()} → ${out.length.toLocaleString()} characters.` });
    } catch {
      setStatus({ kind: 'error', text: `Could not process this ${language}. Check for unclosed quotes, comments or brackets.` });
    }
  };
  useRunShortcut(() => run('format'));

  return (
    <div className="tool">
      <div className="options">
        <label>Indentation{' '}
          <select value={indent} onChange={(e) => setIndent(e.target.value)}>
            <option value="  ">2 spaces</option><option value={'    '}>4 spaces</option><option value={'\t'}>Tab</option>
          </select>
        </label>
      </div>
      <div className="split">
        <Editor label={`Input ${language}`} placeholder={placeholder} value={input} onChange={(e) => setInput(e.target.value)}
          hint={<><Kbd>{modKey}</Kbd>+<Kbd>Enter</Kbd> to format</>} />
        <Editor label="Output" placeholder="Your result will appear here…" value={output} readOnly />
      </div>
      <Toolbar>
        <button type="button" className="btn btn-primary" onClick={() => run('format')}>Format</button>
        <button type="button" className="btn" onClick={() => run('minify')}>Minify</button>
        <ClearButton onClear={() => { setInput(''); setOutput(''); setStatus(null); }} disabled={!input && !output} />
        <span className="toolbar-gap" />
        <CopyButton text={output} label="Copy output" />
        <DownloadButton text={output} filename={filename} type={mime} />
      </Toolbar>
      {status && <Alert kind={status.kind} title={status.text} />}
    </div>
  );
}
