import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, test } from 'vitest';

import { validateBuild } from './validate-build';

const requiredPaths = [
  '404.html',
  'about/index.html',
  'admin/index.html',
  'articles/index.html',
  'index.html',
  'robots.txt',
  'rss.xml',
  'site.webmanifest',
  'sitemap-index.xml',
] as const;

const fixtures: string[] = [];
const sitemapIndex = `<?xml version="1.0"?><sitemapindex>
  <sitemap><loc>https://www.rm-industries.com/sitemap-0.xml</loc></sitemap>
  <sitemap><loc>https://www.rm-industries.com/forge/sitemap-index.xml</loc></sitemap>
  <sitemap><loc>https://www.rm-industries.com/etch/sitemap-index.xml</loc></sitemap>
</sitemapindex>`;

const createFixture = async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'forge-build-output-'));
  fixtures.push(fixture);
  for (const path of requiredPaths) {
    const output = join(fixture, path);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(
      output,
      path === 'sitemap-index.xml'
        ? sitemapIndex
        : path.endsWith('.html')
          ? '<!doctype html><main>Forge</main>'
          : 'Forge\n',
    );
  }
  return fixture;
};

afterEach(async () => {
  await Promise.all(fixtures.splice(0).map((fixture) => rm(fixture, { recursive: true, force: true })));
});

describe('generated build validation', () => {
  test('accepts the complete neutral output fixture', async () => {
    await expect(validateBuild(await createFixture())).resolves.toBeUndefined();
  });

  test('reports a missing required output path', async () => {
    const fixture = await createFixture();
    await rm(join(fixture, 'rss.xml'));
    await expect(validateBuild(fixture)).rejects.toThrow('rss.xml');
  });

  test('rejects unresolved generator tokens', async () => {
    const fixture = await createFixture();
    const unresolvedToken = '__FORGE_' + 'SITE_NAME__';
    await writeFile(join(fixture, 'index.html'), `<p>${unresolvedToken}</p>`);
    await expect(validateBuild(fixture)).rejects.toThrow(unresolvedToken);
  });

  test('reports a missing child sitemap', async () => {
    const fixture = await createFixture();
    await writeFile(join(fixture, 'sitemap-index.xml'), sitemapIndex.replace(/.*etch.*\n/u, ''));
    await expect(validateBuild(fixture)).rejects.toThrow('https://www.rm-industries.com/etch/sitemap-index.xml');
  });
});
