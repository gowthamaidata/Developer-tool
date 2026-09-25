/**
 * Single source of truth for tools and pages.
 * Pure data only (no React) so the build step can read it for sitemap/SEO.
 * To add a tool: add an entry here, then register its component in src/tools/index.ts.
 */

export type CategoryId = 'json' | 'encoding' | 'generators' | 'web' | 'testing' | 'conversion' | 'text';

export const categories: { id: CategoryId; name: string; description: string }[] = [
  { id: 'json', name: 'JSON', description: 'Format, validate and clean up JSON data.' },
  { id: 'encoding', name: 'Encoding & Decoding', description: 'Convert data between encodings.' },
  { id: 'generators', name: 'Generators', description: 'Create passwords and placeholder text.' },
  { id: 'web', name: 'Web Development', description: 'Tidy up HTML and CSS.' },
  { id: 'testing', name: 'Testing', description: 'Check patterns and inputs.' },
  { id: 'conversion', name: 'Conversion', description: 'Convert values between formats.' },
  { id: 'text', name: 'Text', description: 'Analyse and work with plain text.' },
];

export interface ToolFaq { q: string; a: string }
export interface ToolMeta {
  slug: string;
  name: string;
  title: string;          // <title> for SEO
  description: string;    // meta description
  summary: string;        // short line under the H1
  category: CategoryId;
  icon: string;           // short glyph shown in lists
  keywords: string[];
  related: string[];      // slugs; slugs that don't exist are ignored automatically
  popular?: boolean;
  runsLocally: boolean;   // true only if the tool never sends input anywhere
  what: string;
  steps: string[];
  example: { label?: string; input: string; output: string };
  faqs: ToolFaq[];
}

