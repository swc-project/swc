// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_complement.js


export default function _complement(f) {
  return function() {
    return !f.apply(this, arguments);
  };
}
