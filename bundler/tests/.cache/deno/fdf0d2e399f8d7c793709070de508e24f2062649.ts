// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_xtakeWhile.js


import _curry2 from './_curry2.js';
import _reduced from './_reduced.js';
import _xfBase from './_xfBase.js';


function XTakeWhile(f, xf) {
  this.xf = xf;
  this.f = f;
}
XTakeWhile.prototype['@@transducer/init'] = _xfBase.init;
XTakeWhile.prototype['@@transducer/result'] = _xfBase.result;
XTakeWhile.prototype['@@transducer/step'] = function(result, input) {
  return this.f(input) ? this.xf['@@transducer/step'](result, input) : _reduced(result);
};

var _xtakeWhile = _curry2(function _xtakeWhile(f, xf) { return new XTakeWhile(f, xf); });
export default _xtakeWhile;
