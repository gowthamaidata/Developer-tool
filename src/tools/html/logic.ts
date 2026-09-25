/** Small, dependency-free HTML formatter/minifier. Parses text only; never renders or executes input. */

const VOID = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
const RAW = new Set(['script', 'style', 'pre', 'textarea']);
const INLINE = new Set('a abbr b bdi bdo br button cite code data dfn em i img input kbd label mark q s samp select small span strong sub sup time u var'.split(' '));
const AUTO_CLOSE: Record<string, string[]> = { li: ['li'], p: ['p'], option: ['option'], tr: ['tr'], td: ['td', 'th'], th: ['td', 'th'], dt: ['dt', 'dd'], dd: ['dt', 'dd'] };

type El = { t: 'el'; name: string; open: string; close: string | null; kids: Node[]; raw?: string; void?: boolean };
type Node = El | { t: 'text'; v: string } | { t: 'comment'; v: string } | { t: 'decl'; v: string };

const TOKEN = /<!--[\s\S]*?(?:-->|$)|<![^>]*>|<\/[a-zA-Z][^>]*>|<[a-zA-Z](?:[^>"']|"[^"]*"|'[^']*')*>/g;

export function parseHtml(src: string): Node[] {
  const root: El = { t: 'el', name: '#root', open: '', close: '', kids: [] };
  const stack: El[] = [root];
  const top = () => stack[stack.length - 1];
  TOKEN.lastIndex = 0;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN.exec(src))) {
    if (m.index > last) top().kids.push({ t: 'text', v: src.slice(last, m.index) });
    const tok = m[0];
    last = TOKEN.lastIndex;
    if (tok.startsWith('<!--')) top().kids.push({ t: 'comment', v: tok });
    else if (tok.startsWith('<!')) top().kids.push({ t: 'decl', v: tok });
    else if (tok.startsWith('</')) {
      const name = tok.slice(2).match(/^[\w:-]+/)?.[0].toLowerCase() ?? '';
      const idx = stack.map((e) => e.name).lastIndexOf(name);
      if (idx > 0) { stack[idx].close = tok; stack.length = idx; }
    } else {
      const name = tok.match(/^<([\w:-]+)/)![1].toLowerCase();
      if (AUTO_CLOSE[name]?.includes(top().name)) stack.pop();
      const el: El = { t: 'el', name, open: tok, close: null, kids: [] };
      top().kids.push(el);
      if (VOID.has(name) || tok.endsWith('/>')) el.void = true;
      else if (RAW.has(name)) {
        const end = new RegExp(`</${name}\\s*>`, 'ig');
        end.lastIndex = last;
        const em = end.exec(src);
        el.raw = src.slice(last, em ? em.index : src.length);
        el.close = em ? em[0] : `</${name}>`;
        last = TOKEN.lastIndex = em ? em.index + em[0].length : src.length;
      } else stack.push(el);
    }
  }
  if (last < src.length) top().kids.push({ t: 'text', v: src.slice(last) });
  return root.kids;
}

/** Collapses whitespace inside a tag, outside quoted attribute values. */
function tidyTag(tag: string): string {
  let out = '', q = '';
  for (const c of tag) {
    if (q) { out += c; if (c === q) q = ''; continue; }
    if (c === '"' || c === "'") { q = c; out += c; continue; }
    if (/\s/.test(c)) { if (!out.endsWith(' ')) out += ' '; continue; }
    out += c;
  }
  return out.replace(/ (\/?>)$/, (_, e) => (e === '/>' ? ' />' : '>'));
}

const closeOf = (e: El) => e.close ?? `</${e.name}>`;

function dedent(s: string): string[] {
  const lines = s.replace(/^\s*\n|\s+$/g, '').split('\n');
  const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^[ \t]*/)![0].length));
  return lines.map((l) => l.slice(Number.isFinite(ind) ? ind : 0).replace(/\s+$/, ''));
}

export function formatHtml(src: string, indent = '  '): string {
  const out: string[] = [];
  const walk = (nodes: Node[], d: number) => {
    const pad = indent.repeat(d);
    for (const n of nodes) {
      if (n.t === 'text') { const v = n.v.replace(/\s+/g, ' ').trim(); if (v) out.push(pad + v); continue; }
      if (n.t !== 'el') { out.push(pad + n.v.trim()); continue; }
      const open = tidyTag(n.open);
      if (n.void) { out.push(pad + open); continue; }
      if (n.raw !== undefined) {
        if (n.name === 'pre' || n.name === 'textarea') out.push(pad + open + n.raw + closeOf(n));
        else if (!n.raw.trim()) out.push(pad + open + closeOf(n));
        else { out.push(pad + open, ...dedent(n.raw).map((l) => (l ? pad + indent + l : '')), pad + closeOf(n)); }
        continue;
      }
      const kids = n.kids.filter((k) => !(k.t === 'text' && !k.v.trim()));
      const only = allInline(kids) ? compact(n.kids).trim() : null;
      if (!kids.length) out.push(pad + open + closeOf(n));
      else if (only !== null && (pad + open + only + closeOf(n)).length <= 120) out.push(pad + open + only + closeOf(n));
      else { out.push(pad + open); walk(kids, d + 1); out.push(pad + closeOf(n)); }
    }
  };
  walk(parseHtml(src), 0);
  return out.join('\n');
}

const isInline = (n?: Node) => !!n && (n.t === 'text' || (n.t === 'el' && INLINE.has(n.name)));
const allInline = (nodes: Node[]): boolean =>
  nodes.every((n) => n.t === 'text' || (n.t === 'el' && INLINE.has(n.name) && n.raw === undefined && (n.void || allInline(n.kids))));

function compact(nodes: Node[]): string {
  return nodes.map((n, i) => {
    if (n.t === 'text') {
      const v = n.v.replace(/\s+/g, ' ');
      if (v.trim()) return v;
      return isInline(nodes[i - 1]) && isInline(nodes[i + 1]) ? ' ' : '';
    }
    if (n.t === 'comment') return n.v.startsWith('<!--[if') ? n.v : '';
    if (n.t === 'decl') return n.v;
    const open = tidyTag(n.open);
    if (n.void) return open;
    if (n.raw !== undefined) return open + (n.name === 'pre' || n.name === 'textarea' ? n.raw : n.raw.trim()) + closeOf(n);
    return open + compact(n.kids) + closeOf(n);
  }).join('');
}

export function minifyHtml(src: string): string {
  return compact(parseHtml(src)).trim();
}
