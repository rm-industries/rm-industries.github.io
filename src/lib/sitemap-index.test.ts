import { describe, expect, it } from 'vitest';

import { addSitemapsToIndex } from './sitemap-index';

const index =
  '<?xml version="1.0"?><sitemapindex><sitemap><loc>https://www.rm-industries.com/sitemap-0.xml</loc></sitemap></sitemapindex>';

describe('addSitemapsToIndex', () => {
  it('adds child sitemap indexes before the closing tag', () => {
    expect(
      addSitemapsToIndex(index, [
        'https://www.rm-industries.com/forge/sitemap-index.xml',
        'https://www.rm-industries.com/etch/sitemap-index.xml',
      ]),
    ).toContain(
      '<sitemap><loc>https://www.rm-industries.com/forge/sitemap-index.xml</loc></sitemap><sitemap><loc>https://www.rm-industries.com/etch/sitemap-index.xml</loc></sitemap></sitemapindex>',
    );
  });

  it('does not duplicate an existing sitemap', () => {
    const url = 'https://www.rm-industries.com/forge/sitemap-index.xml';
    const updated = addSitemapsToIndex(addSitemapsToIndex(index, [url]), [url]);

    expect(updated.split(url)).toHaveLength(2);
  });

  it('rejects malformed sitemap indexes', () => {
    expect(() => addSitemapsToIndex('<sitemapindex>', [])).toThrow('Sitemap index is missing its closing tag.');
  });
});
