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
import puppeteer from 'puppeteer';
// import {requestP} from 'request-promise-native';

log('Received recaptcha keys: ', recaptchaKeys);

let browser;

jest.setTimeout(21000);

describe ('reCaptchaValidator', function () {

    beforeAll(async () => {
        browser = await puppeteer.launch();
    });

    describe ('#toReCaptchaOptions', function () {
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

    describe ('#makeReCaptchaRequest', function () {
        test ('should have more tests', async function () {
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/60.0.3112.113 Chrome/60.0.3112.113 Safari/537.36')
            await page.goto('http://localhost:3000/test-recaptcha-validator.html');
            await page.waitFor(3000);
            const anchorName = '.rc-anchor-content',
                recaptchaUiFrame = page.mainFrame().childFrames().shift();
            await recaptchaUiFrame.waitFor(anchorName);
            const $anchor = await recaptchaUiFrame.$(anchorName);
            await $anchor.click();
            await page.waitFor(3000);
            await page.screenshot({path: 'example.png'});
            await page.click('input[type="submit"]');
            await page.waitFor(3000);
            await page.screenshot({path: 'example2.png'});
            // dumpFrameTree(page.mainFrame(), '');
            //
            // function dumpFrameTree(frame, indent) {
            //     console.log(indent + frame.url());
            //     for (let child of frame.childFrames())
            //         dumpFrameTree(child, indent + '  ');
            // }
            await browser.close();
            // makeReCaptchaRequest(toReCaptchaOptions({
            //     secret: recaptchaKeys.secret
            // }))
        });
    });

    describe ('#reCaptchaIOValidator', function () {
        test ('should have more tests');
    });

});
