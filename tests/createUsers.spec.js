// tests/userManagement.spec.js
const { test, expect } = require('@playwright/test');
const { UserManagement } = require('../pageObjects/UserManagement');
const { AdminDashboardPage } = require('../pageObjects/AdminDashboardPage');
const testData = require('../testData');
require('dotenv').config();

async function setup(page) {
    const userManagement = new UserManagement(page);
    const dashboard = new AdminDashboardPage(page);

    await page.goto(`${process.env.BASE_URL}/admin/dashboard`);
    await dashboard.searchDSP(testData.dspName);
    await dashboard.openDSPPanel();

    // Go to User Management
    await userManagement.navigateToUserManagement();

    return { userManagement };
}

test('Create DSP User', async ({ page }) => {
    const { userManagement } = await setup(page);

    await userManagement.createDSPUser();
    await userManagement.addNewUserSubmitButton.click();

    //await expect(page.locator("//div[contains(text(),'User created successfully')]")).toBeVisible();
});

test('Create OSM User', async ({ page }) => {
    const { userManagement } = await setup(page);

    await userManagement.createOSMUser();
    await userManagement.addNewUserSubmitButton.click();

});

test('Create Admin User', async ({ page }) => {
    const { userManagement } = await setup(page);

    await userManagement.createAdminUser();
    await userManagement.addNewUserSubmitButton.click();

});

test('Create Director User', async ({ page }) => {
    const { userManagement } = await setup(page);

    await userManagement.createDirectorUser();
    await userManagement.addNewUserSubmitButton.click();

});
