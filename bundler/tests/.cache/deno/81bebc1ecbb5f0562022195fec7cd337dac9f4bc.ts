// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_isTypedArray.js


/**
 * Tests whether or not an object is a typed array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is a typed array, `false` otherwise.
 * @example
 *
 *      _isTypedArray(new Uint8Array([])); //=> true
 *      _isTypedArray(new Float32Array([])); //=> true
 *      _isTypedArray([]); //=> false
 *      _isTypedArray(null); //=> false
 *      _isTypedArray({}); //=> false
 */
export default function _isTypedArray(val) {
  var type = Object.prototype.toString.call(val);
  return type === '[object Uint8ClampedArray]' ||
    type === '[object Int8Array]' || type === '[object Uint8Array]' ||
    type === '[object Int16Array]' || type === '[object Uint16Array]' ||
    type === '[object Int32Array]' || type === '[object Uint32Array]' ||
    type === '[object Float32Array]' || type === '[object Float64Array]' ||
    type === '[object BigInt64Array]' || type === '[object BigUint64Array]';
}
