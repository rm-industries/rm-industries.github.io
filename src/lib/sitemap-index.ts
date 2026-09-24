const closingTag = '</sitemapindex>';

export const addSitemapsToIndex = (index: string, sitemapUrls: readonly string[]): string => {
  if (!index.includes(closingTag)) throw new Error('Sitemap index is missing its closing tag.');

  const existingUrls = new Set(Array.from(index.matchAll(/<loc>([^<]+)<\/loc>/gu), ([, url]) => url));
  const entries = sitemapUrls
    .filter((url) => !existingUrls.has(url))
    .map((url) => `<sitemap><loc>${url}</loc></sitemap>`)
    .join('');

  return index.replace(closingTag, `${entries}${closingTag}`);
};
