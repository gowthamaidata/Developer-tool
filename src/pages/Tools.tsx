import { useSearchParams } from 'react-router-dom';
import { categories, pageMeta, tools, type CategoryId } from '../config/registry';
import { useMeta } from '../lib/meta';
import { searchTools } from '../lib/search';
import { clearRecent, useFavorites, useRecent } from '../lib/storage';
import { ToolList } from '../components/ToolList';

export default function Tools() {
  const m = pageMeta('/tools');
  useMeta(m.title, m.description, '/tools');
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const cat = params.get('category') as CategoryId | null;
  const favorites = useFavorites();
  const recent = useRecent();
  const cats = categories.filter((c) => tools.some((t) => t.category === c.id));

  const update = (next: { q?: string; category?: string | null }) => {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) { if (v) p.set(k, v); else p.delete(k); }
    setParams(p, { replace: true });
  };

  let list = q.trim() ? searchTools(q) : tools;
  if (cat) list = list.filter((t) => t.category === cat);

  return (
    <div className="wrap page">
      <h1>All developer tools</h1>
      <p className="lead">{tools.length} tools, all running in your browser.</p>
      <div className="filter-bar">
        <label htmlFor="tool-filter" className="sr-only">Filter tools</label>
        <input id="tool-filter" type="search" className="search-input" placeholder="Filter tools…" value={q} onChange={(e) => update({ q: e.target.value })} />
        <div className="chips" role="group" aria-label="Category">
          <button type="button" className="chip" aria-pressed={!cat} onClick={() => update({ category: null })}>All</button>
          {cats.map((c) => <button type="button" key={c.id} className="chip" aria-pressed={cat === c.id} onClick={() => update({ category: c.id })}>{c.name}</button>)}
        </div>
      </div>
      {!q && !cat && (favorites.length > 0 || recent.length > 0) && (
        <div className="personal band">
          {favorites.length > 0 && <div><h2 className="band-title">Favorites</h2><ToolList items={favorites} dense /></div>}
          {recent.length > 0 && <div><div className="band-row"><h2 className="band-title">Recently used</h2><button type="button" className="link-btn" onClick={clearRecent}>Clear history</button></div><ToolList items={recent} dense /></div>}
        </div>
      )}
      <section className="band" aria-live="polite">
        <h2 className="band-title">{cat ? cats.find((c) => c.id === cat)?.name : 'Every tool'}{q && ` matching “${q}”`}</h2>
        {list.length ? <ToolList items={list} /> : <p className="empty-note">No tools match. Clear the filter or try another word, such as “json” or “color”.</p>}
      </section>
    </div>
  );
}
