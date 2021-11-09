// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/isCollection.js


import { SYMBOL_ITERATOR } from '../polyfills/symbols.js';
/**
 * Returns true if the provided object is an Object (i.e. not a string literal)
 * and is either Iterable or Array-like.
 *
 * This may be used in place of [Array.isArray()][isArray] to determine if an
 * object should be iterated-over. It always excludes string literals and
 * includes Arrays (regardless of if it is Iterable). It also includes other
 * Array-like objects such as NodeList, TypedArray, and Buffer.
 *
 * @example
 *
 * isCollection([ 1, 2, 3 ]) // true
 * isCollection('ABC') // false
 * isCollection({ length: 1, 0: 'Alpha' }) // true
 * isCollection({ key: 'value' }) // false
 * isCollection(new Map()) // true
 *
 * @param obj
 *   An Object value which might implement the Iterable or Array-like protocols.
 * @return {boolean} true if Iterable or Array-like Object.
 */

export default function isCollection(obj) {
  if (obj == null || typeof obj !== 'object') {
    return false;
  } // Is Array like?


  const length = obj.length;

  if (typeof length === 'number' && length >= 0 && length % 1 === 0) {
    return true;
  } // Is Iterable?


  return typeof obj[SYMBOL_ITERATOR] === 'function';
}