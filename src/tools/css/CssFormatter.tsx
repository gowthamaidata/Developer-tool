import { FormatterTool } from '../FormatterTool';
import { formatCss, minifyCss } from './logic';

export default function CssFormatter() {
  return <FormatterTool language="CSS" placeholder="Paste your CSS here…" format={formatCss} minify={minifyCss} filename="formatted.css" mime="text/css" />;
}
