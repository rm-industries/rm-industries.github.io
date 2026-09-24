import { expect, test } from '@playwright/test';

import { resolvePreviewPath } from './preview';

test('uses the documented action hierarchy and semantic badges', async ({ page }) => {
  await page.goto(resolvePreviewPath('/'));

  await expect(page.getByRole('link', { name: /See what we’re building/u })).toHaveClass(/btn-primary/u);
  await expect(page.getByRole('link', { name: /How we work/u })).toHaveClass(/btn-outline/u);
  await expect(page.getByRole('link', { name: /Explore Forge/u })).toHaveClass(/btn-primary/u);
  await expect(page.getByRole('link', { name: /Explore Etch/u })).toHaveClass(/btn-primary/u);
  await expect(page.getByRole('link', { name: /Email us/u })).toHaveClass(/btn-outline/u);

  await expect(page.locator('.badge-neutral', { hasText: 'Open source' })).toHaveCount(2);
  await expect(page.locator('.badge-success', { hasText: 'Actively maintained' })).toHaveCount(1);
  await expect(page.locator('.badge-primary.badge-soft')).toHaveCount(3);
});
