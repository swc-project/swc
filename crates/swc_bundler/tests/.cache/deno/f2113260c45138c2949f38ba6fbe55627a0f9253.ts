// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_xchain.js


import _curry2 from './_curry2.js';
import _flatCat from './_flatCat.js';
import map from '../map.js';


var _xchain = _curry2(function _xchain(f, xf) {
  return map(f, _flatCat(xf));
});
export default _xchain;
