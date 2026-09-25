import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Prose } from './Prose';

const items: [string, ReactNode][] = [
  ['Are these tools free?', 'Yes. All tools are free to use, with no account and no usage limits.'],
  ['Do I need an account?', 'No. There is no signup or login. Favorites and recently used tools are saved in your browser’s local storage, so they stay on this device only.'],
  ['Is my data uploaded?', 'No. Every current tool processes your input with JavaScript inside your browser. Nothing you paste or type is sent to our server. Each tool page confirms this above the tool.'],
  ['Do you store my input?', 'No. Tool input exists only in the open browser tab and is gone when you close or reload it. We store only your theme, favorites and recently used tool names, and only in your browser.'],
  ['Can I use these tools on mobile?', 'Yes. Every tool works on phones and tablets as well as desktop browsers.'],
  ['Can I use the tools commercially?', <>Yes. You can use the tools and their output for personal or commercial work. The output is yours. Please read the <Link to="/terms">Terms of Use</Link>, including the no-warranty section.</>],
  ['How do I report a bug?', <>Use the <Link to="/contact">Contact page</Link> and choose “Bug report”. Include the tool name, your browser and, if you can, a small example input that shows the problem (never include secrets).</>],
  ['Why is a tool not working?', 'Most problems come from an outdated browser or a browser extension that blocks scripts. Update your browser, try a private window, and make sure JavaScript is enabled. If it still fails, please report it.'],
  ['How can I suggest a new tool?', <>Send a feature request through the <Link to="/contact">Contact page</Link>. Tell us what task you are trying to do.</>],
];

export default function Faq() {
  return (
    <Prose path="/faq" heading="Frequently asked questions">
      <div className="faq">{items.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
    </Prose>
  );
}
