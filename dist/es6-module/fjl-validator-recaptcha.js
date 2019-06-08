import https from 'https';
import querystring from 'querystring';

/**
 * @author elydelacruz
 * @created 12/6/2016.
 * @memberOf function
 * @description "Curry strict" and "curry arbitrarily" functions (`curry`, `curryN`).
 */

/**
 * @private
 * @type {string}
 */
const
/**
 * Returns curried function.
 * @private
 * @param executeArity {Number}
 * @param unmetArityNum {Number}
 * @param fn {Function}
 * @param argsToCurry {...*}
 * @returns {Function} - Curried function.
 */
returnCurried = (executeArity, unmetArityNum, fn, argsToCurry) => {
  switch (unmetArityNum) {
    case 1:
      /* eslint-disable */
      return function func(x) {
        /* eslint-enable */
        return executeAsCurriedFunc(fn, executeArity, unmetArityNum, Array.from(arguments), argsToCurry);
      };

    case 2:
      /* eslint-disable */
      return function func(a, b) {
        /* eslint-enable */
        return executeAsCurriedFunc(fn, executeArity, unmetArityNum, Array.from(arguments), argsToCurry);
      };

    case 3:
      /* eslint-disable */
      return function func(a, b, c) {
        /* eslint-enable */
        return executeAsCurriedFunc(fn, executeArity, unmetArityNum, Array.from(arguments), argsToCurry);
      };

    case 4:
      /* eslint-disable */
      return function func(a, b, c, d) {
        /* eslint-enable */
        return executeAsCurriedFunc(fn, executeArity, unmetArityNum, Array.from(arguments), argsToCurry);
      };

    case 5:
      /* eslint-disable */
      return function func(a, b, c, d, e) {
        /* eslint-enable */
        return executeAsCurriedFunc(fn, executeArity, unmetArityNum, Array.from(arguments), argsToCurry);
      };

    default:
      return (...args) => executeAsCurriedFunc(fn, executeArity, unmetArityNum, args, argsToCurry);
  }
},

/**
 * Returns curried function if unmetArity is not met else returns result of executing
 * final function.
 * @private
 * @param fn {Function}
 * @param executeArity {Number}
 * @param unmetArity {Number}
 * @param args {Array<*>}
 * @param argsToCurry {Array<*>}
 * @returns {Function|*} - Curried function or result of 'finally' executed function.
 */
executeAsCurriedFunc = (fn, executeArity, unmetArity, args, argsToCurry) => {
  let concatedArgs = argsToCurry.concat(args),
      canBeCalled = concatedArgs.length >= executeArity || !executeArity,
      newExpectedArity = executeArity - concatedArgs.length;
  return !canBeCalled ? returnCurried(executeArity, newExpectedArity, fn, concatedArgs) : fn(...concatedArgs);
};

const  
/**
 * Curries a function up to a given arity.
 * @function module:function.curryN
 * @param executeArity {Number}
 * @param fn {Function}
 * @param argsToCurry {...*}
 * @returns {Function}
 * @throws {Error} - When `fn` is not a function.
 */
curryN = (executeArity, fn, ...argsToCurry) => {
  if (!fn || !(fn instanceof Function)) {
    throw new Error(`\`curry*\` functions expect first parameter to be of type \`Function\` though received ${fn}?`);
  }

  return returnCurried(executeArity, executeArity - argsToCurry.length, fn, argsToCurry);
},

/**
 * Curries a function based on it's defined arity (note: rest args param (`...rest`) are not counted in arity).
 * @function module:function.curry
 * @param fn {Function}
 * @param argsToCurry {...*}
 * @returns {Function}
 */
curry = (fn, ...argsToCurry) => curryN((fn || {}).length, fn, ...argsToCurry),

/**
 * Curries a function up to an arity of 2 (won't call function until 2 or more args).
 * @function module:function.curry2
 * @param fn {Function}
 * @returns {Function}
 */
curry2 = fn => curryN(2, fn),

/**
 * Curries a function up to an arity of 3 (won't call function until 3 or more args).
 * @function module:function.curry3
 * @param fn {Function}
 * @returns {Function}
 */
curry3 = fn => curryN(3, fn);

/**
 * @module utils
 */
const  
/**
 * Returns a function that takes an argument and an object on which to execute 'method name'
 * with said parameters.
 * @function module:utils.fPureTakesOne
 * @param name {String}
 * @returns {Function}
 */
fPureTakesOne = name => curry((arg, f) => f[name](arg)),

/**
 * Returns a function that takes 2 arguments and an object on which to execute 'method name'
 * with said parameters.
 * @function module:utils.fPureTakes2
 * @param name {String}
 * @returns {Function}
 */
fPureTakes2 = name => curry((arg1, arg2, f) => f[name](arg1, arg2)),

/**
 * Returns a function that takes an object and one or more arguments on which to execute 'method name'
 * with said parameters.
 * @function module:utils.fPureTakesOneOrMore
 * @param name {String}
 * @returns {Function}
 */
fPureTakesOneOrMore = name => curry2((f, ...args) => f[name](...args));

const  
/**
 * Maps a function to functor (list etc.).
 * @function module:jsPlatform.map
 * @param fn {Function}
 * @param functor {Array|{map: {Function}}}
 * @returns {Array|{map: {Function}}}
 */
map = fPureTakesOne('map'),

/**
 * Filters a functor (list etc.) with passed in function.
 * @function module:jsPlatform.filter
 * @param fn {Function}
 * @param functor {Array|{filter: {Function}}}
 * @returns {Array|{filter: {Function}}}
 */
filter = fPureTakesOne('filter'),

/**
 * Reduces a foldable (list etc.) with passed in function.
 * @function module:jsPlatform.reduce
 * @param fn {Function}
 * @param functor {Array|{reduce: {Function}}}
 * @returns {Array|{reduce: {Function}}}
 */
reduce = fPureTakes2('reduce'),

/**
 * Reduces a foldable (list etc.) from the right with passed in function.
 * @function module:jsPlatform.reduceRight
 * @param fn {Function}
 * @param functor {Array|{reduceRight: {Function}}}
 * @returns {Array|{reduceRight: {Function}}}
 */
reduceRight = fPureTakes2('reduceRight'),

/**
 * For each on functor (Array|Object|etc.).
 * @function module:jsPlatform.forEach
 * @param fn {Function}
 * @param functor {Array|Object|*}
 * @return {*|Array|Object} - The type of object you pass in unless it doesn't have a `forEach` method.
 * @throws {Error} - When passed in functor doesn't have a `forEach` method.
 */
forEach = fPureTakesOne('forEach'),

/**
 * Returns `true` if `fn` (predicate) returns true for at least one item
 * in functor else returns `false`.
 * @param fn {Function} - Predicate.
 * @param functor {Array|Object|*}
 * @return {*|Array|Object} - The type passed.
 * @throws {Error} - When passed in object doesn't have a `some` method.
 */
some = fPureTakesOne('some'),

/**
 * Returns `true` if `fn` (predicate) returns true for all items in functor else returns `false`.
 * @function module:jsPlatform.every
 * @param fn {Function} - Predicate.
 * @param functor {Array|Object|*}
 * @return {*|Array|Object} - The type passed.
 * @throws {Error} - When passed in object doesn't have an `every` method.
 */
every = fPureTakesOne('every'),

/**
 * Array.prototype.join
 * @function module:jsPlatform.join
 * @param separator {String|RegExp}
 * @param arr {Array}
 * @returns {String}
 */
join = fPureTakesOne('join'),

/**
 * Same as Array.prototype.push
 * @function module:jsPlatform.push
 * @param item {*}
 * @param arr {Array}
 * @returns {Number}
 */
push = fPureTakesOneOrMore('push');

/**
 * Created by elydelacruz on 9/7/2017.
 */

const 
/**
 * Functional `apply` function (takes no context).
 * @function module:function.apply
 * @param fn {Function}
 * @param args {Array|*}
 * @returns {*}
 */
apply = curry((fn, args) => fn.apply(null, args)),

/**
 * Functional `call` function (takes no context).
 * @function module:function.call
 * @param fn {Function}
 * @param args {...*}
 * @returns {*}
 */
call = curry2((fn, ...args) => fn.call(null, ...args));

const  
/**
 * Flips a function's first and second arguments and and returns a new function requiring said arguments in reverse.
 * @function module:function.flip
 * @param fn {Function}
 * @returns {Function}
 */
flip = fn => curry((b, a) => call(fn, a, b)),

/**
 * Same as `flip` except returns a flipped function of arity 3.
 * @function module:function.flip3
 * @param fn {Function}
 * @returns {Function}
 */
flip3 = fn => curry((c, b, a) => call(fn, a, b, c)),

/**
 * Same as `flip` except returns a flipped function of arity 4.
 * @function module:function.flip4
 * @param fn {Function}
 * @returns {Function}
 */
flip4 = fn => curry((d, c, b, a) => call(fn, a, b, c, d)),

/**
 * Same as `flip` except returns a flipped function of arity 5.
 * @function module:function.flip5
 * @param fn {Function}
 * @returns {Function}
 */
flip5 = fn => curry((e, d, c, b, a) => call(fn, a, b, c, d, e));

/**
 * @description Defines some of the platform methods for objects (the ones used within `fjl`).
 */
const 
/**
 * Returns whether constructor has derived object.
 * @function module:object.instanceOf
 * @param instanceConstructor {Function} - Constructor.
 * @param instance {*}
 * @instance {*}
 * @returns {Boolean}
 */
instanceOf = curry((instanceConstructor, instance) => instance instanceof instanceConstructor),

/**
 * @function module:object.hasOwnProperty
 * @param propName {*}
 * @param typeInstance {*}
 * @returns {Boolean}
 * @deprecated - Use property directly instead.
 */
hasOwnProperty = fPureTakesOne('hasOwnProperty'),

/**
 * @function module:object.length
 * @param x {*}
 * @returns {Number}
 * @throws {Error} - Throws an error if value doesn't have a `length` property (
 *  `null`, `undefined`, {Boolean}, Symbol, et. al.).
 */
length = x => x.length,

/**
 * Contains all the static functions from `Object` but curried and flipped;
 * @example
 * // E.g., `Object.defineProperties(obj, descriptor)` can now be used like
 * import {defineProperties} from 'fjl'
 * defineProperties(descriptor, someObj),
 * // Et. al.
 * @memberOf module:object
 * @type {{...Object}}
 */
native = Object.getOwnPropertyNames(Object).reduce((agg, key) => {
  if (typeof Object[key] !== 'function') {
    return agg;
  }

  const operation = Object[key];

  switch (operation.length) {
    case 2:
      agg[key] = flip(operation);
      break;

    case 3:
      agg[key] = flip3(operation);
      break;

    case 4:
      agg[key] = flip4(operation);
      break;

    case 5:
      agg[key] = flip5(operation);
      break;

    default:
      agg[key] = Object[key];
      break;
  }

  return agg;
}, {}),

/**
 * Gets passed in object's own enumerable keys (same as `Object.keys`).
 * @function module:object.keys
 * @param obj {*}
 * @returns {Array<String>}
 */
{
  keys
} = native,

/**
 * Defined as `Object.assign` else is the same thing but shimmed.
 * @function module:object.assign
 * @param obj0 {Object}
 * @param objs {...{Object}}
 * @returns {Object}
 */
assign = (() => Object.assign ? (obj0, ...objs) => Object.assign(obj0, ...objs) : curry2((obj0, ...objs) => objs.reduce((topAgg, obj) => {
  return Object.keys(obj).reduce((agg, key) => {
    agg[key] = obj[key];
    return agg;
  }, topAgg);
}, obj0)))();

/**
 * Created by elyde on 12/18/2016.
 * @memberOf object
 */
const _Number = Number.name,
      _NaN = 'NaN',
      _Null = 'Null',
      _Undefined = 'Undefined';
/**
 * Returns the constructor/class/type name of a value.
 * @note Returns 'NaN' if value is of type `Number` and value is `isNaN`.
 * @note Returns 'Undefined' if value is `undefined`
 * @note Returns 'Null' if value is `null`
 * For values that have no concrete constructors and/or casters
 * (null, NaN, and undefined) we returned normalized names for them ('Null', 'NaN', 'Number')
 * @function module:object.typeOf
 * @param value {*}
 * @returns {string} - Constructor's name or derived name (in the case of `null`, `undefined`, or `NaN` (whose
 *  normalized names are 'Null', 'Undefined', 'NaN' respectively).
 */

function typeOf(value) {
  let retVal;

  if (value === undefined) {
    retVal = _Undefined;
  } else if (value === null) {
    retVal = _Null;
  } else {
    let constructorName = value.constructor.name;
    retVal = constructorName === _Number && isNaN(value) ? _NaN : constructorName;
  }

  return retVal;
}

/**
 * Created by elyde on 12/18/2016.
 * @memberOf object
 */
let _String = String.name,
    _Number$1 = Number.name,
    _Object = Object.name,
    _Boolean = Boolean.name,
    _Symbol = 'Symbol',
    _Map = 'Map',
    _Set = 'Set',
    _WeakMap = 'WeakMap',
    _WeakSet = 'WeakSet',
    _Null$1 = 'Null',
    _Undefined$1 = 'Undefined';
const  
/**
 * Resolves/normalizes a type name from either a string or a constructor.
 * @function module:object.toTypeRef
 * @param type {Function|String} - String or function representing a type.
 * @returns {String}
 * @todo write tests for this function.
 */
toTypeRef = type => {
  if (!type) {
    return typeOf(type);
  } else if (type.constructor === String || type instanceof Function) {
    return type;
  }

  return typeOf(type);
},

