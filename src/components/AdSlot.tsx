import { site } from '../config/site';

/**
 * Reserved space for a future ad unit. Renders nothing unless VITE_ADS_ENABLED=true,
 * so the layout never shows empty boxes. Place your ad provider's markup inside.
 * Keep ads away from tool buttons, and label them clearly.
 */
export function AdSlot({ id }: { id: string }) {
  if (!site.adsEnabled) return null;
  return (
    <aside className="ad-slot" aria-label="Advertisement" data-slot={id}>
      <span className="ad-label">Advertisement</span>
    </aside>
  );
}
