const instance = require('../dist/cjs/reCaptchaValidator');

describe ('fjl-validator-recaptcha', function () {
    test ('should have reached this point with no errors', function () {
        expect(!!instance).toEqual(true);
    });
});
