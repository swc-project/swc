// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/utilities/introspectionFromSchema.js


import invariant from '../jsutils/invariant.js';
import isPromise from '../jsutils/isPromise.js';
import { parse } from '../language/parser.js';
import { execute } from '../execution/execute.js';
import { getIntrospectionQuery } from './getIntrospectionQuery.js';
/**
 * Build an IntrospectionQuery from a GraphQLSchema
 *
 * IntrospectionQuery is useful for utilities that care about type and field
 * relationships, but do not need to traverse through those relationships.
 *
 * This is the inverse of buildClientSchema. The primary use case is outside
 * of the server context, for instance when doing schema comparisons.
 */

export function introspectionFromSchema(schema, options) {
  const optionsWithDefaults = {
    directiveIsRepeatable: true,
    schemaDescription: true,
    ...options
  };
  const document = parse(getIntrospectionQuery(optionsWithDefaults));
  const result = execute({
    schema,
    document
  });
  invariant(!isPromise(result) && !result.errors && result.data);
  return result.data;
}