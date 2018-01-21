/**
 * Created by elydelacruz on 6/10/16.
 * @recaptchaVersion v2
 * @reference see below:
 * @see https://developers.google.com/recaptcha/docs/
 * @see https://developers.google.com/recaptcha/docs/verify
 * @notes:
 * The response is a JSON object, for reCAPTCHA V2 and invisible reCAPTCHA:
 * ```
 * {
 *   "success": true|false,
 *   "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
 *   "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
 *   "error-codes": [...]        // optional
 * }
 * ```
 */
import {https} from 'https';
import {queryString} from 'querystring';
import {defineEnumProps$} from 'fjl-mutable';
import {getErrorMsgByKey, toValidationResult, defaultValueObscurator} from 'fjl-validator';
import {assignDeep, isEmpty} from 'fjl';

export const

    INVALID_SUBMISSION = 'invalid-submission',
    MISSING_INPUT_SECRET = 'missing-input-secret',
    INVALID_INPUT_SECRET = 'invalid-input-secret',
    MISSING_INPUT_RESPONSE = 'missing-input-response',
    INVALID_INPUT_RESPONSE = 'invalid-input-response',
    BAD_REQUEST = 'bad-request',
    UNKNOWN_ERROR = 'unknown-error',

    toReCaptchaOptions = options =>
        defineEnumProps$([
                [String, 'secret'],
                [String, 'remoteip'],
                [String, 'response'],
                [Boolean, 'async', true],
                [Object, 'requestOptions', {
                    host: 'www.google.com',
                    path: '/recaptcha/api/siteverify',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }],
                [Object, 'messageTemplates', {}],
                [Boolean, 'valueObscured', false],
                [Function, 'valueObscurator', defaultValueObscurator]
            ], assignDeep({
                messageTemplates: {
                    [INVALID_SUBMISSION]: 'The submitted recaptcha submission is invalid/did-not-pass-validation.',
                    [MISSING_INPUT_SECRET]: 'The secret parameter is missing.',
                    [INVALID_INPUT_SECRET]: 'The secret parameter is invalid or malformed.',
                    [MISSING_INPUT_RESPONSE]: 'The response parameter is missing.',
                    [INVALID_INPUT_RESPONSE]: 'The response parameter is invalid or malformed.',
                    [BAD_REQUEST]: 'Bad request',
                    [UNKNOWN_ERROR]: 'Unknown error.'
                }
            }, options || {})
        ),

    reCaptchaIOValidator = (options, value) => {
        const ops = toReCaptchaOptions(options);
        return makeReCaptchaRequest(ops, value);
    },

    makeReCaptchaRequest = (options, value) => {
        if (!(options.secret && options.response)) {
            throw new Error('Ensure that `secret` and `response` ' +
                'properties are properly set.');
        }

        const {requestOptions} = options,
            serializedRequestParams = queryString.stringify(requestOptions);

        // Set content-length header
        requestOptions.headers['Content-Length'] = serializedRequestParams.length;

        // Make request
        return (new Promise((resolve, reject) => {
            const messages = [],
                validationResult = toValidationResult({value}),
                request = https.request(requestOptions, response => {
                    let body = '';
                    response.setEncoding('utf8');
                    response.on('data', chunk => {
                        body += chunk;
                    });
                    response.on('end', () => {
                        let responseData = JSON.parse(body),
                            errorCode = responseData['error-codes'];

                        errorCode = errorCode ? errorCode.toLowerCase() : null;

                        // If validation failed (false, null, undefined)
                        if (!isEmpty(responseData.success)) {
                            validationResult.result = true;
                            resolve(validationResult);
                        }

                        // Add error message(s)
                        if (options.messageTemplates.hasOwnProperty(errorCode)) {
                            messages.push(getErrorMessageByKey(options, errorCode, value));
                        }
                        else {
                            messages.push(getErrorMessageByKey(options, UNKNOWN_ERROR, value));
                        }
                        validationResult.result = false;
                        validationResult.messages = messages;
                        reject(validationResult, errorCode);
                    });
                });
            request.on('error', err => {
                validationResult.messages.push(err);
                validationResult.result = false;
                reject(validationResult, err);
            });
            request.write(serializedRequestParams, 'utf8');
            request.end();
        }));
    };
