# fjl-validator-recaptcha
ReCaptchaV2 Validator (for backend (nodejs)).

## Import:
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
For callback based usages adapt the "Promised based" example listed below using `reCaptchaValidator$` which is 
the callback based, un-curried version of `reCaptchaValidator`. 

### Promised based:

```
import {recaptchIOValidator} from 'fjl-validator-recaptcha';

// Somewhere in application
const validator = reCaptchaIOValidator(null); // If no `options` passed null to curried version of validator 
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
            (result, errCodes) => log(jsonClone(result), errCodes)
        );
});
        
    // On frontend, result of validation looks like:
    // If success...
    {
        "result": true,
        "messages": []
    }
    
    // If failure, where "messages" contains error messages mapped by
    // error-codes sent back from google recaptcha validation service (
    //  www.google.com/recaptcha/api/siteverify etc.),
    // to override error messages pass in your own `messageTemplates` 
    // key in the `options` object passed along to `reCaptchaIOValidator`
    {
        "result": false,
        "messages": [
            'The secret parameter is invalid or malformed.', 
            'The response parameter is invalid or malformed.'
        ]
    }
    
    // Overriding error messages with your own
    import {
        INVALID_SUBMISSION,
        MISSING_INPUT_SECRET,
        INVALID_INPUT_SECRET,
        MISSING_INPUT_RESPONSE,
        INVALID_INPUT_RESPONSE,
        BAD_REQUEST,
        UNKNOWN_ERROR,
        reCaptchaIOValidator
    }
    
    // Somewhere in application
    const 
    
        recaptchaValidatorOptions = {
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

        // Can be used this way because `reCaptchaIOValidator` is curried:    
        recaptchaValidator = reCaptchaIOValidator(recaptchaValidatorOptions);
    
    // Elsewhere in your application,
    
    // Handle your recaptcha
    // @see reCaptchaV2 frontend: https://developers.google.com/recaptcha/docs/display
    // @see reCaptchaV2 backend: https://developers.google.com/recaptcha/docs/verify
    const validator = reCaptchaIOValidator(options || null); // If using curried 
    // version of validator (if doesn't end with '$') then null is required
    // (since function being used is the curried version)
    router.post('/some-recaptcha-validation-route', (req, res) => 
        validator({secret, response: req.body['g-recaptcha-response']})
            .then(...)
    );
    
});
```

## Members overview:
This is just an overview for indepth docs view jsdocs here:
- `reCaptchaValidator (options, value, resolve, reject)` - Makes an IO Request (returns a promise).  Curried.
- `reCaptchaIOValidator (options, value, resolve, reject)` - Sames `reCaptchaValidator` just explicitly named.  Curried.
- `reCaptchaValidator$ (options, value, resolve, reject)` - Old style/callback based.  Not curried.
- `reCaptchaIOValidator$ (options, value, resolve, reject)` - Same as `reCaptchaIOValidator` but not curried.
- `makeReCaptchaRequest$ (options, value, resolve, reject)` - Used by all `reCaptcha*` methods above (makes the request to recaptchaV2 api).  Not curried.  Old style callback based.
- `toReCaptchaOptions (options)` - Returns a normalized `reCaptchaValidatorOptions` object.
- `toReCaptchaTestValue (options)` - Returns a normalized `reCaptchaValidatorTestValue` object.

## Development 
@see package.json "scripts" sections.
@note `recaptchaKeys` in package.json are the ones prescribed by recaptcha
team for doing `always true` (response from recaptcha service) testing.

## Resources:
- reCaptchaV2 frontend docs: https://developers.google.com/recaptcha/docs/display
- reCaptchaV2 backend docs: https://developers.google.com/recaptcha/docs/verify
