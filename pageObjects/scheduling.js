const { expect } = require('@playwright/test');
const invoiceData = require('../testData').invoiceData;

class ShiftPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // --- Locators (Page Elements) ---
        
        // 1. CSS Selector for the main service type dropdown container (the clickable element)
        this.serviceDropdown = page.locator('body > div:nth-child(4) > div:nth-child(3) > form:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)');

        // 2. XPath for the specific service option (must be visible after clicking the dropdown)
        this.serviceOption = page.locator("//span[normalize-space()='Standard 9 Hour route - £130.50']");

        // 3. XPath for the 'Update' or 'Create' button (handles both possible texts)
        this.updateCreateButton = page.locator("//button[normalize-space()='Update' or normalize-space()='Create']");
        
        // 4. XPath for the success message element (used for verification/wait)
        this.SUCCESS_MESSAGE_XPATH = "//div[contains(text(), 'Shift updated successfully') or contains(text(), 'Shift created successfully')]";
    }

    /**
     * Performs the full user workflow: selects a service type and clicks the 
     * Update or Create button, then waits for the success message.
     * @returns {Promise<boolean>} True if the shift was updated/created and the 
     * success message appeared, false otherwise.
     */
    async createOrUpdateShift() {
        console.log("--- Starting createOrUpdateShift Process (Playwright POM) ---");

        try {
            // 1. Click the service type dropdown selector to open the list
            await this.serviceDropdown.click();
            console.log(`[Action] Clicked the service type dropdown trigger.`);

            // 2. Select the specific service type option
            await this.serviceOption.click();
            console.log(`[Action] Selected the service option: 'Standard 9 Hour route - £130.50'.`);
            
            // 3. Click the 'Update' or 'Create' button
            await this.updateCreateButton.click();
            console.log(`[Action] Clicked the 'Update' or 'Create' button.`);
            
            // 4. Wait for the success message to appear
            await this.page.waitForSelector(this.SUCCESS_MESSAGE_XPATH, { timeout: 10000 });
            
            // Success: Minimal output before returning
            return true;
        } catch (error) {
            // Error: Minimal output before returning
            console.error(`[Fatal Error] Shift operation failed:`, error.message);
            return false;
        }
    }
}

// Export the class for use in Playwright test files
module.exports = { ShiftPage };

