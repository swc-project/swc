// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_includesWith.js


export default function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}
