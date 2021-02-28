// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_isRegExp.js


export default function _isRegExp(x) {
  return Object.prototype.toString.call(x) === '[object RegExp]';
}
