// tests/superAdminSettings.spec.js
const { test, expect } = require('@playwright/test');
const { SuperAdminSettings } = require('../pageObjects/SuperAdminSettings');
const { AdminDashboardPage } = require('../pageObjects/AdminDashboardPage');
const testData = require('../testData');
require('dotenv').config();

async function setup(page, depotName) {
    const dashboard = new AdminDashboardPage(page);
    const superAdminSettings = new SuperAdminSettings(page);

    await page.goto(`${process.env.BASE_URL}/admin/dashboard`);
    await dashboard.searchDSP(testData.dspName);
    await dashboard.openDSPPanel();

    // Navigate to Super Admin Settings
    await superAdminSettings.navigateToSuperAdminSettings(depotName);

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

// Test 1: select a depot from the block list and land on its Admin Payment Settings tabs.
test('Select a depot and land on Admin Payment Settings', async ({ page }) => {

    const { superAdminSettings } = await setup(page, testData.paymentsSettings.depotName);
    await expect(superAdminSettings.addNewRateBtn).toBeVisible();
});

// Test 3: deleting an admin fee rate that has a driver assigned is blocked with an error.
// Uses a stable, already-existing rate with drivers assigned (also referenced by
// testData.invoiceData.rateTitle) rather than creating a fresh assignment - live testing
// showed driver assignment on this depot is shared/contended state that's easy to disturb.
test('Verify delete is blocked for an admin fee rate with a driver assigned', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    await superAdminSettings.verifyDeleteBlockedForAssignedAdminFee(testData.invoiceData.rateTitle);
});

// Test 5: searching a driver already assigned to another fee shows the already-assigned indicator.
// "Newtree next" is already assigned to a pre-existing rate on this depot, so no setup
// is needed here - unlike Test 3, this doesn't need to create its own precondition.
test('Verify already-assigned driver indicator when creating a new admin fee rate', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    await superAdminSettings.searchAlreadyAssignedDriver(testData.paymentsSettings.alreadyAssignedDriverSearchTerm);
});

// Test 6: cancelling an admin fee rate edit discards changes and closes the panel.
test('Cancel admin fee rate edit discards changes', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    await superAdminSettings.cancelAdminFeeRateEdit(testData.adminRate.name);
});

// Test 7: create a system rate card.
test('Add a system rate card', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    await superAdminSettings.addSystemRateCard(testData.paymentsSettings.systemRateCardName);
});

// Tests 8-10: role-based rate, per-driver rate override, and per-driver deduction override.
test('Add a rate card with role rate and per-driver overrides', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    await superAdminSettings.addRateCardWithDriverOverride(testData.paymentsSettings.driverOverrideRateCard);
    await expect(page.locator("//div[contains(text(),'Rate card created successfully')]")).toBeVisible();
});

// Test 11: change Pay Day.
test('Change Pay Day in General Settings', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    const { currentPayDay, newPayDay } = testData.paymentsSettings.generalSettings;
    await superAdminSettings.setPayDay(currentPayDay, newPayDay);
});

// Test 12: change Arrears weeks.
test('Change Arrears weeks in General Settings', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    const { currentArrears, newArrears } = testData.paymentsSettings.generalSettings;
    await superAdminSettings.setArrearsWeeks(currentArrears, newArrears);
});

// Test 13: Cut-Off Day display reflects the current Pay Day-derived value.
test('Verify Cut-Off Day display text', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    const cutOffText = await superAdminSettings.getCutOffDayText();
    expect(cutOffText).toContain('Cut-Off Day:');
});

// Test 14: set NMWR rate and save General Settings.
test('Set NMWR rate and save General Settings', async ({ page }) => {

    const { superAdminSettings } = await setup(page);
    await superAdminSettings.setNmwrRateAndSave(testData.paymentsSettings.generalSettings.nmwrRate);
});

