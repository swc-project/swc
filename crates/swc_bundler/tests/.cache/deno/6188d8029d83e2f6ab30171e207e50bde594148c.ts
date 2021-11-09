// Loaded from https://deno.land/x/ramda@v0.27.2/source/toLower.js


import invoker from './invoker.js';


/**
 * The lower case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to lower case.
 * @return {String} The lower case version of `str`.
 * @see R.toUpper
 * @example
 *
 *      R.toLower('XYZ'); //=> 'xyz'
 */
var toLower = invoker(0, 'toLowerCase');
export default toLower;
