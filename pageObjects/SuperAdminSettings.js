const { th } = require('@faker-js/faker');
const { test, expect } = require('@playwright/test');


class SuperAdminSettings {
    /**
     */
    constructor(page) {
        this.page = page;
        this.addNewRateBtn = page.getByRole('button', { name: 'Add New Rate' });
        this.rateNameInput = page.locator('input[name="name"]');

        this.adminRateSearchInput = page.locator("//input[@placeholder='Search...']");
        this.adminRateThreeDots = page.locator("//div[@data-field='actions']//button[@type='button']");
        this.deleteOption = page.locator("(//li[normalize-space()='Delete'])[1]");
        // Confirmation is a dialog with a "Delete" button, not the "yes" list item
        // this locator originally assumed - fixed after confirming against the live UI.
        this.confirmYesBtn = page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true });
        this.deleteBlockedMsg = page.locator("//div[contains(text(),'Cannot delete admin fee.')]");
        this.editOption = page.locator("(//li[normalize-space()='Edit'])[1]");
        this.unlinkCheckbox = page.locator("(//input[@type='checkbox'])[1]");
        this.updateBtn = page.locator("(//button[normalize-space()='Update'])[1]");
        this.successDeleteMsg = page.locator("//div[contains(text(),'Admin Rate fee deleted successfully')]");
        this.navigateToDrivers = page.locator("//div[@aria-label='My Drivers']//*[name()='svg']");
        this.driversScreenSearch = page.locator("(//input[@placeholder='Search name or email'])[1]");
        this.navigateToDriverProfile = page.locator("(//div[@role='cell'])[3]");
        //this.adminFeeInDriverProfile = page.locator("(//p[normalize-space()='Darren Watts 22 Newtree next - £180'])[1]")

        // 2. Admin fee before VAT input
        this.adminFeeInput = page.locator('input[name="adminFeeBeforeVat"]');

        // 3. VAT checkbox
        this.vatCheckbox = page.locator("input[type='checkbox']").first();

        // 4. Invoice model dropdown
        this.invoiceModelDropdown = page.locator("(//div[@role='combobox'])[3]");

        // 5. Invoice model options
        this.ratnamInvoicingOption = page.locator("(//li[normalize-space()='Ratnam Invoicing'])[1]");
        this.ratnamAccountancyOption = page.locator("(//li[normalize-space()='Ratnam Accountancy'])[1]");

        // 6 & 7. Driver expectations for each model
        this.firstDriverInvoicing = page.locator("//span[normalize-space()='Newtree next']");
        this.firstDriverAccountancy = page.locator("//span[normalize-space()='Ethan Hunt']");

        // 8. Driver search field
        this.driverSearchField = page.locator("//input[@placeholder='Search and select driver by name...']");

        // 9. Driver checkbox - the driver search result row renders last among the
        // checkboxes on this panel (VAT, then Select All, then the matched driver row).
        // A hardcoded index here broke once the visible checkbox count changed.
        this.driverCheckbox = page.locator("input[type='checkbox']").last();

        // 10. Add button
        this.addButton = page.locator("//button[normalize-space()='Add']");

        this.rateCardTab = page.locator("//button[normalize-space()='Rate Card']");

        // 2. Add New Rate Card button
        this.addNewRateCardBtn = page.locator("//button[normalize-space()='Add New Rate Card']");

        // 3. Rate Card name input
        this.rateCardNameInput = page.locator("input[name='name']");

        // 4. Hours input
        this.hoursInput = page.locator("input[name='hours']");

        // 5. Select Role dropdown (for both main and deduction section)
        this.selectRoleDropdown = page.locator("(//div[@class='MuiBox-root css-1aijnf2'])[1]");

        // 6. 'super' role option
        this.superRoleOption = page.locator("(//span[normalize-space()='super'])[1]");

        this.selectRoleDropdown1 = page.locator("(//div[@class='MuiBox-root css-1aijnf2'])[2]");

        // 6. 'super' role option
        this.superRoleOption1 = page.locator("(//span[normalize-space()='super'])[1]");

        // 7. Rate field
        this.rateField = page.locator("input[name='rules.0.rate']");

        // 8. Income field
        this.incomeField = page.locator("input[name='rules.0.income']");

        // 9. Add New Deduction button
        this.addNewDeductionBtn = page.locator("//span[normalize-space()='Add New Deduction']");

        // 10. Deduction name input
        this.deductionNameInput = page.locator("input[name='deductions.0.deductionName']");

        // 13. Deduction rate input
        this.deductionRateInput = page.locator("input[name='deductions.0.rules.0.deductionRate']");

        // 14. Checkbox
        this.checkbox = page.locator("//input[@type='checkbox']");

        // 15. Final Add button
        this.finalAddBtn = page.locator("//button[normalize-space()='Add']");

        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
        // Label shows even though the row is not actually disabled (known bug -
        // CSV: assigned drivers can still be reassigned instead of being blocked).
        this.driverAlreadyAssignedIndicator = page.getByLabel('Driver is already assigned to');

        this.copyAdminFeeRateBtn = page.locator("xpath=(//li[normalize-space(.)='Copy to Depot'])[1]");

        this.selectDepotDropdown = page.locator("xpath=(//span[normalize-space(.)='Select depots'])[1]");
        this.depotSelector = page.locator("(//div[@role='combobox'])[2]")

        this.depotOption = page.locator("xpath=(//input[@type='checkbox'])[1]");

        this.proceedButton = page.locator("xpath=(//button[normalize-space()='Proceed'])[1]");

        this.addRateCardToDepot = page.locator("(//button[normalize-space()='Add'])[1]")

        this.rateCardSelectDepot = page.locator("(//li[normalize-space()='Amazon Nexus Depot'])[1]")


        // Tab label is "Admin Payment Settings", not "Payment Settings" - fixed after
        // confirming the mismatch via a fresh codegen recording against staging.
        this.superAdminSettingsTab = page.getByText('Admin Payment Settings');
        this.settingsIcon = page.locator("//button[@aria-label='Settings']");

        // ------------------ DEPOT SELECTION ------------------ //
        this.depotStatusCell = page.getByRole('cell', { name: 'Active' });
        this.selectDepotBtn = page.getByRole('button', { name: 'Select Depot' });

        // ------------------ GENERAL SETTINGS TAB ------------------ //
        this.generalSettingsTab = page.getByRole('tab', { name: 'General Settings' });
        // Pay Day / Arrears dropdown triggers show their *current* value as their only
        // visible text (no stable "Pay Day:" prefix like the Invoicing module has), so
        // callers must pass the current displayed value in - see setPayDay/setArrearsWeeks.
        this.cutOffDayText = page.getByText(/^Cut-Off Day:/).first();
        this.nmwrRateInput = page.getByPlaceholder('Enter NMWR rate');
        this.generalSettingsSaveBtn = page.getByRole('button', { name: 'Save' });

        // ------------------ RATE CARD: ROLE + DRIVER-SPECIFIC OVERRIDES ------------------ //
        this.systemRateCardCheckbox = page.getByRole('checkbox').first();
        this.selectRoleLabel = page.getByText('Select Role', { exact: true });
        this.driverRoleOption = page.getByRole('button', { name: 'Driver', exact: true });
        this.roleRateInput = page.getByPlaceholder('0', { exact: true });
        this.roleIncomeInput = page.getByPlaceholder('0.00');
        this.addUserBtn = page.getByRole('button', { name: 'Add User' });
        this.userSearchInput = page.getByRole('textbox', { name: 'Search...' });
        this.userSearchResultCheckbox = page.getByRole('checkbox');
        this.closeUserPickerBackdrop = page.locator('.MuiBackdrop-root.MuiBackdrop-invisible');
        // Index 1 = the first per-user override row added on top of the role-level rule (index 0).
        this.driverOverrideRateInput = page.locator('input[name="rules.1.rate"]');
        this.driverOverrideIncomeInput = page.locator('input[name="rules.1.income"]');
        this.deductionRoleRateInput = page.locator('input[name="deductions.0.rules.0.deductionRate"]');
        this.deductionDriverOverrideInput = page.locator('input[name="deductions.0.rules.1.deductionRate"]');

    }

    async navigateToSuperAdminSettings(depotName) {

        if (depotName) {
            await this.selectDepot(depotName);
        }
        await this.settingsIcon.click();
        await this.superAdminSettingsTab.click();
        await expect(this.addNewRateBtn).toBeVisible();
        await this.page.waitForTimeout(2000);
    }

    async selectDepot(depotName) {

        await this.depotStatusCell.first().click();
        await this.selectDepotBtn.click();
        await this.page.getByRole('option', { name: depotName }).click();
    }

    getAdminFeeInDriverProfileLocator(rateName) {
        const expectedText = rateName;
        return this.page.getByText(expectedText).first();
    }

    async copyAdminFeeRate(rateName) {
        // Step 1: Search for the admin rate fee
        await this.adminRateSearchInput.fill(rateName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);

        // Step 2: Click on three dots
        await this.adminRateThreeDots.first().click();

        // Step 3: Click copy to depot
        await this.copyAdminFeeRateBtn.click();

        // Step 4: Select depot
        await this.selectDepotDropdown.click();
        await this.depotOption.click();
        await this.page.keyboard.press('Escape');

        // Step 5: Click proceed
        await this.proceedButton.click();
    }

    async copyRateCard(rateCardName) {

        await this.rateCardTab.click();
        await this.adminRateSearchInput.fill(rateCardName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
        await this.adminRateThreeDots.first().click();
        await this.copyAdminFeeRateBtn.click();
        await this.depotSelector.click();
        await this.rateCardSelectDepot.click();
        await this.proceedButton.click();
        await this.page.waitForTimeout(2000);
        await this.addRateCardToDepot.click();
    }


    async addAdminRateFee(rateName, adminFee, enableVAT, model, driverName) {

        await this.addNewRateBtn.click();
        await this.rateNameInput.fill(rateName);

        await this.adminFeeInput.fill(adminFee.toString());

        if (enableVAT) {
            await this.vatCheckbox.check();
        }

        await this.invoiceModelDropdown.click();
        if (model === 'invoicing') {
            await this.ratnamInvoicingOption.click();
            await this.firstDriverInvoicing.waitFor({ state: 'visible' });
        } else {
            await this.ratnamAccountancyOption.click();
            await this.firstDriverAccountancy.waitFor({ state: 'visible' });
        }

        await this.driverSearchField.fill(driverName);
        await this.page.waitForTimeout(2000);
        await this.driverCheckbox.click();
        await this.addButton.click();

        await this.navigateToDrivers.click();
        await this.driversScreenSearch.fill(driverName);
        await this.navigateToDriverProfile.click();

        const expectedText = `${rateName}`;
        const adminFeeInDriverProfile = this.getAdminFeeInDriverProfileLocator(expectedText);
        await adminFeeInDriverProfile.waitFor({ state: 'visible' });
    }


    async addRateCard(name, hours, rate, income, deductionName, deductionRate) {

        await this.rateCardTab.click();
        await this.addNewRateCardBtn.click();

        await this.rateCardNameInput.fill(name);

        if (hours > 24) throw new Error("❌ Hours value cannot exceed 24");
        await this.hoursInput.fill(hours.toString());

        await this.selectRoleDropdown.click();
        await this.superRoleOption.click();

        await this.rateField.fill(rate.toString());
        await this.incomeField.fill(income.toString());

        await this.addNewDeductionBtn.click();
        await this.deductionNameInput.fill(deductionName);

        await this.deductionRateInput.fill(deductionRate.toString());

        await this.checkbox.check();
        await this.finalAddBtn.click();

        await this.selectRoleDropdown1.click();
        await this.superRoleOption.click();

        await this.finalAddBtn.click();


        await this.page.waitForTimeout(2000); // optional small wait
    }

    async deleteRateCard(rateCardName) {

        await this.page.waitForTimeout(2000);

        await this.rateCardTab.click();
        // Step 1: Search for the rate card
        await this.adminRateSearchInput.fill(rateCardName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);

        // Step 2: Click on three dots
        await this.adminRateThreeDots.first().click();
        await this.deleteOption.click();
        await this.confirmYesBtn.click();

        // Step 3: Expect success message
        await this.page.waitForSelector("//div[contains(text(),'Rate card deleted successfully')]");
        await expect(this.successDeleteMsg).toBeVisible();
    }

    async deleteAdminRateFee(rateName) {
        // Step 1: Search for the admin rate fee
        await this.adminRateSearchInput.fill(rateName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);

        await this.adminRateThreeDots.first().click();

        await this.deleteOption.click();

        await this.confirmYesBtn.click();

        const isBlocked = await this.deleteBlockedMsg.isVisible();

        if (isBlocked) {
            console.log('Deletion blocked — unlinking drivers...');
            // Step 6: Search again
            await this.adminRateSearchInput.fill(rateName);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(2000);

            // Step 7: Click three dots
            await this.adminRateThreeDots.first().click();

            // Step 8: Click edit
            await this.editOption.click();

            // Step 9: Uncheck checkbox
            const isChecked = await this.unlinkCheckbox.isChecked();
            if (isChecked) await this.unlinkCheckbox.uncheck();

            // Step 10: Click update
            await this.updateBtn.click();
            await this.page.waitForTimeout(2000);

            // Step 11: Delete again
            await this.adminRateSearchInput.fill(rateName);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(2000);
            await this.adminRateThreeDots.first().click();
            await this.deleteOption.click();
            await this.confirmYesBtn.click();
        }

        // Step 12: Expect success message
        await this.page.waitForSelector("//div[contains(text(),'Admin Rate fee deleted successfully')]");
        await expect(this.successDeleteMsg).toBeVisible();
    }

    // Test 3: deleting an admin fee rate that still has a driver assigned is blocked.
    async verifyDeleteBlockedForAssignedAdminFee(rateName) {

        await this.adminRateSearchInput.fill(rateName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
        await this.adminRateThreeDots.first().click();
        await this.deleteOption.click();
        await this.confirmYesBtn.click();
        await expect(this.deleteBlockedMsg).toBeVisible();
    }

    // Test 5: searching a driver already assigned to another fee shows the
    // already-assigned indicator (see constructor comment re: known bug).
    async searchAlreadyAssignedDriver(driverSearchTerm) {

        await this.addNewRateBtn.click();
        await this.invoiceModelDropdown.click();
        await this.ratnamInvoicingOption.click();
        await this.driverSearchField.fill(driverSearchTerm);
        await expect(this.driverAlreadyAssignedIndicator).toBeVisible();
        await this.cancelBtn.click();
    }

    // Test 6: cancelling an admin fee rate edit discards changes and closes the panel.
    async cancelAdminFeeRateEdit(rateName) {

        await this.adminRateSearchInput.fill(rateName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
        await this.adminRateThreeDots.first().click();
        await this.editOption.click();
        await this.cancelBtn.click();
        await expect(this.addNewRateBtn).toBeVisible();
    }

    // Test 7: create a system rate card via the "system" checkbox.
    async addSystemRateCard(name) {

        await this.rateCardTab.click();
        await this.addNewRateCardBtn.click();
        await this.systemRateCardCheckbox.check();
        await this.rateCardNameInput.fill(name);
        await this.finalAddBtn.click();
    }

    // Tests 8-10: role-based rate, a per-driver rate override on top of it, and a
    // per-driver override on a deduction. These three are not independently reachable
    // (each depends on the previous step's state), so they're modelled as one flow.
    async addRateCardWithDriverOverride({
        name, hours, roleRate, roleIncome,
        driverSearchTerm, driverOverrideRate, driverOverrideIncome,
        deductionName, deductionRoleRate, deductionDriverOverrideRate,
    }) {

        await this.rateCardTab.click();
        await this.addNewRateCardBtn.click();
        await this.rateCardNameInput.fill(name);
        await this.hoursInput.fill(hours.toString());

        // Test 8: role-based rate
        await this.selectRoleLabel.click();
        await this.driverRoleOption.click();
        await this.roleRateInput.fill(roleRate.toString());
        await this.roleIncomeInput.fill(roleIncome.toString());

        // Test 9: per-driver rate override. "Add User" only adds a row with a
        // "Select Users" trigger - it must be clicked separately to open the search box.
        await this.addUserBtn.first().click();
        await this.page.getByText('Select Users', { exact: true }).first().click();
        await this.userSearchInput.fill(driverSearchTerm);
        await this.userSearchResultCheckbox.first().check();
        await this.closeUserPickerBackdrop.click();
        await this.driverOverrideRateInput.fill(driverOverrideRate.toString());
        await this.driverOverrideIncomeInput.fill(driverOverrideIncome.toString());

        // Test 10: deduction with role rate + per-driver override
        await this.addNewDeductionBtn.click();
        await this.deductionNameInput.fill(deductionName);
        await this.selectRoleLabel.click();
        await this.driverRoleOption.click();
        await this.deductionRoleRateInput.fill(deductionRoleRate.toString());

        await this.addUserBtn.nth(1).click();
        await this.page.getByText('Select Users', { exact: true }).last().click();
        await this.userSearchInput.fill(driverSearchTerm);
        await this.userSearchResultCheckbox.first().check();
        await this.closeUserPickerBackdrop.click();
        await this.deductionDriverOverrideInput.fill(deductionDriverOverrideRate.toString());

        await this.finalAddBtn.click();
    }

    // Test 11: change Pay Day. currentDay must match what's currently displayed -
    // the dropdown trigger has no stable label to search by otherwise.
    async setPayDay(currentDay, newDay) {

        await this.generalSettingsTab.click();
        await this.page.getByText(currentDay, { exact: true }).click();
        await this.page.getByRole('option', { name: newDay, exact: true }).click();
    }

    // Test 12: change Arrears weeks. Same currentValue caveat as setPayDay.
    async setArrearsWeeks(currentWeeks, newWeeks) {

        await this.generalSettingsTab.click();
        await this.page.getByText(currentWeeks, { exact: true }).click();
        await this.page.getByRole('option', { name: newWeeks, exact: true }).click();
    }

    // Test 13: read the Cut-Off Day display text.
    async getCutOffDayText() {

        await this.generalSettingsTab.click();
        return (await this.cutOffDayText.textContent())?.trim();
    }

    // Test 14: set the NMWR rate and save General Settings.
    async setNmwrRateAndSave(rate) {

        await this.generalSettingsTab.click();
        await this.nmwrRateInput.fill(rate.toString());
        await this.generalSettingsSaveBtn.click();
    }

    async verifySystemRateCardIsNotEditable(systemRateCardName) {

        await this.rateCardTab.click();

        await this.adminRateSearchInput.fill(systemRateCardName);
        await this.page.keyboard.press('Enter');

        const rateRow = this.page.getByRole('row', {
            name: new RegExp(systemRateCardName, 'i')
        });
        await expect(rateRow).toBeVisible({ timeout: 10000 });


        const threeDots = rateRow.locator('//div[@data-field="actions"]//button').first();

        await expect(threeDots).toBeDisabled();

        await threeDots.locator('xpath=..').hover();

        const tooltip = this.page.locator('[role="tooltip"]');
        await expect(tooltip).toContainText("System rate cards");
    }


}




module.exports = { SuperAdminSettings };
