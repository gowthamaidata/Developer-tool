export interface PwOptions { length: number; upper: boolean; lower: boolean; digits: boolean; symbols: boolean; noAmbiguous: boolean }

const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>/?~',
};
const AMBIGUOUS = /[O0oIl1|`'"{}[\]()\/\\;:.,<>~]/g;

/** Unbiased secure random integer in [0, max) using rejection sampling. */
function randomInt(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % max;
  }
}

export function charsets(o: PwOptions): string[] {
  return (['upper', 'lower', 'digits', 'symbols'] as const)
    .filter((k) => o[k])
    .map((k) => (o.noAmbiguous ? SETS[k].replace(AMBIGUOUS, '') : SETS[k]))
    .filter(Boolean);
}

/** Generates a password containing at least one character from each selected set. */
export function generatePassword(o: PwOptions): string {
  const sets = charsets(o);
  if (!sets.length) throw new Error('Select at least one character type.');
  const pool = sets.join('');
  const chars = sets.slice(0, o.length).map((s) => s[randomInt(s.length)]);
  while (chars.length < o.length) chars.push(pool[randomInt(pool.length)]);
  for (let i = chars.length - 1; i > 0; i--) { const j = randomInt(i + 1); [chars[i], chars[j]] = [chars[j], chars[i]]; }
  return chars.join('');
}

export function entropyBits(o: PwOptions): number {
  const size = charsets(o).join('').length;
  return size ? Math.round(o.length * Math.log2(size)) : 0;
}

export function strength(bits: number): { label: string; level: 1 | 2 | 3 | 4 } {
  if (bits < 40) return { label: 'Weak', level: 1 };
  if (bits < 60) return { label: 'Fair', level: 2 };
  if (bits < 90) return { label: 'Strong', level: 3 };
  return { label: 'Very strong', level: 4 };
}
