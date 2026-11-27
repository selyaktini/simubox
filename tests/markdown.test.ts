import { describe, expect, it } from 'vitest';
import { renderScientificMarkdown } from '../site/src/lib/markdown';

describe('scientific Markdown', () => {
  it('renders inline and display equations at build time', () => {
    const html = renderScientificMarkdown('An inline $x^2$ term.\n\n$$\ny = x^2\n$$');
    expect(html).toContain('class="katex"');
    expect(html).toContain('katex-display');
  });
  it('escapes raw HTML and rejects unsafe link schemes', () => {
    const html = renderScientificMarkdown('<script>alert(1)</script>\n\n[bad](javascript:alert(1))');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('href="javascript:');
  });
});
