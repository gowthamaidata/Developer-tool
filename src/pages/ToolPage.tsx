import { Suspense, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categories, toolBySlug, toolPath } from '../config/registry';
import { toolComponents } from '../tools';
import { useMeta } from '../lib/meta';
import { addRecent } from '../lib/storage';
import { FavoriteButton } from '../components/FavoriteButton';
import { ToolList } from '../components/ToolList';
import { AdSlot } from '../components/AdSlot';
import NotFound from './NotFound';

export default function ToolPage() {
  const { slug = '' } = useParams();
  const tool = toolBySlug(slug);
  const Comp = toolComponents[slug];
  useMeta(tool?.title ?? 'Page not found – DevTools Hub', tool?.description ?? '', toolPath(slug));
  useEffect(() => { if (tool) addRecent(tool.slug); }, [tool]);
  if (!tool || !Comp) return <NotFound />;
  const cat = categories.find((c) => c.id === tool.category);

  return (
    <article className="wrap tool-page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/tools">Tools</Link> <span aria-hidden="true">/</span> <Link to={`/tools?category=${tool.category}`}>{cat?.name}</Link>
      </nav>
      <header className="tool-head">
        <div>
          <h1>{tool.name}</h1>
          <p className="lead">{tool.summary}</p>
        </div>
        <FavoriteButton slug={tool.slug} name={tool.name} />
      </header>
      {tool.runsLocally && (
        <p className="privacy-note"><span aria-hidden="true">●</span> This tool processes your input locally in your browser. Your data is not uploaded to our server.</p>
      )}

      <Suspense fallback={<div className="loading" role="status">Loading tool…</div>}>
        <Comp />
      </Suspense>

      <AdSlot id="tool-bottom" />

      <div className="doc">
        <section>
          <h2>What is the {tool.name}?</h2>
          <p>{tool.what}</p>
        </section>
        <section>
          <h2>How to use it</h2>
          <ol className="steps">{tool.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        </section>
        <section>
          <h2>Example</h2>
          <div className="example">
            <div><h3>{tool.example.label ?? 'Input'}</h3><pre><code>{tool.example.input}</code></pre></div>
            <div><h3>Output</h3><pre><code>{tool.example.output}</code></pre></div>
          </div>
        </section>
        <section>
          <h2>Frequently asked questions</h2>
          <div className="faq">
            {tool.faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
          </div>
        </section>
        <section>
          <h2>You may also need</h2>
          <ToolList items={tool.related} dense />
        </section>
      </div>
    </article>
  );
}
