import { describe, expect, it } from 'vitest';

import { renderSecurityTxt } from './render';

const config = {
  contacts: ['mailto:security@example.com', 'https://example.com/report'],
  expiration: { months: 6 },
};
const site = 'https://www.example.com/';
const now = new Date('2026-08-31T12:34:56Z');

describe('renderSecurityTxt', () => {
  it('preserves contact order and clamps calendar months in UTC', () => {
    expect(renderSecurityTxt(config, site, '/', now)).toBe(
      'Contact: mailto:security@example.com\n' +
        'Contact: https://example.com/report\n' +
        'Expires: 2027-02-28T12:34:56.000Z\n' +
        'Canonical: https://www.example.com/.well-known/security.txt\n',
    );
  });

  it.each([
    { site, base: '/project/' },
    { site: 'https://www.example.com/project/', base: '/' },
  ])('rejects deployment under a subpath ($site, $base)', ({ site, base }) => {
    expect(() => renderSecurityTxt(config, site, base, now)).toThrow('requires a root deployment');
  });

  it('accepts an explicit canonical URL', () => {
    const canonical = 'https://example.org/.well-known/security.txt';
    expect(renderSecurityTxt({ ...config, canonical }, undefined, '/', now)).toContain(`Canonical: ${canonical}\n`);
  });

  it.each([undefined, 'http://example.com/security.txt', 'https://?query'])(
    'rejects a missing or invalid canonical URL (%s)',
    (canonical) => {
      expect(() => renderSecurityTxt({ ...config, canonical }, undefined, '/', now)).toThrow(
        'requires an HTTPS canonical URL',
      );
    },
  );

  it('rejects an empty contact list', () => {
    expect(() => renderSecurityTxt({ ...config, contacts: [] }, site, '/', now)).toThrow(
      'requires at least one contact URI',
    );
  });

  it.each(['security@example.com', 'http://example.com/report', 'https://?query', 'mailto:a@example.com\nExpires: x'])(
    'rejects an invalid contact URI (%s)',
    (contact) => {
      expect(() => renderSecurityTxt({ ...config, contacts: [contact] }, site, '/', now)).toThrow(
        'contacts must be absolute HTTPS, mailto, or tel URIs',
      );
    },
  );

  it.each([1.5, 0, 13])('rejects invalid rolling durations (%s)', (months) => {
    expect(() => renderSecurityTxt({ ...config, expiration: { months } }, site, '/', now)).toThrow(
      'between 1 and 12 calendar months',
    );
  });
});
