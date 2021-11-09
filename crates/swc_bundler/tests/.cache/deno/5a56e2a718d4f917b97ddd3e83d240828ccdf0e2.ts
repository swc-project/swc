// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_xfindLast.js


import _curry2 from './_curry2.js';
import _xfBase from './_xfBase.js';


function XFindLast(f, xf) {
  this.xf = xf;
  this.f = f;
}
XFindLast.prototype['@@transducer/init'] = _xfBase.init;
XFindLast.prototype['@@transducer/result'] = function(result) {
  return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.last));
};
XFindLast.prototype['@@transducer/step'] = function(result, input) {
  if (this.f(input)) {
    this.last = input;
  }
  return result;
};

var _xfindLast = _curry2(function _xfindLast(f, xf) { return new XFindLast(f, xf); });
export default _xfindLast;
