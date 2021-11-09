// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_isInteger.js


/**
 * Determine if the passed argument is an integer.
 *
 * @private
 * @param {*} n
 * @category Type
 * @return {Boolean}
 */
export default Number.isInteger || function _isInteger(n) {
  return (n << 0) === n;
};
