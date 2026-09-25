import { Link } from 'react-router-dom';
import { site } from '../config/site';
import { Prose } from './Prose';

export default function Terms() {
  return (
    <Prose path="/terms" heading="Terms of Use">
      <p className="muted">Last updated: {site.policyLastUpdated}</p>
      <p>By using DevTools Hub you agree to these terms. They are general terms for a free website and are not legal advice.</p>
      <h2>Acceptable use</h2>
      <p>You may use the tools for lawful personal and commercial purposes. Do not attempt to disrupt the site, overload it with automated requests, or use it to process data you have no right to use.</p>
      <h2>No warranty</h2>
      <p>The tools are provided “as is” and “as available”, without warranties of any kind, express or implied, including fitness for a particular purpose.</p>
      <h2>Accuracy</h2>
      <p>We work to make the tools correct, but results may contain errors. Check important output, such as code, configuration or security-related values, before relying on it.</p>
      <h2>Your responsibility</h2>
      <p>You are responsible for the data you enter and how you use the output. Avoid pasting secrets you are not permitted to handle, even though tools run locally.</p>
      <h2>Third-party services</h2>
      <p>The site may link to or, in future, include third-party services. Their own terms and privacy policies apply to them, and we are not responsible for them.</p>
      <h2>Changes to the service</h2>
      <p>We may add, change or remove tools, or change these terms, at any time. Continued use after changes means you accept the updated terms.</p>
      <h2>Intellectual property</h2>
      <p>The site’s design, text and code belong to their owner. Output you create with the tools is yours.</p>
      <h2>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, we are not liable for any indirect, incidental or consequential damages, or for any loss of data or profits, arising from your use of the site.</p>
      <h2>Contact</h2>
      <p>Questions about these terms? Use the <Link to="/contact">Contact page</Link>.</p>
    </Prose>
  );
}
