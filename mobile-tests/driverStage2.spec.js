const fs = require('fs');
const { remote } = require('webdriverio');


(async () => {
    const { email, otp, password } = JSON.parse(fs.readFileSync('tempDriverData.json', 'utf-8'));

    const driver = await remote({
        port: 4723,
        path: '/',
        capabilities: {
            platformName: "Android",
            "appium:automationName": "UiAutomator2",
            "appium:deviceName": "Pixel 5",
            "appium:app": "/home/affan/Downloads/com.samonboard-v60(2.0.6)-osm-staging (1).apk",
            "appium:autoGrantPermissions": true,
        }
    });

    try {
        console.log(`🚀 Using Email: ${email} and OTP: ${otp}`);
        await driver.pause(5000); // Let the app load completely

        console.log('📋 Dumping initial page source...');
        const source = await driver.getPageSource();
        console.log(source); // Help confirm you're seeing what you expect

        // Step 1: Click Continue
        const continueBtn1 = await driver.$('//android.widget.TextView[@text="Continue"]');
        await continueBtn1.waitForDisplayed({ timeout: 10000 });
        await continueBtn1.click();
        console.log('✅ Clicked first Continue');

        // Step 2: Click "Onboard yourself"
        
        // Step 3: Enter email
        const emailField = await driver.$('//android.widget.EditText[@text="Enter Email"]');
        await emailField.waitForDisplayed({ timeout: 10000 });
        await emailField.setValue(email);

        const passField = await driver.$('//android.widget.EditText[@text="Enter Password"]');
        await passField.waitForDisplayed({ timeout: 10000 });
        await passField.setValue(password);

        const loginBtn = await driver.$('//android.widget.TextView[@text="Login"]');
        await loginBtn.waitForDisplayed({ timeout: 10000 });
        await loginBtn.click();

        const driverHandbook = await driver.$('//android.view.ViewGroup[@content-desc="Driver Handbook"]/com.horcrux.svg.SvgView')
        await driverHandbook.waitForDisplayed({ timeout: 10000});
        await driverHandbook.click();

        await driver.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: 500, y: 1800 },  // start near bottom
                    { type: 'pointerDown', button: 0 },
                    { type: 'pause', duration: 300 },
                    { type: 'pointerMove', duration: 500, x: 500, y: 300 },  // move to top
                    { type: 'pointerUp', button: 0 }
                ]
            }
        ]);

        await driver.releaseActions();
        await driver.pause(1000);

        // Step 4: Enter OTP
        
    } catch (err) {
        console.error("❌ Error during Appium flow:", err);
    } finally {
        await driver.deleteSession();
    }
})();
