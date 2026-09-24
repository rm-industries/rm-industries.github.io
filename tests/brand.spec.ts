import { expect, test } from '@playwright/test';

import { resolvePreviewPath } from './preview';

test('renders company marks without distortion', async ({ page }) => {
  await page.goto(resolvePreviewPath('/'));

  const marks = page.locator('img[src$="/logo.svg"]');
  await expect(marks).toHaveCount(2);

  const dimensions = await marks.evaluateAll((images) =>
    images.map((image) => {
      const element = image as HTMLImageElement;
      const bounds = element.getBoundingClientRect();

      return {
        naturalRatio: element.naturalWidth / element.naturalHeight,
        renderedRatio: bounds.width / bounds.height,
      };
    }),
  );

  for (const dimension of dimensions) {
    expect(dimension.naturalRatio).toBeCloseTo(1.5, 2);
    expect(dimension.renderedRatio).toBeCloseTo(dimension.naturalRatio, 2);
  }
});
