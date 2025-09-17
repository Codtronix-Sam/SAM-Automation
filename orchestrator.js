const fs = require('fs');
const { execSync } = require('child_process');

function runCommand(command, env = {}) {
    execSync(command, {
        stdio: 'inherit',
        env: { ...process.env, ...env },
    });
}

(async () => {
    try {
        console.log("🧪 Starting Playwright - Create Driver");
        runCommand('npx playwright test tests/playwright/createDriver.spec.js');

        const { email, otp } = JSON.parse(fs.readFileSync('tempDriverData.json', 'utf8'));

        console.log("📱 Starting Appium - Onboard Driver");
        runCommand('node tests/appium/driverOnboarding.spec.js');

        console.log("🔁 Resuming Playwright - Approve Docs and More");
        runCommand('npx playwright test tests/playwright/resumeAfterOnboarding.spec.js');

        console.log("📲 Final Appium - Login Driver");
        runCommand('node tests/appium/driverLogin.spec.js', {
            LOGIN_EMAIL: email,
            LOGIN_PASSWORD: '12345678A'
        });

        console.log("✅ Hybrid Flow Complete!");
    } catch (err) {
        console.error("❌ Error during flow:", err);
        process.exit(1);
    }
})();