export const tools: ToolMeta[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    title: 'JSON Formatter & Beautifier – Pretty Print JSON Online | DevTools Hub',
    description: 'Format, beautify, minify and validate JSON in your browser. Choose indentation, sort keys, and get clear error locations. Nothing is uploaded.',
    summary: 'Pretty-print, minify and validate JSON with clear error locations.',
    category: 'json',
    icon: '{ }',
    keywords: ['json', 'format', 'beautify', 'pretty print', 'prettify', 'indent', 'minify', 'validate'],
    related: ['json-validator', 'html-formatter', 'css-formatter', 'word-counter'],
    popular: true,
    runsLocally: true,
    what: 'A JSON formatter takes compact or messy JSON and re-prints it with consistent indentation and line breaks so you can read it. It also checks that the JSON is valid and points to the exact line and column when it is not.',
    steps: ['Paste your JSON into the input box.', 'Choose an indentation and press Format (or Ctrl/Cmd + Enter).', 'Copy the result or download it as a .json file.'],
    example: { input: '{"name":"John","age":25}', output: '{\n  "name": "John",\n  "age": 25\n}' },
    faqs: [
      { q: 'Is my JSON uploaded anywhere?', a: 'No. Formatting runs entirely in your browser. The input never leaves your device.' },
      { q: 'Why does it say my JSON is invalid?', a: 'Common causes are trailing commas, single quotes instead of double quotes, unquoted property names and comments. JSON allows none of these. The error message shows the line and column of the first problem.' },
      { q: 'Does sorting keys change my data?', a: 'Sorting only changes the order of keys inside objects. Values and array order stay the same. Leave "Sort keys" off if order matters to you.' },
      { q: 'How large a file can it handle?', a: 'Files of several megabytes format quickly on modern devices. Very large inputs depend on your device memory and may take a few seconds.' },
    ],
  },
  {
    slug: 'json-validator',
    name: 'JSON Validator',
    title: 'JSON Validator – Check JSON Syntax Online | DevTools Hub',
    description: 'Validate JSON instantly as you type. See whether it is valid and get a precise, readable error with line and column. Runs locally in your browser.',
    summary: 'Check JSON syntax as you type, with the exact line and column of any error.',
    category: 'json',
    icon: '{✓}',
    keywords: ['json', 'validate', 'validator', 'lint', 'check', 'syntax', 'error'],
    related: ['json-formatter', 'html-formatter', 'css-formatter'],
    popular: true,
    runsLocally: true,
    what: 'A JSON validator checks whether text follows the JSON syntax rules (RFC 8259). It checks syntax only: it does not check the data against a schema.',
    steps: ['Paste or type JSON into the editor.', 'The result updates automatically as you type.', 'Fix the reported line and column, or copy the result to share it.'],
    example: { label: 'Invalid input', input: '{\n  "name": "John",\n}', output: 'Invalid JSON: Trailing comma is not allowed in JSON (line 3, column 1).' },
    faqs: [
      { q: 'Does this validate against a JSON Schema?', a: 'No. It checks JSON syntax only. Schema validation (required fields, types) is a separate step.' },
      { q: 'Are comments allowed in JSON?', a: 'No. Standard JSON does not allow comments. Formats such as JSONC or JSON5 do, but most JSON parsers reject them.' },
      { q: 'Is my data sent to a server?', a: 'No. Validation runs in your browser.' },
    ],
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    title: 'Secure Password Generator – Random Strong Passwords | DevTools Hub',
    description: 'Generate strong random passwords in your browser using the Web Crypto API. Choose length and character sets, exclude ambiguous characters. Nothing is stored.',
    summary: 'Create random passwords with your browser’s cryptographic random number generator.',
    category: 'generators',
    icon: '***',
    keywords: ['password', 'generate', 'generator', 'random', 'secure', 'strong', 'secret'],
    related: ['lorem-ipsum', 'color-converter', 'word-counter'],
    popular: true,
    runsLocally: true,
    what: 'This generator builds passwords with crypto.getRandomValues, the browser’s cryptographically secure random source, using unbiased sampling so every allowed character is equally likely. Passwords are created on your device and are not stored or sent anywhere.',
    steps: ['Choose a length and which character types to include.', 'Press Generate (or Ctrl/Cmd + Enter).', 'Copy the password into your password manager.'],
    example: { label: '20 characters, all types', input: 'Length 20, A–Z, a–z, 0–9, symbols', output: 'q7#Vd2!mRk@Lw9$Tz4pE' },
    faqs: [
      { q: 'Is it safe to generate passwords in a browser?', a: 'Yes, when the generator uses the Web Crypto API, as this one does. The password is created locally and is never transmitted or saved.' },
      { q: 'How long should a password be?', a: 'For most accounts, 16 characters or more with mixed character types is a good baseline. Longer is stronger. A password manager means you do not need to remember them.' },
      { q: 'Can I reuse a strong password?', a: 'You should not. If one site is breached, a reused password exposes every other account that shares it. Use a unique password for each account.' },
      { q: 'What does "exclude look-alike characters" do?', a: 'It removes characters that look alike, such as 0/O and 1/l/I, so passwords are easier to read or type by hand. It slightly reduces strength per character.' },
    ],
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    title: 'Color Converter – HEX to RGB, HSL & RGBA | DevTools Hub',
    description: 'Convert colors between HEX, RGB, RGBA, HSL and HSLA with a live preview. Paste any CSS color value and copy the format you need.',
    summary: 'Convert between HEX, RGB(A) and HSL(A) with a live preview.',
    category: 'conversion',
    icon: '#',
    keywords: ['color', 'colour', 'convert', 'hex', 'rgb', 'rgba', 'hsl', 'hsla', 'css', 'picker'],
    related: ['css-formatter', 'html-formatter', 'password-generator'],
    popular: true,
    runsLocally: true,
    what: 'Colors on the web can be written in several equivalent notations. HEX is compact, RGB describes red, green and blue channels from 0–255, and HSL describes hue, saturation and lightness, which is easier to adjust by hand. This tool converts any of them into the others.',
    steps: ['Type or paste a color such as #1351aa, rgb(19 81 170) or hsl(215, 80%, 37%).', 'Or choose one with the color picker.', 'Copy the format you need.'],
    example: { input: '#1351AA', output: 'rgb(19, 81, 170)\nhsl(215, 80%, 37%)' },
    faqs: [
      { q: 'Which input formats are supported?', a: 'HEX (#rgb, #rgba, #rrggbb, #rrggbbaa), rgb()/rgba() and hsl()/hsla(), with comma or space separated values and optional alpha.' },
      { q: 'Why can HSL round-trip slightly differently?', a: 'HSL is shown rounded to whole numbers, so converting it back to RGB can differ by one unit in a channel. The HEX and RGB values shown are exact for the parsed color.' },
      { q: 'Are named colors like "red" supported?', a: 'Not in this version. Use a HEX, RGB or HSL value.' },
    ],
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    title: 'HTML Formatter & Minifier – Beautify HTML Online | DevTools Hub',
    description: 'Format messy HTML with clean indentation or minify it to save bytes. Keeps pre, textarea, script and style content intact. Runs in your browser.',
    summary: 'Beautify or minify HTML while keeping pre, script and style content intact.',
    category: 'web',
    icon: '</>',
    keywords: ['html', 'format', 'beautify', 'prettify', 'indent', 'minify', 'markup', 'tidy'],
    related: ['css-formatter', 'json-formatter', 'color-converter'],
    popular: true,
    runsLocally: true,
    what: 'An HTML formatter re-indents markup so the nesting of elements is easy to follow. The minifier removes comments and unnecessary whitespace between tags to make the file smaller. Your code is parsed as text and is never rendered or executed.',
    steps: ['Paste your HTML.', 'Press Format for readable output or Minify for compact output.', 'Copy or download the result.'],
    example: { input: '<ul><li>One</li><li>Two</li></ul>', output: '<ul>\n  <li>One</li>\n  <li>Two</li>\n</ul>' },
    faqs: [
      { q: 'Will formatting change how my page looks?', a: 'Formatting only changes whitespace between elements. In rare cases whitespace between inline elements (such as two links side by side) is visible, so check layout-sensitive spots.' },
      { q: 'Is my HTML executed?', a: 'No. The HTML is treated as text and parsed by this tool. Scripts inside it are never run.' },
      { q: 'Does it fix invalid HTML?', a: 'It is a formatter, not a validator. It tolerates common mistakes but does not report them. Missing closing tags are added in the formatted output.' },
    ],
  },
  {
    slug: 'css-formatter',
    name: 'CSS Formatter',
    title: 'CSS Formatter & Minifier – Beautify CSS Online | DevTools Hub',
    description: 'Beautify CSS with consistent indentation or minify it for production. Handles media queries, comments and strings. Runs locally in your browser.',
    summary: 'Beautify or minify stylesheets, including nested at-rules.',
    category: 'web',
    icon: '{;}',
    keywords: ['css', 'format', 'beautify', 'prettify', 'minify', 'stylesheet', 'style', 'compress'],
    related: ['html-formatter', 'color-converter', 'json-formatter'],
    popular: true,
    runsLocally: true,
    what: 'A CSS formatter puts each selector and declaration on its own line with consistent spacing. The minifier removes comments and whitespace to reduce file size. Comments starting with /*! (often license notices) are kept when minifying.',
    steps: ['Paste your CSS.', 'Press Format or Minify.', 'Copy or download the result.'],
    example: { input: 'a{color:red;margin:0 auto}', output: 'a {\n  color: red;\n  margin: 0 auto;\n}' },
    faqs: [
      { q: 'Does it support SCSS or Less?', a: 'Plain CSS is fully supported. Simple nested SCSS or Less usually formats well, but preprocessor-specific syntax is not specifically handled.' },
      { q: 'Is the minified CSS safe to use?', a: 'The minifier only removes comments, whitespace and the final semicolon in each block. It does not rename or merge rules, so behaviour stays the same.' },
      { q: 'Is my CSS uploaded?', a: 'No. Everything runs in your browser.' },
    ],
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    title: 'Lorem Ipsum Generator – Placeholder Text | DevTools Hub',
    description: 'Generate lorem ipsum placeholder text by paragraphs, sentences or words. Copy it straight into your mockups and layouts.',
    summary: 'Generate placeholder text by paragraphs, sentences or words.',
    category: 'generators',
    icon: '¶',
    keywords: ['lorem', 'ipsum', 'placeholder', 'dummy', 'text', 'filler', 'generate', 'generator'],
    related: ['word-counter', 'password-generator', 'html-formatter'],
    runsLocally: true,
    what: 'Lorem ipsum is scrambled Latin derived from a text by Cicero. Designers use it as placeholder text so a layout can be judged without real copy distracting from it.',
    steps: ['Choose paragraphs, sentences or words and how many.', 'Press Generate.', 'Copy the text.'],
    example: { label: '1 sentence', input: '1 sentence, starting with "Lorem ipsum"', output: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    faqs: [
      { q: 'Is lorem ipsum copyrighted?', a: 'No. It is derived from a classical Latin text that has long been in the public domain.' },
      { q: 'Should I publish pages with lorem ipsum?', a: 'No. Replace it with real content before launch. Search engines and readers treat placeholder text as low quality.' },
    ],
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    title: 'Word Counter – Count Words, Characters & Reading Time | DevTools Hub',
    description: 'Count words, characters, sentences and paragraphs as you type, with estimated reading and speaking time. Your text stays in your browser.',
    summary: 'Count words, characters, sentences and paragraphs as you type.',
    category: 'text',
    icon: 'Wc',
    keywords: ['word', 'count', 'counter', 'characters', 'letters', 'sentences', 'paragraphs', 'reading time', 'text'],
    related: ['lorem-ipsum', 'json-validator', 'html-formatter'],
    popular: true,
    runsLocally: true,
    what: 'The word counter updates statistics live as you type or paste. Reading time assumes 238 words per minute and speaking time 130 words per minute, common averages for adult readers and presenters.',
    steps: ['Paste or type your text.', 'Read the statistics above the editor.', 'Copy the text or clear it to start again.'],
    example: { input: 'Hello world. This is a test.', output: '6 words, 28 characters, 2 sentences' },
    faqs: [
      { q: 'How are words counted?', a: 'Words are detected with your browser’s built-in language-aware segmenter when available, so hyphenated words and many non-English scripts are counted sensibly.' },
      { q: 'Is my text saved?', a: 'No. The text exists only in this browser tab and disappears when you close or reload it.' },
      { q: 'Why do counts differ from my word processor?', a: 'Tools count edge cases such as numbers, URLs, hyphens and emoji differently. Small differences are normal.' },
    ],
  },
];

