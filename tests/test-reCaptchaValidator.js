import {expect, assert} from 'chai';
import {
    toReCaptchaOptions,
} from '../src/reCaptchaValidator';

import {log, runHasPropTypes} from './utils';
import puppeteer from 'puppeteer';

jest.setTimeout(34000);

describe ('reCaptchaValidator', function () {

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
            '`g-recaptcha-response` are well-formed', async (done) => {
            const anchorName = '.rc-anchor-content',
                browser = await puppeteer.launch(),
                page = await browser.newPage();
            await page.setUserAgent(browserUserAgentString);
            await page.goto('http://localhost:3000/test-recaptcha-validator.html');
            await page.waitFor(3000);
            const recaptchaFrame = page.mainFrame().childFrames()[0];
            await recaptchaFrame.waitFor(anchorName);
            const $anchor = await recaptchaFrame.$(anchorName);
            await $anchor.click();
            await page.waitFor(3000);
            await page.screenshot({path: 'example.png'});
            await page.click('input[type="submit"]');
            await page.waitFor(3000);
            await page.screenshot({path: 'example2.png'});
            await browser.close();
            done();
        });

        test ('should return a "failure" validation result when `secret` is malformed');

    });

});

// dumpFrameTree(page.mainFrame(), '');
// function dumpFrameTree(frame, indent) {
//     console.log(indent + frame.url());
//     for (let child of frame.childFrames())
//         dumpFrameTree(child, indent + '  ');
// }
