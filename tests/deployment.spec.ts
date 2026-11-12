import { expect, test } from '@playwright/test';

import { security } from '../src/config/security';
import { site } from '../src/config/site';
import { securityTxtPath } from '../src/integrations/security-txt/render';

test.beforeAll(() => {
  const deploymentUrl = process.env.DEPLOYMENT_URL;
  if (!deploymentUrl || new URL(deploymentUrl).protocol !== 'https:') {
    throw new Error('DEPLOYMENT_URL must be an HTTPS deployment URL.');
  }
});

for (const path of ['', 'about/', 'articles/']) {
  test(`deployed ${path || 'home'} serves content and fits a phone viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const failedAssets: string[] = [];
    const assetTypes = ['stylesheet', 'script', 'image', 'font'];
    page.on('response', (response) => {
      if (assetTypes.includes(response.request().resourceType()) && !response.ok()) {
        failedAssets.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on('requestfailed', (request) => {
      if (assetTypes.includes(request.resourceType())) failedAssets.push(request.url());
    });
    expect((await page.goto(path))?.status()).toBe(200);
    expect(new URL(page.url()).protocol).toBe('https:');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('meta[name="generator"]')).toHaveAttribute('content', 'Forge by RM Industries');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('footer').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    expect(await page.evaluate(() => [...document.styleSheets].some((sheet) => sheet.href))).toBe(true);
    expect(failedAssets).toEqual([]);
  });
}

test('deployed crawler routes and not-found response are intact', async ({ request }) => {
  for (const path of ['robots.txt', 'rss.xml', 'sitemap-index.xml', 'site.webmanifest']) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect((await response.text()).trim(), path).not.toBe('');
  }
  const missing = await request.get('deployment-smoke-does-not-exist/');
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain('That page is not here.');
});

test('security.txt serves the configured reporting contact through both domains', async ({ request }) => {
  test.skip(Boolean(process.env.GITLAB_CI), 'The canonical domains are served by GitHub Pages.');

  const canonical = new URL(securityTxtPath, site.url);
  expect(canonical.protocol).toBe('https:');
  const response = await request.get(canonical.href, { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^text\/plain;\s*charset="?utf-8"?$/i);

  const body = new TextDecoder('utf-8', { fatal: true }).decode(await response.body());
  const fields = body.split(/\r?\n/);
  expect(fields.filter((field) => field.startsWith('Contact: '))).toEqual(
    security.contacts.map((contact) => `Contact: ${contact}`),
  );
  expect(fields.filter((field) => field.startsWith('Canonical: '))).toEqual([`Canonical: ${canonical.href}`]);
  const expires = fields.filter((field) => field.startsWith('Expires: '));
  expect(expires).toHaveLength(1);
  expect(Date.parse(expires[0]!.slice('Expires: '.length))).toBeGreaterThan(Date.now());
  if (process.env.GITHUB_ACTIONS === 'true' || process.env.SECURITY_TXT_EXPIRES) {
    expect(expires).toEqual([process.env.SECURITY_TXT_EXPIRES]);
  }

  const apex = new URL(canonical);
  apex.hostname = apex.hostname.replace(/^www\./, '');
  const redirect = await request.get(apex.href, { maxRedirects: 0 });
  expect([301, 302, 303, 307, 308]).toContain(redirect.status());
  const location = redirect.headers().location;
  expect(location).toBeTruthy();
  expect(new URL(location!, apex).href).toBe(canonical.href);
});
