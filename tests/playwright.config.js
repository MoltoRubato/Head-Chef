import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 40000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'node index.js',
      url: 'http://localhost:3001/health',
      timeout: 15000,
      reuseExistingServer: true,
      cwd: '../server',
      env: { PORT: '3001' },
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      timeout: 30000,
      reuseExistingServer: true,
      cwd: '../client',
    },
  ],
});
