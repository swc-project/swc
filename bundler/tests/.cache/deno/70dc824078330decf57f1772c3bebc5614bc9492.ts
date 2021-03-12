// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_isFunction.js


export default function _isFunction(x) {
  var type = Object.prototype.toString.call(x);
  return type  === '[object Function]' ||
    type === '[object AsyncFunction]' ||
    type === '[object GeneratorFunction]' ||
    type === '[object AsyncGeneratorFunction]';
}
