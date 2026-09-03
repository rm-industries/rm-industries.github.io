import { expect, test } from 'vitest';

import { isCurrentPath, isExternalHref } from './navigation.ts';

test('matches exact and nested navigation paths at segment boundaries', () => {
  expect(isCurrentPath('/articles/', '/articles')).toBe(true);
  expect(isCurrentPath('articles/?page=2', '/articles/?page=2')).toBe(true);
  expect(isCurrentPath('/articles/example/', '/articles/')).toBe(true);
  expect(isCurrentPath('/articles-summary/', '/articles')).toBe(false);
});

test('does not mark same-page fragment links as the current page', () => {
  expect(isCurrentPath('/', '/#work')).toBe(false);
  expect(isCurrentPath('/articles/', '/articles/#content')).toBe(false);
});

test('matches the home route only at the site root', () => {
  expect(isCurrentPath('/', '/')).toBe(true);
  expect(isCurrentPath('', '/')).toBe(true);
  expect(isCurrentPath('/articles/', '/')).toBe(false);
});

test('does not treat external URLs as current paths', () => {
  expect(isCurrentPath('/', 'https://example.com')).toBe(false);
  expect(isExternalHref('https://example.com')).toBe(true);
  expect(isExternalHref('/about/')).toBe(false);
});
