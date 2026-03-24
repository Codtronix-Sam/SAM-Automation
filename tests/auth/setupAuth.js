const { chromium } = require('@playwright/test');
require('dotenv').config({ path: `.env.${process.env.ENV || 'clone'}` });

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const role = (process.env.ROLE || 'superadmin').toLowerCase();

  // 🚀 remove trailing slash from BASE_URL
  const baseUrl = process.env.BASE_URL.replace(/\/$/, '');

  // Login
  await page.goto(baseUrl);
  await page.locator('input[type="email"]').fill(process.env[`${role.toUpperCase()}_EMAIL`]);
  await page.locator('input[type="password"]').fill(process.env[`${role.toUpperCase()}_PASSWORD`]);
  await page.locator('button[type="submit"]').click();

  // Expected dashboards
  const dashboards = {
    superadmin: '/admin/dashboard',
    admin: '/dsp/dashboard',  
    dsp: '/dsp/dashboard',
    osm: '/dsp/dashboard',
    director: '/dsp/dashboard'
  };

  const expectedDashboard = dashboards[role] || '/admin/dashboard';

  // ✅ More flexible wait (handles query params, etc.)
  await page.waitForURL(new RegExp(`${expectedDashboard}.*`), { timeout: 60000 });

  // Save storage state
  await page.context().storageState({ path: `storage/${process.env.ENV}-${role}.json` });

  await browser.close();
})();
