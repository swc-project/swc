// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_assoc.js


import _isArray from './_isArray.js';
import _isInteger from './_isInteger.js';

/**
 * Makes a shallow clone of an object, setting or overriding the specified
 * property with the given value. Note that this copies and flattens prototype
 * properties onto the new object as well. All non-primitive properties are
 * copied by reference.
 *
 * @private
 * @param {String|Number} prop The property name to set
 * @param {*} val The new value
 * @param {Object|Array} obj The object to clone
 * @return {Object|Array} A new object equivalent to the original except for the changed property.
 */
export default function _assoc(prop, val, obj) {
  if (_isInteger(prop) && _isArray(obj)) {
    var arr = [].concat(obj);
    arr[prop] = val;
    return arr;
  }

  var result = {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  result[prop] = val;
  return result;
}
