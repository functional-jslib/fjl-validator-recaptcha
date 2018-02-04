import * as instance from '../src/reCaptchaValidator';
import {expect} from 'chai';

describe ('fjl-validator-recaptcha', function () {
    test ('should have reached this point with no errors', function () {
        expect(!!instance).to.equal(true);
    });
});
