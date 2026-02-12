const { expect } = require('@playwright/test');
const invoiceData = require('../testData').invoiceData;

class PaymentsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        this.invoiceTabs = page.locator("(//a[normalize-space()='Invoicing'])[1]");
        this.addInvoicingBtn = page.locator("(//button[normalize-space()='Add New Invoice'])[1]");
        this.selectDriverForInvoice = page.locator("(//span[normalize-space()='Select driver'])[1]");
        this.invoiceSearchInput = page.locator("(//input[@placeholder='Search...'])[2]");

        this.statusDropdown = page.locator("(//span[normalize-space()='Select status'])[1]");
        this.dateInput = page.locator("input[placeholder='DD/MM/YYYY']");

        this.incomeDropdownLabel = page.locator("(//span[normalize-space()='Search income name'])[1]");
        this.addIncomeBtn = page.locator('button:has-text("Add Income")');

        this.addDeductionBtn = page.locator('button:has-text("Add Deduction")');

        this.createInvoiceBtn = page.locator("(//button[normalize-space()='Create Invoice'])[1]");
        this.successMsg = page.locator("//div[contains(text(),'Invoice created successfully!')]");

        this.paymentsMenu = page.getByRole('button', { name: 'Payments' });

        this.visiblePopovers = page.locator('div[role="presentation"]:not([aria-hidden="true"])');

        this.adminFeeTable = page.locator("//div[normalize-space()='Admin Fee']/following::table[1]");
        this.adminFeeFirstCell = this.adminFeeTable.locator('tbody tr td').first();
    }

    async openCreateInvoice() {
        try {
            if (await this.invoiceTabs.isVisible()) await this.invoiceTabs.click();
        } catch (e) { }
        await this.addInvoicingBtn.click();
    }

    async selectDriverByName(name) {
        await this.selectDriverForInvoice.click();
        await this.invoiceSearchInput.click();
        await this.invoiceSearchInput.fill(name);
        const driverOption = this.page.locator(`//span[normalize-space()="${name}"]`).first();
        await driverOption.waitFor({ state: 'visible', timeout: 6000 });
        await driverOption.click();
        await this.page.waitForTimeout(700);
    }

    async getSelectedAdminFeeText() {
        try {
            if (await this.adminFeeFirstCell.isVisible().catch(() => false)) {
                const txt = await this.adminFeeFirstCell.textContent();
                return (txt || '').trim();
            }
            const fallback = this.page.locator("//div[normalize-space()='Admin Fee']/following::div[1]//span[normalize-space()]").first();
            if (await fallback.isVisible().catch(() => false)) {
                const t = await fallback.textContent();
                return (t || '').trim();
            }
        } catch (e) {
            return '';
        }
        return '';
    }

    async selectInvoiceDate(day) {
        if (!day) return;

        const dayStr = String(day).trim();
        let dd, mm, yyyy;
        if (dayStr.includes('/')) {
            const parts = dayStr.split('/');
            dd = String(parts[0]).padStart(2, '0');
            mm = String(parts[1]).padStart(2, '0');
            yyyy = parts[2] || new Date().getFullYear();
        } else {
            const now = new Date();
            dd = dayStr.padStart(2, '0');
            mm = String(now.getMonth() + 1).padStart(2, '0');
            yyyy = now.getFullYear();
        }

        const displayDate = `${dd}/${mm}/${yyyy}`; // e.g. 01/12/2025
        const digitsDate = `${dd}${mm}${yyyy}`;     // e.g. 01122025

        const selector = 'input[placeholder="DD/MM/YYYY"]';

        // 1) Try to click the input to open the calendar
        try {
            await this.dateInput.click({ force: true });
        } catch (e) {
            // fallback to DOM click
            await this.page.evaluate(sel => {
                const el = document.querySelector(sel);
                if (el) el.click();
            }, selector);
        }
        await this.page.waitForTimeout(150);

        // 2) Close the calendar (Escape). Some calendars keep focus; we still ensure input is focused afterwards.
        try { await this.page.keyboard.press('Escape'); } catch (e) { }
        await this.page.waitForTimeout(150);

        // 3) Ensure the input is focused. If not, focus it via JS.
        try {
            // Try Playwright focus first
            await this.dateInput.focus();
        } catch (e) {
            try {
                await this.page.evaluate(sel => {
                    const el = document.querySelector(sel);
                    if (el) el.focus();
                }, selector);
            } catch (er) { }
        }
        // small delay for focus to settle
        await this.page.waitForTimeout(120);

        // Double-check activeElement is the input; if not, force focus again
        const isFocused = await this.page.evaluate(sel => {
            const el = document.querySelector(sel);
            return !!el && document.activeElement === el;
        }, selector).catch(() => false);

        if (!isFocused) {
            // attempt to focus again via click and js focus
            try { await this.dateInput.click({ force: true }); } catch (e) { }
            await this.page.evaluate(sel => {
                const el = document.querySelector(sel);
                if (el) el.focus();
            }, selector).catch(() => { });
            await this.page.waitForTimeout(80);
        }

        // 4) Clear the field then type digits-only date slowly so app key handlers pick it up
        try {
            // triple click to select all if UI supports it, otherwise fill ''
            try { await this.dateInput.click({ clickCount: 3, force: true }); } catch (e) { }
            await this.dateInput.fill('');
        } catch (e) { }

        // Type digits one by one with a small delay
        try {
            for (const ch of digitsDate.split('')) {
                await this.page.keyboard.type(ch, { delay: 60 });
            }
            await this.page.waitForTimeout(120);
            // press Enter or Tab to commit
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(200);
        } catch (e) {
            // ignore and fallback
        }

        // 5) Read back the value; if it looks good, return
        let val = await this.dateInput.inputValue().catch(() => '');
        if (val && (val.includes(dd) || val.replace(/\D/g, '').includes(digitsDate))) {
            return; // success
        }

        // 6) Fallback: fill visible display format and dispatch input/change
        try {
            await this.dateInput.fill(displayDate);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(150);
            val = await this.dateInput.inputValue().catch(() => '');
            if (val && val.includes(dd)) return;
        } catch (e) { }

        // 7) Final fallback: set via JS and dispatch events
        try {
            await this.page.evaluate(({ selector, displayDate }) => {
                const el = document.querySelector(selector);
                if (el) {
                    el.value = displayDate;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    // some apps listen to blur
                    el.blur();
                }
            }, { selector, displayDate });
            await this.page.waitForTimeout(120);
        } catch (e) { }
    }

    async selectInvoiceDate(day) {
        if (!day) return;

        const dayStr = String(day).trim();
        let dd, mm, yyyy;
        if (dayStr.includes('/')) {
            const parts = dayStr.split('/');
            dd = String(parts[0]).padStart(2, '0');
            mm = String(parts[1]).padStart(2, '0');
            yyyy = parts[2] || new Date().getFullYear();
        } else {
            const now = new Date();
            dd = dayStr.padStart(2, '0');
            mm = String(now.getMonth() + 1).padStart(2, '0');
            yyyy = now.getFullYear();
        }

        const displayDate = `${dd}/${mm}/${yyyy}`; // e.g. 01/12/2025
        const dayNumber = String(parseInt(dd, 10)); // e.g. "1" or "21"
        const paddedDay = dd;                        // e.g. "01" or "21"

        // Open calendar by clicking input (best-effort)
        try { await this.dateInput.click({ force: true }); } catch (e) {
            await this.page.evaluate(sel => { const el = document.querySelector(sel); if (el) el.click(); }, 'input[placeholder="DD/MM/YYYY"]');
        }
        await this.page.waitForTimeout(150);

        // Ensure calendar is closed/open state handled by attempting clicks on visible calendar buttons.
        // Try multiple button selectors (your simple approach + padded + aria-label/class heuristics)
        const candidateSelectors = [
            `//button[normalize-space()="${dayStr}"]`,            // exactly what you used
            `//button[normalize-space()="${dayNumber}"]`,         // unpadded numeric
            `//button[normalize-space()="${paddedDay}"]`,         // padded two-digit
            `//button[@aria-label and contains(@aria-label, "${displayDate}")]`,
            `//button[contains(@class,"react-datepicker__day") and normalize-space()="${dayNumber}"]`,
            `//td//button[normalize-space()="${dayNumber}"]`,     // some calendars put button inside td
        ];

        for (const sel of candidateSelectors) {
            try {
                const btn = this.page.locator(sel).first();
                if (await btn.isVisible().catch(() => false)) {
                    await btn.click();
                    await this.page.waitForTimeout(200);
                    // verify input accepted the value (best-effort)
                    const val = await this.dateInput.inputValue().catch(() => '');
                    if (val && (val.includes(dd) || val.replace(/\D/g, '').includes(dd))) return;
                    // otherwise continue to try other selectors/fallbacks
                }
            } catch (e) { /* ignore and try next */ }
        }

        // If clicking calendar day didn't work, try the v9 manual-typing fallback
        // Close calendar if open so typing goes to input
        try { await this.page.keyboard.press('Escape'); } catch (e) { }
        await this.page.waitForTimeout(150);

        // Ensure input is focused
        try { await this.dateInput.focus(); } catch (e) {
            await this.page.evaluate(sel => { const el = document.querySelector(sel); if (el) el.focus(); }, 'input[placeholder="DD/MM/YYYY"]');
        }
        await this.page.waitForTimeout(80);

        // Type digits ddmmyyyy slowly
        const digitsDate = `${dd}${mm}${yyyy}`;
        try {
            // clear first
            try { await this.dateInput.click({ clickCount: 3, force: true }); } catch (e) { }
            await this.dateInput.fill('');
            for (const ch of digitsDate.split('')) {
                await this.page.keyboard.type(ch, { delay: 70 });
            }
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(200);
            const val2 = await this.dateInput.inputValue().catch(() => '');
            if (val2 && (val2.includes(dd) || val2.replace(/\D/g, '').includes(digitsDate))) return;
        } catch (e) { /* continue to next fallback */ }

        // Final fallback: set via JS and dispatch events
        try {
            await this.page.evaluate(({ selector, displayDate }) => {
                const el = document.querySelector(selector);
                if (el) {
                    el.value = displayDate;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    el.blur();
                }
            }, { selector: 'input[placeholder="DD/MM/YYYY"]', displayDate });
            await this.page.waitForTimeout(120);
        } catch (e) { }
    }

    async selectStatus(statusText) {
        if (!statusText) return;

        // small settle in case prior steps opened popovers
        try { await this.page.keyboard.press('Escape'); } catch (e) { }
        await this.page.waitForTimeout(150);

        // Prefer a role-based button if available (more robust than XPath)
        const roleBtn = this.page.getByRole('button', { name: /^Select status$/ }).first();

        // Wait briefly for the control to appear; use a slightly longer timeout here
        const visible = await roleBtn.isVisible().catch(() => false);
        if (visible) {
            try {
                await roleBtn.waitFor({ state: 'visible', timeout: 8000 });
                await roleBtn.click();
            } catch (e) {
                // fallback to click with force
                await roleBtn.click({ force: true }).catch(() => { });
            }
        } else {
            // fallback to the original XPath/locator (keeps compatibility)
            try {
                await this.statusDropdown.waitFor({ state: 'visible', timeout: 8000 });
                await this.statusDropdown.click();
            } catch (e) {
                // last-resort forced click
                await this.statusDropdown.click({ force: true }).catch(() => { });
            }
        }

        // Now wait for the option to be visible in the opened list and click it
        const statusOption = this.page.locator(`//span[normalize-space()='${statusText}']`).first();
        await statusOption.waitFor({ state: 'visible', timeout: 8000 });
        await statusOption.click();
        await this.page.waitForTimeout(120);
    }

    async selectIncomeByText(partialText) {
        if (!partialText) return;
        await this.incomeDropdownLabel.click();
        const incomeOption = this.page.locator(`//button[normalize-space() and contains(., "${partialText}")]`).first();
        await incomeOption.waitFor({ state: 'visible', timeout: 5000 });
        await incomeOption.click();
        await this.page.waitForTimeout(500);
    }

    async createInvoiceFromData(data = invoiceData) {
        await this.openCreateInvoice();
        await this.selectDriverByName(data.driverName);

        if (typeof this.selectAdminFeeByText === 'function') {
            await this.selectAdminFeeByText(data.rateTitle);
        } else {
            try { await this.page.keyboard.press('Escape'); } catch (e) { }
            await this.page.waitForTimeout(150);

            const adminFeeControl = this.page.locator("//div[normalize-space()='Admin Fee']/following::div[1]").first();
            if (await adminFeeControl.isVisible().catch(() => false)) {
                await adminFeeControl.click();
            } else {
                const fallbackBtn = this.page.locator("(//span[normalize-space()='Admin Fee']/following::button)[1]");
                if (await fallbackBtn.isVisible().catch(() => false)) await fallbackBtn.click();
            }

            const popover = this.visiblePopovers.first();
            await popover.waitFor({ state: 'visible', timeout: 6000 }).catch(() => { });
            const firstOption = popover.locator('button, [role="button"], [role="option"]').first();
            if (await firstOption.isVisible().catch(() => false)) {
                await firstOption.click().catch(() => { });
            }

            try { await this.page.keyboard.press('Escape'); } catch (e) { }
            await this.page.waitForTimeout(300);
        }

        if (data.date) {
            await this.selectInvoiceDate(data.date);
            await this.page.waitForTimeout(300);
        }

        await this.incomeDropdownLabel.click();
        const incomeOption = this.page.locator('//span[contains(@class, "MuiListItemText-primary") and contains(., "Standard 9 Hour route - £130.50")]');
        await incomeOption.click();


        await this.createInvoiceBtn.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.createInvoiceBtn).toBeEnabled({ timeout: 10000 });
        await this.createInvoiceBtn.click();
        await this.successMsg.waitFor({ state: 'visible', timeout: 15000 });
    }

}

module.exports = { PaymentsPage };