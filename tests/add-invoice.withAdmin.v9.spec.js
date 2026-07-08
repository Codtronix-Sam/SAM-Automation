const { test, expect } = require('@playwright/test')
const { AdminDashboardPage } = require('../pageObjects/AdminDashboardPage')
const { PaymentsPage } = require('../pageObjects/PaymentsPage.patched.v9')
const invoiceData = require('../testData').invoiceData

test.describe('Payments - Add Invoice (v9 date workaround)', () => {
  test('happy path: create invoice via AdminDashboard flow (v9)', async ({ page }) => {
    await page.goto('/')
    const admin = new AdminDashboardPage(page)
    await admin.searchDSP('SAM Onboarding')
    await page.waitForTimeout(500)
    await admin.openDSPPanel()

    const paymentsBtn = page.getByRole('button', { name: 'Payments' }).first()
    await paymentsBtn.waitFor({ state: 'visible', timeout: 8000 })
    await paymentsBtn.click()
    await page.waitForLoadState('networkidle')

    const payments = new PaymentsPage(page)
    await payments.createInvoiceFromData(invoiceData)

    await expect(page.locator('text=Invoice created successfully!')).toBeVisible({ timeout: 10000 })
    const referenceOrDriver = invoiceData.expectedReference || invoiceData.driverName
    await payments.navigateToPaymentsAndAssertInvoicePresent(referenceOrDriver)
  })
})
