// Loaded from https://deno.land/x/ramda@v0.27.2/source/max.js


import _curry2 from './internal/_curry2.js';


/**
 * Returns the larger of its two arguments.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> a
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.maxBy, R.min
 * @example
 *
 *      R.max(789, 123); //=> 789
 *      R.max('a', 'b'); //=> 'b'
 */
var max = _curry2(function max(a, b) { return b > a ? b : a; });
export default max;
