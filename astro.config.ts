import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import { getDeploymentConfig } from './src/config/deployment';
import { security } from './src/config/security';
import { site } from './src/config/site';
import securityTxt from './src/integrations/security-txt';

const deployment = getDeploymentConfig(site.url);

export default defineConfig({
  base: deployment.base,
  integrations: [sitemap(), securityTxt(security)],
  output: 'static',
  site: deployment.site,
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
});
