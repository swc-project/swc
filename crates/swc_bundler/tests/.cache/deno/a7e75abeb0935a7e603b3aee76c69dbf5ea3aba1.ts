// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_xdropLast.js


import _curry2 from './_curry2.js';
import _xfBase from './_xfBase.js';


function XDropLast(n, xf) {
  this.xf = xf;
  this.pos = 0;
  this.full = false;
  this.acc = new Array(n);
}
XDropLast.prototype['@@transducer/init'] = _xfBase.init;
XDropLast.prototype['@@transducer/result'] =  function(result) {
  this.acc = null;
  return this.xf['@@transducer/result'](result);
};
XDropLast.prototype['@@transducer/step'] = function(result, input) {
  if (this.full) {
    result = this.xf['@@transducer/step'](result, this.acc[this.pos]);
  }
  this.store(input);
  return result;
};
XDropLast.prototype.store = function(input) {
  this.acc[this.pos] = input;
  this.pos += 1;
  if (this.pos === this.acc.length) {
    this.pos = 0;
    this.full = true;
  }
};

var _xdropLast = _curry2(function _xdropLast(n, xf) { return new XDropLast(n, xf); });
export default _xdropLast;
