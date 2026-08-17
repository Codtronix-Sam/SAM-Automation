const { defineConfig } = require('@playwright/test');
require('dotenv').config({ path: `.env.${process.env.ENV || 'staging'}` });

const role = (process.env.ROLE || 'superadmin').toLowerCase();
const env = (process.env.ENV || 'staging').toLowerCase();

module.exports = defineConfig({
  testDir: './tests',

  retries: 1, // optional but useful
  timeout: 60000,

  use: {
    baseURL: process.env.BASE_URL,
    storageState: `storage/${env}-${role}.json`,
    headless: true,

    // 🔥 important for Allure attachments
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  reporter: [
    ['list'], // 👈 shows results in terminal (optional but useful)
    ['html', { open: 'on-failure' }],
    ['allure-playwright']
  ],
});