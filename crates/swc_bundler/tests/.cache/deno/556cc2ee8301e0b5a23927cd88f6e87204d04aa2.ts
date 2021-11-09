// Loaded from https://deno.land/x/ramda@v0.27.2/source/sum.js


import add from './add.js';
import reduce from './reduce.js';


/**
 * Adds together all the elements of a list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list An array of numbers
 * @return {Number} The sum of all the numbers in the list.
 * @see R.reduce
 * @example
 *
 *      R.sum([2,4,6,8,100,1]); //=> 121
 */
var sum = reduce(add, 0);
export default sum;
