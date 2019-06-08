"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reCaptchaValidatorV2 = exports.reCaptchaValidator = exports.reCaptchaIOValidator = exports.reCaptchaIOValidator$ = exports.reCaptchaValidator$ = exports.makeReCaptchaRequest$ = exports.toReCaptchaValidatorOptions = exports.toReCaptchaTestValue = exports.UNKNOWN_ERROR = exports.BAD_REQUEST = exports.INVALID_INPUT_RESPONSE = exports.MISSING_INPUT_RESPONSE = exports.INVALID_INPUT_SECRET = exports.MISSING_INPUT_SECRET = void 0;

var _https = _interopRequireDefault(require("https"));

var _querystring = _interopRequireDefault(require("querystring"));

var _fjlValidator = require("fjl-validator");

var _fjl = require("fjl");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var
/**
 * @memberOf module:fjlValidatorReCaptcha
 * @property MISSING_INPUT_SECRET
 * @type {string}
 */
MISSING_INPUT_SECRET = 'missing-input-secret',

/**
 * @memberOf module:fjlValidatorReCaptcha
 * @property INVALID_INPUT_SECRET
 * @type {string}
 */
INVALID_INPUT_SECRET = 'invalid-input-secret',

/**
 * @memberOf module:fjlValidatorReCaptcha
 * @property MISSING_INPUT_RESPONSE
 * @type {string}
 */
MISSING_INPUT_RESPONSE = 'missing-input-response',

/**
 * @memberOf module:fjlValidatorReCaptcha
 * @property INVALID_INPUT_RESPONSE
 * @type {string}
 */
INVALID_INPUT_RESPONSE = 'invalid-input-response',

/**
 * @memberOf module:fjlValidatorReCaptcha
 * @proerpty BAD_REQUEST
 * @type {string}
 */
BAD_REQUEST = 'bad-request',

/**
 * @memberOf module:fjlValidatorReCaptcha
 * @property UNKNOWN_ERROR
 * @type {string}
 */
UNKNOWN_ERROR = 'unknown-error',

/**
 * Normalizes value object to be tested by `reCaptchaValidator`.
 * @function module:fjlValidatorReCaptcha.toReCaptchaTestValue
 * @param incoming {Object} - Incoming 'un-normalized' test value object; E.g. `{secret: '', resonse: '', etc...}`
 * @param [outgoing={}]{Object} - Optional.  Outgoing object to apply enumerable prop getters and setters to.
 * @returns {ReCaptchaTestValue} - In the form of `{secret, response, remoteip}`.
 * @throws {Error} - If any of `secret`, `response`, or `remoteip` are passed in with values
 *  containing anything other than values of type String.
 */
toReCaptchaTestValue = function toReCaptchaTestValue(incoming) {
  var outgoing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (0, _fjl.assign)((0, _fjl.defineEnumProps)([[String, 'secret'], [String, 'remoteip'], [String, 'response']], outgoing), incoming);
},

/**
 * Normalizes value object to be tested by `reCaptchaValidator`.
 * @function module:fjlValidatorReCaptcha.toReCaptchaValidatorOptions
 * @param options {Object} - Incoming 'un-normalized' test value object; E.g. `{secret: '', resonse: '', etc...}`
 * @param [outgoing={}]{Object} - Optional.  Outgoing object to apply enumerable prop getters and setters to.
 * @returns {ReCaptchaValidatorOptions} - `{requestOptions {Object}, messageTemplates {Object}}`.
 * @throws {Error} - If any of the passed object's properties do not match expected types.
 */
toReCaptchaValidatorOptions = function toReCaptchaValidatorOptions(options) {
  var _messageTemplates;

  var outgoing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (// @note `toValidationOptions` sets getter and setter for 'messageTemplates', 'valueObscured', and `valueObscurer`
    (0, _fjl.assignDeep)((0, _fjl.defineEnumProps)([[Object, 'requestOptions', {}]], (0, _fjlValidator.toValidationOptions)(outgoing)), {
      requestOptions: {
        host: 'www.google.com',
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      },
      messageTemplates: (_messageTemplates = {}, _defineProperty(_messageTemplates, MISSING_INPUT_SECRET, 'The secret parameter is missing.'), _defineProperty(_messageTemplates, INVALID_INPUT_SECRET, 'The secret parameter is invalid or malformed.'), _defineProperty(_messageTemplates, MISSING_INPUT_RESPONSE, 'The response parameter is missing.'), _defineProperty(_messageTemplates, INVALID_INPUT_RESPONSE, 'The response parameter is invalid or malformed.'), _defineProperty(_messageTemplates, BAD_REQUEST, 'Bad request'), _defineProperty(_messageTemplates, UNKNOWN_ERROR, 'Unknown error.'), _messageTemplates)
    }, options || {})
  );
},

