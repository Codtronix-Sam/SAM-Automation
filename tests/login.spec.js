
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pageObjects/LoginPage');
require('dotenv').config(); 

test.only('User can login and reach dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);

  await expect(page).toHaveURL(`${process.env.BASE_URL}/admin/dashboard`);
});
