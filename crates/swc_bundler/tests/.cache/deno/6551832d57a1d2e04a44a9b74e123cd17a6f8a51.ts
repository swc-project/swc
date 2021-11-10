// Loaded from https://deno.land/x/ramda@v0.27.2/source/propSatisfies.js


import _curry3 from './internal/_curry3.js';
import prop from './prop.js';

/**
 * Returns `true` if the specified object property satisfies the given
 * predicate; `false` otherwise. You can test multiple properties with
 * [`R.where`](#where).
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Logic
 * @sig (a -> Boolean) -> String -> {String: a} -> Boolean
 * @param {Function} pred
 * @param {String} name
 * @param {*} obj
 * @return {Boolean}
 * @see R.where, R.propEq, R.propIs
 * @example
 *
 *      R.propSatisfies(x => x > 0, 'x', {x: 1, y: 2}); //=> true
 */
var propSatisfies = _curry3(function propSatisfies(pred, name, obj) {
  return pred(prop(name, obj));
});
export default propSatisfies;
