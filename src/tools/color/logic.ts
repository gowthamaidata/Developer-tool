export interface Rgba { r: number; g: number; b: number; a: number }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round = (v: number, d = 0) => { const f = 10 ** d; return Math.round(v * f) / f; };

function alpha(s: string | undefined): number {
  if (s === undefined) return 1;
  const v = s.endsWith('%') ? parseFloat(s) / 100 : parseFloat(s);
  if (Number.isNaN(v)) throw new Error(`Alpha value "${s}" is not a number.`);
  return clamp(v, 0, 1);
}

export function parseColor(input: string): Rgba {
  const s = input.trim().toLowerCase();
  if (!s) throw new Error('Enter a color value.');
  const hex = s.match(/^#?([0-9a-f]{3,8})$/);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) throw new Error('HEX colors need 3, 4, 6 or 8 digits.');
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? round(n(6) / 255, 3) : 1 };
  }
  const fn = s.match(/^(rgba?|hsla?)\(\s*([^)]*)\)$/);
  if (!fn) throw new Error('Unrecognised color. Use HEX (#1351aa), rgb(19, 81, 170) or hsl(215, 80%, 37%).');
  const parts = fn[2].split(/\s*[,/]\s*|\s+/).filter(Boolean);
  if (parts.length < 3 || parts.length > 4) throw new Error(`${fn[1]}() needs 3 values, plus an optional alpha.`);
  const nums = parts.slice(0, 3).map((p) => {
    const v = parseFloat(p);
    if (Number.isNaN(v)) throw new Error(`"${p}" is not a number.`);
    return { v, pct: p.endsWith('%') };
  });
  const a = alpha(parts[3]);
  if (fn[1].startsWith('rgb')) {
    const [r, g, b] = nums.map((n) => clamp(Math.round(n.pct ? n.v * 2.55 : n.v), 0, 255));
    return { r, g, b, a };
  }
  const h = ((nums[0].v % 360) + 360) % 360;
  const sat = clamp(nums[1].v, 0, 100) / 100;
  const l = clamp(nums[2].v, 0, 100) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const f = (n: number) => l - sat * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255), a };
}

export function toHsl({ r, g, b }: Rgba) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B), d = max - min;
  const l = (max + min) / 2;
  let h = 0;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d) {
    if (max === R) h = ((G - B) / d) % 6;
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const hx = (n: number) => n.toString(16).padStart(2, '0');

export function formats(c: Rgba) {
  const { h, s, l } = toHsl(c);
  const a = round(c.a, 3);
  const hex = `#${hx(c.r)}${hx(c.g)}${hx(c.b)}`.toUpperCase();
  return [
    { label: 'HEX', value: a < 1 ? hex + hx(Math.round(a * 255)).toUpperCase() : hex },
    { label: 'RGB', value: `rgb(${c.r}, ${c.g}, ${c.b})` },
    { label: 'RGBA', value: `rgba(${c.r}, ${c.g}, ${c.b}, ${a})` },
    { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: 'HSLA', value: `hsla(${h}, ${s}%, ${l}%, ${a})` },
  ];
}

export const toHex6 = (c: Rgba) => `#${hx(c.r)}${hx(c.g)}${hx(c.b)}`;