/**
 * Returns possible Type's TypeRef name.
 * @function module:object.toTypeRefName
 * @param Type {(TypeRef|*)}
 * @returns {String}
 * @todo Ensure tests are written for this function.
 */
toTypeRefName = Type => {
  const ref = toTypeRef(Type);
  return ref instanceof Function ? ref.name : ref;
},

/**
 * Returns whether a value is a function or not.
 * @function module:object.isFunction
 * @param value {*}
 * @returns {Boolean}
 */
isFunction = instanceOf(Function),

/**
 * Strict type checker.  Checks if given value is a direct instance of given type;  E.g.,
 * @example
 *   isType(String, 'abcdefg')  === true // true
 *   isType(String.name, 'abcdefg') === true
 *   isType(Number, NaN) === false
 *   isType(Number, 99) === true
 *   isType('Null', 99) === false // though, for `null` and `undefined` checks
 *                                // @see `isset`, in this module, instead
 *   isType('Undefined', undefined) === true // true
 *
 * @note Useful where absolute types, or some semblance thereof, are required.
 * @function module:object.isType
 * @param type {Function|ObjectConstructor|String} - Constructor or constructor name
 * @param obj {*}
 * @return {Boolean}
 */
isType = curry((type, obj) => typeOf(obj) === toTypeRefName(type)),

/**
 * Loose type checker;  E.g., If `type` is not a constructor, but a constructor name, does a type check on
 * constructor names, else if first check fails and `type` is a constructor, performs an `instanceof` check
 * on value with constructor.
 * @note Use care when checking for `Array` since it is an `instanceof` Object.
 * @note For `null` and `undefined` their class cased names can be used for type checks
 * `isOfType('Null', null) === true (passes strict type check)` (or better yet @link `module:object.isset` can be used).
 * @throwsafe - Doesn't throw on `null` or `undefined` `obj` values.
 * @example
 * isOfType(Number, 99) === true        // true  (passes strict type check (numbers are not instances of `Number`
 *                                      //        constructor)
 * isOfType('Number', 99) === true      // true  (passes strict type check)
 * isOfType(Number, NaN) === true       // true. (passes instance of check)
 *                                      //        If you want "true" strict type checking use `isType`
 * isOfType(Object, []) === true        // true  (passes instance of check)
 * isOfType(Array, []) === true         // true  (passes instance of check)
 * isOfType(Object, {}) === true        // true  (passes instance of check)
 * isOfType(Object.name, {}) === true   // true  (Passes strict type check)
 * class Abc extends String {}
 * isOfType(String, new Abc('abcd')) // true (passes instanceof check)
 *
 * @function module:object.isOfType
 * @param type {Function|String} - Type reference (constructor or `constructor.name`).
 * @param x {*} - Value to check.
 * @returns {Boolean}
 */
isOfType = curry((type, x) => isType(type, x) || instanceOf(type, x)),

/**
 * Checks if value is an array (same as `Array.isArray`).
 * @function module:object.isArray
 * @param value {*}
 * @returns {boolean}
 */
{
  isArray
} = Array,

/**
 * Checks whether value is an object or not.
 * @function module:object.isObject
 * @param value
 * @returns {Boolean}
 */
isObject = isType(_Object),

/**
 * Checks if value is a boolean.
 * @function module:object.isBoolean
 * @param value {*}
 * @returns {Boolean}
 */
isBoolean = isType(_Boolean),

/**
 * Checks if value is a valid number (also checks if isNaN so that you don't have to).
 * @function module:object.isNumber
 * @param value {*}
 * @returns {Boolean}
 */
isNumber = isType(_Number$1),

/**
 * Checks whether value is a string or not.
 * @function module:object.isString
 * @param value {*}
 * @returns {Boolean}
 */
isString = isType(_String),

/**
 * Checks whether value is of `Map` or not.
 * @function module:object.isMap
 * @param value {*}
 * @returns {Boolean}
 */
isMap = isType(_Map),

/**
 * Checks whether value is of `Set` or not.
 * @function module:object.isSet
 * @param value {*}
 * @returns {Boolean}
 */
isSet = isType(_Set),

/**
 * Checks whether value is of `WeakMap` or not.
 * @function module:object.isWeakMap
 * @param value {*}
 * @returns {Boolean}
 */
isWeakMap = isType(_WeakMap),

/**
 * Checks whether value is of `WeakSet` or not.
 * @function module:object.isWeakSet
 * @param value {*}
 * @returns {Boolean}
 */
isWeakSet = isType(_WeakSet),

/**
 * Checks if value is undefined.
 * @function module:object.isUndefined
 * @param value {*}
 * @returns {Boolean}
 */
isUndefined = isType(_Undefined$1),

/**
 * Checks if value is null.
 * @function module:object.isNull
 * @param value {*}
 * @returns {Boolean}
 */
isNull = isType(_Null$1),

/**
 * Checks if value is a `Symbol`.
 * @function module:object.isSymbol
 * @param value {*}
 * @returns {Boolean}
 */
isSymbol = isType(_Symbol),

/**
 * Checks if given `x` is set and of one of
 *  [String, Boolean, Number, Symbol] (null and undefined are immutable
 *  but are not "usable" (usually not what we want to operate on).
 * @function module:object.isUsableImmutablePrimitive
 * @param x {*}
 * @returns {Boolean}
 */
isUsableImmutablePrimitive = x => {
  const typeOfX = typeOf(x);
  return isset(x) && [_String, _Number$1, _Boolean, _Symbol].some(Type => Type === typeOfX);
},

/**
 * Checks to see if passed in value is empty;  I.e.,
 *  check for one of '', 0, `null`, `undefined`, `NaN`, `false`, empty array, empty object, ~~empty function (zero arity)~~,
 *  or empty collection (es6 collection: Map, Set, WeakMap, or WeakSet etc.) (`!value.size`).
 * @function module:object.isEmpty
 * @param x {*} - Value to check.
 * @returns {Boolean}
 */
isEmpty = x => {
  if (!x) {
    // if '', 0, `null`, `undefined`, `NaN`, or `false` then is empty
    return true;
  }

  if (isNumber(x) || isFunction(x)) {
    return false;
  }

  if (isArray(x)) {
    // takes care of 'instances of Array'
    return !x.length;
  }

  if (x.size !== undefined && !instanceOf(Function, x.size)) {
    return !x.size;
  }

  if (isObject(x)) {
    return !keys(x).length;
  }

  return false;
},

/**
 * Returns whether passed in values is defined and not null or not.
 * @function module:object.isset
 * @param x {*}
 * @returns {Boolean}
 */
isset = x => x !== null && x !== undefined,

/**
 * Checks if value qualifies (has `map` method) as a functor.
 * @function module:object.isFunctor
 * @param x {*}
 * @returns {bool}
 */
isFunctor = x => x && x.map && instanceOf(Function, x.map);

/**
 * @memberOf object
 */
/**
 * Looks up property and returns it's value; Else `undefined`.
 * Method is null safe (will not throw on `null` or `undefined`).
 * @function module:object.lookup
 * @param key {String} - Key to search on `obj`
 * @param obj {Object} - Object to search `name` on.
 * @returns {*}
 */

const lookup = curry((key, obj) => isset(obj) ? obj[key] : undefined);

/**
 * Creates a value `of` given type;  Checks for one of the following construction strategies (in order listed):
 * @example
 * // - If exists `(value).constructor.of` uses this.
 * // - If value is of one String, Boolean, Symbol, or Number types calls it's
 * //      constructor as a function (in cast form;  E.g., `constructor(...args)` )
 * // - Else if constructor is a function, thus far, then calls constructor using
 * //      the `new` keyword (with any passed in args).

 * @function module:object.of
 * @param x {*} - Value to derive returned value's type from.
 * @param [args] {...*} - Any args to pass in to matched construction strategy.
 * @returns {*|undefined} - New value of given value's type else `undefined`.
 */

const of = (x, ...args) => {
  if (!isset(x)) {
    return undefined;
  }

  const constructor = x.constructor;

  if (constructor.hasOwnProperty('of')) {
    return apply(constructor.of, args);
  } else if (isUsableImmutablePrimitive(x)) {
    return apply(constructor, args);
  } else if (isFunction(constructor)) {
    return new constructor(...args);
  }

  return undefined;
};

const 
/**
 * Gives you value at key/namespace-key within `obj`;  E.g.,
 * searchObj('all.your.base', {all: {your: {base: 99}}}) === 99 // `true`
 * @note If key is unreachable (undefined) returns `undefined`.
 *  Useful in cases where we do not want to check each key along the way before getting/checking value;  E.g.,
 * @example
 * ```
 * if (obj && obj.all && obj.all.your && obj.all.your.base) {
 *   // Thing we want to do
 * }
 *
 * // So with our function becomes
 * if (searchObj('all.your.base', obj)) {
 *   // Thing we want to do
 * }
 * ```
 * @function module:object.searchObj
 * @param nsString {String}
 * @param obj {*}
 * @returns {*}
 */
searchObj = curry((nsString, obj) => {
  if (!obj) {
    return obj;
  }

  if (nsString.indexOf('.') === -1) {
    return obj[nsString];
  }

  const parts = nsString.split('.'),
        limit = parts.length;
  let ind = 0,
      parent = obj;

  for (; ind < limit; ind += 1) {
    const node = parent[parts[ind]];

    if (!isset(node)) {
      return node;
    }

    parent = node;
  }

  return parent;
});

/**
 * @module errorThrowing
 * @description Contains error throwing facilities for when a value doesn't match a type.
 */
const  
/**
 * Pretty prints an array of types/type-strings for use by error messages;
 * Outputs "`SomeTypeName`, ..." from [SomeType, 'SomeTypeName', etc...]
 * @function module:errorThrowing.typeRefsToStringOrError
 * @param types {Array|TypesArray}
 * @return {String}
 * @private
 */
typeRefsToStringOrError = types => types.length ? types.map(type => `\`${toTypeRefName(type)}\``).join(', ') : '',

/**
 * Prints a message from an object.  Object signature:
 * {contextName, valueName, value, expectedTypeName, foundTypeName, messageSuffix}
 * @function module:errorThrowing.defaultErrorMessageCall
 * @param tmplContext {Object|TemplateContext} - Object to use in error template.
 * @returns {string}
 * @private
 */
defaultErrorMessageCall = tmplContext => {
  const {
    contextName,
    valueName,
    value,
    expectedTypeName,
    foundTypeName,
    messageSuffix
  } = tmplContext,
        isMultiTypeNames = isArray(expectedTypeName),
        typesCopy = isMultiTypeNames ? 'of type' : 'of one of the types',
        typesToMatchCopy = isMultiTypeNames ? typeRefsToStringOrError(expectedTypeName) : expectedTypeName;
  return (contextName ? `\`${contextName}.` : '`') + `${valueName}\` is not ${typesCopy}: ${typesToMatchCopy}.  ` + `Type received: ${foundTypeName}.  Value: ${value};` + `${messageSuffix ? '  ' + messageSuffix + ';' : ''}`;
},

/**
 * Gets the error message thrower seeded with passed in errorMessage template call.
 * @function module:errorThrowing.getErrorIfNotTypeThrower$
 * @param errorMessageCall {Function|ErrorMessageCall}
 * @param typeChecker {Function|TypeChecker} - Function<Type, value>:Boolean
 * @returns {Function|ErrorIfNotType}
 * @private
 */
_getErrorIfNotTypeThrower = (errorMessageCall, typeChecker = isOfType) => (ValueType, contextName, valueName, value, messageSuffix = null) => {
  const expectedTypeName = toTypeRef(ValueType),
        foundTypeName = typeOf(value);

  if (typeChecker(ValueType, value)) {
    return value;
  } // Value matches type


  throw new Error(errorMessageCall({
    contextName,
    valueName,
    value,
    expectedTypeName,
    foundTypeName,
    messageSuffix
  }));
},

/**
 * Gets the error message thrower seeded with passed in errorMessage template call.
 * @function module:errorThrowing.getErrorIfNotTypesThrower$
 * @param errorMessageCall {Function|ErrorMessageCall}
 * @param typeChecker {Function|TypeChecker} - Function<Type, value>:Boolean
 * @returns {Function|ErrorIfNotTypes}
 * @private
 */
_getErrorIfNotTypesThrower = (errorMessageCall, typeChecker = isOfType) => (valueTypes, contextName, valueName, value, messageSuffix = null) => {
  const expectedTypeNames = valueTypes.map(toTypeRef),
        matchFound = valueTypes.some(ValueType => typeChecker(ValueType, value)),
        foundTypeName = typeOf(value);

  if (matchFound) {
    return value;
  }

  throw new Error(errorMessageCall({
    contextName,
    valueName,
    value,
    expectedTypeName: expectedTypeNames,
    foundTypeName,
    messageSuffix
  }));
},

/**
 * Checks that passed in `value` is of given `type`.  Throws an error if value
 * is not of given `type`.  This is the un-curried version.  For the curried version
 * see `module:errorThrowing.errorIfNotType`.
 * @function module:errorThrowing.errorIfNotType$
 * @param type {String|Function} - Type's name or type itself.
 * @param contextName {String} - Name of context to attribute errors if thrown.
 * @param valueName {String} - String rep of value.
 * @param value {*}
 * @param [messageSuffix=null] {String} - Optional.
 * @returns {*} - Given `value` if `value` matches passed in type.
 * @private
 */
_errorIfNotType = _getErrorIfNotTypeThrower(defaultErrorMessageCall),

