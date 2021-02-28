// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/promiseReduce.js


import isPromise from './isPromise.js';

/**
 * Similar to Array.prototype.reduce(), however the reducing callback may return
 * a Promise, in which case reduction will continue after each promise resolves.
 *
 * If the callback does not return a Promise, then this function will also not
 * return a Promise.
 */
export default function promiseReduce(values, callback, initialValue) {
  return values.reduce((previous, value) => isPromise(previous) ? previous.then(resolved => callback(resolved, value)) : callback(previous, value), initialValue);
}