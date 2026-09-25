export type JsonCheck =
  | { ok: true; value: unknown }
  | { ok: false; message: string; line?: number; column?: number; excerpt?: string };

export function checkJson(text: string): JsonCheck {
  if (!text.trim()) return { ok: false, message: 'Input is empty. Paste some JSON to check.' };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return explain(text, (e as Error).message);
  }
}

export function formatJson(value: unknown, indent: string, sortKeys: boolean): string {
  return JSON.stringify(sortKeys ? sortDeep(value) : value, null, indent);
}

function sortDeep(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortDeep);
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v as object).sort()) out[k] = sortDeep((v as Record<string, unknown>)[k]);
    return out;
  }
  return v;
}

/** Locates the first syntax error with a small scanner, giving the same clear message in every browser. */
function explain(text: string, nativeMessage: string): JsonCheck {
  let err: { pos: number; msg: string } | null = null;
  try { scan(text); } catch (x) {
    if (x && typeof x === 'object' && 'pos' in x) err = x as { pos: number; msg: string };
  }
  if (!err) return { ok: false, message: `Invalid JSON: ${nativeMessage}` };
  const before = text.slice(0, err.pos);
  const line = before.split('\n').length;
  const column = err.pos - before.lastIndexOf('\n');
  const src = text.split('\n')[line - 1] ?? '';
  const start = Math.max(0, column - 40);
  const excerpt = src.slice(start, column + 40) + '\n' + ' '.repeat(column - 1 - start) + '^';
  return { ok: false, message: `Invalid JSON: ${err.msg} (line ${line}, column ${column}).`, line, column, excerpt };
}

function scan(s: string) {
  let i = 0;
  const n = s.length;
  const fail = (msg: string, at = i): never => { throw { pos: at, msg }; };
  const found = () => (i >= n ? 'the end of the input' : `'${s[i]}'`);
  const ws = () => { while (i < n && (s[i] === ' ' || s[i] === '\n' || s[i] === '\r' || s[i] === '\t')) i++; };
  const num = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;

  const str = () => {
    const start = i++;
    while (i < n) {
      const c = s[i];
      if (c === '"') { i++; return; }
      if (c === '\\') {
        const e = s[i + 1];
        if (e === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(s.slice(i + 2, i + 6))) fail('Invalid \\u escape: expected 4 hex digits');
          i += 6;
        } else if (e !== undefined && '"\\/bfnrt'.includes(e)) i += 2;
        else fail(`Invalid escape sequence '\\${e ?? ''}'`);
        continue;
      }
      if (c < ' ') fail('Unescaped control character (such as a line break or tab) inside a string');
      i++;
    }
    fail('Unterminated string: missing closing double quote', start);
  };

  const value = (depth: number): void => {
    if (depth > 5000) fail('Nesting is too deep');
    ws();
    const c = s[i];
    if (c === '{') {
      i++; ws();
      if (s[i] === '}') { i++; return; }
      for (;;) {
        ws();
        if (s[i] !== '"') fail(s[i] === "'" ? 'Property names must use double quotes, not single quotes'
          : s[i] === '}' ? 'Trailing comma is not allowed in JSON' : `Expected a property name in double quotes but found ${found()}`);
        str(); ws();
        if (s[i] !== ':') fail(`Expected ':' after the property name but found ${found()}`);
        i++;
        value(depth + 1); ws();
        if (s[i] === ',') { i++; continue; }
        if (s[i] === '}') { i++; return; }
        fail(`Expected ',' or '}' but found ${found()}`);
      }
    }
    if (c === '[') {
      i++; ws();
      if (s[i] === ']') { i++; return; }
      for (;;) {
        ws();
        if (s[i] === ']') fail('Trailing comma is not allowed in JSON');
        value(depth + 1); ws();
        if (s[i] === ',') { i++; continue; }
        if (s[i] === ']') { i++; return; }
        fail(`Expected ',' or ']' but found ${found()}`);
      }
    }
    if (c === '"') return str();
    if (c === "'") fail('Strings must use double quotes, not single quotes');
    if (c === '-' || (c >= '0' && c <= '9')) {
      num.lastIndex = i;
      const m = num.exec(s);
      if (!m) fail('Invalid number');
      i += m![0].length;
      return;
    }
    for (const lit of ['true', 'false', 'null']) if (s.startsWith(lit, i)) { i += lit.length; return; }
    if (c === '/' ) fail('Comments are not allowed in JSON');
    if (i >= n) fail('Unexpected end of input: the JSON looks incomplete');
    fail(/[A-Za-z_]/.test(c) ? `Unexpected text starting with ${found()}. Strings and property names need double quotes` : `Unexpected character ${found()}`);
  };

  value(0); ws();
  if (i < n) fail(`Unexpected ${found()} after the end of the JSON value`);
}
