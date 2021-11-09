// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_xfindIndex.js


import _curry2 from './_curry2.js';
import _reduced from './_reduced.js';
import _xfBase from './_xfBase.js';


function XFindIndex(f, xf) {
  this.xf = xf;
  this.f = f;
  this.idx = -1;
  this.found = false;
}
XFindIndex.prototype['@@transducer/init'] = _xfBase.init;
XFindIndex.prototype['@@transducer/result'] = function(result) {
  if (!this.found) {
    result = this.xf['@@transducer/step'](result, -1);
  }
  return this.xf['@@transducer/result'](result);
};
XFindIndex.prototype['@@transducer/step'] = function(result, input) {
  this.idx += 1;
  if (this.f(input)) {
    this.found = true;
    result = _reduced(this.xf['@@transducer/step'](result, this.idx));
  }
  return result;
};

var _xfindIndex = _curry2(function _xfindIndex(f, xf) { return new XFindIndex(f, xf); });
export default _xfindIndex;
