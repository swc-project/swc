// Loaded from https://deno.land/x/ramda@v0.27.2/source/paths.js


import _curry2 from './internal/_curry2.js';
import _isInteger from './internal/_isInteger.js';
import nth from './nth.js';

/**
 * Retrieves the values at given paths of an object.
 *
 * @func
 * @memberOf R
 * @since v0.27.1
 * @category Object
 * @typedefn Idx = [String | Int | Symbol]
 * @sig [Idx] -> {a} -> [a | Undefined]
 * @param {Array} pathsArray The array of paths to be fetched.
 * @param {Object} obj The object to retrieve the nested properties from.
 * @return {Array} A list consisting of values at paths specified by "pathsArray".
 * @see R.path
 * @example
 *
 *      R.paths([['a', 'b'], ['p', 0, 'q']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, 3]
 *      R.paths([['a', 'b'], ['p', 'r']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, undefined]
 */
var paths = _curry2(function paths(pathsArray, obj) {
  return pathsArray.map(function(paths) {
    var val = obj;
    var idx = 0;
    var p;
    while (idx < paths.length) {
      if (val == null) {
        return;
      }
      p = paths[idx];
      val = _isInteger(p) ? nth(p, val) : val[p];
      idx += 1;
    }
    return val;
  });
});
export default paths;
