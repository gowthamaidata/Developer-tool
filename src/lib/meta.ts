import { useEffect } from 'react';
import { site } from '../config/site';

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  el.setAttribute(attr, value);
}

/** Keeps title, description and canonical correct during client-side navigation. */
export function useMeta(title: string, description: string, path: string) {
  useEffect(() => {
    document.title = title;
    setTag('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }), 'content', description);
    if (site.url) {
      setTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', site.url + path);
    }
  }, [title, description, path]);
}
