// helpers/setup.js
const { AdminDashboardPage } = require('../pageObjects/AdminDashboardPage');
const { DriversPage } = require('../pageObjects/DriversPage');

async function setup(page, testData) {
  const dashboard = new AdminDashboardPage(page);
  const driversPage = new DriversPage(page);

  const role = (process.env.ROLE || 'superadmin').toLowerCase();

  // map dashboards by role
  const dashboards = {
    superadmin: '/admin/dashboard',
    admin: '/dsp/dashboard',   // adjust if admin really lands somewhere else
    dsp: '/dsp/dashboard',
    osm: '/dsp/dashboard',
    director: '/dsp/dashboard'
  };

  const expectedDashboard = dashboards[role] || '/admin/dashboard';

  // ✅ Go to role-specific dashboard
  await page.goto(`${process.env.BASE_URL.replace(/\/$/, '')}${expectedDashboard}`);

  // ✅ WAIT for the dashboard to load and search field to become visible
  if (role === 'superadmin') {
    await page.waitForSelector('input[placeholder="Search by Name"]', { state: 'visible', timeout: 15000 });
    // OR use the locator from your POM instead:
    // await dashboard.searchField.waitFor({ state: 'visible', timeout: 15000 });

    await dashboard.searchDSP(testData.dspName);
    await dashboard.openDSPPanel();
  }

  return { dashboard, driversPage, role };
}

module.exports = { setup };
