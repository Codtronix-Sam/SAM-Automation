const { test, expect } = require('@playwright/test');
const invoiceData = require('../testData').invoiceData;

class PaymentsPage {

    /**
  * @param {import('@playwright/test').Page} page
  */

    constructor(page) {

        this.page = page;
        this.paymentModule = page.locator("(//div[@role='button'])[4]");
        this.paymentAndInvoicesDD = page.locator("//button[normalize-space()='Payment & Invoices']");
        this.addInvoiceBtn = page.locator("//button[normalize-space()='Add Invoice']");
        this.dateField = page.locator("//button[@aria-label='Choose date']//*[name()='svg']");
        this.openAmzExpress = page.locator("(//button[@type='button'][normalize-space()='Open'])[3]");
        this.confirmWeek = page.locator("//button[normalize-space()='Confirm']");
        this.userField = page.locator('input[role="combobox"]');
        this.nineHourDaysField = page.locator('input[name="nineHrRouteDays"]');
        this.nineHourRoutePay = page.locator('input[name="nineHrRoutePay"]');
        this.eightHourDaysField = page.locator('input[name="eightHrRouteDays"]');
        this.eightHourRoutePay = page.locator('input[name="eightHrRoutePay"]');
        this.additionalPay = page.locator('input[name="additionalPay"]');
        this.BYODField = page.locator('input[name="byod"]');
        this.seasonalIncentive = page.locator('input[name="seasonalIncentive"]');
        this.bonus = page.locator('input[name="bonus"]');
        this.rescue = page.locator('input[name="rescue"]');
        this.otherPay = page.locator('input[name="otherPay"]');
        this.otherDeduction = page.locator('input[name="otherDeduction"]');
        this.gross = page.locator('input[name="gross"]');
        this.vat = page.locator('input[name="vat"]');
        this.adminFees = page.locator('input[name="adminFees"]');
        this.adminFeesRefund = page.locator('input[name="adminFeesRefund"]');
        this.net = page.locator('input[name="net"]');
        this.status = page.locator("//div[@id='mui-component-select-status']");
        this.statusScheduled = page.locator("//li[normalize-space()='Scheduled']");
        this.addInvoiceSubmitBtn = page.locator("//button[@type='submit']");
        // --- Additional locators discovered on Create Invoice page ---
        // Inputs that are present but were not in the file
        this.invoiceCreationDateInput = page.locator('input[name="invoiceCreationDate"]'); // Disabled until driver selected
        this.invoiceReferenceInput = page.locator('input[name="invoiceReferenceId"]'); // Disabled until driver selected

        // Income row fields (first row)
        this.firstIncomeQuantity = page.locator('input[name="incomeRows.0.quantity"]'); // quantity spinbutton
        // Buttons for adding items
        this.addIncomeBtn = page.locator('button:has-text("Add Income")');
        this.addDeductionBtn = page.locator('button:has-text("Add Deduction")');

        // Invoice actions
        this.cancelInvoiceBtn = page.locator('button:has-text("CANCEL")');
        // Status option visible label (pending)
        this.statusPendingOption = page.locator('//span[normalize-space()="pending"]');

        // Optional: a robust locator for driver label / visible select label
        this.driverSelectLabel = page.locator("(//span[normalize-space()='Select driver'])[1]");

        // Note: many of these controls are initially disabled until a driver and admin fee are selected.
        this.addInvoiceSuccessMessage = page.locator("//div[contains(text(),'Invoice added successfully.')]");
        this.getCurrentPayDay = page.locator("//button[starts-with(normalize-space(), 'Pay Day:')]");
        this.openDaysDropdown = page.locator("//button[starts-with(normalize-space(), 'Pay Day:')]");
        // this.selectRandomDay = page.locator(`li[role="menuitem"] >> text=${newDay}`)

        // ------------------ INVOICE CREATION ------------------ //
        this.invoiceTabs = page.locator("(//a[normalize-space()='Invoicing'])[1]");
        this.addInvoicingBtn = page.locator("(//button[normalize-space()='Add New Invoice'])[1]");
        this.selectDriverForInvoice = page.locator("(//span[normalize-space()='Select driver'])[1]");
        this.invoiceSearchInput = page.locator("(//input[@placeholder='Search...'])[2]");
        this.importTesterOption = page.locator("(//span[normalize-space()='Import Tester'])[1]");
        this.adminFeeRateOption = page.locator("(//span[@title='Admin fee rate for import tester with VAT'])[1]");
        this.statusDropdown = page.locator("(//span[normalize-space()='Select status'])[1]");
        this.incorrectStatusOption = page.locator("(//span[normalize-space()='Incorrect'])[1]");
        this.dateInput = page.locator("input[placeholder='DD/MM/YYYY']");
        this.dateButton21 = page.locator("//button[normalize-space()='21']");
        this.incomeDropdownLabel = page.locator("(//span[normalize-space()='Search income name'])[1]");
        this.incomeOption = page.locator("//span[contains(@class, 'MuiListItemText-primary') and contains('8 Hour route for import tester - £100')]");
        this.totalIncome = page.locator("(//span[normalize-space()='Total Income: £100.00'])[1]");
        this.totalDeduction = page.locator("(//span[normalize-space()='Total Deduction: £25.20'])[1]");
        this.totalAdminFee = page.locator("(//span[normalize-space()='Total Admin Fee: £13.2'])[1]");
        this.netAmount = page.locator("(//span[contains(text(),'£61.60')])[3]");
        this.createInvoiceBtn = page.locator("(//button[normalize-space()='Create Invoice'])[1]");
        this.successMsg = page.locator("//div[contains(text(),'Invoice created successfully!')]");
        this.selectAllBtn = page.getByRole('checkbox', { name: 'Select all rows' })
        this.bulkUpdateBtn = page.locator("//button[normalize-space()='Bulk Update']")
        this.bulkStatusDD = page.getByText('Select invoice status', { exact: true })
        this.bulkStatusUnpaidOption = page.locator("//li[normalize-space()='Unpaid']")
        this.bulkStatusPaidOption = page.locator("//li[normalize-space()='Paid']")
        this.confirmBulkUpdateBtn = page.getByRole('button', { name: /^Update/ });
        this.bulkUpdateSuccessMsg = page.getByText('Bulk update status to Unpaid successful', { exact: true })
        this.approvePaymentsBtn = page.getByRole('button', { name: 'Approve Payments' })
        this.approvePaymentsSuccessMsg = page.getByText(/Successfully approved \d+ invoice\(s\)/).isVisible();
        this.deleteAllInvoicesBtn = page.locator("//button[contains(normalize-space(),'Delete')]")
        this.confirmDeleteBtn = page.getByText('Delete', { exact: true })
        this.deletionSuccessMsg = page.getByText(/\d+ invoice\(s\) deleted successfully/);
    }