/**
 * Checks that passed in `value` is of one of the given `types`.  Throws an error if value
 *  is not of one of the given `types`.  This is the un-curried version.  For the curried version
 * see `module:errorThrowing.errorIfNotTypes`.
 * @type {Function|module:errorThrowing.errorIfNotTypes}
 * @function module:errorThrowing.errorIfNotTypes$
 * @param types {Array} - Array of one or more types or type names themselves.
 * @param contextName {String} - Name of context to attribute errors if thrown.
 * @param valueName {String} - String rep of value.
 * @param value {*}
 * @returns {*} - Given `value` if `value` matches passed in type.
 * @private
 */
_errorIfNotTypes = _getErrorIfNotTypesThrower(defaultErrorMessageCall),

/**
 * Checks that passed in `value` is of given `type`.  Throws an error if value
 * is not of given `type`.  Curried.
 * @function module:errorThrowing.errorIfNotType
 * @param type {String|Function} - Type's name or type itself.
 * @param contextName {String} - Name of context to attribute errors if thrown.
 * @param valueName {String} - String rep of value.
 * @param value {*}
 * @param [messageSuffix=null] {String} - Optional.
 * @returns {*} - Given `value` if `value` matches passed in type.
 * @curried
 */
errorIfNotType = curry(_errorIfNotType),

/**
 * Checks that passed in `value` is of one of the given `types`.  Throws an error if value
 *  is not of one of the given `types`.  Curried.
 * @function module:errorThrowing.errorIfNotTypes
 * @param types {Array} - Array of one or more types or type names themselves.
 * @param contextName {String} - Name of context to attribute errors if thrown.
 * @param valueName {String} - String rep of value.
 * @param value {*}
 * @returns {*} - Given `value` if `value` matches passed in type.
 * @curried
 */
errorIfNotTypes = curry(_errorIfNotTypes);
/**
 * @typedef {*} Any - Synonym for 'any value'.
 */

/**
 * @typedef {String|Function} TypeRef
 * @description Type reference.  Type itself or Type's name;  E.g., `Type.name`;
 */

/**
 * @typedef {Object<value, valueName, expectedTypeName, foundTypeName, messageSuffix>} TemplateContext
 * @description Template context used for error message renderers (functions that take a context obj and return a string).
 * @property value {*}
 * @property valueName {String}
 * @property expectedTypeName {String} - Expected name of constructor of `value`;  E.g., usually `SomeConstructor.name`;
 * @property foundTypeName {String} - Found types name;  E.g., `FoundConstructor.name`;
 * @property [messageSuffix=null] {*} - Message suffix (sometimes an extra hint or instructions for
 *  directing user to fix where his/her error has occurred).  Optional.
 */

/**
 * @typedef {Array<(String|Function)>} TypesArray
 */

/**
 * @typedef {Function} TypeChecker
 * @description Checks whether a value is of given type.
 * @param Type {TypeRef} - a Type or it's name;  E.g., `Type.name`.
 * @param value {*}
 * @returns {Boolean}
 */

/**
 * @typedef {Function} ErrorMessageCall
 * @description Error message template function.
 * @param tmplContext {TemplateContext}
 * @returns {String}
 */

/**
 * @typedef {Function} ErrorIfNotType
 * @description Used to ensure value matches passed in type.
 * @param type {TypeRef} - Constructor name or constructor.
 * @param contextName {String}
 * @param valueName {String}
 * @param value {*}
 * @throws {Error} - If value doesn't match type.
 * @returns {*} - What ever value is.
 */

/**
 * @typedef {Function} ErrorIfNotTypes
 * @description Used to ensure a value matches one of one or more types passed in.
 * @param valueTypes {TypesArray} - Array of constructor names or constructors.
 * @param contextName {String}
 * @param valueName {String}
 * @param value {*}
 * @throws {Error} - If value doesn't match type.
 * @returns {*} - Whatever value is.
 */

/**
 * @module object
 * @note Custom jsdoc type definitions defined toward end of file.
 */
/**
 * Creates `defineProps` and `defineEnumProps` methods based on `{enumerable}` param.
 * @param {{enumerable: Boolean}}
 * @returns {function(*, *)|PropsDefinerCall}
 * @private
 */

function createDefinePropsMethod({
  enumerable
}) {
  const operation = enumerable ? defineEnumProp : defineProp;
  return (argTuples, target) => {
    argTuples.forEach(argTuple => {
      const [TypeRef, propName, defaultValue] = argTuple;
      apply(operation, [TypeRef, target, propName, defaultValue]);
    });
    return target;
  };
}

const 
/**
 * Creates a descriptor for a property which is settable but throws
 * errors when the `Type` is disobeyed.
 * @function module:object.createTypedDescriptor
 * @param Type {TypeRef} - {String|Function}
 * @param target {*}
 * @param propName {String}
 * @returns {Descriptor} - Property descriptor with just getter and setter.
 */
createTypedDescriptor = (Type, target, propName) => {
  let _value;

  return {
    get: function () {
      return _value;
    },
    set: function (value) {
      _value = errorIfNotType(Type, propName, target, value);
    }
  };
},

/**
 * Returns a target-descriptor tuple whose 'descriptor' will be set to
 *  enumerable (`enumerable: true`).
 * @function module:object.toEnumerableDescriptor
 * @param {TargetDescriptorTuple} - [target, descriptor] tuple.
 * @returns {TargetDescriptorTuple} - Array of target and descriptor.
 */
toEnumerableDescriptor = ([target, descriptor]) => {
  descriptor.enumerable = true;
  return [target, descriptor];
},

/**
 * Returns an target and descriptor tuple from given.
 * @function module:object.toTargetDescriptorTuple
 * @param targetOrTargetDescriptorTuple {(*|Array<*, *>)} - Target object or tuple of target and descriptor.
 * @returns {(Array<*>|Array<*,*>)}
 */
toTargetDescriptorTuple = targetOrTargetDescriptorTuple => isType('Array', targetOrTargetDescriptorTuple) ? // Strict type check for array
targetOrTargetDescriptorTuple : [targetOrTargetDescriptorTuple],

/**
 * Allows you to define a "typed" property on given `target`.
 * @function module:object.defineProp
 * @param Type {TypeRef} - {String|Function}
 * @param target {TargetDescriptorTuple} - Target or array of target and descriptor ([target, descriptor]).
 * @param propName {String}
 * @param [defaultValue=undefined] {*}
 * @returns {TargetDescriptorTuple}
 */
defineProp = (Type, target, propName, defaultValue = undefined) => {
  const [_target, _descriptor] = toTargetDescriptorTuple(target),
        descriptor = _descriptor || createTypedDescriptor(Type, _target, propName);

  Object.defineProperty(_target, propName, descriptor);

  if (!isUndefined(defaultValue)) {
    _target[propName] = defaultValue;
  }

  return [_target, descriptor];
},

/**
 * Allows you to define a "typed", enumerated property on `target`.
 * @function module:object.defineEnumProp
 * @param Type {TypeRef} - {String|Function}
 * @param target {TargetDescriptorTuple} - Target or array of target and descriptor ([target, descriptor]).
 * @param propName {String}
 * @param [defaultValue=undefined] {*}
 * @returns {TargetDescriptorTuple}
 */
defineEnumProp = (Type, target, propName, defaultValue = undefined) => {
  const [_target, _descriptor] = toTargetDescriptorTuple(target),
        descriptor = _descriptor || createTypedDescriptor(Type, _target, propName);

  return defineProp(Type, toEnumerableDescriptor([_target, descriptor]), propName, defaultValue);
},

/**
 * Allows you to define multiple enum props at once on target.
 * @function module:object.defineEnumProps
 * @param argsTuple {Array.<DefinePropArgsTuple>} - Array of argArrays for `defineEnumProp`.
 * @param [target = undefined] {Target} - Target to use in internal calls if one is not provided but encountered 'argArray'.
 * @returns {Array.<TargetDescriptorTuple>} - Results of each call to `defineEnumProp`.
 */
defineEnumProps = curry(createDefinePropsMethod({
  enumerable: true
})),

/**
 * Allows you to define multiple props at once on target.
 * @function module:object.defineProps
 * @param argsTuple {Array.<DefinePropArgsTuple>} - Array of argArrays for `defineProp`.
 * @param [target = undefined] {Target} - Target to use in internal calls if one is not provided but encountered 'argArray'.
 * @returns {Array.<TargetDescriptorTuple>} - Results of each call to `defineProp`.
 * @curried
 */
defineProps = curry(createDefinePropsMethod({
  enumerable: false
}));
/** ============================================================= */

/** Type definitions:                                             */

/** ============================================================= */

/**
 * @typedef {*} Target
 */

/**
 * @typedef {Object} Descriptor
 */

/**
 * @typedef {Array<Target, Descriptor>} TargetDescriptorTuple
 */

/**
 * @typedef {Array.<TypeRef, TargetDescriptorTuple, String, *>}  DefinePropArgsTuple
 * @description Arguments list for `defineProp` and/or `defineEnumProp` (note: some
 *  parts of array/tuple are options (namely the last two args));  E.g.,
 *  ```
 *  [String, [someTarget], 'somePropName', 'someDefaultValue] // ...
 *  ```
 */

/**
 * @typedef {Function} PropsDefinerCall
 * @description Same type as `defineProp` and `defineEnumProp`
 * @param argsTuple {DefinePropArgsTuple}
 * @param target {Target}
 * @returns {Array.<TargetDescriptorTuple>}
 */

const 
/**
 * Merges all objects down into one (takes two or more args).
 * @function module:object.assignDeep
 * @param obj0 {Object}
 * @param [objs] {...{Object}} - One or more objects to merge onto `obj0`.
 * @returns {Object}
 */
assignDeep = curry2((obj0, ...objs) => !obj0 ? obj0 : objs.reduce((topAgg, obj) => !obj ? topAgg : keys(obj).reduce((agg, key) => {
  let propDescription = Object.getOwnPropertyDescriptor(agg, key); // If property is not writable move to next item in collection

  if (agg.hasOwnProperty(key) && propDescription && !(propDescription.get && propDescription.set) && !propDescription.writable) {
    return agg;
  }

  if (isObject(agg[key]) && isObject(obj[key])) {
    assignDeep(agg[key], obj[key]);
  } else {
    agg[key] = obj[key];
  }

  return agg;
}, topAgg), obj0));

/**
 *  List operations that overlap (apart from globally overlapping props and functions like `length`)
 *      on both strings and arrays.
 */
const 
/**
 * Concats/appends all functors onto the end of first functor.
 * Note:  functors passed in after the first one must be of the same type.
 * @function module:jsPlatform.concat
 * @param functor {Array|Object|*}
 * @param ...functor {Array|Object|*}
 * @return {*|Array|Object} - The type passed.
 * @throws {Error} - When passed in object doesn't have an `every` method.
 */
concat = fPureTakesOneOrMore('concat'),

/**
 * Same as Array.prototype.slice
 * @function module:list.slice
 * @param separator {String|RegExp}
 * @param arr{Array}
 * @returns {Array}
 */
slice = fPureTakes2('slice'),

/**
 * `Array.prototype.includes` or shim.
 * @function module:list.includes
 * @param value {*}
 * @param xs {Array|String}
 * @returns {Boolean}
 */
includes = (() => 'includes' in Array.prototype ? fPureTakesOne('includes') : (value, xs) => xs.indexOf(value) > -1)(),

/**
 * Searches list/list-like for given element `x`.
 * @function module:list.indexOf
 * @param x {*} - Element to search for.
 * @param xs {Array|String|*} - list or list like to look in.
 * @returns {Number} - `-1` if element not found else index at which it is found.
 */
indexOf = fPureTakesOne('indexOf'),

/**
 * Last index of (`Array.prototype.lastIndexOf`).
 * @function module:list.lastIndexOf
 * @param x {*} - Element to search for.
 * @param xs {Array|String|*} - list or list like to look in.
 * @returns {Number} - `-1` if element not found else index at which it is found.
 */
lastIndexOf = fPureTakesOne('lastIndexOf');

/**
 * @module boolean
 * @description Contains functional version of 'always-true', 'always-false', 'is-truthy', and 'is-falsy'.
 */
const  
/**
 * Returns `false`.
 * @function module:boolean.alwaysFalse
 * @returns {Boolean}
 */
alwaysFalse = () => false,

/**
 * Equality operator.
 * @function module:boolean.equal
 * @param a {*}
 * @param b {*}
 * @returns {boolean}
 */
equal = curry((a, b) => a === b),

/**
 * Equality operator for all.
 * @function module:boolean.equalAll
 * @param a {*} - Item `0`.
 * @param args {...*} - Others
 * @returns {boolean}
 */
equalAll = curry2((a, ...args) => args.every(b => equal(a, b)));

/**
 * Maps a function onto a List (string or array) or a functor (value containing a map method).
 * @function module:list.map
 * @param fn {Function} - Function to map on given value.
 * @param xs {Array|String|*}
 * @returns {Array|String|*}
 */

const map$1 = curry((fn, xs) => {
  if (!isset(xs)) {
    return xs;
  }

  let out = of(xs),
      limit,
      i = 0;

  switch (typeOf(xs)) {
    case 'Array':
      limit = length(xs);

      if (!limit) {
        return out;
      }

      for (; i < limit; i += 1) {
        out.push(fn(xs[i], i, xs));
      }

      return out;

    case 'String':
      limit = length(xs);

      if (!xs) {
        return out;
      }

      for (; i < limit; i += 1) {
        out += fn(xs[i], i, xs);
      }

      return out;

    default:
      if (isFunctor(xs)) {
        return xs.map(fn);
      } // Other objects


      return Object.keys(xs).reduce((agg, key) => {
        out[key] = fn(xs[key], key, xs);
        return out;
      }, out);
  }
});

