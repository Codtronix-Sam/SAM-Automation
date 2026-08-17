class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(email, password) {
    await this.emailInput.fill(process.env.LOGIN_EMAIL);
    await this.passwordInput.fill(process.env.LOGIN_PASSWORD);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
