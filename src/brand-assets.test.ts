import { readFile } from 'node:fs/promises';

import { beforeAll, describe, expect, test } from 'vitest';

const readAsset = (name: string) => readFile(new URL(`../public/${name}`, import.meta.url), 'utf8');
const pathData = (svg: string) => Array.from(svg.matchAll(/<path[^>]+d="([^"]+)"/gu), ([, path]) => path);

describe('company brand assets', () => {
  let logo: string;
  let favicon: string;
  let socialCard: string;

  beforeAll(async () => {
    [logo, favicon, socialCard] = await Promise.all([
      readAsset('logo.svg'),
      readAsset('favicon.svg'),
      readAsset('social-card.svg'),
    ]);
  });

  test('keeps the logo and favicon transparent, theme-aware, and geometrically aligned', () => {
    expect(logo).toContain('viewBox="0 0 96 64"');
    expect(favicon).toContain('viewBox="0 0 112 80"');
    expect(logo).not.toContain('<rect');
    expect(favicon).not.toContain('<rect');
    expect(pathData(favicon)).toEqual(pathData(logo));

    for (const color of ['#4c4f69', '#cdd6f4', '#cba6f7']) {
      expect(logo).toContain(color);
      expect(favicon).toContain(color);
    }
  });

  test('uses the current monogram, typography, and Mocha palette on the social card', () => {
    expect(socialCard).toContain('viewBox="0 0 1200 630"');
    expect(socialCard).toContain('<title>RM Industries</title>');
    expect(socialCard).toContain('<desc>RM Industries social sharing card</desc>');
    expect(socialCard).toContain("font-family=\"'Fira Sans', system-ui, sans-serif\"");
    expect(socialCard).toContain("font-family=\"'Fira Code', ui-monospace, monospace\"");
    expect(pathData(socialCard)).toEqual(pathData(logo));

    for (const color of ['#1e1e2e', '#181825', '#cdd6f4', '#cba6f7']) {
      expect(socialCard).toContain(color);
    }
  });
});
