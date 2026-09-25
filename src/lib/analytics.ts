import { site } from '../config/site';

/**
 * Analytics integration point. Nothing is loaded unless VITE_ANALYTICS_ID is set.
 * To enable Google Analytics 4: set VITE_ANALYTICS_ID=G-XXXXXXX in .env, then
 * update the Privacy Policy (src/pages/Privacy.tsx) to describe it before deploying.
 */
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } }

export function initAnalytics() {
  if (!site.analyticsId || typeof window === 'undefined') return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(site.analyticsId)}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer!.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', site.analyticsId, { send_page_view: false });
}

export function trackPageView(path: string) {
  if (site.analyticsId && window.gtag) window.gtag('event', 'page_view', { page_path: path });
}