const 
/**
 * Pushes incoming `item` onto given array and returns said array.
 * @private
 * @param agg {Array}
 * @param item {*}
 * @returns {Array}
 */
aggregateArray = (agg, item) => {
  agg.push(item);
  return agg;
};

/**
 * List operator utils module.
 * @module listUtils
 */
const 
/**
 * Returns a slice of the given list from `startInd` to the end of the list.
 * @function module:listUtils.sliceFrom
 * @param startInd {Number}
 * @param xs {Array|String|*}
 * @returns {Array|String|*}
 */
sliceFrom = curry((startInd, xs) => slice(startInd, undefined, xs)),

/**
 * Slices from index `0` to given index.
 * @function module:listUtils.sliceTo
 * @param toInd {Number}
 * @param xs {Array|String|*}
 * @returns {Array|String|*}
 */
sliceTo = curry((toInd, xs) => slice(0, toInd, xs)),

/**
 * Slices a copy of list.
 * @function listUtils.sliceCopy
 * @param xs {Array|String|*}
 * @returns {Array|String|*}
 */
sliceCopy = sliceFrom(0),

/**
 * Generic 'ascending order' ordering function (use by the likes of `list.sort` etc.)
 * @function module:listUtils.genericAscOrdering
 * @param a {*}
 * @param b {*}
 * @returns {number}
 */
genericAscOrdering = curry((a, b) => {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }

  return 0;
}),

/**
 * Returns length of all passed lists in list.
 * @function module:listUtils.lengths
 * @param lists ...{Array|String|*}
 * @returns {Array|String|*}
 */
lengths = curry2((...lists) => map$1(length, lists)),

/**
 * Returns a list of lists trimmed to the shortest length in given list of lists.   @background This method is used by the `zip*` functions to achieve their
 *  'slice to smallest' functionality.
 * @function module:listUtils.toShortest
 * @param lists {...(Array|String|*)}
 * @returns {Array|String|*}
 */
toShortest = curry2((...lists) => {
  const listLengths = apply(lengths, lists),
        smallLen = Math.min.apply(Math, listLengths);
  return map$1((list, ind) => listLengths[ind] > smallLen ? sliceTo(smallLen, list) : sliceCopy(list), lists);
}),

/**
 * Reduces until predicate.
 * @function module:listUtils.reduceUntil
 * @param pred {Function} - `(item, index, list) => Boolean(...)`
 * @param op {Function} - Operation - `(agg, item, index, list) => agg`
 * @param agg {*} - Zero value.
 * @param xs {Array|String|*} - List.
 * @returns {*}
 */
reduceUntil = curry((pred, op, agg, xs) => {
  const limit = length(xs);

  if (!limit) {
    return agg;
  }

  let ind = 0,
      result = agg;

  for (; ind < limit; ind++) {
    if (pred(xs[ind], ind, xs)) {
      break;
    }

    result = op(result, xs[ind], ind, xs);
  }

  return result;
}),

/**
 * Reduces until predicate (from right to left).
 * @function module:listUtils.reduceUntilRight
 * @param pred {Function} - `(item, index, list) => Boolean(...)`
 * @param op {Function} - Operation - `(agg, item, index, list) => agg`
 * @param agg {*} - Zero value.
 * @param xs {Array|String|*} - List.
 * @returns {*}
 */
reduceUntilRight = curry((pred, op, agg, arr) => {
  const limit = length(arr);

  if (!limit) {
    return agg;
  }

  let ind = limit - 1,
      result = agg;

  for (; ind >= 0; ind--) {
    if (pred(arr[ind], ind, arr)) {
      break;
    }

    result = op(result, arr[ind], ind, arr);
  }

  return result;
}),

/**
 * Reduces a list with given operation (`op`) function.
 * @function module:listUtils.reduce
 * @param op {Function} - Operation - `(agg, item, index, list) => agg`
 * @param agg {*} - Zero value.
 * @param xs {Array|String|*} - List.
 * @returns {*}
 */
reduce$1 = reduceUntil(alwaysFalse),

/**
 * Reduces a list with given operation (`op`) function (from right-to-left).
 * @function module:listUtils.reduceRight
 * @param op {Function} - Operation - `(agg, item, index, list) => agg`
 * @param agg {*} - Zero value.
 * @param xs {Array|String|*} - List.
 * @returns {*}
 */
reduceRight$1 = reduceUntilRight(alwaysFalse),

/**
 * Gets last index of a list/list-like (Array|String|Function etc.).
 * @function module:listUtils.lastIndex
 * @param x {Array|String|*} - list like or list.
 * @returns {Number} - `-1` if no element found.
 */
lastIndex = x => {
  const len = length(x);
  return len ? len - 1 : 0;
},

/**
 * Finds index in string or list.
 * @function module:listUtils.findIndexWhere
 * @param pred {Function} - Predicate<element, index, arr>.
 * @param arr {Array|String}
 * @returns {Number} - `-1` if predicate not matched else `index` found
 */
findIndexWhere = curry((pred, arr) => {
  let ind = 0;
  const limit = length(arr);

  for (; ind < limit; ind += 1) {
    const predicateFulfilled = !!pred(arr[ind], ind, arr);

    if (predicateFulfilled) {
      return ind;
    }
  }

  return -1;
}),

/**
 * Finds index in list from right to left.
 * @function module:listUtils.findIndexWhereRight
 * @param pred {Function} - Predicate<element, index, arr>.
 * @param arr {Array|String}
 * @returns {Number} - `-1` if predicate not matched else `index` found
 */
findIndexWhereRight = curry((pred, arr) => {
  let ind = length(arr) - 1;

  for (; ind >= 0; ind -= 1) {
    const predicateFulfilled = !!pred(arr[ind], ind, arr);

    if (predicateFulfilled) {
      return ind;
    }
  }

  return -1;
}),

/**
 * @function module:listUtils.findIndicesWhere
 * @param pred {Function}
 * @param xs {Array|String|*} - list or list like.
 * @returns {Array|undefined}
 */
findIndicesWhere = curry((pred, xs) => {
  const limit = length(xs);
  let ind = 0,
      out = [];

  for (; ind < limit; ind++) {
    if (pred(xs[ind], ind, xs)) {
      out.push(ind);
    }
  }

  return out.length ? out : undefined;
}),

/**
 * @function module:listUtils.findWhere
 * @param pred {Function}
 * @param xs {Array|String|*} - list or list like.
 * @returns {*}
 */
findWhere = curry((pred, xs) => {
  let ind = 0,
      limit = length(xs);

  if (!limit) {
    return;
  }

  for (; ind < limit; ind++) {
    let elm = xs[ind];

    if (pred(elm, ind, xs)) {
      return elm;
    }
  }

  return undefined;
});

const objUnion = curry((obj1, obj2) => assignDeep(obj1, obj2)),
      objIntersect = curry((obj1, obj2) => reduce$1((agg, key) => {
  if (obj2.hasOwnProperty(key)) {
    agg[key] = obj2[key];
  }

  return agg;
}, {}, keys(obj1))),
      objDifference = curry((obj1, obj2) => reduce$1((agg, key) => {
  if (!obj2.hasOwnProperty(key)) {
    agg[key] = obj1[key];
  }

  return agg;
}, {}, keys(obj1))),
      objComplement = curry2((obj0, ...objs) => reduce$1((agg, obj) => assignDeep(agg, objDifference(obj, obj0)), {}, objs));

/**
 * @module console
 * @description Console exports.
 */
const  
/**
 * `Console.log` method.
 * @function module:console.log
 * @params args {...*}
 * @returns {void}
 */
log = console.log.bind(console),

/**
 * `Console.error` method.
 * @function module:console.error
 * @params args {...*}
 * @returns {void}
 */
error = console.error.bind(console),

/**
 * `Console.warn`.
 * @function module:console.warn
 * @param args {...*}
 * @returns {void}
 */
warn = console.warn.bind(console);

/**
 * @memberOf function
 */
const  
/**
 * Takes a function that takes two parameters and returns a negated version of given
 * function.
 * @function module:_negate.negateF2
 * @param fn {Function}
 * @returns {Function}
 */
negateF2 = fn => curry((a, b) => !fn(a, b)),

/**
 * Takes a function that takes three parameters and returns a
 * negated version of given function.
 * @function module:_negate.negateF3
 * @param fn {Function}
 * @returns {Function}
 */
negateF3 = fn => curry((a, b, c) => !fn(a, b, c));

const 
/**
 * Run `operation` until predicate returns `true` (like a functional
 *  version of a while loop).
 * @function module:function.until
 * @param predicate {Function} :: a -> Boolean
 * @param operation {Function} :: a -> a
 * @param typeInstance {*} :: * - A monoidal zero or some starting point.
 * @returns {*} - What ever type `typeInstance` is
 */
until = curry((predicate, operation, typeInstance) => {
  let result = typeInstance;

  while (!predicate(result)) {
    result = operation(result);
  }

  return result;
});

/**
 * @module function
 */

/**
 * @module object
 */
/**
 * Normalizes step for `from` and `to` combination.
 * @function module:list.normalizeStep
 * @param from {Number}
 * @param to {Number}
 * @param [step = 1] {Number}
 * @returns {Number}
 * @private
 */

const normalizeStep = (from, to, step) => {
  if (from > to) {
    return step > 0 ? -step : step; // make step negative
  }

  return step < 0 ? -1 * step : step; // make step positive
};

const 
/**
 * Range function - gives you an array contain numbers in given range.
 * @note normalizes `step` to be valid if range numbers given are invalid
 *  (forces `step` to be negative if range required is in the negative direction
 *  and forces `step` to be positive if range required is in the other direction).
 * @function module:list.range
 * @param from {Number}
 * @param to {Number}
 * @param [step = 1] {Number}
 * @returns {Array.<Number>}
 */
range = curry((from, to, step = 1) => {
  let i = from;
  const out = [];
  step = normalizeStep(from, to, step);

  if (step === 0 || from === to) {
    return [from];
  }

  for (; (to - i) * step >= 0; i += step) {
    out.push(i);
  }

  return out;
});

/**
 * Created by elydelacruz on 9/6/2017.
 */
/**
 * Functional version of `String.prototype.split`.
 * @function module:jsPlatform.split
 * @param separator {String|RegExp}
 * @param str {String}
 * @returns {Array}
 */

const split = fPureTakesOne('split');

/**
 * List operations module.
 * @module list
 */
const  
/**
 * Append two, or more, lists, i.e.,
 * @example
 * expectEqual(append(take(13, alphabetString), drop(13, alphabetString)), alphabetString); // true
 *
 * // Another example
 * const result = append(
 *   alphabetStr.split(''),
 *   alphabetStr.split('')
 * ),
 * expected = repeat(2, alphabetStr).split('');
 *
 * shallowEquals(result, expected) === true // `true`
 *
 * @function module:list.append
 * @param [args] {...(Array|String|*)} - One or more lists or list likes (strings etc.).
 * @returns {(Array|String|*)} - Same type as list like passed in.
 * @curried - Curried at upto 2 arguments.
 */
append = curry2((...args) => apply(concat, args)),

/**
 * Returns head of list (first item of list).
 * @haskellType `head :: [a] -> a`
 * @function module:list.head
 * @param x {Array|String}
 * @returns {*} - First item from list
 */
head = x => x[0],

/**
 * Returns last item of list.
 * @haskellType `last :: [a] -> a`
 * @function module:list.last
 * @param xs {Array|String}
 * @returns {*}
 */
last = xs => xs[lastIndex(xs)],

/**
 * Returns tail part of list (everything after the first item as new list).
 * @haskelType `tail :: [a] -> [a]`
 * @function module:list.tail
 * @param xs {Array|String}
 * @returns {Array|String}
 */
tail = xs => sliceFrom(1, xs),

/**
 * Returns everything except last item of list as new list.
 * @haskellType `init :: [a] -> [a]`
 * @function module:list.init
 * @param xs {Array|String}
 * @returns {Array|String}
 */
init = xs => sliceTo(lastIndex(xs), xs),

/**
 * Returns `head` and `tail` of passed in list/string in a tuple.
 * @haskellType `uncons :: [a] -> Maybe (a, [a])`
 * @function module:list.uncons
 * @param xs {Array|String}
 * @returns {Array|undefined}
 */
uncons = xs => !xs || length(xs) === 0 ? undefined : [head(xs), tail(xs)],

/**
 * Returns `tail` and `head` of passed in list/string in a tuple.
 * @haskellType `unconsr :: [a] -> Maybe ([a], a)`
 * @function module:list.unconsr
 * @param xs {Array|String}
 * @returns {Array|String|*|undefined}
 */
unconsr = xs => !xs || length(xs) === 0 ? undefined : [init(xs), last(xs)],

/**
 * Concatenates all the elements of a container of lists.
 * @haskellType `concat :: Foldable t => t [a] -> [a]`
 * @function module:list.concat
 * @param xs {Array}
 * @returns {Array}
 */
concat$1 = xs => {
  switch (length(xs)) {
    case undefined:
    case 0:
      return [];

    case 1:
      const item0 = xs[0];
      return item0 && item0.slice ? sliceCopy(item0) : item0;

    case 2:
    default:
      return apply(append, xs);
  }
},

/**
 * Map a function over all the elements of a container and concatenate the resulting lists.
 * @haskellType `concatMap :: Foldable t => (a -> [b]) -> t a -> [b]`
 * @function module:list.concatMap
 * @param fn {Function}
 * @param foldableOfA {Array}
 * @returns {Array}
 */
concatMap = curry((fn, foldableOfA) => concat$1(map$1(fn, foldableOfA))),

