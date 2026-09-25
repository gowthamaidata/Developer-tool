import { Link } from 'react-router-dom';
import { site } from '../config/site';
import { Prose } from './Prose';

export default function Privacy() {
  return (
    <Prose path="/privacy" heading="Privacy Policy">
      <p className="muted">Last updated: {site.policyLastUpdated}</p>
      <p>This policy explains what information DevTools Hub (“we”, “the site”) handles and why. It is a general description, not legal advice.</p>

      <h2>Information you enter into tools</h2>
      <p>All current tools run in your browser. Text, code, JSON or other data you enter is processed on your device and is not sent to our server. It is not stored after you close or reload the page.</p>

      <h2>Local storage</h2>
      <p>We use your browser’s local storage to remember, on your device only:</p>
      <ul>
        <li>your theme choice (light or dark),</li>
        <li>tools you mark as favorites,</li>
        <li>the names of tools you recently opened.</li>
      </ul>
      <p>This information is never sent to us. You can clear recent tools from the home page, or remove everything by clearing this site’s data in your browser settings.</p>

      <h2>Cookies</h2>
      <p>The site does not set cookies at this time.</p>

      <h2>Analytics</h2>
      <p>The site does not currently use analytics. If we add analytics in future, we will update this policy before it is enabled and describe what is collected.</p>

      <h2>Advertising</h2>
      <p>The site does not currently show ads. If we add advertising in future (for example Google AdSense), the ad provider may use cookies or similar technologies to show and measure ads. We will update this policy, and ask for consent where the law requires it, before ads are shown.</p>

      <h2>Hosting and server logs</h2>
      <p>Like any website, the site is served by a hosting provider. When your browser requests a page, the provider may automatically log technical data such as your IP address, browser type and the page requested, for security and reliability. These logs do not include anything you type into the tools.</p>

      <h2>Contact form</h2>
      <p>If you contact us, we receive the name, email address and message you provide, and use them only to reply to you. Depending on how the contact form is set up, your message may be delivered through your own email app or a form-handling service. We keep messages only as long as needed to handle your request.</p>

      <h2>Third-party services</h2>
      <p>The tools do not load third-party scripts. Any future third-party services will be listed here.</p>

      <h2>Your rights</h2>
      <p>Depending on where you live, you may have the right to access, correct or delete personal information we hold about you (in practice, only contact messages). To make a request, use the <Link to="/contact">Contact page</Link>.</p>

      <h2>Data retention</h2>
      <p>Tool input is not retained. Local storage data stays in your browser until you clear it. Contact messages are deleted when they are no longer needed.</p>

      <h2>Changes to this policy</h2>
      <p>We will update this page when our practices change and revise the date at the top.</p>
    </Prose>
  );
}