/**
 * Makes request to reCaptchaV2 service using passed in options and test value.
 * @function module:fjlValidatorReCaptcha.makeReCaptchaRequest$
 * @param options {ReCaptchaValidatorOptions}
 * @param value {ReCaptchaTestValue}
 * @param resolve {Function} - Resolve/success callback - Receives validation result object.
 * @param reject {Function} - Reject/failure callback - Receives validation result object and errorCodes array.
 * @returns {void}
 */
makeReCaptchaRequest$ = function makeReCaptchaRequest$(options, value, resolve, reject) {
  var messages = [],
      secret = value.secret,
      remoteip = value.remoteip,
      response = value.response;

  if (!secret) {
    messages.push((0, _fjlValidator.getErrorMsgByKey)(options, MISSING_INPUT_SECRET, value));
  }

  if (!response) {
    messages.push((0, _fjlValidator.getErrorMsgByKey)(options, MISSING_INPUT_RESPONSE, value));
  }

  if (messages.length) {
    resolve((0, _fjlValidator.toValidationResult)({
      result: false,
      messages: messages
    }));
    return; // Exiting explicitly here due to function being able to be used in callback style (old-style)
  }

  var formParams = {
    secret: secret,
    remoteip: remoteip,
    response: response
  },
      requestOptions = options.requestOptions,
      serializedParams = _querystring["default"].stringify(formParams); // Set content-length header


  requestOptions.headers['Content-Length'] = serializedParams.length;
  requestOptions.body = serializedParams; // Make request

  var validationResult = (0, _fjlValidator.toValidationResult)(),
      request = _https["default"].request(requestOptions, function (res) {
    // handle `response` (`res`)
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      var responseData = JSON.parse(body),
          errorCodes = responseData['error-codes'],
          hasErrorCodes = !!errorCodes && !!errorCodes.length,
          normalizedErrorCodes = hasErrorCodes ? errorCodes.map(function (x) {
        return x.toLowerCase();
      }) : [],
          nonEmptyErrorCodes = []; // If validation failed (false, null, undefined)

      if (!(0, _fjl.isEmpty)(responseData.success)) {
        validationResult.result = true;
        resolve(validationResult);
        return;
      }

      if (hasErrorCodes) {
        // Add error message(s)
        nonEmptyErrorCodes = normalizedErrorCodes.filter(function (code) {
          return options.messageTemplates.hasOwnProperty(code);
        }); // Get error messages

        if (!nonEmptyErrorCodes.length) {
          messages.push((0, _fjlValidator.getErrorMsgByKey)(options, UNKNOWN_ERROR, value));
        } // Else add 'unknown error' error message
        else {
            nonEmptyErrorCodes.forEach(function (code) {
              return messages.push((0, _fjlValidator.getErrorMsgByKey)(options, code, value));
            });
          }
      } else {
        messages.push((0, _fjlValidator.getErrorMsgByKey)(options, UNKNOWN_ERROR, value));
      } // Set failure results


      validationResult.result = false;
      validationResult.messages = messages;
      resolve(validationResult, nonEmptyErrorCodes);
    });
  });

  request.on('error', function (err) {
    messages.push(err);
    validationResult.messages = messages;
    validationResult.result = false;
    reject(validationResult, err);
  });
  request.write(serializedParams, 'utf8');
  request.end();
},

/**
 * Validates a test value against google's reCaptchaV2 backend validation service;
 * @note unlike `makeReCaptchaRequest$` this method validates/normalizes the passed in data objects before making
 * the validation request to the backend-validation-service.
 * @function module:fjlValidatorReCaptcha.reCaptchaValidator$
 * @param options {ReCaptchaValidatorOptions}
 * @param value {ReCaptchaTestValue}
 * @param resolve {Function} - Resolve/success callback - Receives validation result object.
 * @param reject {Function} - Reject/failure callback - Receives validation result object and errorCodes array.
 * @returns {void}
 */
reCaptchaValidator$ = function reCaptchaValidator$(options, value, resolve, reject) {
  return makeReCaptchaRequest$(toReCaptchaValidatorOptions(options), toReCaptchaTestValue(value), resolve, reject);
},

