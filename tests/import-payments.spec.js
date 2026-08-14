const { test, expect } = require('@playwright/test');
const { PaymentsPage } = require('../pageObjects/PaymentsPage');
const testData = require('../testData');
const path = require('path');
require('dotenv').config();

// Deliberately does not go through AdminDashboardPage's searchDSP/openDSPPanel first -
// that path and PaymentsPage.selectDepotForPayments() land in different contexts and
// don't compose (confirmed live: chaining them leaves the depot-selection step clicking
// at nothing). selectDepotForPayments already handles the full route from the dashboard.
async function setup(page) {
    const paymentsPage = new PaymentsPage(page);
    await page.goto(`${process.env.BASE_URL}/admin/dashboard`);
    return { paymentsPage };
}

// End-to-end Import Payments flow for a single driver/week: create via import, verify
// line items, re-import an updated sheet (triggers duplicate detection), override to
// update, verify the new values, then leave the week clean. Modelled as one test since
// each step depends on the state the previous one left behind - none are independently
// reachable in isolation.
test('Import payment sheet creates and then updates an invoice for a driver', async ({ page }) => {

    const { paymentsPage } = await setup(page);
    const data = testData.importPayments;

    await test.step('Navigate to Payments for the target week', async () => {
        await paymentsPage.selectDepotForPayments(data.depotName);
        await paymentsPage.paymentsNavBtn.click();
    });

    await test.step('Delete any pre-existing invoices for the week before starting', async () => {
        await paymentsPage.deleteAllInvoicesForSelectedWeekIfAny();
    });

    await test.step('Import Sheet A and verify a fresh invoice is created', async () => {
        await paymentsPage.openImportInvoiceDialog();
        await paymentsPage.selectImportWeek(data.weekLabel);
        await paymentsPage.uploadImportSheet(path.resolve(__dirname, '..', data.sheetAPath));
        await paymentsPage.submitImport();
        await paymentsPage.verifyImportResult({ imported: 1, duplicates: 0, errors: 0 });
    });

    await test.step('Verify Sheet A line items on the created invoice', async () => {
        await paymentsPage.openInvoiceForDriver(data.driverName);
        await expect(paymentsPage.totalIncomeLine).toHaveText(data.sheetA.totalIncome);
        expect(await paymentsPage.getIncomeLineQuantity(0)).toBe(data.sheetA.otherPayQty);
        expect(await paymentsPage.getIncomeLineQuantity(1)).toBe(data.sheetA.spendifyQty);
        await paymentsPage.closeInvoiceDetail();
    });

    await test.step('Re-import Sheet B and verify it is detected as a duplicate', async () => {
        await paymentsPage.openImportInvoiceDialog();
        await paymentsPage.selectImportWeek(data.weekLabel);
        await paymentsPage.uploadImportSheet(path.resolve(__dirname, '..', data.sheetBPath));
        await paymentsPage.submitImport();
        // Leave the dialog open - the override table is part of this same screen,
        // below the summary, and closing here would dismiss it too.
        await paymentsPage.verifyImportResult({ imported: 0, duplicates: 1, errors: 0, closeDialog: false });
    });

    await test.step('Override the duplicate to update the existing invoice', async () => {
        await paymentsPage.overrideDuplicateInvoice(data.driverName);
    });

    await test.step('Verify Sheet B updated line items on the invoice', async () => {
        await paymentsPage.openInvoiceForDriver(data.driverName);
        await expect(paymentsPage.totalIncomeLine).toHaveText(data.sheetB.totalIncome);
        expect(await paymentsPage.getIncomeLineQuantity(0)).toBe(data.sheetB.otherPayQty);
        expect(await paymentsPage.getIncomeLineQuantity(1)).toBe(data.sheetB.spendifyQty);
        await paymentsPage.closeInvoiceDetail();
    });

    await test.step('Clean up: delete the invoice created during the test', async () => {
        await paymentsPage.deleteAllInvoicesForSelectedWeekIfAny();
    });
});
