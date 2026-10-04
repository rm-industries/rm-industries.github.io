import { defineConfig, devices } from '@playwright/test';

const deploymentUrl = process.env.DEPLOYMENT_URL;

export default defineConfig({
  testDir: './tests/smoke',
  outputDir: 'test-results',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: deploymentUrl?.endsWith('/') ? deploymentUrl : deploymentUrl && `${deploymentUrl}/`,
    ...devices['Desktop Chrome'],
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
