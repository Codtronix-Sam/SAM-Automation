// tests/seed.spec.js
// Seed test used by Planner/Generator to initialize session and reach Admin Dashboard
// Adjust selectors or credentials sources if your app uses different fields or flows.

require('dotenv').config();
const { test } = require('@playwright/test');
const { AdminDashboardPage } = require('../pageObjects/AdminDashboardPage');
const testData = require('../testData');

test('seed', async ({ page }) => {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  const email = process.env.TEST_USER_EMAIL || testData.adminEmail || testData.email || '';
  const password = process.env.TEST_USER_PASSWORD || testData.adminPassword || testData.password || '';

  // Try to navigate to login and perform login if credentials are provided.
  try {
    await page.goto(`${base}/login`, { waitUntil: 'networkidle' });

    if (email && password) {
      // Common selectors - modify if your app differs
      const emailSelector = 'input[name="email"]';
      const passwordSelector = 'input[name="password"]';
      const submitSelector = 'button[type="submit"]';

      // Fill and submit login form
      await page.fill(emailSelector, email);
      await page.fill(passwordSelector, password);
      await Promise.all([
        page.waitForNavigation({ url: '**/admin/dashboard', timeout: 15000 }).catch(() => {}),
        page.click(submitSelector)
      ]);
    }
  } catch (err) {
    // If login page is unreachable, continue and try to navigate directly
    // console.warn('seed: login attempt failed', err);
  }

  // Ensure we're on the admin dashboard; navigate directly if needed
  try {
    await page.goto(`${base}/admin/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
  } catch (err) {
    // If still not on dashboard, throw so Planner knows seed failed
    throw new Error('Seed: unable to reach admin dashboard. Check BASE_URL and credentials.');
  }

  // Use your AdminDashboardPage page object to open the DSP panel used by Payments tests
  try {
    const dashboard = new AdminDashboardPage(page);
    const dspName = testData.dspName || process.env.TEST_DSP_NAME || '';
    if (dspName) {
      await dashboard.searchDSP(dspName);
      await dashboard.openDSPPanel();
    } else {
      // If no dspName available, just ensure dashboard is open for planner exploration
      // console.info('seed: no dspName provided in testData or env; skipping DSP open step');
    }
  } catch (err) {
    // Non-fatal: page object methods may be different; Planner can still continue from dashboard URL
    // console.warn('seed: AdminDashboardPage flow failed; dashboard is open for manual exploration', err);
  }

  // At this point the session should be initialized and the Planner can begin exploring from the dashboard.
});
