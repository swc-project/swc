// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_map.js


export default function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
}
