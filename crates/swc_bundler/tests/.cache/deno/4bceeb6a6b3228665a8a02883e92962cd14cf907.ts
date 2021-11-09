// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_dropLastWhile.js


import slice from '../slice.js';

export default function dropLastWhile(pred, xs) {
  var idx = xs.length - 1;
  while (idx >= 0 && pred(xs[idx])) {
    idx -= 1;
  }
  return slice(0, idx + 1, xs);
}
