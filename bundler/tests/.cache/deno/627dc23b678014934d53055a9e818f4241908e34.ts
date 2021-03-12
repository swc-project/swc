// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_includes.js


import _indexOf from './_indexOf.js';


export default function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}
