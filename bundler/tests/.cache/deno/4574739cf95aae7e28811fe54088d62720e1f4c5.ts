// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/polyfills/find.js


/* eslint-disable no-redeclare */
// $FlowFixMe
const find = Array.prototype.find ? function (list, predicate) {
  return Array.prototype.find.call(list, predicate);
} : function (list, predicate) {
  for (const value of list) {
    if (predicate(value)) {
      return value;
    }
  }
};
export default find;