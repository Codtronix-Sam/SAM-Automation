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

// test('Verify delete all invoices functionality', async ({ page }) => {

//     const { paymentsPage } = await setup(page);

//     await paymentsPage.gotoPaymentsModule();
//     await paymentsPage.deleteAllInvoices();
// });

// Tests 15-20: create a new invoice for a driver end to end - select driver + their
// admin fee rate, pick a week, add income lines, assign a deduction, add a repayment
// deduction, then submit. Not independently reachable steps, so modelled as one flow.
test('Create a new invoice for a driver with income and deductions', async ({ page }) => {

    const { paymentsPage } = await setup(page);
    const data = testData.newInvoice;

    await test.step('Open Add New Invoice and select driver + admin fee', async () => {
        await paymentsPage.selectDepotForPayments(data.depotName);
        await paymentsPage.openAddNewInvoice();
        await paymentsPage.selectDriverForNewInvoice(data.driverButtonName);
        await paymentsPage.selectAdminFeeForInvoice(data.adminFeeButtonName);
    });

    await test.step('Select the pay week', async () => {
        await paymentsPage.selectInvoiceWeek(data.weekOptionName);
    });

    await test.step('Add an income line item', async () => {
        await paymentsPage.addIncomeLineItem(data.incomeSearchTerm, data.incomeButtonName, data.incomeQuantity);
    });

    await test.step('Assign a deduction', async () => {
        await paymentsPage.assignDeductionToInvoice(data.deductionSearchText, data.deductionAmount);
    });

    await test.step('Add a repayment deduction', async () => {
        await paymentsPage.addRepaymentDeduction(data.repaymentAmount);
    });

    await test.step('Submit the invoice', async () => {
        await paymentsPage.submitCreateInvoice();
    });
});

test('Verify bulk update invoices to Unpaid', async ({ page }) => {

    const { paymentsPage } = await setup(page);

    await test.step('Go to Payments Module', async () => {
        await paymentsPage.gotoPaymentsModule();
    });

    await test.step('Bulk update invoices to Unpaid', async () => {
        await paymentsPage.bulkUpdateInvoicestoUnpaid();
    });

});

// test('Verify bulk update invoices to Paid', async ({ page }) => {

//     const { paymentsPage } = await setup(page);

//     await paymentsPage.gotoPaymentsModule();
//     await paymentsPage.bulkUpdateInvoicestoPaid();
// });

// test('Verify approve payments functionality', async ({ page }) => {

//     const { paymentsPage } = await setup(page);

//     await paymentsPage.gotoPaymentsModule();
//     await paymentsPage.approvePayments();
// });

// test('Verify add invoice functionality', async ({ page }) => {

//     const { paymentsPage } = await setup(page);
//     await paymentsPage.gotoPaymentsModule();
//     await paymentsPage.openAmzExpressDepot();
//     //  await page.waitForTimeout(5000);
//     await paymentsPage.clickPaymentsAndInvociesDD();
//     await paymentsPage.addInvoice('Saad', '5', '5', '5', '5', '8', '6', '3', '2', '2', '5', '6', '7', '2', '4', '5', '5');
//     await paymentsPage.verifyInvoceIsAdded();
// });

// test('Verify Pay Day selection', async ({ page }) => {


//     const { paymentsPage } = await setup(page);
//     await paymentsPage.gotoPaymentsModule();
//     await paymentsPage.openAmzExpressDepot();
//     await paymentsPage.clickPaymentsAndInvociesDD();
//     await paymentsPage.payDaySelection();
// });

// test('Create invoice with driver-priority rate card', async ({ page }) => {
//     const { paymentsPage } = await setup(page);

//     await paymentsPage.gotoPaymentsModule();
//     await paymentsPage.createInvoiceWithDriverPriorityRateCard();
// });

// test('Verify if payday is applied correctly in listing', async ({ page }) => {
//     const { paymentsPage } = await setup(page);

//     await paymentsPage.gotoPaymentsModule();
//     await paymentsPage.createInvoiceWithDriverPriorityRateCard();
//     await paymentsPage.clickPaymentsAndInvociesDD();
//     await paymentsPage.verifyPaydayInListing();
// });

