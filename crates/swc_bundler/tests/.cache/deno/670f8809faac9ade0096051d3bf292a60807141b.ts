// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_modify.js


import _isArray from './_isArray.js';
import _isInteger from './_isInteger.js';

/**
 * Makes a shallow clone of an object, applying the given fn to the specified
 * property with the given value. Note that this copies and flattens prototype
 * properties onto the new object as well. All non-primitive properties are
 * copied by reference.
 *
 * @private
 * @param {String|Number} prop The property name to set
 * @param {Function} fn The function to apply to the property
 * @param {Object|Array} obj The object to clone
 * @return {Object|Array} A new object equivalent to the original except for the changed property.
 */
export default function _modify(prop, fn, obj) {
  if (_isInteger(prop) && _isArray(obj)) {
    var arr = [].concat(obj);
    arr[prop] = fn(arr[prop]);
    return arr;
  }

  var result = {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  result[prop] = fn(result[prop]);
  return result;
}
