import { FormatterTool } from '../FormatterTool';
import { formatHtml, minifyHtml } from './logic';

export default function HtmlFormatter() {
  return <FormatterTool language="HTML" placeholder="Paste your HTML here…" format={formatHtml} minify={minifyHtml} filename="formatted.html" mime="text/html" />;
}
