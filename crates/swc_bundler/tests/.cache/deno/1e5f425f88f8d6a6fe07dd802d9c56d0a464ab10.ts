// Loaded from https://deno.land/x/ramda@v0.27.2/source/dropRepeats.js


import _curry1 from './internal/_curry1.js';
import _dispatchable from './internal/_dispatchable.js';
import _xdropRepeatsWith from './internal/_xdropRepeatsWith.js';
import dropRepeatsWith from './dropRepeatsWith.js';
import equals from './equals.js';


/**
 * Returns a new list without any consecutively repeating elements.
 * [`R.equals`](#equals) is used to determine equality.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig [a] -> [a]
 * @param {Array} list The array to consider.
 * @return {Array} `list` without repeating elements.
 * @see R.transduce
 * @example
 *
 *     R.dropRepeats([1, 1, 1, 2, 3, 4, 4, 2, 2]); //=> [1, 2, 3, 4, 2]
 */
var dropRepeats = _curry1(
  _dispatchable([], _xdropRepeatsWith(equals), dropRepeatsWith(equals))
);
export default dropRepeats;
