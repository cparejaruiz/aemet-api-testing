import { defineConfig } from '@playwright/test';

export default defineConfig({    
  testDir: './tests',
    timeout: 30000,
    retries: 2,
    use: {
        browserName: 'chromium',
        headless: false,
        args: [
          '--disable-site-isolation-trials',
          '--disable-features=site-per-process,SitePerProcess',
          '--disable-blink-features=AutomationControlled',
      ],
    },
    reporter: [['list'], ['html', { outputFile: 'test-results/report.html' }]]
});