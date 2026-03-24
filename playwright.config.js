const { defineConfig } = require('@playwright/test');
require('dotenv').config({ path: `.env.${process.env.ENV || 'staging'}` });

const role = (process.env.ROLE || 'superadmin').toLowerCase();
const env = (process.env.ENV || 'staging').toLowerCase();

module.exports = defineConfig({
  testDir: './tests',

  use: {
    baseURL: process.env.BASE_URL,
    storageState: `storage/${env}-${role}.json`,
    headless: true,
  },
});