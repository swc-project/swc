// Loaded from https://deno.land/x/ramda@v0.27.2/source/toUpper.js


import invoker from './invoker.js';


/**
 * The upper case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to upper case.
 * @return {String} The upper case version of `str`.
 * @see R.toLower
 * @example
 *
 *      R.toUpper('abc'); //=> 'ABC'
 */
var toUpper = invoker(0, 'toUpperCase');
export default toUpper;
