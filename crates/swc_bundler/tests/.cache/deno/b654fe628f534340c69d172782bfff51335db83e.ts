// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/printPathArray.js


/**
 * Build a string describing the path.
 */
export default function printPathArray(path) {
  return path.map(key => typeof key === 'number' ? '[' + key.toString() + ']' : '.' + key).join('');
}