export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
export const toolPath = (slug: string) => `/tools/${slug}`;

export interface PageMeta { path: string; title: string; description: string; jsonLd?: object }

export const pages: PageMeta[] = [
  { path: '/', title: 'DevTools Hub – Fast, free developer tools. No signup required.', description: 'Fast, free, privacy-friendly developer tools that run in your browser: JSON formatter, password generator, color converter, HTML and CSS formatters and more.' },
  { path: '/tools', title: 'All Developer Tools | DevTools Hub', description: 'Browse every DevTools Hub tool by category: JSON, generators, web development, conversion and text tools.' },
  { path: '/about', title: 'About | DevTools Hub', description: 'Why DevTools Hub exists: fast, simple, privacy-friendly developer utilities without signups.' },
  { path: '/faq', title: 'FAQ | DevTools Hub', description: 'Answers about DevTools Hub: pricing, privacy, data storage, mobile use, commercial use and reporting bugs.' },
  { path: '/contact', title: 'Contact | DevTools Hub', description: 'Report a bug, request a tool or send a general question to DevTools Hub.' },
  { path: '/privacy', title: 'Privacy Policy | DevTools Hub', description: 'How DevTools Hub handles data: what is collected, local storage, cookies and third-party services.' },
  { path: '/terms', title: 'Terms of Use | DevTools Hub', description: 'Terms for using DevTools Hub tools and website.' },
];

export const pageMeta = (path: string) => pages.find((p) => p.path === path)!;

/** Every indexable route. Used by the build step for per-route HTML and sitemap.xml. */
export const staticRoutes: PageMeta[] = [
  ...pages,
  ...tools.map((t) => ({
    path: toolPath(t.slug),
    title: t.title,
    description: t.description,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: t.name,
      description: t.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any (web browser)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  })),
];
