// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/polyfills/isFinite.js


/* eslint-disable no-redeclare */
// $FlowFixMe workaround for: https://github.com/facebook/flow/issues/4441
const isFinitePolyfill = Number.isFinite || function (value) {
  return typeof value === 'number' && isFinite(value);
};

export default isFinitePolyfill;