/**
 * Returns a copy of the passed in list reverses.
 * @haskellType `reverse :: [a] -> [a]`
 * @function module:list.reverse
 * @param xs {Array|String}
 * @returns {Array|String}
 */
reverse$1 = xs => {
  if (!isset(xs) || !xs.length) {
    return xs;
  }

  let out = of(xs),
      i = xs.length - 1;

  switch (typeOf(xs)) {
    case 'String':
      for (; i >= 0; i -= 1) {
        out += xs[i];
      }

      return out;

    default:
      for (; i >= 0; i -= 1) {
        out.push(xs[i]);
      }

      return out;
  }
},

/**
 * Takes an element and a list and `intersperses' that element between the
 *  elements of the list.
 * @function module:list.intersperse
 * @note In our version of the function javascript is loosely typed so,
 *  so is our function (to much overhead to make it typed) so `between` can be any value.
 * @param between {*} - Should be of the same type of elements contained in list.
 * @param arr {Array|String} - List.
 * @returns {Array|String}
 */
intersperse = curry((between, xs) => {
  if (!xs || !xs.length) {
    return xs;
  }

  const limit = xs.length,
        lastInd = limit - 1;
  let out = of(xs),
      i = 0;

  if (isString(xs)) {
    for (; i < limit; i += 1) {
      out += i === lastInd ? xs[i] : xs[i] + between;
    }

    return out;
  }

  for (; i < limit; i += 1) {
    if (i === lastInd) {
      out.push(xs[i]);
    } else {
      out.push(xs[i], between);
    }
  }

  return out;
}),

/**
 * `intercalate xs xss` is equivalent to (concat (intersperse xs xss)). It inserts the list xs in between the lists in xss and concatenates the result.
 * @haskellType `intercalate :: [a] -> [[a]] -> [a]`
 * @function module:list.intercalate
 * @param xs {Array|String}
 * @param xss {Array|String}
 * @returns {Array|String}
 */
intercalate = curry((xs, xss) => {
  if (isString(xss)) {
    return intersperse(xs, xss);
  }

  return concat$1(intersperse(xs, xss));
}),

/**
 * Returns an array with the given indices swapped.
 * @function module:list.swapped
 * @param ind1 {Number}
 * @param ind2 {Number}
 * @param list {Array}
 * @returns {Array} - Copy of incoming with swapped values at indices.
 */
swapped = curry((ind1, ind2, list) => {
  const out = sliceCopy(list),
        tmp = out[ind1];
  out[ind1] = out[ind2];
  out[ind2] = tmp;
  return out;
}),

/**
 * Left associative fold.  Reduces a container of elements down by the given operation (same as [].reduce).
 * @function module:list.foldl
 * @param fn {Function}
 * @param zero {*} - Aggregator.
 * @param functor {Array}
 * @returns {*} - Whatever type is lastly returned from `fn`.
 */
foldl = reduce$1,

/**
 * A variant of `foldl` except that this one doesn't require the starting point.  The starting point/value will be pulled
 * out from a copy of the container.
 * @function module:list.foldl1
 * @param op {Function}
 * @param xs {Array}
 * @returns {*} - Whatever type is lastly returned from `op`.
 */
foldl1 = curry((op, xs) => {
  const parts = uncons(xs);
  return !parts ? [] : reduce$1(op, parts[0], parts[1]);
}),

/**
 * A variant of `foldr` except that this one doesn't require the starting point/value.  The starting point/value will be pulled
 * out from a copy of the container.
 * @function module:list.foldr1
 * @param op {Function}
 * @param xs {Array}
 * @returns {*} - Whatever type is lastly returned from `op`.
 */
foldr1 = curry((op, xs) => {
  const parts = unconsr(xs);
  return !parts ? [] : reduceRight$1(op, parts[1], parts[0]);
}),

/**
 * Performs a map then a reduce all in one (from left-to-right). Returns a tuple
 * containing the aggregated value and the result of mapping the passed in function on passed in list.
 * @function module:list.mapAccumL
 * @param op {Function} - Function<aggregator, item, index> : [aggregated, mapResult]
 * @param zero {*} - An instance of the passed in list type used to aggregateArray on.
 * @param xs {Array} - list type.
 * @return {Array} - [aggregated, list]
 */
mapAccumL = curry((op, zero, xs) => {
  const list = sliceCopy(xs),
        limit = length(xs);

  if (!limit) {
    return [zero, list];
  }

  let ind = 0,
      agg = zero,
      mapped = [],
      tuple;

  for (; ind < limit; ind++) {
    tuple = op(agg, list[ind], ind);
    agg = tuple[0];
    mapped = tuple[1];
  }

  return [agg, mapped];
}),

/**
 * Performs a map and a reduce all in one (from right-to-left). Returns a tuple
 * containing the aggregated value and the result of mapping the passed in function on passed in list.
 * @function module:list.mapAccumR
 * @param op {Function} - Function<aggregator, item, index> : [aggregated, mapResult]
 * @param zero {*} - An instance of the passed in list type used to aggregateArray on.
 * @param xs {Array} - list type.
 * @return {Array} - [aggregated, list]
 */
mapAccumR = curry((op, zero, xs) => {
  const list = sliceCopy(xs),
        limit = length(xs);

  if (!limit) {
    return [zero, list];
  }

  let ind = limit - 1,
      agg = zero,
      mapped = [],
      tuple;

  for (; ind >= 0; ind--) {
    tuple = op(agg, list[ind], ind);
    agg = tuple[0];
    mapped = tuple[1];
  }

  return [agg, mapped];
}),

/**
 * iterate f x returns an infinite list of repeated applications of f to x.
 * @function module:list.iterate
 * @example `iterate(5, f, x) == [x, f(x), f(f(x)), ...]`
 * @param limit {Number}
 * @param op {Function} - Operation.
 * @param x {*} - Starting point.
 * @returns {*}
 */
iterate = curry((limit, op, x) => {
  let ind = 0,
      out = [],
      lastX = x;

  for (; ind < limit; ind += 1) {
    out.push(lastX);
    lastX = op(lastX, ind);
  }

  return out;
}),

/**
 * Repeats `x` `limit` number of times.
 * @function module:list.repeat
 * @param limit {Number}
 * @param x {*}
 * @return {Array}
 */
repeat = curry((limit, x) => iterate(limit, a => a, x)),

/**
 * Same as `repeat` due to the nature of javascript (see haskell version for usage).
 * @function module:list.replicate
 * @param limit {Number}
 * @param x {*}
 * @return {Array}
 */
replicate = repeat,

/**
 * Replicates a list `limit` number of times and appends the results (concat)
 * @function module:list.cycle
 * @param limit {Number}
 * @param xs {Array}
 * @returns {Array}
 */
cycle = curry((limit, xs) => concat$1(replicate(limit, xs))),

/**
 * Unfolds a value into a list of somethings.
 * @haskellType `unfoldr :: (b -> Maybe (a, b)) -> b -> [a]`
 * @function module:list.unfoldr
 * @param op {Function} - Operation to perform (should return a two component tuple (item to aggregateArray and item to unfold in next iteration).
 * @param x {*} - Starting parameter to unfold from.
 * @returns {Array} - An array of whatever you return from `op` yielded.
 */
unfoldr = curry((op, x) => {
  let ind = 0,
      out = [],
      resultTuple = op(x, ind, out);

  while (resultTuple) {
    out.push(resultTuple[0]);
    resultTuple = op(resultTuple[1], ++ind, out);
  }

  return out;
}),

/**
 * Finds index in string or list (alias for `findIndex`).
 * @function module:list.findIndex
 * @param pred {Function} - Predicate<element, index, arr>.
 * @param arr {Array|String}
 * @returns {Number} - `-1` if predicate not matched else `index` found
 */
findIndex = findIndexWhere,

/**
 * @function module:list.findIndices
 * @param pred {Function}
 * @param xs {Array} - list or list like.
 * @returns {Array|undefined}
 */
findIndices = findIndicesWhere,

/**
 * @function module:list.elemIndex
 * @param x {*} - Element to search for.
 * @param xs {Array} - list or list like.
 * @returns {*}
 */
elemIndex = curry((x, xs) => {
  const foundInd = indexOf(x, xs);
  return foundInd !== -1 ? foundInd : undefined;
}),

/**
 * @function module:list.elemIndices
 * @param value {*} - Element to search for.
 * @param xs {Array} - list or list like.
 * @returns {*}
 */
elemIndices = curry((value, xs) => findIndices(x => x === value, xs)),

/**
 * Splits `x` in two at given `index` (exclusive (includes element/character at
 * given index in second part of returned list)).
 * @function module:list.splitAt
 * @param ind {Number} - Index to split at.
 * @param list {Array|String} - functor (list or string) to split.
 * @returns {Array|String} - List like type passed
 */
splitAt = (ind, list) => [sliceTo(ind, list), sliceFrom(ind, list)],

/**
 * Gives an list with passed elements while predicate was true.
 * @function module:list.takeWhile
 * @param pred {Function} - Predicate<*, index, list|string>
 * @param list {Array|String}
 * @returns {Array}
 */
takeWhile = curry((pred, list) => reduceUntil(negateF3(pred), // predicate
isString(list) ? (agg, x) => agg + x : aggregateArray, // operation
of(list), // aggregate
list)),

/**
 * Returns an list without elements that match predicate.
 * @function module:list.dropWhile
 * @param pred {Function} - Predicate<*, index, list|string>
 * @param list {Array|String}
 * @refactor
 * @returns {Array|String}
 */
dropWhile = curry((pred, list) => {
  const limit = length(list),
        splitPoint = findIndexWhere((x, i, xs) => !pred(x, i, xs), list);
  return splitPoint === -1 ? sliceFrom(limit, list) : slice(splitPoint, limit, list);
}),

/**
 * @function module:list.dropWhileEnd
 * @param pred {Function} - Predicate<*, index, list|string>
 * @param list {Array|String}
 * @refactor
 * @returns {Array|String}
 */
dropWhileEnd = curry((pred, list) => {
  const splitPoint = findIndexWhereRight((x, i, xs) => !pred(x, i, xs), list);

  if (splitPoint === -1) {
    return of(list);
  }

  return sliceTo(splitPoint + 1, list);
}),

/**
 * Gives you the `span` of items matching predicate
 * and items not matching predicate;  E.g., Gives an
 * array of arrays;  E.g., [[matching-items], [non-matching-items]]
 * @function list.span
 * @param pred {Function} - List predicate (`(x, i, list) => bool`)
 * @param list {Array|String}
 * @returns {(Array<Array<*>>|Array<String>)}
 * @type {Function}
 */
span = curry((pred, list) => {
  const splitPoint = findIndexWhere(negateF3(pred), list);
  return splitPoint === -1 ? [sliceFrom(0, list), of(list)] : splitAt(splitPoint, list);
}),

/**
 * breakOnList, applied to a predicate p and a list xs, returns a tuple
 * where first element is longest prefix (possibly empty) of xs of elements
 * that do not satisfy p and second element is the remainder of the list:
 * @haskellExample
 * Replace `break` with `breakOnList` for our version.
 * ```
 * breakOnList (> 3) [1,2,3,4,1,2,3,4] == ([1,2,3],[4,1,2,3,4])
 * breakOnList (< 9) [1,2,3] == ([],[1,2,3])
 * breakOnList (> 9) [1,2,3] == ([1,2,3],[])
 * ```
 * @function module:list.breakOnList
 * @param pred {Function}
 * @param list {Array|String|*}
 * @returns {Array}
 */
breakOnList = curry((pred, list) => {
  const splitPoint = findIndexWhere(negateF3(pred), list);
  return splitPoint === -1 ? [of(list), sliceFrom(0, list)] : reverse$1(splitAt(splitPoint, list));
}),

/**
 * For each function (same as `[].forEach` except in functional format).
 * @function module:list.forEach
 * @param fn {Function} - Operation (`(element, index, list) => {...}`, etc.)
 * @param xs {(Array|String)}
 * @returns {void}
 */
forEach$1 = curry((fn, list) => {
  const limit = length(list);

  if (!limit) {
    return;
  }

  let ind = 0;

  for (; ind < limit; ind += 1) {
    fn(list[ind], ind, list);
  }
}),

/**
 * Filters a structure of elements using given predicate (`pred`) (same as `[].filter`).
 * @function module:list.filter
 * @param pred {Function}
 * @param xs {Array} - list or list like.
 * @returns {Array} - Structure of filtered elements.
 */
filter$1 = curry((pred, xs) => {
  let ind = 0,
      limit = length(xs),
      out = [];

  if (!limit) {
    return out;
  }

  for (; ind < limit; ind++) {
    if (pred(xs[ind], ind, xs)) {
      out.push(xs[ind]);
    }
  }

  return out;
}),

/**
 * Partitions a list on a predicate;  Items that match predicate are in first list in tuple;  Items that
 * do not match the tuple are in second list in the returned tuple.
 *  Essentially `[filter(p, xs), filter(negateF3(p), xs)]`.
 * @function module:list.partition
 * @param pred {Function} - Predicate<item, index, originalArrayOrString>
 * @param list {Array}
 * @returns {Array|String} - Tuple of arrays or strings (depends on incoming list (of type list or string)).
 */
partition = curry((pred, list) => !length(list) ? [[], []] : [filter$1(pred, list), filter$1(negateF3(pred), list)]),

/**
 * The opposite of `elem` - Returns a boolean indicating whether an element exists in given list.
 * @function module:list.notElem
 * @param element {*}
 * @param xs {Array}
 * @returns {Boolean}
 */
notElem = negateF2(includes),

