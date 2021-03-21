// Loaded from https://deno.land/x/ramda@v0.27.2/source/xor.js


import _curry2 from './internal/_curry2.js';

/**
 * Exclusive disjunction logical operation.
 * Returns `true` if one of the arguments is truthy and the other is falsy.
 * Otherwise, it returns `false`.
 *
 * @func
 * @memberOf R
 * @since v0.27.1
 * @category Logic
 * @sig a -> b -> Boolean
 * @param {Any} a
 * @param {Any} b
 * @return {Boolean} true if one of the arguments is truthy and the other is falsy
 * @see R.or, R.and
 * @example
 *
 *      R.xor(true, true); //=> false
 *      R.xor(true, false); //=> true
 *      R.xor(false, true); //=> true
 *      R.xor(false, false); //=> false
 */
var xor = _curry2(function xor(a, b) {
  return Boolean(!a ^ !b);
});
export default xor;
