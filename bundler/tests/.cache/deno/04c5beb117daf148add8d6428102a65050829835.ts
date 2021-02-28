// Loaded from https://deno.land/x/ramda@v0.27.2/source/pipe.js


import _arity from './internal/_arity.js';
import _pipe from './internal/_pipe.js';
import reduce from './reduce.js';
import tail from './tail.js';


/**
 * Performs left-to-right function composition. The first argument may have
 * any arity; the remaining arguments must be unary.
 *
 * In some libraries this function is named `sequence`.
 *
 * **Note:** The result of pipe is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.compose
 * @example
 *
 *      const f = R.pipe(Math.pow, R.negate, R.inc);
 *
 *      f(3, 4); // -(3^4) + 1
 * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
 * @symb R.pipe(f, g, h)(a)(b) = h(g(f(a)))(b)
 */
export default function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }
  return _arity(
    arguments[0].length,
    reduce(_pipe, arguments[0], tail(arguments))
  );
}
