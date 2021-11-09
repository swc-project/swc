// Loaded from https://deno.land/x/ramda@v0.27.2/source/endsWith.js


import _curry2 from './internal/_curry2.js';
import equals from './equals.js';
import takeLast from './takeLast.js';

/**
 * Checks if a list ends with the provided sublist.
 *
 * Similarly, checks if a string ends with the provided substring.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category List
 * @sig [a] -> [a] -> Boolean
 * @sig String -> String -> Boolean
 * @param {*} suffix
 * @param {*} list
 * @return {Boolean}
 * @see R.startsWith
 * @example
 *
 *      R.endsWith('c', 'abc')                //=> true
 *      R.endsWith('b', 'abc')                //=> false
 *      R.endsWith(['c'], ['a', 'b', 'c'])    //=> true
 *      R.endsWith(['b'], ['a', 'b', 'c'])    //=> false
 */
var endsWith = _curry2(function(suffix, list) {
  return equals(takeLast(suffix.length, list), suffix);
});
export default endsWith;
