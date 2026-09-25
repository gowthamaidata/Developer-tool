# DevTools Hub

Fast, free developer tools that run in the browser. React + TypeScript + Vite, no backend.

## Run
```bash
npm install
npm run dev        # http://localhost:5173
```

## Build
```bash
npm run build      # output in dist/
npm run preview    # test the production build locally
```

## Configure
Copy `.env.example` to `.env` and set `VITE_SITE_URL` (needed for canonical URLs and sitemap.xml).
Contact form: set `VITE_CONTACT_EMAIL` (opens the visitor's email app) or `VITE_CONTACT_ENDPOINT` (JSON POST, e.g. Formspree).
Analytics and ads are off until `VITE_ANALYTICS_ID` / `VITE_ADS_ENABLED=true` are set. Update the Privacy Policy first.

## Add a tool
1. Add an entry to `src/config/registry.ts` (name, slug, category, SEO text, FAQ, related tools).
2. Create the component in `src/tools/<name>/` (keep logic in a separate `logic.ts`).
3. Register it in `src/tools/index.ts`.
Navigation, search, categories, related tools, sitemap and per-page SEO update automatically.
