exports.config = {
    runner: 'local',
    specs: [
         //    './mobile-tests/driverCheckIn.spec.js',
       './mobile-tests/submitAccidentForms.spec.js' // <-- Add your second spec here
    ], maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Pixel_5_API_36',
        'appium:app': '/home/affan/Downloads/com.samonboard-v60(2.0.6)-osm-staging.apk',
        'appium:autoGrantPermissions': true
    }],
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec'],
    services: ['appium'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 600000
    },
    hostname: 'localhost',
    port: 4723,
    path: '/'
};