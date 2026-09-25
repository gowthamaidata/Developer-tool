import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../lib/theme';
import { modKey } from '../lib/shortcuts';
import { SearchBox } from './SearchBox';

export function Header() {
  const [theme, toggleTheme] = useTheme();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const loc = useLocation();

  useEffect(() => { setMenu(false); setSearch(false); }, [loc.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        lastFocus.current = document.activeElement as HTMLElement;
        setSearch(true);
      } else if (e.key === 'Escape') {
        setSearch(false);
        setMenu(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!search) { lastFocus.current?.focus?.(); return; }
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [search]);

  const openSearch = () => { lastFocus.current = document.activeElement as HTMLElement; setSearch(true); };

  return (
    <header className="site-header">
      <a href="#main" className="skip">Skip to content</a>
      <div className="wrap header-inner">
        <Link to="/" className="logo" aria-label="DevTools Hub home">
          <span className="logo-mark" aria-hidden="true">&lt;/&gt;</span>
          <span>DevTools Hub</span>
        </Link>
        <nav id="main-nav" className={'nav' + (menu ? ' is-open' : '')} aria-label="Main">
          <NavLink to="/tools">All tools</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="header-actions">
          <button type="button" className="btn search-trigger" onClick={openSearch} aria-haspopup="dialog">
            <span>Search</span><kbd className="kbd hide-sm">{modKey} K</kbd>
          </button>
          <button type="button" className="btn icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title="Toggle theme">
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
          <button type="button" className="btn icon-btn menu-btn" aria-expanded={menu} aria-controls="main-nav" aria-label="Menu" onClick={() => setMenu((m) => !m)}>
            <span aria-hidden="true">{menu ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>
      {search && (
        <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setSearch(false); }}>
          <div className="dialog" role="dialog" aria-modal="true" aria-label="Search tools" ref={dialog}>
            <SearchBox autoFocus large onDone={() => setSearch(false)} />
            <p className="dialog-hint"><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd> to choose, <kbd className="kbd">Enter</kbd> to open, <kbd className="kbd">Esc</kbd> to close</p>
          </div>
        </div>
      )}
    </header>
  );
}
