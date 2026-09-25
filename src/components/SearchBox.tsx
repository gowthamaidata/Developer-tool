import { useId, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toolPath } from '../config/registry';
import { searchTools } from '../lib/search';

interface Props { autoFocus?: boolean; onDone?: () => void; large?: boolean; label?: string }

/** Accessible combobox that searches the tool registry and navigates on Enter. */
export function SearchBox({ autoFocus, onDone, large, label = 'Search tools' }: Props) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const id = useId();
  const results = searchTools(q).slice(0, 8);
  const open = q.trim().length > 0;

  const go = (slug: string) => { navigate(toolPath(slug)); setQ(''); onDone?.(); };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active].slug); }
    else if (e.key === 'Escape' && q) { e.stopPropagation(); setQ(''); }
  };

  return (
    <div className={'search' + (large ? ' search-lg' : '')}>
      <label htmlFor={id + 'in'} className="sr-only">{label}</label>
      <input
        id={id + 'in'}
        type="search"
        className="search-input"
        placeholder="What do you need to do?"
        autoFocus={autoFocus}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={id + 'list'}
        aria-activedescendant={open && results[active] ? `${id}-${results[active].slug}` : undefined}
        value={q}
        onChange={(e) => { setQ(e.target.value); setActive(0); }}
        onKeyDown={onKey}
      />
      {open && (
        <ul id={id + 'list'} role="listbox" className="search-results" aria-label="Matching tools">
          {results.length === 0 && <li className="search-empty" role="option" aria-selected="false" aria-disabled="true">No tool matches “{q}”. Try “json”, “password” or “color”.</li>}
          {results.map((t, i) => (
            <li
              key={t.slug}
              id={`${id}-${t.slug}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'is-active' : ''}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); go(t.slug); }}
            >
              <span className="tool-icon" aria-hidden="true">{t.icon}</span>
              <span><span className="tool-name">{t.name}</span><span className="tool-sum">{t.summary}</span></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
