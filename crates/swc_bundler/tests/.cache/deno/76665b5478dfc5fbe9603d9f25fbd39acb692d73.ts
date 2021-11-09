// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_isArguments.js


import _has from './_has.js';


var toString = Object.prototype.toString;
var _isArguments = (function() {
  return toString.call(arguments) === '[object Arguments]' ?
    function _isArguments(x) { return toString.call(x) === '[object Arguments]'; } :
    function _isArguments(x) { return _has('callee', x); };
}());

export default _isArguments;
