// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_has.js


export default function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
