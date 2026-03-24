const { defineConfig } = require('@playwright/test');
require('dotenv').config({ path: `.env.${process.env.ENV || 'staging'}` });

const role = (process.env.ROLE || 'superadmin').toLowerCase();
const env = (process.env.ENV || 'staging').toLowerCase();

const storageFile = `storage/${env}-${role}.json`;

module.exports = defineConfig({
  testDir: './tests',
  retries: 0,

  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright'],
  ],

  projects: [
    {
      name: 'setup',
      testMatch: /auth\/setupAuth\.js/, // ✅ FIXED
      use: {
        baseURL: process.env.BASE_URL,
        headless: true,
      },
    },
    {
      name: 'tests',
      dependencies: ['setup'],
      use: {
        baseURL: process.env.BASE_URL,
        storageState: storageFile,
        headless: true,
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});