    async gotoPaymentsModule() {

        await this.paymentModule.click();
    }

    async deleteAllInvoices() {

        await this.page.waitForTimeout(5000);
        await this.selectAllBtn.click();
        await this.page.waitForTimeout(1000);
        await this.deleteAllInvoicesBtn.click();
        await this.page.waitForTimeout(1000);
        await this.confirmDeleteBtn.click();
        await expect(this.deletionSuccessMsg).toBeVisible();
    }

    async bulkUpdateInvoicestoUnpaid() {

        await this.page.waitForTimeout(5000);
        await this.selectAllBtn.click();
        await this.bulkUpdateBtn.click();
        await this.bulkStatusDD.click();
        await this.page.waitForTimeout(1000);
        await this.bulkStatusUnpaidOption.click();
        await this.confirmBulkUpdateBtn.click();
        await expect(this.bulkUpdateSuccessMsg).toBeVisible();
    }

    async bulkUpdateInvoicestoPaid() {

        await this.page.waitForTimeout(5000);
        await this.selectAllBtn.click();
        await this.bulkUpdateBtn.click();
        await this.bulkStatusDD.click();
        await this.page.waitForTimeout(1000);
        await this.bulkStatusPaidOption.click();
        await this.confirmBulkUpdateBtn.click();
        await expect(this.bulkUpdateSuccessMsg).toBeVisible();

    }

    async approvePayments() {

        await this.page.waitForTimeout(5000);
        await this.selectAllBtn.click();
        await this.approvePaymentsBtn.click();
        await expect(this.approvePaymentsSuccessMsg).toBeVisible();
    }


    // async createInvoiceWithDriverPriorityRateCard() {
    //     const data = invoiceData;

    //     // Step 1: Search and select driver
    //     await this.invoiceTabs.click();
    //     await this.addInvoicingBtn.click();
    //     await this.selectDriverForInvoice.click();
    //     await this.invoiceSearchInput.click();
    //     await this.invoiceSearchInput.fill(data.driverName);
    //     const driverOption = this.page.locator(`//span[normalize-space()='${data.driverName}']`);
    //     await driverOption.click();

