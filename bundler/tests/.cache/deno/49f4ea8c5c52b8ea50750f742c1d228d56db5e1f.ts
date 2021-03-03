// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_isString.js


export default function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}
