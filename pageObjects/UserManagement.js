const { faker } = require('@faker-js/faker');
const { test, expect } = require('@playwright/test');

class UserManagement {


    /**
  * @param {import('@playwright/test').Page} page
  */

    constructor(page) {

        this.page = page;
        this.settingsIcon = page.locator("//button[@aria-label='Settings']");
        this.userManagementTab = page.locator("//p[normalize-space()='User Management']")
        this.addUserButton = page.locator("(//button[normalize-space()='Add New User'])[1]");
        this.emailField = page.locator('input[placeholder="email@example.com"]');
        this.firstNameField = page.locator("input[name='firstName']");
        this.lastNameField = page.locator("input[name='lastName']");
        this.phoneField = page.locator("input[name='contactNumber']");
        this.roleDropdown = page.locator("//div[@id='mui-component-select-roleId']");
        this.selectRoleDSP = page.locator("(//li[@role='option'])[1]"); //DSP on staging
        this.selectRoleOSM = page.locator("(//li[@role='option'])[2]"); //OSM on staging
        this.selectRoleAdmin = page.locator("(//li[@role='option'])[5]"); //Admin on staging
        this.selectRoleDirector = page.locator("(//li[@role='option'])[6]"); //Director on staging
        this.addNewUserSubmitButton = page.locator("//button[@type='submit']");
        this.passwordField = page.locator("input[name='password']");

    }

    async navigateToUserManagement() {

        await this.settingsIcon.click();
        await this.userManagementTab.click();
        await expect(this.addUserButton).toBeVisible();
        await this.page.waitForTimeout(2000);
        await this.addUserButton.click();

    }

    async createDirectorUser() {

        await expect(this.emailField).toBeVisible();
        await this.emailField.fill(faker.internet.email());
        await this.firstNameField.fill(faker.person.firstName());
        await this.lastNameField.fill(faker.person.lastName());
        await this.phoneField.fill(faker.phone.number('5014######'));
        await this.roleDropdown.click();
        await this.selectRoleDirector.click();
        await this.page.keyboard.press('Escape');
        await this.passwordField.fill('admin@123');

    }

    async createDSPUser() {

        await expect(this.emailField).toBeVisible();
        await this.emailField.fill(faker.internet.email());
        await this.firstNameField.fill(faker.person.firstName());
        await this.lastNameField.fill(faker.person.lastName());
        await this.phoneField.fill(faker.phone.number('5014######'));
        await this.roleDropdown.click();
        await this.selectRoleDSP.click();
        await this.page.keyboard.press('Escape');
        await this.passwordField.fill('admin@123');


    }

    async createOSMUser() {

        await expect(this.emailField).toBeVisible();
        await this.emailField.fill(faker.internet.email());
        await this.firstNameField.fill(faker.person.firstName());
        await this.lastNameField.fill(faker.person.lastName());
        await this.phoneField.fill(faker.phone.number('5014######'));
        await this.roleDropdown.click();
        await this.selectRoleOSM.click();
        await this.page.keyboard.press('Escape');
        await this.passwordField.fill('admin@123');


    }

    async createAdminUser() {

        await expect(this.emailField).toBeVisible();
        await this.emailField.fill(faker.internet.email());
        await this.firstNameField.fill(faker.person.firstName());
        await this.lastNameField.fill(faker.person.lastName());
        await this.phoneField.fill(faker.phone.number('5014######'));
        await this.roleDropdown.click();
        await this.selectAdmin.click();
        await this.page.keyboard.press('Escape');
        await this.passwordField.fill('admin@123');



    }

    async AddUserBtn() {
        await this.addUserButton.click();
    }
}

module.exports = { UserManagement };