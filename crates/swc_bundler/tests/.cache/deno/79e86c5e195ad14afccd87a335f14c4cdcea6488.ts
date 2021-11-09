// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/error/syntaxError.js


import { GraphQLError } from './GraphQLError.js';
/**
 * Produces a GraphQLError representing a syntax error, containing useful
 * descriptive information about the syntax error's position in the source.
 */

export function syntaxError(source, position, description) {
  return new GraphQLError(`Syntax Error: ${description}`, undefined, source, [position]);
}