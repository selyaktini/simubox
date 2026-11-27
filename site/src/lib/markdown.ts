import { Marked, Renderer } from 'marked';
import markedKatex from 'marked-katex-extension';

function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

const renderer = new Renderer();
renderer.html = ({ text }) => escapeHtml(text);
renderer.link = function ({ href, title, tokens }) {
  const safe = href.startsWith('#') || /^https:\/\//i.test(href);
  const label = this.parser.parseInline(tokens);
  if (!safe) return label;
  const titleAttribute = title ? ` title="${escapeHtml(title).replaceAll('"', '&quot;')}"` : '';
  return `<a href="${escapeHtml(href).replaceAll('"', '&quot;')}"${titleAttribute}>${label}</a>`;
};
const parser = new Marked(markedKatex({ throwOnError: true, trust: false }), { renderer });

export function renderScientificMarkdown(source: string): string {
  const html = parser.parse(source, { async: false });
  if (typeof html !== 'string') throw new Error('Scientific Markdown rendering returned an unexpected result');
  return html;
}
