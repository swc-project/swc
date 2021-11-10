// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/promiseForObject.js


/**
 * This function transforms a JS object `ObjMap<Promise<T>>` into
 * a `Promise<ObjMap<T>>`
 *
 * This is akin to bluebird's `Promise.props`, but implemented only using
 * `Promise.all` so it will work with any implementation of ES6 promises.
 */
export default function promiseForObject(object) {
  const keys = Object.keys(object);
  const valuesAndPromises = keys.map(name => object[name]);
  return Promise.all(valuesAndPromises).then(values => values.reduce((resolvedObject, value, i) => {
    resolvedObject[keys[i]] = value;
    return resolvedObject;
  }, Object.create(null)));
}