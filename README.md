# fjl-validator-recaptcha
ReCaptchaV2 Validator (for backend (nodejs)).

## Import:
Currently only es6 import is available though you can always require 'babel-register'
at the top of your page to use the module (cjs exported version coming shortly).

## Usage:
```
import {recaptchIOValidator} from 'recaptchaValidator';

// Somewhere in application
router.post('/test-recaptcha-validator', (req, res) => {
    res.type('application/json');
    return reCaptchaIOValidator(
            {secret: 'recaptcha-secret-here'}, 
            req.body['g-recaptcha-response']
        )
        .then(
            // Send back result of validation
            result => res.json(result),  
            
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
        // No 'non-promise' version of validator currently available
    }
    
    // Somewhere in application
    const 
    
        recaptchaValidatorOptions = {
            secret: 'recaptcha-secret-here',
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
    router.post('/some-recaptcha-validation-route', (req, res) => 
        recaptchaValidator(req.body['g-recaptcha-response']).then(...)
    );
    
});
```

## Development 
@see package.json "scripts" sections.

## Resources:
- reCaptchaV2 frontend docs: https://developers.google.com/recaptcha/docs/display
- reCaptchaV2 backend docs: https://developers.google.com/recaptcha/docs/verify
