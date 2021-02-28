// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_promap.js


export default function _promap(f, g, profunctor) {
  return function(x) {
    return g(profunctor(f(x)));
  };
}
