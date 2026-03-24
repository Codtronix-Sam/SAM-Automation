const { chromium } = require('@playwright/test');
require('dotenv').config({ path: `.env.${process.env.ENV || 'staging'}` });

(async () => {
  const browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false'
  });

  const page = await browser.newPage();

  const role = (process.env.ROLE || 'superadmin').toLowerCase();
  const baseUrl = process.env.BASE_URL.replace(/\/$/, '');

  await page.goto(baseUrl);

  await page.fill('input[type="email"]', process.env[`${role.toUpperCase()}_EMAIL`]);
  await page.fill('input[type="password"]', process.env[`${role.toUpperCase()}_PASSWORD`]);
  await page.click('button[type="submit"]');

  await page.waitForURL(/dashboard/, { timeout: 60000 });

  await page.context().storageState({
    path: `storage/${process.env.ENV}-${role}.json`,
  });

  await browser.close();
})();