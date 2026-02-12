import { test } from '@playwright/test';
import LoginPage from '../pageObjects/logincheck.js';

test('User can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto('https://www.saucedemo.com/');
    await loginPage.login('standard_user', 'secret_sauce');
});