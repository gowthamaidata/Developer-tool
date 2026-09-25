import { Link } from 'react-router-dom';
import { categories, pageMeta, tools } from '../config/registry';
import { useMeta } from '../lib/meta';
import { clearRecent, useFavorites, useRecent } from '../lib/storage';
import { modKey } from '../lib/shortcuts';
import { SearchBox } from '../components/SearchBox';
import { ToolList } from '../components/ToolList';
import { AdSlot } from '../components/AdSlot';

export default function Home() {
  const m = pageMeta('/');
  useMeta(m.title, m.description, '/');
  const recent = useRecent();
  const favorites = useFavorites();
  const cats = categories.filter((c) => tools.some((t) => t.category === c.id));

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <h1 className="hero-title">Developer tools that just work</h1>
          <div className="hero-side">
            <p className="hero-sub">Fast, free, privacy-friendly tools for everyday development tasks.</p>
            <SearchBox large label="Search tools" />
            <p className="hero-hint">Try “format json”, “password” or “hex to rgb”. Press <kbd className="kbd">{modKey} K</kbd> to search from any page.</p>
          </div>
        </div>
      </section>

      <div className="wrap">
        {(favorites.length > 0 || recent.length > 0) && (
          <section className="band personal" aria-label="Your tools">
            {favorites.length > 0 && <div><h2 className="band-title">Favorites</h2><ToolList items={favorites} dense /></div>}
            {recent.length > 0 && (
              <div>
                <div className="band-row"><h2 className="band-title">Recently used</h2><button type="button" className="link-btn" onClick={clearRecent}>Clear history</button></div>
                <ToolList items={recent} dense />
              </div>
            )}
          </section>
        )}

        <AdSlot id="home-top" />

        <section className="band">
          <h2 className="band-title">Popular tools</h2>
          <ToolList items={tools.filter((t) => t.popular)} />
        </section>

        <section className="band">
          <div className="band-row"><h2 className="band-title">Explore developer tools</h2><Link to="/tools">View all tools</Link></div>
          <div className="cat-table">
            {cats.map((c) => (
              <div className="cat-row" key={c.id}>
                <h3 className="cat-label"><Link to={`/tools?category=${c.id}`}>{c.name}</Link></h3>
                <ToolList items={tools.filter((t) => t.category === c.id)} dense />
              </div>
            ))}
          </div>
        </section>

        <section className="band trust">
          <h2 className="band-title">Built for speed. Designed for privacy. No signup required.</h2>
          <div className="trust-grid">
            <p><strong>Runs in your browser.</strong> Every tool here processes your input on your device. Nothing you paste is uploaded.</p>
            <p><strong>No account.</strong> Open a tool and use it. Favorites and recent tools are saved only in this browser.</p>
            <p><strong>Keyboard friendly.</strong> <kbd className="kbd">{modKey} K</kbd> to search, <kbd className="kbd">{modKey} Enter</kbd> to run the current tool.</p>
          </div>
        </section>
      </div>
    </>
  );
}
