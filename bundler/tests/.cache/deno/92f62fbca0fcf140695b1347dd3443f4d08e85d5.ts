// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_forceReduced.js


export default function _forceReduced(x) {
  return {
    '@@transducer/value': x,
    '@@transducer/reduced': true
  };
}
