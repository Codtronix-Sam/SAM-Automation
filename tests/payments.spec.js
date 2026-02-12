const { test, expect } = require('@playwright/test');
const { AdminDashboardPage } = require('../pageObjects/AdminDashboardPage');
const { PaymentsPage } = require('../pageObjects/PaymentsPage');
const testData = require('../testData');
const { invoiceData } = require('../testData');
require('dotenv').config();

async function setup(page) {
    const dashboard = new AdminDashboardPage(page);
    const paymentsPage = new PaymentsPage(page);

    await page.goto(`${process.env.BASE_URL}/admin/dashboard`);
    await dashboard.searchDSP(testData.dspName);
    await dashboard.openDSPPanel();

    return { dashboard, paymentsPage };
}

test('Verify add invoice functionality', async ({ page }) => {

    const { paymentsPage } = await setup(page);
    await paymentsPage.gotoPaymentsModule();
    await paymentsPage.openAmzExpressDepot();
    //  await page.waitForTimeout(5000);
    await paymentsPage.clickPaymentsAndInvociesDD();
    await paymentsPage.addInvoice('Saad', '5', '5', '5', '5', '8', '6', '3', '2', '2', '5', '6', '7', '2', '4', '5', '5');
    await paymentsPage.verifyInvoceIsAdded();
});

test('Verify Pay Day selection', async ({ page }) => {


    const { paymentsPage } = await setup(page);
    await paymentsPage.gotoPaymentsModule();
    await paymentsPage.openAmzExpressDepot();
    await paymentsPage.clickPaymentsAndInvociesDD();
    await paymentsPage.payDaySelection();
});

test('Create invoice with driver-priority rate card', async ({ page }) => {
    const { paymentsPage } = await setup(page);

    await paymentsPage.gotoPaymentsModule();
    await paymentsPage.createInvoiceWithDriverPriorityRateCard();
});

test('Verify if payday is applied correctly in listing', async ({ page }) => {
    const { paymentsPage } = await setup(page);

    await paymentsPage.gotoPaymentsModule();
    await paymentsPage.createInvoiceWithDriverPriorityRateCard();
    await paymentsPage.clickPaymentsAndInvociesDD();
    await paymentsPage.verifyPaydayInListing();
});

