// Loaded from https://deno.land/x/ramda@v0.27.2/source/negate.js


import _curry1 from './internal/_curry1.js';


/**
 * Negates its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number}
 * @example
 *
 *      R.negate(42); //=> -42
 */
var negate = _curry1(function negate(n) { return -n; });
export default negate;
