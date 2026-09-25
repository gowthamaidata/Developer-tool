import { toggleFavorite, useFavorites } from '../lib/storage';

export function FavoriteButton({ slug, name, compact }: { slug: string; name: string; compact?: boolean }) {
  const fav = useFavorites().includes(slug);
  return (
    <button
      type="button"
      className={'fav' + (fav ? ' is-on' : '') + (compact ? ' fav-compact' : ' btn')}
      aria-pressed={fav}
      aria-label={compact ? (fav ? `Remove ${name} from favorites` : `Add ${name} to favorites`) : undefined}
      title={fav ? 'Remove from favorites' : 'Add to favorites'}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(slug); }}
    >
      <span aria-hidden="true">{fav ? '★' : '☆'}</span>
      {!compact && <span>{fav ? 'Favorited' : 'Favorite'}</span>}
    </button>
  );
}
