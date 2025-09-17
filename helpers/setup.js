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

  // go to role-specific dashboard
  await page.goto(`${process.env.BASE_URL.replace(/\/$/, '')}${expectedDashboard}`);

  if (role === 'superadmin') {
    await dashboard.searchDSP(testData.dspName);
    await dashboard.openDSPPanel();
  }

  return { dashboard, driversPage, role };
}

module.exports = { setup };
