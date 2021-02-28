// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_createPartialApplicator.js


import _arity from './_arity.js';
import _curry2 from './_curry2.js';


export default function _createPartialApplicator(concat) {
  return _curry2(function(fn, args) {
    return _arity(Math.max(0, fn.length - args.length), function() {
      return fn.apply(this, concat(args, arguments));
    });
  });
}
