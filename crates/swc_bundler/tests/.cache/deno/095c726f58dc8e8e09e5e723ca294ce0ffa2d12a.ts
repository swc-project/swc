// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_xfilter.js


import _curry2 from './_curry2.js';
import _xfBase from './_xfBase.js';


function XFilter(f, xf) {
  this.xf = xf;
  this.f = f;
}
XFilter.prototype['@@transducer/init'] = _xfBase.init;
XFilter.prototype['@@transducer/result'] = _xfBase.result;
XFilter.prototype['@@transducer/step'] = function(result, input) {
  return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
};

var _xfilter = _curry2(function _xfilter(f, xf) { return new XFilter(f, xf); });
export default _xfilter;
