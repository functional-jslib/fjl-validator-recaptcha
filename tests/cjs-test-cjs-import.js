const instance = require('../dist/cjs/reCaptchaValidator');
const {expect} = require('chai');

describe ('fjl-validator-recaptcha', function () {
    test ('should have reached this point with no errors', function () {
        expect(!!instance).to.equal(true);
    });
});