/**
 * Checks if list `xs1` is a prefix of list `xs2`
 * @function module:list.isPrefixOf
 * @param xs1 {Array|String|*}
 * @param xs2 {Array|String|*}
 * @returns {boolean}
 */
isPrefixOf = curry((xs1, xs2) => {
  const limit1 = length(xs1),
        limit2 = length(xs2);

  if (limit2 < limit1 || !limit1 || !limit2 || indexOf(xs1[0], xs2) === -1) {
    return false;
  }

  let ind = 0;

  for (; ind < limit1; ind++) {
    if (xs1[ind] !== xs2[ind]) {
      return false;
    }
  }

  return true;
}),

/**
 * Checks if list `xs1` is a suffix of list `xs2`
 * @function module:list.isSuffixOf
 * @param xs1 {Array|String|*}
 * @param xs2 {Array|String|*}
 * @returns {boolean}
 */
isSuffixOf = curry((xs1, xs2) => {
  const limit1 = length(xs1),
        limit2 = length(xs2);

  if (limit2 < limit1 || !limit1 || !limit2 || indexOf(xs1[0], xs2) === -1) {
    return false;
  }

  let ind1 = limit1 - 1,
      ind2 = limit2 - 1;

  for (; ind1 >= 0; ind1--) {
    if (xs1[ind1] !== xs2[ind2]) {
      return false;
    }

    ind2 -= 1;
  }

  return true;
}),

/**
 * Checks if list `xs1` is an infix of list `xs2`
 * @function module:list.isInfixOf
 * @param xs1 {Array|String|*}
 * @param xs2 {Array|String|*}
 * @returns {boolean}
 */
isInfixOf = curry((xs1, xs2) => {
  const limit1 = length(xs1),
        limit2 = length(xs2);

  if (limit2 < limit1 || !limit1 || !limit2) {
    return false;
  }

  let ind1,
      foundLen,
      ind = 0;

  for (; ind < limit2; ind += 1) {
    foundLen = 0;

    for (ind1 = 0; ind1 < limit1; ind1 += 1) {
      if (xs2[ind1 + ind] === xs1[ind1]) {
        foundLen += 1;
      }

      if (foundLen === limit1) {
        return true;
      }
    }
  }

  return false;
}),

/**
 * Checks if list `xs1` is a sub-sequence of list `xs2`
 * @function module:list.isSubsequenceOf
 * @param xs1 {Array|String|*}
 * @param xs2 {Array|String|*}
 * @returns {boolean}
 */
isSubsequenceOf = curry((xs1, xs2) => {
  const len = Math.pow(2, length(xs2)),
        lenXs1 = length(xs1);
  let foundLen, i;

  for (i = 0; i < len; i += 1) {
    foundLen = 0;

    for (let j = 0; j < len; j += 1) {
      if (i & 1 << j && indexOf(xs2[j], xs1) > -1) {
        foundLen += 1;
      }

      if (foundLen === lenXs1) {
        return true;
      }
    }
  }

  return false;
}),

/**
 * Allows you to group items in a list based on your supplied equality check.
 * @note Sames `group` but allows you to specify equality operation.
 * @haskellType `groupBy :: (a -> a -> Bool) -> [a] -> [[a]]`
 * @function module:list.groupBy
 * @param equalityOp {Function}
 * @param xs {Array}
 * @returns {*}
 */
groupBy = curry((equalityOp, xs) => {
  const limit = length(xs);

  if (!limit) {
    return sliceCopy(xs);
  }

  let ind = 0,
      prevItem,
      item,
      predOp = x => {
    if (equalityOp(x, prevItem)) {
      ind++;
    }

    if (equalityOp(x, item)) {
      prevItem = x;
      return true;
    }

    return false;
  },
      agg = [];

  for (; ind < limit; ind += 1) {
    item = xs[ind];
    agg.push(takeWhile(predOp, slice(ind, limit, xs)));
  }

  return agg;
}),

//map(list => tail(list), xs),

/**
 * Strips prefix list from given list
 * @function module:list.stripPrefix
 * @param prefix {Array|String|*}
 * @param list {Array|string|*}
 * @returns {Array|*}
 */
stripPrefix = curry((prefix, list) => isPrefixOf(prefix, list) ? splitAt(length(prefix), list)[1] : sliceCopy(list)),

/**
 * zip takes two lists and returns a list of corresponding pairs.
 * If one input list is short, excess elements of the longer list are discarded.
 * @haskellType `zip :: [a] -> [b] -> [(a, b)]`
 * @function module:list.zip
 * @param arr1 {Array}
 * @param arr2 {Array}
 * @returns {Array<Array<*,*>>}
 */
zip = curry((arr1, arr2) => {
  if (!length(arr1) || !length(arr2)) {
    return [];
  }

  const [a1, a2] = toShortest(arr1, arr2);
  return reduce$1((agg, item, ind) => aggregateArray(agg, [item, a2[ind]]), [], a1);
}),

/**
 * zipN takes one or more lists and returns a list containing lists of all indices
 * at a given index, index by index.
 * If one input list is short, excess elements of the longer list are discarded.
 * @function module:list.zipN
 * @param lists {Array|String} - One ore more lists of the same type.
 * @returns {Array}
 */
zipN = curry2((...lists) => {
  const trimmedLists = apply(toShortest, lists);
  return reduce$1((agg, item, ind) => aggregateArray(agg, map$1(xs => xs[ind], trimmedLists)), [], trimmedLists[0]);
}),

/**
 * @haskellType `zip3 :: [a] -> [b] -> [c] -> [(a, b, c)]`
 * @function module:list.zip3
 * @param arr1 {Array}
 * @param arr2 {Array}
 * @param arr3 {Array}
 * @returns {Array<Array<*,*>>}
 */
zip3 = curry((arr1, arr2, arr3) => zipN(arr1, arr2, arr3)),

/**
 * @haskellType `zip4 :: [a] -> [b] -> [c] -> [d] -> [(a, b, c, d)]`
 * @function module:list.zip4
 * @param arr1 {Array}
 * @param arr2 {Array}
 * @param arr3 {Array}
 * @param arr4 {Array}
 * @returns {Array<Array<*,*>>}
 */
zip4 = curry((arr1, arr2, arr3, arr4) => zipN(arr1, arr2, arr3, arr4)),

/**
 * @haskellType `zip5 :: [a] -> [b] -> [c] -> [d] -> [e] -> [(a, b, c, d, e)]`
 * @function module:list.zip5
 * @param arr1 {Array}
 * @param arr2 {Array}
 * @param arr3 {Array}
 * @param arr4 {Array}
 * @param arr5 {Array}
 * @returns {Array<Array<*,*>>}
 */
zip5 = curry((arr1, arr2, arr3, arr4, arr5) => zipN(arr1, arr2, arr3, arr4, arr5)),

/**
 * zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
 * zipWith generalises zip by zipping with the function given as the
 * first argument, instead of a function tupling function (function that returns a tuple). For example,
 * zipWith (+) is applied to two lists to produce the list of corresponding sums.
 * @note `_|_` means bottom or perpetual (@see
 *  - https://wiki.haskell.org/Bottom
 *  - https://stackoverflow.com/questions/19794681/what-does-this-syntax-mean-in-haskell-or
 *  )
 * @example
 * ```
 * zipWith f [] _|_ = []
 * ```
 * @haskellType `zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]`
 * @function module:list.zipWith
 * @param op {Function} - Takes two parts of a tuple and returns a tuple.
 *  E.g., ` op :: a -> b -> (a, b)`
 * @param xs1 {Array}
 * @param xs2 {Array}
 * @returns {Array<Array<*,*>>}
 */
zipWith = curry((op, xs1, xs2) => {
  if (!length(xs1) || !length(xs2)) {
    return [];
  }

  const [a1, a2] = toShortest(xs1, xs2);
  return reduce$1((agg, item, ind) => aggregateArray(agg, op(item, a2[ind])), [], a1);
}),

/**
 * Zips all given lists with tupling function. Note: Haskell types do not have
 *  a way (that I know of) to show one or more for params in a function so `@haskellType` below
 *  is left there for general purpose not for exactness as is told by aforementioned.
 * @haskellType `zipWithN :: (a -> b -> c) -> [a] -> [b] -> [c]` - Where `N` is the number
 *  of lists to zip.
 * @function module:list.zipWithN
 * @param op {Function} - Takes expected number of parts for tuple and returns a tuple
 *  of said parts:
 *  E.g., ` op :: a -> b -> c -> (a, b, c)`
 * @param lists ...{Array}
 * @returns {Array<Array<*,*>>}
 */
zipWithN = curry3((op, ...lists) => {
  const trimmedLists = apply(toShortest, lists),
        lenOfTrimmed = length(trimmedLists);

  if (!lenOfTrimmed) {
    return [];
  } else if (lenOfTrimmed === 1) {
    return sliceTo(length(trimmedLists[0]), trimmedLists[0]);
  }

  return reduce$1((agg, item, ind) => aggregateArray(agg, apply(op, map$1(xs => xs[ind], trimmedLists))), [], trimmedLists[0]);
}),

/**
 * Zips 3 lists with tupling function.
 * @haskellType `zipWith3 :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]`
 * @function module:list.zipWith3
 * @param op {Function} - Takes expected number of parts for tuple and returns a tuple
 *  of said parts:
 *  E.g., ` op :: a -> b -> c -> (a, b, c)`
 * @param xs1 {Array}
 * @param xs2 {Array}
 * @param xs3 {Array}
 * @returns {Array<Array<*,*>>}
 */
zipWith3 = curry((op, xs1, xs2, xs3) => zipWithN(op, xs1, xs2, xs3)),

/**
 * Zips 4 lists with tupling function.
 * @haskellType `zipWith4 :: (a -> b -> c -> d -> e) -> [a] -> [b] -> [c]  -> [d] -> [e]`
 * @function module:list.zipWith4
 * @param op {Function} - Takes expected number of parts for tuple and returns a tuple
 *  of said parts:
 *  E.g., ` op :: a -> b -> c -> d -> (a, b, c, d)`
 * @param xs1 {Array}
 * @param xs2 {Array}
 * @param xs3 {Array}
 * @param xs4 {Array}
 * @returns {Array<Array<*,*>>}
 */
zipWith4 = curry((op, xs1, xs2, xs3, xs4) => zipWithN(op, xs1, xs2, xs3, xs4)),

/**
 * Zips 5 lists.
 * @haskellType `zipWith5 :: (a -> b -> c -> d -> e -> f) -> [a] -> [b] -> [c]  -> [d] -> [e] -> [f]`
 * @function module:list.zipWith5
 * @param op {Function} - Takes expected number of parts for tuple and returns a tuple
 *  of said parts:
 *  E.g., ` op :: a -> b -> c -> d -> e -> (a, b, c, d, e)`
 * @param xs1 {Array}
 * @param xs2 {Array}
 * @param xs3 {Array}
 * @param xs4 {Array}
 * @param xs5 {Array}
 * @returns {Array<Array<*,*>>}
 */
zipWith5 = curry((op, xs1, xs2, xs3, xs4, xs5) => zipWithN(op, xs1, xs2, xs3, xs4, xs5)),

/**
 * unzip transforms a list of pairs into a list of first components and a list of second components.
 * @haskellType `unzip :: [(a, b)] -> ([a], [b])`
 * @function module:list.unzip
 * @param arr {Array|*}
 * @returns {Array|*}
 */
unzip = foldl((agg, item) => {
  agg[0].push(item[0]);
  agg[1].push(item[1]);
  return agg;
}, [[], []]),

/**
 * Returns true if any item in container passes predicate `p`.
 * @function module:list.any
 * @param p {Function} - Predicate.
 * @param xs {Array|String}
 * @returns {Boolean}
 */
any = curry((p, xs) => {
  let ind = 0,
      limit = length(xs);

  if (!limit) {
    return false;
  }

  for (; ind < limit; ind += 1) {
    if (p(xs[ind])) {
      return true;
    }
  }

  return false;
}),

/**
 * Returns true if all items in container pass predicate `p`.
 * @function module:list.all
 * @param p {Function} - Predicate.
 * @param xs {Array|String}
 * @returns {Boolean}
 */
all = curry((p, xs) => {
  const limit = length(xs);
  let ind = 0;

  if (!limit) {
    return false;
  }

  for (; ind < limit; ind++) {
    if (!p(xs[ind], ind, xs)) {
      return false;
    }
  }

  return true;
}),

/**
 * scanl is similar to foldl, but returns a list of successive reduced values from the left:
 * ```
 * scanl f z [x1, x2, ...] == [z, z `f` x1, (z `f` x1) `f` x2, ...]
 * ```
 * Also note that:
 * ```
 * last (scanl f z xs) == foldl f z xs.
 * ```
 * @function module:list.scanl
 * @param fn {Function}
 * @param zero {*}
 * @param xs {Array}
 * @returns {Array|*}
 */
scanl = curry((fn, zero, xs) => {
  if (!xs || !length(xs)) {
    return [];
  }

  const limit = length(xs);
  let ind = 0,
      result = zero,
      out = [];

  while (ind < limit) {
    result = fn(result, xs[ind], ind, xs);
    out.push(result);
    ind++;
  }

  return out;
}),

/**
 * `scanl1` is a variant of `scanl` that has no starting value argument:
 * `shallowCompare(scanl1(fn, [x1, x2, ...]), [x1, fn(x1, x2), ...]) // true`
 * @function module:list.scanl1
 * @param fn {Function}
 * @param xs {Array}
 * @returns {Array|*}
 */
