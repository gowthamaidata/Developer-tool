import { useSyncExternalStore } from 'react';

/** Tiny localStorage-backed store. Only non-sensitive preferences are stored. */
const PREFIX = 'dth:';
const listeners = new Set<() => void>();
const cache = new Map<string, unknown>();

function read<T>(key: string, fallback: T): T {
  if (cache.has(key)) return cache.get(key) as T;
  let v = fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw != null) v = JSON.parse(raw) as T;
  } catch { /* storage unavailable or corrupted: use fallback */ }
  cache.set(key, v);
  return v;
}

export function write<T>(key: string, value: T) {
  cache.set(key, value);
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* ignore quota/private mode */ }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useStored<T>(key: string, fallback: T): T {
  return useSyncExternalStore(subscribe, () => read(key, fallback), () => fallback);
}

const EMPTY: string[] = [];
export const useFavorites = () => useStored<string[]>('favorites', EMPTY);
export const useRecent = () => useStored<string[]>('recent', EMPTY);

export function toggleFavorite(slug: string) {
  const f = read<string[]>('favorites', EMPTY);
  write('favorites', f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug]);
}
export function addRecent(slug: string) {
  const r = read<string[]>('recent', EMPTY);
  write('recent', [slug, ...r.filter((s) => s !== slug)].slice(0, 6));
}
export const clearRecent = () => write('recent', []);
