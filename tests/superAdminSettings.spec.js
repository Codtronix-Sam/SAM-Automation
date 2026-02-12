// tests/superAdminSettings.spec.js
const { test, expect } = require('@playwright/test');
const { SuperAdminSettings } = require('../pageObjects/SuperAdminSettings');
const { AdminDashboardPage } = require('../pageObjects/AdminDashboardPage');
const testData = require('../testData');
require('dotenv').config();

async function setup(page) {
    const dashboard = new AdminDashboardPage(page);
    const superAdminSettings = new SuperAdminSettings(page);

    await page.goto(`${process.env.BASE_URL}/admin/dashboard`);
    await dashboard.searchDSP(testData.dspName);
    await dashboard.openDSPPanel();

    // Navigate to Super Admin Settings
    await superAdminSettings.navigateToSuperAdminSettings();

    return { superAdminSettings };
}

test('Add New Admin Rate Fee', async ({ page }) => {
    const { superAdminSettings } = await setup(page);

    await superAdminSettings.addAdminRateFee(
        testData.adminRate.name,
        testData.adminRate.fee,
        testData.adminRate.enableVAT,
        testData.adminRate.model,
        testData.adminRate.driverName
    );

    await expect(page.locator("//div[contains(text(),'Admin Fee Rate created successfully')]")).toBeVisible();

});

test('Delete existing Admin Rate Fee successfully', async ({ page }) => {
    const { superAdminSettings } = await setup(page);
    await superAdminSettings.deleteAdminRateFee(testData.rateCard.name);
    await expect(page.locator("//div[contains(text(),'Admin Fee Rate deleted successfully')]")).toBeVisible();
});


// test('Add new rate card successfully', async ({ page }) => {

//     const { superAdminSettings } = await setup(page);

//     await superAdminSettings.addRateCard(
//         testData.rateCard.name,
//         testData.rateCard.hours,
//         testData.rateCard.rate,
//         testData.rateCard.income,
//         testData.rateCard.deductionName,
//         testData.rateCard.deductionRate
//     );

//     await expect(page.locator("//div[contains(text(),'Rate card created successfully')]")).toBeVisible();
// });

// test('Delete existing Rate Card successfully', async ({ page }) => {
//     const { superAdminSettings } = await setup(page);
//     await page.waitForTimeout(2000);

//     await superAdminSettings.deleteRateCard(testData.rateCard.name);
//     await expect(page.locator("//div[contains(text(),'Rate card deleted successfully')]")).toBeVisible();
// });

test('Copy Admin Fee Rate successfully', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    await superAdminSettings.copyAdminFeeRate(testData.adminRate.name);
    await expect(page.locator("//div[contains(text(),'Admin Fee Rate copied to depots')]")).toBeVisible();
} );

test('Copy Rate Card successfully', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    await superAdminSettings.copyRateCard(testData.rateCard.name1);
    await expect(page.locator("//div[contains(text(),'Rate card copied successfully')]")).toBeVisible();
} );


test('Verify system rate is not editable', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    await superAdminSettings.verifySystemRateCardIsNotEditable(testData.systemRate.name);
    //await expect(page.locator("//div[contains(text(),'Rate card copied successfully')]")).toBeVisible();
} );

