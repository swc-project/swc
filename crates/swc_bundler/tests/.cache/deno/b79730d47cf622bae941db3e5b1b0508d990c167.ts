// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_pipe.js


export default function _pipe(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
}
