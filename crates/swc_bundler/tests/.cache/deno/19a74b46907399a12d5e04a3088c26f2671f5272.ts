// Loaded from https://deno.land/x/ramda@v0.27.2/source/propIs.js


import _curry3 from './internal/_curry3.js';
import prop from './prop.js';
import is from './is.js';


/**
 * Returns `true` if the specified object property is of the given type;
 * `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Type
 * @sig Type -> String -> Object -> Boolean
 * @param {Function} type
 * @param {String} name
 * @param {*} obj
 * @return {Boolean}
 * @see R.is, R.propSatisfies
 * @example
 *
 *      R.propIs(Number, 'x', {x: 1, y: 2});  //=> true
 *      R.propIs(Number, 'x', {x: 'foo'});    //=> false
 *      R.propIs(Number, 'x', {});            //=> false
 */
var propIs = _curry3(function propIs(type, name, obj) {
  return is(type, prop(name, obj));
});
export default propIs;
