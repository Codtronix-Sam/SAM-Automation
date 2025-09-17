const { test, expect } = require('@playwright/test');
const { AdminDashboardPage } = require('../pageObjects/AdminDashboardPage');
const { DriversPage } = require('../pageObjects/DriversPage');
const testData = require('../testData');
const fs = require('fs');
const { execSync } = require('child_process');
const util = require('util');
//const execAsync = util.promisify(exec);
require('dotenv').config();

const { setup } = require('../helpers/setup');

test('Switch between drivers tabs', async ({ page }) => {
    const { driversPage } = await setup(page);

    await driversPage.gotoDriversModule();

    await driversPage.switchToActiveDrivers();
    await expect(page.locator("//p[normalize-space()='Active Drivers']")).toBeVisible();

    await driversPage.switchToOnboardingDrivers();
    await expect(page.locator("//p[normalize-space()='Onboarding Drivers']")).toBeVisible();

    await driversPage.switchToInactiveDrivers();
    await expect(page.locator("(//p[normalize-space()='Inactive Drivers'])[1]")).toBeVisible();
});

test('Verify the Customer Name filter in Active Drivers', async ({ page }) => {
    const { driversPage } = await setup(page);

    await driversPage.gotoDriversModule();
    await driversPage.filterByCustomer(testData.filters.customer);
    await driversPage.verifyFilterApplied(
        testData.filters.expectedResult,
        testData.filters.customerFilterText
    );
});

test('Verify the driver search', async ({ page }) => {
    const { driversPage } = await setup(page);

    await driversPage.gotoDriversModule();
    await driversPage.driverSearch(testData.driver.searchKeyword);
    await driversPage.verifyDriverSearch(testData.driver.searchKeyword);
});

test('Verify Add Driver functionality', async ({ page }) => {
    test.setTimeout(90_000)
    const { driversPage } = await setup(page);

    await driversPage.gotoDriversModule();

    const { email, firstName, lastName, phone } = testData.driver;
    await driversPage.createDriver(email, firstName, lastName, phone);
    await driversPage.verifyDriverAdded();

    await driversPage.navigateToCreatedDriverProfile(email);

    // const otp = await driversPage.getOtpFromDriverProfile();
    // console.log("Driver Email:", email);
    // console.log("OTP:", otp);



    // fs.writeFileSync('tempDriverData.json', JSON.stringify({ email, otp }));

    // try {
    //     const output = execSync('node mobile-tests/driverOnboarding.spec.js', { stdio: 'inherit' });
    //     console.log(`📱 Appium script completed successfully`);
    // } catch (err) {
    //     console.error(`❌ Appium script failed:\n${err.message}`);
    // }
    

});
