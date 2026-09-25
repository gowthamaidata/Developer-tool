import { useId, useState } from 'react';
import { ClearButton, CopyButton, Editor, Toolbar } from '../../components/ui';
import { useRunShortcut } from '../../lib/shortcuts';
import { lorem, type LoremUnit } from './logic';

const MAX: Record<LoremUnit, number> = { paragraphs: 50, sentences: 200, words: 2000 };

export default function LoremIpsum() {
  const [unit, setUnit] = useState<LoremUnit>('paragraphs');
  const [count, setCount] = useState(3);
  const [classic, setClassic] = useState(true);
  const [text, setText] = useState('');
  const id = useId();
  const n = Math.min(MAX[unit], Math.max(1, Math.round(count) || 1));
  const generate = () => setText(lorem(unit, n, classic));
  useRunShortcut(generate);

  return (
    <div className="tool">
      <div className="options">
        <label htmlFor={id}>Amount</label>
        <input id={id} type="number" className="num" min={1} max={MAX[unit]} value={count} onChange={(e) => setCount(+e.target.value)} />
        <select aria-label="Unit" value={unit} onChange={(e) => setUnit(e.target.value as LoremUnit)}>
          <option value="paragraphs">Paragraphs</option><option value="sentences">Sentences</option><option value="words">Words</option>
        </select>
        <label className="check"><input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} /> Start with “Lorem ipsum…”</label>
      </div>
      {count > MAX[unit] && <p className="field-hint">Limited to {MAX[unit]} {unit}.</p>}
      <Toolbar>
        <button type="button" className="btn btn-primary" onClick={generate}>Generate</button>
        <CopyButton text={text} />
        <ClearButton onClear={() => setText('')} disabled={!text} />
      </Toolbar>
      <Editor label="Generated text" placeholder="Click Generate to create placeholder text." value={text} readOnly className="editor-prose" />
    </div>
  );
}
