// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/Path.js


/**
 * Given a Path and a key, return a new Path containing the new key.
 */
export function addPath(prev, key) {
  return {
    prev,
    key
  };
}
/**
 * Given a Path, return an Array of the path keys.
 */

export function pathToArray(path) {
  const flattened = [];
  let curr = path;

  while (curr) {
    flattened.push(curr.key);
    curr = curr.prev;
  }

  return flattened.reverse();
}