import { Link } from 'react-router-dom';
import { toolBySlug, toolPath, type ToolMeta } from '../config/registry';
import { FavoriteButton } from './FavoriteButton';

/** A ruled list of tools. Used for popular, favorites, recent, categories and related tools. */
export function ToolList({ items, dense }: { items: (ToolMeta | string)[]; dense?: boolean }) {
  const list = items.map((i) => (typeof i === 'string' ? toolBySlug(i) : i)).filter((t): t is ToolMeta => !!t);
  if (!list.length) return null;
  return (
    <ul className={'tool-list' + (dense ? ' tool-list-dense' : '')}>
      {list.map((t) => (
        <li key={t.slug} className="tool-row">
          <Link to={toolPath(t.slug)} className="tool-link">
            <span className="tool-icon" aria-hidden="true">{t.icon}</span>
            <span className="tool-text">
              <span className="tool-name">{t.name}</span>
              {!dense && <span className="tool-sum">{t.summary}</span>}
            </span>
          </Link>
          <FavoriteButton slug={t.slug} name={t.name} compact />
        </li>
      ))}
    </ul>
  );
}
