/** Site-wide settings. Values come from environment variables (see .env.example). */
const env = import.meta.env;

export const site = {
  name: 'DevTools Hub',
  tagline: 'Fast, free developer tools. No signup required.',
  url: ((env.VITE_SITE_URL as string) || '').replace(/\/+$/, ''),
  contactEmail: (env.VITE_CONTACT_EMAIL as string) || '',
  contactEndpoint: (env.VITE_CONTACT_ENDPOINT as string) || '',
  analyticsId: (env.VITE_ANALYTICS_ID as string) || '',
  adsEnabled: env.VITE_ADS_ENABLED === 'true',
  policyLastUpdated: 'September 25, 2026',
};
