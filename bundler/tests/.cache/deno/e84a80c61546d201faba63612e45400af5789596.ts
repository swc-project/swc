// Loaded from https://deno.land/x/ramda@v0.27.2/source/traverse.js


import _curry3 from './internal/_curry3.js';
import map from './map.js';
import sequence from './sequence.js';


/**
 * Maps an [Applicative](https://github.com/fantasyland/fantasy-land#applicative)-returning
 * function over a [Traversable](https://github.com/fantasyland/fantasy-land#traversable),
 * then uses [`sequence`](#sequence) to transform the resulting Traversable of Applicative
 * into an Applicative of Traversable.
 *
 * Dispatches to the `traverse` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
 * @param {Function} of
 * @param {Function} f
 * @param {*} traversable
 * @return {*}
 * @see R.sequence
 * @example
 *
 *      // Returns `Maybe.Nothing` if the given divisor is `0`
 *      const safeDiv = n => d => d === 0 ? Maybe.Nothing() : Maybe.Just(n / d)
 *
 *      R.traverse(Maybe.of, safeDiv(10), [2, 4, 5]); //=> Maybe.Just([5, 2.5, 2])
 *      R.traverse(Maybe.of, safeDiv(10), [2, 0, 5]); //=> Maybe.Nothing
 */
var traverse = _curry3(function traverse(of, f, traversable) {
  return (
    typeof traversable['fantasy-land/traverse'] === 'function'
      ? traversable['fantasy-land/traverse'](f, of)
      : typeof traversable.traverse === 'function'
        ? traversable.traverse(f, of)
        : sequence(of, map(f, traversable))
  );
});
export default traverse;
