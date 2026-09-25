import { Link } from 'react-router-dom';
import { categories, tools } from '../config/registry';

export function Footer() {
  const cats = categories.filter((c) => tools.some((t) => t.category === c.id));
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-brand">DevTools Hub</p>
          <p className="muted">Fast, free developer tools. No signup required.</p>
        </div>
        <nav aria-label="Quick links">
          <h2>Quick links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/tools">All tools</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <nav aria-label="Categories">
          <h2>Categories</h2>
          <ul>{cats.map((c) => <li key={c.id}><Link to={`/tools?category=${c.id}`}>{c.name}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Legal">
          <h2>Legal</h2>
          <ul>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </nav>
      </div>
      <div className="wrap footer-base">© {new Date().getFullYear()} DevTools Hub</div>
    </footer>
  );
}
