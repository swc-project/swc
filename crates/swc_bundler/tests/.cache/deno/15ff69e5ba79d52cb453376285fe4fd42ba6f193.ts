// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/SingleFieldSubscriptionsRule.js


import { GraphQLError } from '../../error/GraphQLError.js';

/**
 * Subscriptions must only include one field.
 *
 * A GraphQL subscription is valid only if it contains a single root field.
 */
export function SingleFieldSubscriptionsRule(context) {
  return {
    OperationDefinition(node) {
      if (node.operation === 'subscription') {
        if (node.selectionSet.selections.length !== 1) {
          context.reportError(new GraphQLError(node.name ? `Subscription "${node.name.value}" must select only one top level field.` : 'Anonymous Subscription must select only one top level field.', node.selectionSet.selections.slice(1)));
        }
      }
    }

  };
}