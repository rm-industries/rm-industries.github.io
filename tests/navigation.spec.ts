import { expect, test } from '@playwright/test';

import { resolvePreviewPath, resolvePreviewUrl } from './preview';

test('uses primary navigation to move between pages and identify the current page', async ({ page }) => {
  await page.goto(resolvePreviewPath('/'));

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');

  await navigation.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(resolvePreviewUrl('/about/'));
  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'About' }),
  ).toHaveAttribute('aria-current', 'page');
});

test('opens mobile navigation and follows a configured link', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(resolvePreviewPath('/'));

  await page.locator('summary').filter({ hasText: 'Menu' }).click();
  const navigation = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link', { name: 'About' }).click();

  await expect(page).toHaveURL(resolvePreviewUrl('/about/'));
  await expect(page.getByRole('heading', { level: 1, name: 'Curious about the rough edges.' })).toBeVisible();
});

test('links the featured project to its public repository', async ({ page }) => {
  await page.goto(resolvePreviewPath('/'));

  await expect(page.getByRole('link', { name: /Explore Forge on GitHub/u })).toHaveAttribute(
    'href',
    'https://github.com/rm-industries/forge',
  );
});
