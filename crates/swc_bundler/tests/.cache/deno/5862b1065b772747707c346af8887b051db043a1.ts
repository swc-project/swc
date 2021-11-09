// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/isObjectLike.js


/**
 * Return true if `value` is object-like. A value is object-like if it's not
 * `null` and has a `typeof` result of "object".
 */
export default function isObjectLike(value) {
  return typeof value == 'object' && value !== null;
}