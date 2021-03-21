// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/defineToJSON.js


import nodejsCustomInspectSymbol from './nodejsCustomInspectSymbol.js';
/**
 * The `defineToJSON()` function defines toJSON() and inspect() prototype
 * methods, if no function provided they become aliases for toString().
 */

export default function defineToJSON(classObject, fn = classObject.prototype.toString) {
  classObject.prototype.toJSON = fn;
  classObject.prototype.inspect = fn;
  /* istanbul ignore else (See: https://github.com/graphql/graphql-js/issues/2317) */

  if (nodejsCustomInspectSymbol) {
    classObject.prototype[nodejsCustomInspectSymbol] = fn;
  }
}