const { defineConfig } = require('@playwright/test');
require('dotenv').config({ path: `.env.${process.env.ENV || 'staging'}` });

// Normalize role/env (lowercase so filenames are consistent)
const role = (process.env.ROLE || 'superadmin').toLowerCase();
const env = (process.env.ENV || 'staging').toLowerCase();

module.exports = defineConfig({
  use: {
    baseURL: process.env.BASE_URL, // ✅ pulled from correct .env
    storageState: `storage/${env}-${role}.json`, // ✅ consistent session file
    headless: false,
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    },
  },
  testDir: './tests',
  retries: 0,
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright'],
  ],
});
