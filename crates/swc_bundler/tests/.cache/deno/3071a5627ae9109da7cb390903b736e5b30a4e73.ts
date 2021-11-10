// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_xwrap.js


function XWrap(fn) {
  this.f = fn;
}
XWrap.prototype['@@transducer/init'] = function() {
  throw new Error('init not implemented on XWrap');
};
XWrap.prototype['@@transducer/result'] = function(acc) { return acc; };
XWrap.prototype['@@transducer/step'] = function(acc, x) {
  return this.f(acc, x);
};

export default function _xwrap(fn) { return new XWrap(fn); }
