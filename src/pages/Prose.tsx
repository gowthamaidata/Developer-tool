import type { ReactNode } from 'react';
import { pageMeta } from '../config/registry';
import { useMeta } from '../lib/meta';

export function Prose({ path, heading, children }: { path: string; heading: string; children: ReactNode }) {
  const m = pageMeta(path);
  useMeta(m.title, m.description, path);
  return <article className="wrap page narrow prose"><h1>{heading}</h1>{children}</article>;
}
