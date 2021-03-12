// Loaded from https://deno.land/x/ramda@v0.27.2/source/dissoc.js


import _curry2 from './internal/_curry2.js';
import dissocPath from './dissocPath.js';

/**
 * Returns a new object that does not contain a `prop` property.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Object
 * @sig String -> {k: v} -> {k: v}
 * @param {String} prop The name of the property to dissociate
 * @param {Object} obj The object to clone
 * @return {Object} A new object equivalent to the original but without the specified property
 * @see R.assoc, R.omit
 * @example
 *
 *      R.dissoc('b', {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
 */
var dissoc = _curry2(function dissoc(prop, obj) { return dissocPath([prop], obj); });
export default dissoc;
