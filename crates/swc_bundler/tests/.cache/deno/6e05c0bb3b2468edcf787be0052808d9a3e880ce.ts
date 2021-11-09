// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_isTransformer.js


export default function _isTransformer(obj) {
  return obj != null && typeof obj['@@transducer/step'] === 'function';
}
