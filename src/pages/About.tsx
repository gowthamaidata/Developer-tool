import { Link } from 'react-router-dom';
import { Prose } from './Prose';

export default function About() {
  return (
    <Prose path="/about" heading="About DevTools Hub">
      <p className="lead">DevTools Hub is designed to provide fast, accessible developer utilities that solve common technical tasks without unnecessary complexity.</p>
      <h2>What we focus on</h2>
      <p><strong>Speed.</strong> Pages are small and each tool loads only the code it needs.</p>
      <p><strong>Simplicity.</strong> One page per task, with the tool at the top and obvious Copy, Download and Clear buttons.</p>
      <p><strong>Privacy.</strong> The current tools run entirely in your browser. What you paste is not uploaded.</p>
      <p><strong>Accessibility.</strong> Every tool works with a keyboard and screen reader, in light and dark themes.</p>
      <p><strong>Free access.</strong> No account, no signup, no paywall.</p>
      <h2>Get in touch</h2>
      <p>Found a bug or want a new tool? <Link to="/contact">Send us a message</Link>.</p>
    </Prose>
  );
}
