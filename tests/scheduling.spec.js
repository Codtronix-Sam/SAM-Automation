const { test, expect } = require('@playwright/test');
const { ShiftPage } = require('../pageObjects/scheduling');
const { AdminDashboardPage } = require('../pageObjects/AdminDashboardPage');
const invoiceData = require('../testData').invoiceData;

test.describe('Shift Management', () => {

    test('happy path: successfully select service and update/create shift', async ({ page }) => {
        await page.goto('/');
        const admin = new AdminDashboardPage(page);
        await admin.searchDSP('SAM Onboarding');
        await page.waitForTimeout(500);
        await admin.openDSPPanel();

        const schedulingBtn = page.getByRole('button', { name: 'Scheduling' }).first();
        await schedulingBtn.waitFor({ state: 'visible', timeout: 8000 });
        await schedulingBtn.click();
        await page.waitForLoadState('networkidle');

        const shiftPage = new ShiftPage(page);
        const isSuccess = await shiftPage.createOrUpdateShift();
        await expect(isSuccess).toBe(true, 'Expected shift creation/update to succeed and return true.');
        await expect(page.locator(shiftPage.SUCCESS_MESSAGE_XPATH)).toBeVisible({ timeout: 5000 });
    });
});