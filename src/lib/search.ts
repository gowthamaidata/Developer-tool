import { tools, type ToolMeta } from '../config/registry';

/** Ranks tools by how well every word of the query matches name, keywords and description. */
export function searchTools(query: string): ToolMeta[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored = tools.map((t) => {
    const name = t.name.toLowerCase();
    const kw = t.keywords.join(' ');
    const desc = (t.summary + ' ' + t.description).toLowerCase();
    let score = 0;
    for (const w of words) {
      const stem = w.replace(/(ing|er|s)$/, '') || w;
      if (name.startsWith(w)) score += 6;
      else if (name.includes(w)) score += 4;
      else if (kw.includes(w) || kw.includes(stem)) score += 3;
      else if (desc.includes(w) || desc.includes(stem)) score += 1;
      else return { t, score: 0 };
    }
    return { t, score };
  });
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.t);
}
