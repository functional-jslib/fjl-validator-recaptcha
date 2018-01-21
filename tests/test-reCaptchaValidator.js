import {expect, assert} from 'chai';
import {
    toReCaptchaOptions,
    reCaptchaIOValidator,
    makeReCaptchaRequest,
    INVALID_SUBMISSION,
    MISSING_INPUT_SECRET,
    INVALID_INPUT_SECRET,
    MISSING_INPUT_RESPONSE,
    INVALID_INPUT_RESPONSE,
    UNKNOWN_ERROR,
} from '../src/reCaptchaValidator';

import {recaptchaKeys} from '../package.json';

import {log, jsonClone, runHasPropTypes} from './utils';

log('Received recaptcha keys: ', recaptchaKeys);

describe ('reCaptchaValidator', function () {
    describe ('#toReCaptchaOptions', function () {
        describe ('properties', function () {
            [{}, undefined].forEach(value => {
                runHasPropTypes([
                    [String, 'secret', ['hello', 99]],
                    [String, 'remoteip', ['hello', false]],
                    [String, 'response', ['hello', false]],
                    [Boolean, 'async', [false, '']],
                    [Object, 'requestOptions', [{}, false]],
                    [Object, 'messageTemplates', [{}, false]]
                ], toReCaptchaOptions(value));
            });
        });
    });

    describe ('#makeReCaptchaRequest', function () {
        test ('should have more tests');
    });

    describe ('#reCaptchaIOValidator', function () {
        test ('should have more tests');
    });

});
