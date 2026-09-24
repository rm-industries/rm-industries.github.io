import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { site } from '../src/config/site.ts';
import { addSitemapsToIndex } from '../src/lib/sitemap-index.ts';

const sitemapIndexPath = resolve('dist/sitemap-index.xml');
const childSitemaps = ['forge', 'etch'].map((project) => new URL(`${project}/sitemap-index.xml`, site.url).href);
const sitemapIndex = await readFile(sitemapIndexPath, 'utf8');

await writeFile(sitemapIndexPath, addSitemapsToIndex(sitemapIndex, childSitemaps));
