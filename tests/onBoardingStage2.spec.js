require('dotenv').config();
const fs = require('fs');
const { test, expect } = require('@playwright/test');
const { AdminDashboardPage } = require('../pageObjects/AdminDashboardPage');
const { DriverCheckinCheckout } = require('../pageObjects/DriverCheckinCheckout');
const { DriversPage } = require('../pageObjects/DriversPage');
const testData = require('../testData');
const { execSync } = require('child_process');
const util = require('util');
//const execAsync = util.promisify(exec);

async function setup(page) {
    const driversPage = new DriversPage(page);

    const dashboard = new AdminDashboardPage(page);

    console.log("BASE_URL:", process.env.BASE_URL);

    await page.goto(`${process.env.BASE_URL}/admin/dashboard`);
    await dashboard.searchDSP(testData.dspName);
    await dashboard.openDSPPanel();

    return { dashboard, driversPage };
}

test('Resume after mobile onboarding', async ({ page }) => {
    const { driversPage } = await setup(page);

    await driversPage.gotoDriversModule();

    const { email } = JSON.parse(fs.readFileSync('tempDriverData.json', 'utf-8'));
    const { password } = JSON.parse(fs.readFileSync('tempDriverData.json', 'utf-8'));

    console.log(`🔁 Resuming with email: ${email}`);

    await driversPage.navigateToCreatedDriverProfile(email);

    await driversPage.approveDocs();

    console.log("✅ Web approval completed");

    fs.writeFileSync('tempDriverData.json', JSON.stringify({ email, password }));

    try {
        const output = execSync('node mobile-tests/driverStage2.spec.js', { stdio: 'inherit' });
        console.log(`📱 Appium script completed successfully`);
    } catch (err) {
        console.error(`❌ Appium script failed:\n${err.message}`);
    }

});
