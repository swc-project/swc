// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_xdropRepeatsWith.js


import _curry2 from './_curry2.js';
import _xfBase from './_xfBase.js';


function XDropRepeatsWith(pred, xf) {
  this.xf = xf;
  this.pred = pred;
  this.lastValue = undefined;
  this.seenFirstValue = false;
}

XDropRepeatsWith.prototype['@@transducer/init'] = _xfBase.init;
XDropRepeatsWith.prototype['@@transducer/result'] = _xfBase.result;
XDropRepeatsWith.prototype['@@transducer/step'] = function(result, input) {
  var sameAsLast = false;
  if (!this.seenFirstValue) {
    this.seenFirstValue = true;
  } else if (this.pred(this.lastValue, input)) {
    sameAsLast = true;
  }
  this.lastValue = input;
  return sameAsLast ? result : this.xf['@@transducer/step'](result, input);
};

var _xdropRepeatsWith = _curry2(function _xdropRepeatsWith(pred, xf) { return new XDropRepeatsWith(pred, xf); });
export default _xdropRepeatsWith;