    //     // Step 2: Select admin fee rate
    //     const rateOption = this.page.locator(`//span[@title='${data.rateTitle}']`);
    //     await rateOption.waitFor({ state: 'visible' });
    //     await expect(rateOption).toBeVisible();

    //     // Step 3: Select status
    //     await this.statusDropdown.click();
    //     const statusOption = this.page.locator(`//span[normalize-space()='${data.status}']`);
    //     await statusOption.click();

    //     // Step 4: Select date
    //     await this.dateInput.click();
    //     const dateBtn = this.page.locator(`//button[normalize-space()='${data.date}']`);
    //     await dateBtn.click();

    //     // Step 5: Select income
    //     await this.incomeDropdownLabel.click();
    //     const incomeOption = this.page.locator('//span[contains(@class, "MuiListItemText-primary") and contains(., "8 Hour route for import tester - £100")]');
    //     await incomeOption.click();

    //     // Step 6: Verify calculated totals
    //     await expect(this.page.locator(`//span[normalize-space()='Total Income: ${data.expectedIncome}']`)).toBeVisible();
    //     await expect(this.page.locator(`//span[normalize-space()='Total Deduction: ${data.expectedDeduction}']`)).toBeVisible();
    //     await expect(this.page.locator(`//span[normalize-space()='Total Admin Fee: ${data.expectedAdminFee}']`)).toBeVisible();
    //     await expect(this.page.locator(`//span[contains(text(),'${data.expectedNet}')]`).first()).toBeVisible();

    //     // Step 7: Create invoice
    //     await this.createInvoiceBtn.click();

    //     // Step 8: Verify success message
    //     await expect(this.successMsg).toBeVisible();
    // }

    // getSelectDayLocator(day) {
    //     return this.page.locator(`li[role="menuitem"] >> text=${day}`);
    // }

    // async openAmzExpressDepot() {

    //     await this.openAmzExpress.click();
    //     await this.confirmWeek.click();

    // }

    // async verifyInvoceIsAdded() {

    //     await this.addInvoiceSuccessMessage.isVisible();
    // }

    // async clickPaymentsAndInvociesDD() {

    //     await this.paymentAndInvoicesDD.click();
    // }

    // async addInvoice(userName, nineHourDays, nineHourRoutePay, eightHourDays, eightHourPay, additionalPay, BYOD, incentive, bonus, rescue, otherPay, deduction, grossAmt, vatAmt, adminFeeAmt, refundAmt, netAmt) {
    //     await this.addInvoiceBtn.click();
    //     await this.dateField.click();
    //     await this.page.keyboard.press('Enter');
    //     await this.userField.fill(userName);
    //     await this.page.waitForTimeout(5000);
    //     await this.page.keyboard.press('Enter');

    //     await this.nineHourDaysField.fill(nineHourDays);
    //     await this.nineHourRoutePay.fill(nineHourRoutePay);
    //     await this.eightHourDaysField.fill(eightHourDays);
    //     await this.eightHourRoutePay.fill(eightHourPay);
    //     await this.additionalPay.fill(additionalPay);
    //     await this.BYODField.fill(BYOD);
    //     await this.seasonalIncentive.fill(incentive);
    //     await this.bonus.fill(bonus);
    //     await this.rescue.fill(rescue);
    //     await this.otherPay.fill(otherPay);
    //     await this.otherDeduction.fill(deduction);
    //     await this.gross.fill(grossAmt);
    //     await this.vat.fill(vatAmt);
    //     await this.adminFees.fill(adminFeeAmt);
    //     await this.adminFeesRefund.fill(refundAmt);
    //     await this.net.fill(netAmt);
    //     await this.status.click();
    //     await this.statusScheduled.click();
    //     await this.addInvoiceSubmitBtn.click();



    //     // const today = new Date();
    //     // const day = today.getDate();

    //     // await this.page.getByRole('dialog', { name: `${day}` }).click();
    // }

    // async payDaySelection() {

    //     const currentText = await this.getCurrentPayDay.textContent();
    //     await this.page.waitForTimeout(1000);
    //     const currentDay = currentText.split(':')[1].trim().toLowerCase();
    //     await this.page.waitForTimeout(1000);

    //     const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    //     const newDay = allDays.find(day => day !== currentDay);
    //     await this.page.waitForTimeout(1000);

    //     await this.openDaysDropdown.click();
    //     await this.page.waitForTimeout(1000);
    //     await this.getSelectDayLocator(newDay).click();

    //     await expect(this.getCurrentPayDay).toHaveText(`Pay Day: ${newDay.charAt(0).toLowerCase() + newDay.slice(1)}`);


    // }


}
module.exports = { PaymentsPage };