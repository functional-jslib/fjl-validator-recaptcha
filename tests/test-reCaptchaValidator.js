import {expect, assert} from 'chai';
import {
    toReCaptchaOptions,
    reCaptchaIOValidator
    // makeReCaptchaRequest,
    // MISSING_INPUT_SECRET,
    // INVALID_INPUT_SECRET,
    // MISSING_INPUT_RESPONSE,
    // INVALID_INPUT_RESPONSE,
    // UNKNOWN_ERROR,
    // toReCaptchaTestValue,
} from '../src/reCaptchaValidator';

import {log, runHasPropTypes} from './utils';
import puppeteer from 'puppeteer';

let browser;

jest.setTimeout(34000);

describe ('reCaptchaValidator', function () {

    beforeAll(async () => {
        browser = await puppeteer.launch();
    });

    describe ('#toReCaptchaOptions', function () {
        [{}, undefined].forEach(value => {
            runHasPropTypes([
                [Object, 'requestOptions', [{}, false]]
            ], toReCaptchaOptions(value));
        });
    });

    describe ('#reCaptchaIOValidator', function () {

        const messagesTemplatesForTests = toReCaptchaOptions().messageTemplates,
            browserUserAgentString = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
                'Ubuntu Chromium/60.0.3112.113 Chrome/60.0.3112.113 Safari/537.36';

        test ('should return a "success" ({result: true, ...}) validation result when `secret` and ' +
            '`g-recaptcha-response` are well-formed', function (done) {
            const anchorName = '.rc-anchor-content';
            return browser.newPage()
                .then(page => [page, page.setUserAgent(browserUserAgentString)])
                .then(([page]) => page.goto('http://localhost:3000/test-recaptcha-validator.html'))
                .then(([page]) => page.waitFor(3000))
                .then(page => [page, page.mainFrame().childFrames().shift()])
                .then(([page, recaptchaFrame]) => recaptchaFrame.waitFor(anchorName))
                .then(([page, recaptchaFrame]) => [page, recaptchaFrame.$(anchorName)])
                .then(([page, $anchor]) => [page, $anchor.click()])
                .then(([page]) => page.waitFor(3000))
                .then(page => [page, page.screenshot({path: 'example.png'})])
                .then(([page]) => [page, page.click('input[type="submit"]')])
                .then(([page]) => page.waitFor(3000))
                .then(page => page.screenshot({path: 'example2.png'}))
                .then(() => browser.close())
                .then(done)
                .catch(log);
        });

        test ('should return a "failure" validation result when `secret` is malformed')/*, function () {

        });*/
    });

});

// dumpFrameTree(page.mainFrame(), '');
// function dumpFrameTree(frame, indent) {
//     console.log(indent + frame.url());
//     for (let child of frame.childFrames())
//         dumpFrameTree(child, indent + '  ');
// }