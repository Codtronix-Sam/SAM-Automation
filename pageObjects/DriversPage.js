const { test, expect } = require('@playwright/test');

class DriversPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.driverModuleLink = page.locator('div[aria-label="My Drivers"]');
    this.activeTab = page.locator("//p[normalize-space()='Active Drivers']");
    this.onboardingTab = page.locator("//p[normalize-space()='Onboarding Drivers']");
    this.inactiveTab = page.locator("(//p[normalize-space()='Inactive Drivers'])[1]");
    this.filterButton = page.locator("//button[normalize-space()='Filters']");
    this.customerDropdown = page.locator("(//div[@role='combobox'])[2]");
    this.depotDropdown = page.locator("(//div[@role='combobox'])[3]");
    this.modelNameDropdown = page.locator("(//div[@role='combobox'])[4]");
    this.driverCountText = page.locator("text=17 Drivers");
    this.customerFilterLabel = page.locator("//span[normalize-space()='Customer Name: Amazon']");
    this.driverSearchField = page.locator('input[placeholder="Search name or email"]');
    this.firstCell = page.locator('(//div[@role="cell"])[1]');
    this.addNewDriver = page.locator("//button[normalize-space()='Add new Driver']");
    this.driverEmail = page.locator("input[placeholder='email@example.com']");
    this.driverFName = page.locator("input[placeholder='First Name']");
    this.driverLName = page.locator("input[placeholder$='Last Name']");
    this.driverContact = page.locator("input[placeholder$='Contact No.']");
    this.customerAmazaon = page.locator("//div[@role='button'][normalize-space()='Amazon']");
    this.depotDropDown = page.locator("//div[@id='mui-component-select-depotId']");
    this.selectDepot = page.locator("//li[normalize-space()='Amazon Express Depot']");
    this.roleDD = page.locator("//div[@id='mui-component-select-roleId']"); // after this press enter button then click anywhere outside to close the DD
    this.inviteUserBtn = page.locator('button[type="submit"]');
    this.verifyDriverCreation = page.locator("(//div[contains(text(),'New user added successfully.')])[1]");
    this.verticalIcon = page.locator('svg[data-testid="MoreVertIcon"]');
    this.viewDriverProfile = page.locator("//p[normalize-space()='View Driver Profile']");
    this.OTPTest = page.locator("//p[normalize-space()='OTP']/following-sibling::p[1]");

    this.approveBtn = page.locator("(//button[@type='button'][normalize-space()='Approve'])[1]");
    this.approveBtn2 = page.locator(
      "(//button[@type='button' and normalize-space()='Approve'])[2] | (//button[@type='button' and normalize-space()='Approve'])[1]"
    );



  }

  getCustomerOption(optionText) {
    return this.page.locator(`//li[@role='option' and text()='${optionText}']`);
  }

  getDepotOption(depotOptionText) {
    return this.page.locator(`//li[@role='option' and text()='${depotOptionText}']`);
  }

  getModelOption(modelOptionText) {
    return this.page.locator(`//li[@role='option' and text()='${modelOptionText}']`);
  }

  async approveDocs() {

    await this.approveBtn.click();
    await this.approveBtn2.click();
  }

  async getOtpFromDriverProfile() {
    const otp = await this.OTPTest.textContent();
    return otp.trim();
  }

  async createDriver(email, fName, lName, contactNumber) {

    await this.addNewDriver.click();
    await this.driverEmail.fill(email);
    await this.driverFName.fill(fName);
    await this.driverLName.fill(lName);
    await this.driverContact.fill(contactNumber);
    await this.customerAmazaon.click();
    await this.depotDropDown.click();
    await this.selectDepot.click();
    await this.roleDD.click();
    await this.page.keyboard.press('Enter');
    await this.page.keyboard.press('Escape');
    await this.inviteUserBtn.click();

  }

  async navigateToCreatedDriverProfile(email) {

    await this.onboardingTab.click();
    await this.driverSearchField.fill(email);
    await this.verticalIcon.click();
    await this.viewDriverProfile.click();
  }

  async verifyDriverAdded() {

    await expect(this.verifyDriverCreation).toBeVisible();
  }

  async verifyDriverSearch(driverName) {

    await expect(this.firstCell).toContainText(driverName);
  }

  async driverSearch(driverName) {

    await this.driverSearchField.fill(driverName);
  }

  async gotoDriversModule() {
    await this.driverModuleLink.click();
  }

  async switchToActiveDrivers() {
    await this.activeTab.click();
  }

  async switchToOnboardingDrivers() {
    await this.onboardingTab.click();
  }

  async switchToInactiveDrivers() {
    await this.inactiveTab.click();
  }

  async filterByCustomer(customerName) {
    await this.filterButton.click();
    await this.customerDropdown.click();
    await this.getCustomerOption(customerName).click();
    await this.page.keyboard.press('Escape');
  }

   async filterByDepot(depotName) {
    await this.filterButton.click();
    await this.depotDropdown.click();
    await this.getDepotOption(depotName).click();
    await this.page.keyboard.press('Escape');
  }

  async filterByModel(modelName) {
    await this.filterButton.click();
    await this.modelNameDropdown.click();
    await this.getModelOption(modelName).click();
    await this.page.keyboard.press('Escape');
  }

  async verifyFilterAppliedCustomer(expectedText, expectedTag) {
    await this.page.waitForSelector(`text=${expectedText}`);
    await this.page.waitForSelector(`//span[normalize-space()='${expectedTag}']`);
  }

  async verifyFilterAppliedDepot(expectedText, expectedTag) {
    await this.page.waitForSelector(`text=${expectedText}`);
    await this.page.waitForSelector(`//span[normalize-space()='${expectedTag}']`);
  }

  async verifyFilterAppliedModel(expectedText, expectedTag) {
    await this.page.waitForSelector(`text=${expectedText}`);
    await this.page.waitForSelector(`//span[normalize-space()='${expectedTag}']`);
  }
}

module.exports = { DriversPage };
