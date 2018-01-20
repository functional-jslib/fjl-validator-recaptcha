/**
 * Created by elydelacruz on 6/10/16.
 */
import {https} from 'https';
import {queryString} from 'querystring';

import {defineEnumProps$} from 'fjl-mutable';
import {getErrorMsgByKey, toValidationOptions} from 'fjl-validator';
import {assignDeep} from 'fjl';

const toReCaptchaOptions = options =>
        toValidationOptions(
            defineEnumProps$([
                    [String, 'secret'],
                    [String, 'remoteip'],
                    [String, 'response'],
                    [Boolean, 'async', true],
                    [Object, 'requestOptions']
                ], assignDeep({
                    requestOptions: {
                        host: 'www.google.com',
                        path: '/recaptcha/api/siteverify',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        }
                    },
                    messageTemplates: {
                        'invalid-submission': 'The submitted recaptcha submission is invalid/did-not-pass-validation.',
                        'missing-input-secret': 'The secret parameter is missing.',
                        'invalid-input-secret': 'The secret parameter is invalid or malformed.',
                        'missing-input-response': 'The response parameter is missing.',
                        'invalid-input-response': 'The response parameter is invalid or malformed.',
                        'unknown-error': 'Unknown error.'
                    }
                }, options)
            )
        ),

    reCaptchaValidator = (options, value) => {
        const ops = reCaptchaOptions(options);
        return makeReCaptchaRequest(ops, value);
    },

    makeReCaptchaRequest = (options, value) => {
        if (!(options.secret && options.response)) {
            throw new Error('Ensure that `secret` and `response` properties are properly set.');
        }

        const {requestOptions} = options,
            result = false,
            messages = [];

        let unknownErrorKey = 'unknown-error',
            serializedRequestParams = queryString.stringify(requestOptions),
            request;

        // Set content-length header
        requestOptions.headers['Content-Length'] = serializedRequestParams.length;

        // Make request
        return (new Promise((resolve, reject) => {
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
                        resolve(true);
                    }

                    // Add error message(s)
                    if (options.messageTemplates.hasOwnProperty(errorCode)) {
                        getErrorMessageByKey(options, errorCode, value);
                    }
                    else {
                        getErrorMessageByKey(options, unknownErrorKey, value);
                    }
                    reject(options.messages, options.errorCodes);
                });
            });
            request.on('error', err => {
                options.messages.push(err);
                reject(options.messages, unknownErrorKey);
            });
            request.write(serializedRequestParams, 'utf8');
            request.end();
        }));
    };
