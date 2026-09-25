import { useEffect, useId, useState } from 'react';
import { Alert, CopyButton, Kbd, Toolbar } from '../../components/ui';
import { modKey, useRunShortcut } from '../../lib/shortcuts';
import { entropyBits, generatePassword, strength, type PwOptions } from './logic';

export default function PasswordGenerator() {
  const [o, setO] = useState<PwOptions>({ length: 20, upper: true, lower: true, digits: true, symbols: true, noAmbiguous: false });
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const id = useId();

  const generate = () => {
    try { setPw(generatePassword(o)); setError(''); }
    catch (e) { setPw(''); setError((e as Error).message); }
  };
  useEffect(generate, [o]); // regenerate when options change
  useRunShortcut(generate);

  const set = <K extends keyof PwOptions>(k: K, v: PwOptions[K]) => setO((p) => ({ ...p, [k]: v }));
  const setLen = (v: number) => set('length', Math.min(128, Math.max(4, Number.isFinite(v) ? Math.round(v) : 20)));
  const bits = entropyBits(o);
  const s = strength(bits);

  return (
    <div className="tool">
      <div className="pw-out">
        <output htmlFor={id} className="pw-value" aria-live="polite">{pw || 'Select at least one character type.'}</output>
        <Toolbar>
          <button type="button" className="btn btn-primary" onClick={generate}>Generate</button>
          <CopyButton text={pw} />
          <span className="field-hint"><Kbd>{modKey}</Kbd>+<Kbd>Enter</Kbd> to regenerate</span>
        </Toolbar>
        {pw && (
          <div className="meter" aria-label={`Strength: ${s.label}, about ${bits} bits of entropy`}>
            <div className="meter-bars" aria-hidden="true">{[1, 2, 3, 4].map((n) => <span key={n} className={n <= s.level ? `on l${s.level}` : ''} />)}</div>
            <span><strong>{s.label}</strong> · about {bits} bits of entropy</span>
          </div>
        )}
      </div>
      {error && <Alert kind="error" title={error} />}
      <fieldset className="options options-stack" id={id}>
        <legend>Options</legend>
        <div className="range-row">
          <label htmlFor={id + 'len'}>Length</label>
          <input id={id + 'len'} type="range" min={4} max={128} value={o.length} onChange={(e) => setLen(+e.target.value)} />
          <input type="number" min={4} max={128} value={o.length} aria-label="Length (number)" onChange={(e) => setLen(+e.target.value)} className="num" />
        </div>
        <label className="check"><input type="checkbox" checked={o.upper} onChange={(e) => set('upper', e.target.checked)} /> Uppercase (A–Z)</label>
        <label className="check"><input type="checkbox" checked={o.lower} onChange={(e) => set('lower', e.target.checked)} /> Lowercase (a–z)</label>
        <label className="check"><input type="checkbox" checked={o.digits} onChange={(e) => set('digits', e.target.checked)} /> Numbers (0–9)</label>
        <label className="check"><input type="checkbox" checked={o.symbols} onChange={(e) => set('symbols', e.target.checked)} /> Symbols (!@#$…)</label>
        <label className="check"><input type="checkbox" checked={o.noAmbiguous} onChange={(e) => set('noAmbiguous', e.target.checked)} /> Exclude look-alike characters (0/O, 1/l/I…)</label>
      </fieldset>
      <p className="muted small">Passwords are generated on your device and are not stored. Use a different password for every account, and keep them in a password manager.</p>
    </div>
  );
}
