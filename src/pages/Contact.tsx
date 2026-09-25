import { useState, type FormEvent } from 'react';
import { site } from '../config/site';
import { Alert } from '../components/ui';
import { Prose } from './Prose';

const TOPICS = ['Bug report', 'Feature request', 'General inquiry'];

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', subject: TOPICS[0], message: '' });
  const [state, setState] = useState<{ kind: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const configured = !!(site.contactEndpoint || site.contactEmail);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.name.trim()) errs.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = 'Enter a valid email address, like name@example.com.';
    if (f.message.trim().length < 10) errs.message = 'Write a message of at least 10 characters.';
    setErrors(errs);
    if (Object.keys(errs).length) { setState({ kind: 'error', text: 'Please fix the highlighted fields.' }); return; }
    if (site.contactEndpoint) {
      setSending(true);
      try {
        const r = await fetch(site.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(f) });
        if (!r.ok) throw new Error();
        setState({ kind: 'success', text: 'Message sent. Thank you.' });
        setF({ name: '', email: '', subject: TOPICS[0], message: '' });
      } catch {
        setState({ kind: 'error', text: 'Your message could not be sent. Check your connection and try again.' });
      } finally { setSending(false); }
    } else if (site.contactEmail) {
      const body = `${f.message}\n\n— ${f.name} (${f.email})`;
      window.location.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent(`[${f.subject}] DevTools Hub`)}&body=${encodeURIComponent(body)}`;
      setState({ kind: 'info', text: 'Your email app should open with the message filled in. Press Send there to deliver it.' });
    }
  };

  const field = (k: 'name' | 'email', label: string, type: string, auto: string) => (
    <div className="field">
      <label htmlFor={`c-${k}`}>{label}</label>
      <input id={`c-${k}`} className="input" type={type} autoComplete={auto} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}
        aria-invalid={!!errors[k] || undefined} aria-describedby={errors[k] ? `c-${k}-err` : undefined} />
      {errors[k] && <p id={`c-${k}-err`} className="field-error">{errors[k]}</p>}
    </div>
  );

  return (
    <Prose path="/contact" heading="Contact">
      <p className="lead">Report a bug, request a tool, or ask a question.</p>
      {!configured && <Alert kind="info" title="Contact form backend not configured yet.">Messages can’t be sent from this form until the site owner sets VITE_CONTACT_EMAIL or VITE_CONTACT_ENDPOINT.</Alert>}
      {site.contactEmail && <p>Email: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p>}
      <form className="form" onSubmit={submit} noValidate>
        {field('name', 'Name', 'text', 'name')}
        {field('email', 'Email', 'email', 'email')}
        <div className="field">
          <label htmlFor="c-subject">Subject</label>
          <select id="c-subject" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        <div className="field">
          <label htmlFor="c-message">Message</label>
          <textarea id="c-message" className="input" rows={6} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })}
            aria-invalid={!!errors.message || undefined} aria-describedby={errors.message ? 'c-message-err' : 'c-message-hint'} />
          {errors.message ? <p id="c-message-err" className="field-error">{errors.message}</p>
            : <p id="c-message-hint" className="field-hint">For bug reports, include the tool name, your browser and a small example. Never include passwords or tokens.</p>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={!configured || sending}>{sending ? 'Sending…' : site.contactEndpoint ? 'Send message' : 'Open in email app'}</button>
        {state && <Alert kind={state.kind} title={state.text} />}
      </form>
    </Prose>
  );
}
