// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/polyfills/objectValues.js


/* eslint-disable no-redeclare */
// $FlowFixMe workaround for: https://github.com/facebook/flow/issues/2221
const objectValues = Object.values || (obj => Object.keys(obj).map(key => obj[key]));

export default objectValues;