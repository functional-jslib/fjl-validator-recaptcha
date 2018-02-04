[![Build Status](https://travis-ci.org/functional-jslib/fjl-validator-recaptcha.png)](https://travis-ci.org/functional-jslib/fjl-validator-recaptcha)
[![GitHub version](https://badge.fury.io/gh/functional-jslib%2Ffjl.svg)](http://badge.fury.io/gh/functional-jslib%2Ffjl)
[![NPM version](https://badge.fury.io/js/fjl-validator-recaptcha.svg)](http://badge.fury.io/js/fjl-validator-recaptcha)
[![Dependencies](https://david-dm.org/functional-jslib/fjl-validator-recaptcha.png)](https://david-dm.org/functional-jslib/fjl-validator-recaptcha)

# fjl-validator-recaptcha
ReCaptchaV2 Validator (for backend (nodejs)).

## In this readme:
- [Importing/Including](#importing-including)
- [Usage](#usage)
- [Docs](#usage)
- [Development](#development)
- [Resources](#resources)
- [License](#license)

## Importing/including:
Currently only es6 import is available though you can always require 'babel-register'
at the top of your page to use the module (cjs exported version coming shortly) or you can also build 
your sources which should build the module into the results.

## Usage:
The library exports several methods but most notably `reCaptchaValidator` and `reCaptchaValidatorV2` are usually the 
ones you'll need.
`reCaptchaValidator` is curried and takes `options` parameter first and `value` parameter second.
`reCaptchaValidatorV2` takes the `value` parameter first and `options` one second (good for the non-functional-programming-style initiates) 
(though note: this version is also curried).

### Callback based:
For callback based usage adapt the "Promised based" examples listed below replacing `reCaptchaValidator` with
 `reCaptchaValidator$` (which is the callback based, un-curried version of `reCaptchaValidator`). 

### Promised based:
#### On backend:

```
import {recaptchValidator} from 'fjl-validator-recaptcha';

// Somewhere in application
// ...

const validator = reCaptchaValidator(null); // If no `options` pass `null` when using curried version 
// (un-curried version is `reCaptchaValidator$` and 'value' first version is `reCaptchaValidatorV2`).

router.post('/test-recaptcha-validator', (req, res) => {
    res.type('application/json');
    return validator({
            secret: 'recaptcha-secret-here', 
            response: req.body['g-recaptcha-response'] 
        })
        .then(
            // Send back result of validation
            result => res.json(result),  // {result {Boolean}, messages {Array}}
            
            // Else, if rejection of promise, send back result of validation
            // And errorCodes for user
            (result, errorCodes) => res.json({result: result, errorCodes})
        );
});
```

**Overriding error messages:**
```
import {
    INVALID_SUBMISSION,
    MISSING_INPUT_SECRET,
    INVALID_INPUT_SECRET,
    MISSING_INPUT_RESPONSE,
    INVALID_INPUT_RESPONSE,
    BAD_REQUEST,
    UNKNOWN_ERROR,
    reCaptchaValidator
}

// Somewhere in application
const recaptchaValidatorOptions = {
        messageTemplates: {
            // Here you override the specific error-code messages you want
             'invalid-submission': 'The submitted recaptcha submission is ' +
                'invalid/did-not-pass-validation.',
             
             // You can optionally use the constants setup internally that 
             //  are mapped to error-codes sent back by the recaptcha service; 
             //  The constants are the same as the error codes except uppercase 
             //  and underscore separated (error codes sent back by recatpcha 
             //  service are dash separated and lowercase).
             [MISSING_INPUT_SECRET]: 'The secret parameter is missing.',
             [INVALID_INPUT_SECRET]: 'The secret parameter is invalid or malformed.',
             [MISSING_INPUT_RESPONSE]: 'The response parameter is missing.',
             [INVALID_INPUT_RESPONSE]: 'The response parameter is ' + 
                'invalid or malformed.',
             [BAD_REQUEST]: 'Bad request',
             [UNKNOWN_ERROR]: 'Unknown error.'
        }
    },

    // Can be used this way because it is curried:    
    myReCaptchaValidator = reCaptchaValidator(recaptchaValidatorOptions);

// Elsewhere in your application,

// Handle your recaptcha
// @see reCaptchaV2 frontend: https://developers.google.com/recaptcha/docs/display
// @see reCaptchaV2 backend: https://developers.google.com/recaptcha/docs/verify

router.post('/some-form-endpoint', (req, res) =>
    // Set returning-response type
    res.type('application/json');

    // Validate recaptcha before validating your form or as part of validating your form
    // ...
    return myReCaptchaValidator({secret, response: req.body['g-recaptcha-response']})
        .then(() => {
            // Handle success of form/re-captcha submission 
            // Return appropriate message(s) to the client
            res.json(...);
        })
        .catch((result, errorCodes) => {
            // Return appropriate message(s) to the client
            res.json(...);
        });
);
    
```

#### On frontend:
On the frontend you'll handle response from the server somewhat like:

**Success response:**  Passing validation result object directly, 'un-altered', from server.
```
{
    "result": true,
    "messages": []
}
```

**Error response (example):** Returning validation result object, with 'errorCodes' key added to it, from server.
```
{
    "result": false,
    "messages": [
        'The secret parameter is invalid or malformed.', 
        'The response parameter is invalid or malformed.'
    ],
    "errorCodes": [...]
}
```

**Handling response on frontend (example):**
```      
// Preamble
const someForm = document.forms['some-form-name'];
// ... 

// Hit some recaptcha validation endpoint on your server or some form submitting service (some contact-form, or the like, kind-of service/endpoint)
fetch('/validate-recaptcha', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'g-recaptcha-response': someForm.elements['g-recaptcha-response']
        })
    })
    .then(res => res.json())
    .then(result => {
        if (!result.result) {
            // Message user about error(s) (`messages` will be an array of message strings)
            result.messages.map(...); // 
        }
        // Else submission/validation of form/or-recaptcha was successful
        else {
            // Show success message to user
        }
    );
```

## Docs
**JSDocs format:**  
[https://functional-jslib.github.io/fjl-validator-recaptcha/](https://functional-jslib.github.io/fjl-validator-recaptcha/)

## Members overview:
This is just an overview of members included in library.  For in-depth docs view 
[jsdocs](https://functional-jslib.github.io/fjl-validator-recaptcha/) version of docs instead:
- `reCaptchaValidator (options, value)` - Makes an IO Request (returns a promise).  Curried.
- `reCaptchaIOValidator (options, value)` - Sames `reCaptchaValidator` just explicitly named.  Curried.
- `reCaptchaValidator$ (options, value, resolve, reject)` - Old style/callback based.  Not curried.
- `reCaptchaIOValidator$ (options, value)` - Same as `reCaptchaIOValidator` but not curried.
- `makeReCaptchaRequest$ (options, value, resolve, reject)` - Used by all `reCaptcha*` methods above 
    (makes the request to recaptchaV2 api).  Not curried.  Old style callback based.
- `toReCaptchaValidatorOptions (options)` - Returns a normalized `reCaptchaValidatorOptions` object.
- `toReCaptchaTestValue (options)` - Returns a normalized `reCaptchaValidatorTestValue` object.

## Development
- Requires `npm install -g forever` - Due to using it for 'travis-ci' automated testing. 
- @see package.json "scripts" sections.
- @note `recaptchaKeys` in package.json are the ones prescribed by recaptcha
team for doing `always true` (response from recaptcha service) testing.

## Resources:
### ReCaptcha Api links:
- reCaptchaV2 frontend docs: https://developers.google.com/recaptcha/docs/display
- reCaptchaV2 backend docs: https://developers.google.com/recaptcha/docs/verify

## License:
BSD 3 Clause ('./LICENSE' file included in repo).
