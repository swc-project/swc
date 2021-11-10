// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/polyfills/isInteger.js


/* eslint-disable no-redeclare */
// $FlowFixMe workaround for: https://github.com/facebook/flow/issues/4441
const isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

export default isInteger;