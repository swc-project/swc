// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_xtap.js


import _curry2 from './_curry2.js';
import _xfBase from './_xfBase.js';


function XTap(f, xf) {
  this.xf = xf;
  this.f = f;
}
XTap.prototype['@@transducer/init'] = _xfBase.init;
XTap.prototype['@@transducer/result'] = _xfBase.result;
XTap.prototype['@@transducer/step'] = function(result, input) {
  this.f(input);
  return this.xf['@@transducer/step'](result, input);
};

var _xtap = _curry2(function _xtap(f, xf) { return new XTap(f, xf); });
export default _xtap;
