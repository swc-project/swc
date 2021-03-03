// Loaded from https://deno.land/x/ramda@v0.27.2/source/dec.js


import add from './add.js';


/**
 * Decrements its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number} n - 1
 * @see R.inc
 * @example
 *
 *      R.dec(42); //=> 41
 */
var dec = add(-1);
export default dec;
