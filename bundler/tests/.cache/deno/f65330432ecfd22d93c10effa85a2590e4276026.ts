// Loaded from https://deno.land/x/ramda@v0.27.2/source/empty.js


import _curry1 from './internal/_curry1.js';
import _isArguments from './internal/_isArguments.js';
import _isArray from './internal/_isArray.js';
import _isObject from './internal/_isObject.js';
import _isString from './internal/_isString.js';
import _isTypedArray from './internal/_isTypedArray.js';


/**
 * Returns the empty value of its argument's type. Ramda defines the empty
 * value of Array (`[]`), Object (`{}`), String (`''`),
 * TypedArray (`Uint8Array []`, `Float32Array []`, etc), and Arguments. Other
 * types are supported if they define `<Type>.empty`,
 * `<Type>.prototype.empty` or implement the
 * [FantasyLand Monoid spec](https://github.com/fantasyland/fantasy-land#monoid).
 *
 * Dispatches to the `empty` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig a -> a
 * @param {*} x
 * @return {*}
 * @example
 *
 *      R.empty(Just(42));               //=> Nothing()
 *      R.empty([1, 2, 3]);              //=> []
 *      R.empty('unicorns');             //=> ''
 *      R.empty({x: 1, y: 2});           //=> {}
 *      R.empty(Uint8Array.from('123')); //=> Uint8Array []
 */
var empty = _curry1(function empty(x) {
  return (
    (x != null && typeof x['fantasy-land/empty'] === 'function')
      ? x['fantasy-land/empty']()
      : (x != null && x.constructor != null && typeof x.constructor['fantasy-land/empty'] === 'function')
        ? x.constructor['fantasy-land/empty']()
        : (x != null && typeof x.empty === 'function')
          ? x.empty()
          : (x != null && x.constructor != null && typeof x.constructor.empty === 'function')
            ? x.constructor.empty()
            : _isArray(x)
              ? []
              : _isString(x)
                ? ''
                : _isObject(x)
                  ? {}
                  : _isArguments(x)
                    ? (function() { return arguments; }())
                    : _isTypedArray(x)
                      ? x.constructor.from('')
                      : void 0  // else
  );
});
export default empty;
