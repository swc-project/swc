// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/nodejsCustomInspectSymbol.js


/* istanbul ignore next (See: https://github.com/graphql/graphql-js/issues/2317) */
const nodejsCustomInspectSymbol = typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for('nodejs.util.inspect.custom') : undefined;
export default nodejsCustomInspectSymbol;