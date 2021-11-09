// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_isNumber.js


export default function _isNumber(x) {
  return Object.prototype.toString.call(x) === '[object Number]';
}
