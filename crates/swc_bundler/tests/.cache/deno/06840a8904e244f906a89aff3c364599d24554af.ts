// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_isObject.js


export default function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}
