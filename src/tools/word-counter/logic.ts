export const READ_WPM = 238;
export const SPEAK_WPM = 130;

type Seg = { segment(s: string): Iterable<{ isWordLike?: boolean; segment: string }> };
const makeSeg = (g: 'word' | 'sentence'): Seg | null => {
  const I = (Intl as unknown as { Segmenter?: new (l?: string, o?: object) => Seg }).Segmenter;
  return I ? new I(undefined, { granularity: g }) : null;
};
const wordSeg = makeSeg('word');
const sentSeg = makeSeg('sentence');

export function countText(text: string) {
  const trimmed = text.trim();
  let words = 0;
  if (trimmed) {
    if (wordSeg) for (const s of wordSeg.segment(text)) { if (s.isWordLike) words++; }
    else words = trimmed.split(/\s+/).length;
  }
  let sentences = 0;
  if (trimmed) {
    if (sentSeg) for (const s of sentSeg.segment(text)) { if (/[\p{L}\p{N}]/u.test(s.segment)) sentences++; }
    else sentences = (trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).length;
  }
  return {
    words,
    characters: [...text].length,
    charactersNoSpaces: [...text.replace(/\s/g, '')].length,
    sentences,
    paragraphs: trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0,
    lines: text ? text.split('\n').length : 0,
    readingMinutes: words / READ_WPM,
    speakingMinutes: words / SPEAK_WPM,
  };
}

export function duration(min: number): string {
  if (min === 0) return '0 sec';
  const sec = Math.max(1, Math.round(min * 60));
  if (sec < 60) return `${sec} sec`;
  const m = Math.floor(sec / 60), s = sec % 60;
  return s ? `${m} min ${s} sec` : `${m} min`;
}
