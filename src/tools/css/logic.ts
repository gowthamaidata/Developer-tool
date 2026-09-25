/** Dependency-free CSS formatter/minifier that respects strings, comments and parentheses. */

type Tok =
  | { t: 'open'; prelude: string }
  | { t: 'close' }
  | { t: 'decl'; prop: string; value: string }
  | { t: 'stmt'; text: string }
  | { t: 'comment'; text: string };

export function tokenizeCss(src: string): Tok[] {
  const toks: Tok[] = [];
  let buf = '';
  let depth = 0;
  let paren = 0;
  const flush = (end: ';' | '}') => {
    const s = buf.trim();
    buf = '';
    if (!s) return;
    if (s.startsWith('@') || end === ';' && !hasTopColon(s)) { toks.push({ t: 'stmt', text: s }); return; }
    const i = topColon(s);
    if (i < 0) toks.push({ t: 'stmt', text: s });
    else toks.push({ t: 'decl', prop: s.slice(0, i).trim(), value: s.slice(i + 1).trim() });
  };
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      const text = src.slice(i, end < 0 ? src.length : end + 2);
      if (buf.trim()) buf += text; else toks.push({ t: 'comment', text });
      i += text.length - 1;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < src.length && src[j] !== c) { if (src[j] === '\\') j++; j++; }
      buf += src.slice(i, j + 1);
      i = j;
      continue;
    }
    if (c === '(') paren++;
    if (c === ')') paren = Math.max(0, paren - 1);
    if (paren === 0 && c === '{') { toks.push({ t: 'open', prelude: buf.trim() }); buf = ''; depth++; continue; }
    if (paren === 0 && c === '}') { flush('}'); if (depth > 0) { toks.push({ t: 'close' }); depth--; } continue; }
    if (paren === 0 && c === ';') { flush(';'); continue; }
    if (/\s/.test(c)) { if (buf && !buf.endsWith(' ')) buf += ' '; continue; }
    buf += c;
  }
  flush(';');
  while (depth-- > 0) toks.push({ t: 'close' });
  return toks;
}

function topColon(s: string): number {
  let p = 0, q = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === q) q = ''; continue; }
    if (c === '"' || c === "'") q = c;
    else if (c === '(') p++;
    else if (c === ')') p--;
    else if (c === ':' && p === 0) return i;
  }
  return -1;
}
const hasTopColon = (s: string) => topColon(s) >= 0;

/** Applies fn to the parts of s outside quoted strings. */
function outsideStrings(s: string, fn: (part: string) => string): string {
  return s.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/).map((p, i) => (i % 2 ? p : fn(p))).join('');
}

/** Normalises ", " and " > " between selectors, leaving brackets and parentheses untouched. */
function tidySelector(s: string): string {
  let out = '', depth = 0, q = '';
  for (const c of s) {
    if (q) { out += c; if (c === q) q = ''; continue; }
    if (c === '"' || c === "'") q = c;
    if (c === '[' || c === '(') depth++;
    if (c === ']' || c === ')') depth--;
    if (depth === 0 && (c === ',' || c === '>')) { out = out.trimEnd() + (c === ',' ? ', ' : ' > '); continue; }
    if (depth === 0 && c === ' ' && /[ >,]$/.test(out)) continue;
    out += c;
  }
  return out.trim();
}

export function formatCss(src: string, indent = '  '): string {
  const out: string[] = [];
  let d = 0;
  for (const t of tokenizeCss(src)) {
    const pad = indent.repeat(d);
    if (t.t === 'open') {
      if (out.length && out[out.length - 1] !== '' && out[out.length - 1].trim() !== '' && !out[out.length - 1].endsWith('{')) out.push('');
      out.push(pad + (t.prelude.startsWith('@') ? t.prelude : tidySelector(t.prelude)) + ' {');
      d++;
    } else if (t.t === 'close') {
      d = Math.max(0, d - 1);
      out.push(indent.repeat(d) + '}');
    } else if (t.t === 'decl') out.push(`${pad}${t.prop}: ${t.value};`);
    else if (t.t === 'stmt') out.push(`${pad}${t.text};`);
    else out.push(pad + t.text);
  }
  return out.join('\n').trim();
}

export function minifyCss(src: string): string {
  let out = '';
  for (const t of tokenizeCss(src)) {
    if (t.t === 'open') out += outsideStrings(t.prelude, (p) => p.replace(/\s*([,>~{}])\s*/g, '$1')) + '{';
    else if (t.t === 'close') out = out.replace(/;$/, '') + '}';
    else if (t.t === 'decl') out += `${t.prop}:${outsideStrings(t.value, (p) => p.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*,\s*/g, ',').replace(/\s*!important/g, '!important'))};`;
    else if (t.t === 'stmt') out += t.text + ';';
    else if (t.text.startsWith('/*!')) out += t.text;
  }
  return out.replace(/;$/, '');
}
