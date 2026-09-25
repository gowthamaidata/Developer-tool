import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/** Each tool is code-split: its code only loads when its page is opened. */
export const toolComponents: Record<string, LazyExoticComponent<ComponentType>> = {
  'json-formatter': lazy(() => import('./json/JsonFormatter')),
  'json-validator': lazy(() => import('./json/JsonValidator')),
  'password-generator': lazy(() => import('./password/PasswordGenerator')),
  'color-converter': lazy(() => import('./color/ColorConverter')),
  'html-formatter': lazy(() => import('./html/HtmlFormatter')),
  'css-formatter': lazy(() => import('./css/CssFormatter')),
  'lorem-ipsum': lazy(() => import('./lorem-ipsum/LoremIpsum')),
  'word-counter': lazy(() => import('./word-counter/WordCounter')),
};
