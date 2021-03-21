// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/LoneAnonymousOperationRule.js


import { GraphQLError } from '../../error/GraphQLError.js';
import { Kind } from '../../language/kinds.js';

/**
 * Lone anonymous operation
 *
 * A GraphQL document is only valid if when it contains an anonymous operation
 * (the query short-hand) that it contains only that one operation definition.
 */
export function LoneAnonymousOperationRule(context) {
  let operationCount = 0;
  return {
    Document(node) {
      operationCount = node.definitions.filter(definition => definition.kind === Kind.OPERATION_DEFINITION).length;
    },

    OperationDefinition(node) {
      if (!node.name && operationCount > 1) {
        context.reportError(new GraphQLError('This anonymous operation must be the only defined operation.', node));
      }
    }

  };
}