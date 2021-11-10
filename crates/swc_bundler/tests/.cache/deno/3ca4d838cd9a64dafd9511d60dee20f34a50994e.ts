// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/isPromise.js


/**
 * Returns true if the value acts like a Promise, i.e. has a "then" function,
 * otherwise returns false.
 */
// eslint-disable-next-line no-redeclare
export default function isPromise(value) {
  return typeof value?.then === 'function';
}