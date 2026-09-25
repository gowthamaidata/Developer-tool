import { Link } from 'react-router-dom';
import { useMeta } from '../lib/meta';
import { SearchBox } from '../components/SearchBox';

export default function NotFound() {
  useMeta('Page not found – DevTools Hub', 'This page does not exist.', '/404');
  return (
    <div className="wrap page narrow">
      <h1>Page not found</h1>
      <p className="lead">This address doesn’t match any page. Search for the tool you need, or <Link to="/tools">browse all tools</Link>.</p>
      <SearchBox large />
    </div>
  );
}