scanl1 = curry((fn, xs) => {
  if (!xs || !xs.length) {
    return [];
  }

  return scanl(fn, head(xs), tail(xs));
}),

/**
 * Same as `scanl` but from the right (similiar to `foldr`'s relationship to 'foldl').
 * Note also `scanr`'s relationship ot `foldr`:
 * `head (scanr(fn, z, xs)) === foldr(fn, z, xs).
 * @function module:list.scanr
 * @param fn {Function}
 * @param zero {*}
 * @param xs {Array}
 * @returns {Array|*}
 */
scanr = curry((fn, zero, xs) => {
  if (!xs || !length(xs)) {
    return [];
  }

  const limit = length(xs);
  let ind = limit - 1,
      result = xs[0],
      out = [];

  while (ind > -1) {
    result = fn(result, xs[ind], ind, xs);
    out.push(result);
    ind--;
  }

  return out;
}),

/**
 * Same as `scanr` but takes no zero/accumulator value.
 * @function module:list.scanr1
 * @param fn {Function}
 * @param xs {Array}
 * @returns {Array|*}
 */
scanr1 = curry((fn, xs) => {
  if (!xs || !xs.length) {
    return [];
  }

  return scanr(fn, last(xs), init(xs));
}),

/**
 * `remove(x, xs)` removes the first occurrence of `x` from `xs`.
 * For example, `remove('a', 'banana') === 'bnana';`
 * @function module:list.remove
 * @param x {*}
 * @param list {Array|String|*}
 * @returns {Array}
 */
remove = curry((x, list) => removeBy((a, b) => a === b, x, list)),

/**
 * Sort a list by comparing the results of a key function applied to each
 * element. sortOn f is equivalent to sortBy (comparing f), but has the
 * performance advantage of only evaluating f once for each element in the
 * input list. This is called the decorate-sort-undecorate paradigm, or
 * Schwartzian transform.
 *
 * Elements are arranged from from lowest to highest, keeping duplicates
 * in the order they appeared in the input.
 *
 * Ex:
 * ```
 * shallowEquals(
 *  sortOn (head, [[2, "world"], [4, "!"], [1, "Hello"]]),
 *  [[1,"Hello"],[2,"world"],[4,"!"]]
 * ) // true
 * ```
 * @function module:list.sortOn
 * @param valueFn {Function}
 * @param xs {Array|String|*}
 * @returns {Array}
 */
sortOn = curry((valueFn, xs) => // Un-decorate
map$1(decorated => decorated[1], // Decorate and sort
sortBy( // Ordering
([a0], [b0]) => genericAscOrdering(a0, b0), // Decorate
map$1(item => [valueFn(item), item], xs)))),

/**
 * The sortBy function is the non-overloaded (in haskell terms) version of sort.
 * @haskellExample ```
 *  >>> sortBy (\(a,_) (b,_) -> compare a b) [(2, "world"), (4, "!"), (1, "Hello")]
 *  [(1,"Hello"),(2,"world"),(4,"!")]
 * ```
 * @function module:list.sortBy
 * @param orderingFn {Function}
 * @param xs {Array|String|*}
 * @returns {Array|String|*}
 */
sortBy = curry((orderingFn, xs) => sliceCopy(xs).sort(orderingFn || genericAscOrdering)),

/**
 * The insert function takes an element and a list and inserts the element
 * into the list at the first position where it is less than or equal to the
 * next element. In particular, if the list is sorted before the call, the
 * result will also be sorted. It is a special case of insertBy, which allows
 * the programmer to supply their own comparison function.
 * @function module:list.insert
 * @param x {*}
 * @param xs {Array|*}
 * @returns {Array}
 */
insert = curry((x, xs) => {
  if (!xs.length) {
    return of(xs, x);
  }

  const foundIndex = findIndex(item => x <= item, xs);
  return foundIndex === -1 ? concat$1([xs, of(xs, x)]) : concat$1(intersperse(of(xs, x), splitAt(foundIndex, xs)));
}),

/**
 * A version of `insert` that allows you to specify the ordering of the inserted
 * item;  Before/at, or after
 * @function module:list.insertBy
 * @haskellType `insertBy :: (a -> a -> Ordering) -> a -> [a] -> [a]`
 * @note `Ordering` means 'something that is order-able'
 *  operated on by this functions logic.
 * @param orderingFn {Function} - A function that returns `-1`, `0`, or 1`.
 * @param x {*} - Value to insert.
 * @param xs {Array} - List to insert into (note new list is returned)
 * @returns {Array} - New list.
 */
insertBy = curry((orderingFn, x, xs) => {
  const limit = length(xs);

  if (!limit) {
    return [x];
  }

  let ind = 0;

  for (; ind < limit; ind += 1) {
    if (orderingFn(x, xs[ind]) <= 0) {
      const parts = splitAt(ind, xs);
      return concat$1([parts[0], [x], parts[1]]);
    }
  }

  return aggregateArray(sliceCopy(xs), x);
}),

/**
 * The nubBy function behaves just like nub, except it uses a user-supplied equality predicate.
 * @function module:list.nubBy
 * @param pred {Function}
 * @param list {Array|String|*}
 * @returns {Array}
 */
nubBy = curry((pred, list) => {
  if (!length(list)) {
    return [];
  }

  const limit = length(list);

  let ind = 0,
      currItem,
      out = [],
      anyOp = storedItem => pred(currItem, storedItem);

  for (; ind < limit; ind += 1) {
    currItem = list[ind];

    if (any(anyOp, out)) {
      continue;
    }

    out.push(currItem);
  }

  return out;
}),

/**
 * Behaves the same as `remove`, but takes a user-supplied equality predicate.
 * @function module:list.removeBy
 * @param pred {Function} - Equality predicate `(a, b) => bool`
 * @param x {*}
 * @param list {Array|String|*}
 * @returns {Array}
 */
removeBy = curry((pred, x, list) => {
  const foundIndex = findIndex(item => pred(x, item), list);

  if (foundIndex > -1) {
    const parts = splitAt(foundIndex, list);
    return append(parts[0], tail(parts[1]));
  }

  return sliceCopy(list);
}),

/**
 * The `removeFirstsBy` function takes a predicate and two lists and returns the first list with the first
 * occurrence of each element of the second list removed.
 * @function module:list.removeFirstBy
 * @param pred {Function}
 * @param xs1 {Array|String|*}
 * @param xs2 {Array|String|*}
 * @returns {Array}
 */
removeFirstsBy = curry((pred, xs1, xs2) => foldl((agg, x) => removeBy(pred, x, agg), xs1, xs2)),

/**
 * Returns the union on elements matching boolean check passed in.
 * @function module:list.unionBy
 * @param pred {Function} - `pred :: a -> a -> Bool`
 * @param arr1 {Array}
 * @param arr2 {Array}
 * @returns {Array}
 */
unionBy = curry((pred, arr1, arr2) => foldl((agg, b) => {
  const alreadyAdded = any(a => pred(a, b), agg);
  return !alreadyAdded ? (agg.push(b), agg) : agg;
}, sliceCopy(arr1), arr2)),

/**
 * Creates a union on matching elements from array1.
 * @function module:list.union
 * @param arr1 {Array}
 * @param arr2 {Array}
 * @returns {Array}
 */
union = curry((arr1, arr2) => append(arr1, filter$1(elm => !includes(elm, arr1), arr2))),

/**
 * Performs an intersection on list 1 with  elements from list 2.
 * @function module:list.intersect
 * @param arr1 {Array}
 * @param arr2 {Array}
 * @returns {Array}
 */
intersect = curry((arr1, arr2) => !arr1 || !arr2 || !arr1 && !arr2 ? [] : filter$1(elm => includes(elm, arr2), arr1)),

/**
 * Returns an intersection by predicate.
 * @function module:list.intersectBy
 * @param pred {Function} - `pred :: a -> b -> Bool`
 * @param list1 {Array}
 * @param list2 {Array}
 * @return {Array}
 */
intersectBy = curry((pred, list1, list2) => foldl((agg, a) => any(b => pred(a, b), list2) ? (agg.push(a), agg) : agg, [], list1)),

/**
 * Returns the difference of list 1 from list 2.
 * @note The `difference` operation here is non-associative;  E.g., `a - b` is not equal to `b - a`;
 * @function module:list.difference
 * @param array1 {Array}
 * @param array2 {Array}
 * @returns {Array}
 */
difference = curry((array1, array2) => {
  // augment this with max length and min length ordering on op
  if (array1 && !array2) {
    return sliceCopy(array1);
  } else if (!array1 && array2 || !array1 && !array2) {
    return [];
  }

  return reduce$1((agg, elm) => !includes(elm, array2) ? (agg.push(elm), agg) : agg, [], array1);
}),

/**
 * Returns the complement of list 0 and the reset of the passed in arrays.
 * @function module:list.complement
 * @param arr0 {Array}
 * @param arrays {...Array}
 * @returns {Array}
 */
complement = curry2((arr0, ...arrays) => reduce$1((agg, arr) => append(agg, difference(arr, arr0)), [], arrays));

/**
 * @module string
 * @description Contains functions for strings.
 */
const  
/**
 * Splits a string on all '\n', '\r', '\n\r', or '\r\n' characters.
 * @function module:string.lines
 * @param str {String}
 * @returns {Array}
 */
lines = split(/[\n\r]/gm),

/**
 * Splits a string on all '\s' and/or all '\t' characters.
 * @function module:string.words
 * @param str{String}
 * @returns {Array}
 */
words = split(/[\s\t]/gm),

/**
 * Intersperse an array of strings with '\s' and then concats them.
 * @function module:string.unwords
 * @param arr {String}
 * @returns {Array}
 */
unwords = intercalate(' '),

/**
 * Intersperses a '\n' character into a list of strings and then concats it.
 * @function module:string.unlines
 * @param list {Array|String|*}
 * @returns {Array}
 */
unlines = intercalate('\n');

/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 * @module ValidationUtils
 */
const 
/**
 * Default value obscurator.
 * @function module:ValidationUtils.defaultValueObscurator
 * @param x {*} - Value to obscurate.
 * @returns {String} - Obscurated value.
 */
defaultValueObscurator = x => repeat((x + '').length, '*'),

/**
 * Gets an error message by `messageTemplates` key from `options` object.
 * @function module:ValidationUtils.getErrorMsgByKey
 * @param options {Object}
 * @param key {(String|Function)}
 * @param value {*}
 * @returns {String|undefined} - Error message if successfully resolved one else `undefined`.
 * @curried
 */
getErrorMsgByKey = curry((options, key, value) => {
  let message;

  const {
    messageTemplates,
    valueObscured,
    valueObscurator
  } = options,
        _value = valueObscured ? valueObscurator(value) : value;

  if (isFunction(key)) {
    message = call(key, _value, options);
  } else if (!isString(key) || !messageTemplates || !messageTemplates[key]) {
    return;
  } else if (isFunction(messageTemplates[key])) {
    message = call(messageTemplates[key], _value, options);
  } else {
    message = messageTemplates[key];
  }

  return message;
}),

/**
 * Returns a strongly typed/normalized ValidatorOptions object.
 * @function module:ValidationUtils.toValidationOptions
 * @param options {...Object}
 * @returns {Object}
 */
toValidationOptions = (...options) => assignDeep(defineEnumProps([[Object, 'messageTemplates', {}], [Boolean, 'valueObscured', false], [Function, 'valueObscurator', defaultValueObscurator]], {}), ...(options.length ? options : [{}])),

/**
 * Returns a strongly typed, normalized validation result object.
 * @function module:ValidationUtils.toValidationResult
 * @param options {...Object}
 * @returns {*}
 */
toValidationResult = (...options) => assignDeep(defineEnumProps([[Boolean, 'result', false], [Array, 'messages', []]], {}), {
  value: undefined
}, ...(options.length ? options : [{}])),
      isOneOf = (x, ...types) => {
  const typeName = typeOf(x);
  return types.map(toTypeRefName).some(name => typeName === name);
};

/**
 * Created by Ely on 7/21/2014.
 * Module for validating a value by regular expression.
 * @module regexValidator
 */
const 
/**
 * Normalizes `regexValidator` options.
 * @function module:regexValidator.toRegexValidatorOptions
 * @param options {Object}
 * @returns {Object}
 */
toRegexValidatorOptions = options => {
  const [_options] = defineEnumProp(RegExp, toValidationOptions(), 'pattern', /./);
  _options.messageTemplates = {
    DOES_NOT_MATCH_PATTERN: (value, ops) => 'The value passed in does not match pattern"' + ops.pattern + '".  Value passed in: "' + value + '".'
  };
  return options ? assignDeep(_options, options) : _options;
},

/**
 * Same as `regexValidator` except this version is not curried and doesn't normalize incoming `options` parameter.
 * @note Useful when the user has a need for calling `toRegexValidatorOptions`
 *  externally/from-outside-the-`regexValidator` call (helps to remove that one extra call in this case (since
 *  `regexValidator` calls `toRegexValidatorOptions` internally)).
 * @function module:regexValidator.regexValidatorNoNormalize
 * @param options {Object}
 * @param value {*}
 * @returns {*}
 */
regexValidatorNoNormalize = curry((options, value) => {
  const result = options.pattern.test(value),
        // If test failed
  messages = !result ? [getErrorMsgByKey(options, 'DOES_NOT_MATCH_PATTERN', value)] : [];
  return toValidationResult({
    result,
    messages,
    value
  });
}),

/**
 * Validates a value with the regex `pattern` option passed in.
 * @function module:regexValidator.regexValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
regexValidator = curry((options, value) => regexValidatorNoNormalize(toRegexValidatorOptions(options), value));

/**
 * Created by Ely on 1/21/2015.
 * Module for validating alpha-numeric values.
 * @module alnumValidator
 */