/**
 * Validates a test value against reCaptchaV2 backend service;
 * @note When a reject occurs it will receive validation result object and `errorCodes` array (which contains
 *  error code sent back by reCaptcha service.
 * @function module:fjlValidatorReCaptcha.reCaptchaIOValidator$
 * @param options {ReCaptchaValidatorOptions}
 * @param value {ReCaptchaTestValue}
 * @returns {(Promise.<ValidationResult>|Promise.<ValidationResult, Array.<String>>)}
 */
reCaptchaIOValidator$ = function reCaptchaIOValidator$(options, value) {
  return new Promise(function (resolve, reject) {
    return reCaptchaValidator$(options, value, resolve, reject);
  });
},

/**
 * Curried version of `reCaptchaIOValidator$`.
 * @function module:fjlValidatorReCaptcha.reCaptchaIOValidator
 * @param options {ReCaptchaValidatorOptions}
 * @param value {ReCaptchaTestValue}
 * @returns {(Promise.<ValidationResult>|Promise.<ValidationResult, Array.<String>>)}
 * @curried - Is curried.
 */
reCaptchaIOValidator = (0, _fjl.curry)(reCaptchaIOValidator$),

/**
 * Alias of `reCaptchaIOValidator`.
 * @function module:fjlValidatorReCaptcha.reCaptchaValidator
 * @param options {ReCaptchaValidatorOptions}
 * @param value {ReCaptchaTestValue}
 * @returns {(Promise.<ValidationResult>|Promise.<ValidationResult, Array.<String>>)}
 * @curried - Is curried.
 */
reCaptchaValidator = reCaptchaIOValidator,

/**
 * Same as `reCaptchaIOValidator` though with arguments flipped;
 *  Takes `value` parameter first and the `options` one second.
 * @function module:fjlValidatorReCaptcha.reCaptchaValidatorV2
 * @param value {ReCaptchaTestValue}
 * @param options {ReCaptchaValidatorOptions}
 * @returns {(Promise.<ValidationResult>|Promise.<ValidationResult, Array.<String>>)}
 * @curried - Is curried.
 */
reCaptchaValidatorV2 = (0, _fjl.curry)((0, _fjl.flip)(reCaptchaIOValidator$));
/*-------------------
 * VIRTUAL TYPES
 * @note 'reCaptcha-v2 backend service' is the backend validation service used to validate, from a backend,
 *  the frontend validation result (for reCaptchaV2).
 *-------------------*/

/**
 * @typedef {Object.<String, (Function|String)>} MessageTemplates
 * Message Templates object to get error messages from error codes received from the reCaptcha-v2 'backend' service.
 */

/**
 * @typedef {Object.<String, *>} RequestOptions
 * Options used to make request to google's reCaptcha-v2 backend-validation service.
 */

/**
 * @typedef {Object.<String, *>} ReCaptchaValidatorOptions
 * @property requestOptions {RequestOptions}
 * @property messageTemplates {MessageTemplates}
 */

/**
 * @typedef {Object.<String, String>} ReCaptchaTestValue
 * @property {String} secret - The 'secret' key sent to the google reCaptcha-v2 backend service.
 * @property {String} response - The 'response' string sent to the reCaptcha-v2 backend service.
 * @property {String} [remoteip=undefined] - Optional.  The 'remoteip' string sent to the reCaptcha-v2 backend-validation service.
 */

/**
 * @typedef {Object.<String, *>} ValidationResult
 * @property {Boolean} result - Result of validators validation (`true` or `false`).
 * @property {Array.<String>} messages - Validation failure messages;  Reasons why tested value(s) didn't pass validation.
 * @type {string}
 */


exports.reCaptchaValidatorV2 = reCaptchaValidatorV2;
exports.reCaptchaValidator = reCaptchaValidator;
exports.reCaptchaIOValidator = reCaptchaIOValidator;
exports.reCaptchaIOValidator$ = reCaptchaIOValidator$;
exports.reCaptchaValidator$ = reCaptchaValidator$;
exports.makeReCaptchaRequest$ = makeReCaptchaRequest$;
exports.toReCaptchaValidatorOptions = toReCaptchaValidatorOptions;
exports.toReCaptchaTestValue = toReCaptchaTestValue;
exports.UNKNOWN_ERROR = UNKNOWN_ERROR;
exports.BAD_REQUEST = BAD_REQUEST;
exports.INVALID_INPUT_RESPONSE = INVALID_INPUT_RESPONSE;
exports.MISSING_INPUT_RESPONSE = MISSING_INPUT_RESPONSE;
exports.INVALID_INPUT_SECRET = INVALID_INPUT_SECRET;
exports.MISSING_INPUT_SECRET = MISSING_INPUT_SECRET;