// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_isPlaceholder.js


export default function _isPlaceholder(a) {
  return a != null &&
         typeof a === 'object' &&
         a['@@functional/placeholder'] === true;
}
