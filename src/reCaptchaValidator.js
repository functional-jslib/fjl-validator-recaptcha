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
import https from 'https';
import querystring from 'querystring';
import {defineEnumProps$} from 'fjl-mutable';
import {getErrorMsgByKey, toValidationResult, toValidationOptions, defaultValueObscurator} from 'fjl-validator';
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
        toValidationOptions (
            defineEnumProps$([
                [String, 'secret'],
                [String, 'remoteip'],
                [Boolean, 'async', true],
                [Object, 'requestOptions', {
                    host: 'www.google.com',
                    path: '/recaptcha/api/siteverify',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }],
                // [Object, 'messageTemplates'],
                // [Boolean, 'valueObscured', false],
                // [Function, 'valueObscurator', defaultValueObscurator]
            ], {} ),
            assignDeep({
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
        const messages = [];

        if (!value) {
            messages.push(getErrorMsgByKey(options, MISSING_INPUT_RESPONSE, value));
        }
        else if (!options.secret) {
            messages.push(getErrorMsgByKey(options, MISSING_INPUT_SECRET, value));
        }
        if (messages.length) {
            return Promise.resolve(toValidationResult({result: false, messages}))
        }

        const formParams = {secret: options.secret, remoteip: options.remoteip, response: value},
            {requestOptions} = options,
            serializedParams = querystring.stringify(formParams);

        // Set content-length header
        requestOptions.headers['Content-Length'] = serializedParams.length;
        requestOptions.body = serializedParams;

        // Make request
        return (new Promise((resolve, reject) => {
            const validationResult = toValidationResult(),
                request = https.request(requestOptions, response => {
                    let body = '';
                    response.setEncoding('utf8');
                    response.on('data', chunk => {
                        body += chunk;
                    });
                    response.on('end', () => {
                        let responseData = JSON.parse(body),
                            errorCodes = responseData['error-codes'],
                            hasErrorCodes = !!errorCodes && !!errorCodes.length,
                            normalizedErrorCodes = hasErrorCodes ? errorCodes.map(x => x.toLowerCase()) : [],
                            nonEmptyErrorCodes = [];

                        // If validation failed (false, null, undefined)
                        if (!isEmpty(responseData.success)) {
                            validationResult.result = true;
                            return resolve(validationResult);
                        }

                        if (hasErrorCodes) {
                            // Add error message(s)
                            nonEmptyErrorCodes =
                                normalizedErrorCodes.filter(code =>
                                    options.messageTemplates.hasOwnProperty(code));

                            // Get error messages
                            if (!nonEmptyErrorCodes.length) {
                                messages.push(getErrorMsgByKey(options, UNKNOWN_ERROR, value));
                            }

                            // Else add 'unknown error' error message
                            else {
                                nonEmptyErrorCodes.forEach(code =>
                                    messages.push(getErrorMsgByKey(options, code, value)));
                            }
                        }
                        else {
                            messages.push(getErrorMsgByKey(options, UNKNOWN_ERROR, value));
                        }

                        // Set failure results
                        validationResult.result = false;
                        validationResult.messages = messages;
                        reject(validationResult, nonEmptyErrorCodes);
                    });
                });
            request.on('error', err => {
                messages.push(err);
                validationResult.messages = messages;
                validationResult.result = false;
                reject(validationResult, err);
            });
            request.write(serializedParams, 'utf8');
            request.end();
        }));
    };