const  
/**
 * @function module:alnumValidator.alnumValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
alnumValidator = curry((options, value) => regexValidator(assignDeep({
  pattern: /^[\da-z]+$/i,
  messageTemplates: {
    DOES_NOT_MATCH_PATTERN: x => `Value is not alpha-numeric.  Value received: '${x}'.`
  }
}, options), value));

/**
 * Created by Ely on 1/21/2015.
 * Module for validating digits.
 * @module digitValidator
 */
const  
/**
 * @function module:digitValidator.digitValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
digitValidator = curry((options, value) => regexValidator(assignDeep({
  pattern: /^\d+$/,
  messageTemplates: {
    DOES_NOT_MATCH_PATTERN: x => `The value passed in contains non digital characters.  ` + `Value received: "${x}".`
  }
}, options), value));

/**
 * Created by Ely on 1/21/2015.
 * @module lengthValidator
 * @todo Allow validator option generators to receive `zero` object (object on which to extend on).
 * @todo Allow validator option generators to receive more than one options object.
 */
const 
/**
 * Normalizes `lengthValidator` options.
 * @function module:lengthValidator.toLengthOptions
 * @param options {Object}
 * @returns {Object}
 */
toLengthOptions = options => {
  const _options = defineEnumProps([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], toValidationOptions());

  _options.messageTemplates = {
    NOT_OF_TYPE: value => `Value does not have a \`length\` property.  ` + `Type received: \`${typeOf(value)}\`.  ` + `Value received: \`${value}\`.`,
    NOT_WITHIN_RANGE: (value, ops) => `Value's length is not within range ` + `${ops.min} to ${ops.max}.  ` + `Evaluated length is \`${value.length}\`.  ` + `Value received: \`${value}\`.`
  };
  return options ? assignDeep(_options, options) : _options;
},

/**
 * Validates whether given value has a length and whether length is between
 *  given range (if given) but doesn't normalize options.
 *  (@see `toLengthOptions` for range props).
 * @function module:lengthValidator.lengthValidatorNoNormalize
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
lengthValidatorNoNormalize = curry((options, value) => {
  const messages = [];
  let valLength,
      isWithinRange,
      result = false;

  if (isOneOf(value, 'Null', 'Undefined', 'NaN', 'Symbol') || !value.hasOwnProperty('length')) {
    messages.push(getErrorMsgByKey(options, 'NOT_OF_TYPE', value));
    return toValidationResult({
      result,
      messages,
      value
    });
  }

  valLength = value.length;
  isWithinRange = valLength >= options.min && valLength <= options.max;

  if (!isWithinRange) {
    messages.push(getErrorMsgByKey(options, 'NOT_WITHIN_RANGE', value));
  } else {
    result = true;
  }

  return toValidationResult({
    result,
    messages,
    value
  });
}),

/**
 * Validates whether given value has a length and whether length is between
 *  given range (if given).  Same as `lengthValidatorNoNormalize` except normalizes incoming options.
 *  (@see `toLengthOptions` for more on options).
 * @function module:lengthValidator.lengthValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
lengthValidator = curry((options, value) => {
  return lengthValidatorNoNormalize(toLengthOptions(options), value);
});

/**
 * Created by Ely on 7/21/2014.
 * @module notEmptyValidator
 */
const  
/**
 * Normalizes incoming options so that they are valid `notEmptyValidator` options.
 * @note currently `notEmptyValidator` only takes the `messageTemplates` option (may
 *  have more options in the future).
 * @function module:notEmptyValidator.toNotEmptyOptions
 * @param options {Object}
 * @returns {Object}
 */
toNotEmptyOptions = options => toValidationOptions({
  messageTemplates: {
    EMPTY_NOT_ALLOWED: () => 'Empty values are not allowed.'
  }
}, options),

/**
 * Validates whether incoming `value` is empty* or not also doesn't normalize the passed in
 * options parameter (since currently `notEmptyValidator` has no options other than it's `messageTemplates`
 * field). * 'empty' in our context means one of `null`, `undefined`, empty lists (strings/arrays) (`x.length === 0`), `false`, empty object (obj with `0` enumerable props), and empty collection/iterable object (`Map`, `Set` etc.), NaN,
 * Also this method is useful when the user, themselves, have to call `toNotEmptyOptions` for a specific reason.
 * @function module:notEmptyValidator.notEmptyValidatorNoNormalize
 * @param options {Object}
 * @param value {*}
 * @returns {*}
 */
notEmptyValidatorNoNormalize = curry((options, value) => {
  const result = isEmpty(value),
        // If test failed
  messages = result ? [getErrorMsgByKey(options, 'EMPTY_NOT_ALLOWED', value)] : [];
  return toValidationResult({
    result: !result,
    messages,
    value
  });
}),

/**
 * Returns a validation result indicating whether give `value`
 * is an empty* value or not (*@see `notEmptyValidatorNoNormalize` for more about
 * empties).
 * @function module:notEmptyValidator.notEmptyValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
notEmptyValidator = curry((options, value) => notEmptyValidatorNoNormalize(toNotEmptyOptions(options), value));

/**
 * Created by Ely on 1/21/2015.
 * @module stringLengthValidator
 */
const 
/**
 * Normalizes (ensures has expected properties) `stringLengthValidator`'s options.
 * @function module:stringLengthValidator.toStringLengthOptions
 * @param options {Object}
 * @returns {Object}
 */
toStringLengthOptions = options => {
  const _options = {
    messageTemplates: {
      NOT_OF_TYPE: value => `Value is not a String.  ` + `Value type received: ${typeOf(value)}.  ` + `Value received: "${value}".`
    }
  };
  return toLengthOptions(options ? assignDeep(_options, options) : _options);
},

/**
 * Same as `stringLengthValidator` except doesn't normalize the incoming options.
 * Useful for cases where you have to call `toStringLengthValidator` options from outside of the `stringLengthValidator` call (
 *  helps eliminate one call in this case).  Also useful for extreme cases (cases where you have hundreds of validators
 *  and want to pull out every ounce of performance from them possible).
 * @function module:stringLengthValidator.stringLengthValidatorNoNormalize
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
stringLengthValidatorNoNormalize = curry((options, value) => {
  const messages = [],
        isOfType = isString(value),
        valLength = isOfType ? value.length : 0,
        isWithinRange = valLength >= options.min && valLength <= options.max;

  if (!isOfType) {
    messages.push(getErrorMsgByKey(options, 'NOT_OF_TYPE', value));
  } else if (!isWithinRange) {
    messages.push(getErrorMsgByKey(options, 'NOT_WITHIN_RANGE', value));
  }

  return toValidationResult({
    result: isOfType && isWithinRange,
    messages,
    value
  });
}),

/**
 * @function module:stringLengthValidator.stringLengthValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
stringLengthValidator = curry((options, value) => stringLengthValidatorNoNormalize(toStringLengthOptions(options), value));

/**
 * Created by elydelacruz on 6/10/16.
 * @module fjlValidatorReCaptcha
 * @recaptchaVersion v2
 * @reference see below:
 * @see https://developers.google.com/recaptcha/docs/
 * @see https://developers.google.com/recaptcha/docs/verify
 * @todo Request handlers should be separated out from inlined definitions
 */
const 
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
toReCaptchaTestValue = (incoming, outgoing = {}) => assign(defineEnumProps([[String, 'secret'], [String, 'remoteip'], [String, 'response']], outgoing), incoming),

/**
 * Normalizes value object to be tested by `reCaptchaValidator`.
 * @function module:fjlValidatorReCaptcha.toReCaptchaValidatorOptions
 * @param options {Object} - Incoming 'un-normalized' test value object; E.g. `{secret: '', resonse: '', etc...}`
 * @param [outgoing={}]{Object} - Optional.  Outgoing object to apply enumerable prop getters and setters to.
 * @returns {ReCaptchaValidatorOptions} - `{requestOptions {Object}, messageTemplates {Object}}`.
 * @throws {Error} - If any of the passed object's properties do not match expected types.
 */
toReCaptchaValidatorOptions = (options, outgoing = {}) => // @note `toValidationOptions` sets getter and setter for 'messageTemplates', 'valueObscured', and `valueObscurer`
assignDeep(defineEnumProps([[Object, 'requestOptions', {}]], toValidationOptions(outgoing)), {
  requestOptions: {
    host: 'www.google.com',
    path: '/recaptcha/api/siteverify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  messageTemplates: {
    [MISSING_INPUT_SECRET]: 'The secret parameter is missing.',
    [INVALID_INPUT_SECRET]: 'The secret parameter is invalid or malformed.',
    [MISSING_INPUT_RESPONSE]: 'The response parameter is missing.',
    [INVALID_INPUT_RESPONSE]: 'The response parameter is invalid or malformed.',
    [BAD_REQUEST]: 'Bad request',
    [UNKNOWN_ERROR]: 'Unknown error.'
  }
}, options || {}),

/**
 * Makes request to reCaptchaV2 service using passed in options and test value.
 * @function module:fjlValidatorReCaptcha.makeReCaptchaRequest$
 * @param options {ReCaptchaValidatorOptions}
 * @param value {ReCaptchaTestValue}
 * @param resolve {Function} - Resolve/success callback - Receives validation result object.
 * @param reject {Function} - Reject/failure callback - Receives validation result object and errorCodes array.
 * @returns {void}
 */
makeReCaptchaRequest$ = (options, value, resolve, reject) => {
  const messages = [],
        {
    secret,
    remoteip,
    response
  } = value;

  if (!secret) {
    messages.push(getErrorMsgByKey(options, MISSING_INPUT_SECRET, value));
  }

  if (!response) {
    messages.push(getErrorMsgByKey(options, MISSING_INPUT_RESPONSE, value));
  }

  if (messages.length) {
    resolve(toValidationResult({
      result: false,
      messages
    }));
    return; // Exiting explicitly here due to function being able to be used in callback style (old-style)
  }

  const formParams = {
    secret,
    remoteip,
    response
  },
        {
    requestOptions
  } = options,
        serializedParams = querystring.stringify(formParams); // Set content-length header

  requestOptions.headers['Content-Length'] = serializedParams.length;
  requestOptions.body = serializedParams; // Make request

  const validationResult = toValidationResult(),
        request = https.request(requestOptions, res => {
    // handle `response` (`res`)
    let body = '';
    res.setEncoding('utf8');
    res.on('data', chunk => {
      body += chunk;
    });
    res.on('end', () => {
      let responseData = JSON.parse(body),
          errorCodes = responseData['error-codes'],
          hasErrorCodes = !!errorCodes && !!errorCodes.length,
          normalizedErrorCodes = hasErrorCodes ? errorCodes.map(x => x.toLowerCase()) : [],
          nonEmptyErrorCodes = []; // If validation failed (false, null, undefined)

      if (!isEmpty(responseData.success)) {
        validationResult.result = true;
        resolve(validationResult);
        return;
      }

      if (hasErrorCodes) {
        // Add error message(s)
        nonEmptyErrorCodes = normalizedErrorCodes.filter(code => options.messageTemplates.hasOwnProperty(code)); // Get error messages

        if (!nonEmptyErrorCodes.length) {
          messages.push(getErrorMsgByKey(options, UNKNOWN_ERROR, value));
        } // Else add 'unknown error' error message
        else {
            nonEmptyErrorCodes.forEach(code => messages.push(getErrorMsgByKey(options, code, value)));
          }
      } else {
        messages.push(getErrorMsgByKey(options, UNKNOWN_ERROR, value));
      } // Set failure results


      validationResult.result = false;
      validationResult.messages = messages;
      resolve(validationResult, nonEmptyErrorCodes);
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
reCaptchaValidator$ = (options, value, resolve, reject) => makeReCaptchaRequest$(toReCaptchaValidatorOptions(options), toReCaptchaTestValue(value), resolve, reject),

/**
 * Validates a test value against reCaptchaV2 backend service;
 * @note When a reject occurs it will receive validation result object and `errorCodes` array (which contains
 *  error code sent back by reCaptcha service.
 * @function module:fjlValidatorReCaptcha.reCaptchaIOValidator$
 * @param options {ReCaptchaValidatorOptions}
 * @param value {ReCaptchaTestValue}
 * @returns {(Promise.<ValidationResult>|Promise.<ValidationResult, Array.<String>>)}
 */
reCaptchaIOValidator$ = (options, value) => new Promise((resolve, reject) => reCaptchaValidator$(options, value, resolve, reject)),

/**
 * Curried version of `reCaptchaIOValidator$`.
 * @function module:fjlValidatorReCaptcha.reCaptchaIOValidator
 * @param options {ReCaptchaValidatorOptions}
 * @param value {ReCaptchaTestValue}
 * @returns {(Promise.<ValidationResult>|Promise.<ValidationResult, Array.<String>>)}
 * @curried - Is curried.
 */
reCaptchaIOValidator = curry(reCaptchaIOValidator$),

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
reCaptchaValidatorV2 = curry(flip(reCaptchaIOValidator$));
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

export { BAD_REQUEST, INVALID_INPUT_RESPONSE, INVALID_INPUT_SECRET, MISSING_INPUT_RESPONSE, MISSING_INPUT_SECRET, UNKNOWN_ERROR, makeReCaptchaRequest$, reCaptchaIOValidator, reCaptchaIOValidator$, reCaptchaValidator, reCaptchaValidator$, reCaptchaValidatorV2, toReCaptchaTestValue, toReCaptchaValidatorOptions };
//# sourceMappingURL=fjl-validator-recaptcha.js.map
