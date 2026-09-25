const WORDS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum curabitur pretium tincidunt lacus nunc facilisis mauris pellentesque habitant morbi tristique senectus netus malesuada fames turpis egestas vestibulum ante primis faucibus orci luctus ultrices posuere cubilia integer nec odio praesent libero').split(' ');
const OPENING = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

const pick = () => WORDS[Math.floor(Math.random() * WORDS.length)];
const between = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function sentence(): string {
  const n = between(6, 14);
  const words = Array.from({ length: n }, pick);
  if (n > 9) words[between(3, n - 4)] += ',';
  return cap(words.join(' ')) + '.';
}
const paragraph = () => Array.from({ length: between(4, 7) }, sentence).join(' ');

export type LoremUnit = 'paragraphs' | 'sentences' | 'words';

export function lorem(unit: LoremUnit, count: number, startClassic: boolean): string {
  let out: string;
  if (unit === 'words') {
    const w = Array.from({ length: count }, pick);
    if (startClassic) OPENING.replace(',', '').toLowerCase().split(' ').slice(0, count).forEach((x, i) => (w[i] = x));
    out = cap(w.join(' ')) + '.';
  } else if (unit === 'sentences') {
    const s = Array.from({ length: count }, sentence);
    if (startClassic) s[0] = OPENING + '.';
    out = s.join(' ');
  } else {
    const p = Array.from({ length: count }, paragraph);
    if (startClassic) p[0] = OPENING + '. ' + p[0];
    out = p.join('\n\n');
  }
  return out;
}
