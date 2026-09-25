import { useId, useMemo, useRef, useState } from 'react';
import { Alert, CopyButton } from '../../components/ui';
import { formats, parseColor, toHex6, type Rgba } from './logic';

export default function ColorConverter() {
  const [input, setInput] = useState('#1351AA');
  const id = useId();
  const parsed = useMemo((): { c?: Rgba; err?: string } => {
    try { return { c: parseColor(input) }; } catch (e) { return { err: (e as Error).message }; }
  }, [input]);
  const last = useRef<Rgba>({ r: 19, g: 81, b: 170, a: 1 });
  if (parsed.c) last.current = parsed.c;
  const color = parsed.c ?? last.current;
  const empty = !input.trim();

  return (
    <div className="tool">
      <div className="color-top">
        <div className="field grow">
          <div className="field-head"><label htmlFor={id}>Color value</label><span className="field-hint">HEX, RGB(A) or HSL(A)</span></div>
          <div className="color-input">
            <input id={id} className="input mono" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="#1351AA or rgb(19, 81, 170)" spellCheck={false} autoComplete="off"
              aria-invalid={(!!parsed.err && !empty) || undefined} aria-describedby={parsed.err ? id + 'err' : undefined} />
            <input type="color" aria-label="Pick a color" value={toHex6(color)} onChange={(e) => setInput(e.target.value.toUpperCase())} />
          </div>
        </div>
        <div className="swatch" aria-hidden="true"><span style={{ background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` }} /></div>
      </div>
      {empty && <p className="empty-note">Enter a color value, or use the picker.</p>}
      {parsed.err && !empty && <Alert id={id + 'err'} kind="error" title={parsed.err}>The preview and values below show the last valid color.</Alert>}
      <table className="kv">
        <caption className="sr-only">Color in each format</caption>
        <tbody>
          {formats(color).map((f) => (
            <tr key={f.label}>
              <th scope="row">{f.label}</th>
              <td><code>{f.value}</code></td>
              <td className="kv-act"><CopyButton text={f.value} label={`Copy`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-quiet" onClick={() => setInput('')}>Clear</button>
    </div>
  );
}
