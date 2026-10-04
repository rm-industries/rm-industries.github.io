import { expect, test } from '@playwright/test';

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
