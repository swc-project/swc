// Loaded from https://deno.land/x/ramda@v0.27.2/source/mean.js


import _curry1 from './internal/_curry1.js';
import sum from './sum.js';


/**
 * Returns the mean of the given list of numbers.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list
 * @return {Number}
 * @see R.median
 * @example
 *
 *      R.mean([2, 7, 9]); //=> 6
 *      R.mean([]); //=> NaN
 */
var mean = _curry1(function mean(list) {
  return sum(list) / list.length;
});
export default mean;
