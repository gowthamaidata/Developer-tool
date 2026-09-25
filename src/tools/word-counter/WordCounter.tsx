import { useDeferredValue, useMemo, useState } from 'react';
import { ClearButton, CopyButton, Editor, Toolbar } from '../../components/ui';
import { countText, duration } from './logic';

export default function WordCounter() {
  const [text, setText] = useState('');
  const deferred = useDeferredValue(text);
  const c = useMemo(() => countText(deferred), [deferred]);
  const stats: [string, string][] = [
    ['Words', c.words.toLocaleString()],
    ['Characters', c.characters.toLocaleString()],
    ['Without spaces', c.charactersNoSpaces.toLocaleString()],
    ['Sentences', c.sentences.toLocaleString()],
    ['Paragraphs', c.paragraphs.toLocaleString()],
    ['Reading time', duration(c.readingMinutes)],
    ['Speaking time', duration(c.speakingMinutes)],
  ];
  return (
    <div className="tool">
      <dl className="stats" aria-live="polite">
        {stats.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <Editor label="Your text" placeholder="Paste or type your text here…" value={text} onChange={(e) => setText(e.target.value)} className="editor-prose editor-tall" />
      <Toolbar>
        <CopyButton text={text} label="Copy text" />
        <ClearButton onClear={() => setText('')} disabled={!text} />
      </Toolbar>
    </div>
  );
}
