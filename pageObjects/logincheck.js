class LoginPage {
        constructor(page) {
            this.page = page;
            this.username = page.locator("input[placeholder = 'Username']");
            this.password = page.locator("input[placeholder = 'Password']");
            this.loginButton = page.locator('[data-test = "login-button"]');
        }


        async login(username, password) {
            await this.username.fill(username);
            await this.password.fill(password);
            await this.loginButton.click();
        }           

    }

module.exports = LoginPage;
// test file

