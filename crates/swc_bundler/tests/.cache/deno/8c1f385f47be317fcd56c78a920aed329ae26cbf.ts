// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/utilities/getOperationRootType.js


import { GraphQLError } from '../error/GraphQLError.js';

/**
 * Extracts the root type of the operation from the schema.
 */
export function getOperationRootType(schema, operation) {
  if (operation.operation === 'query') {
    const queryType = schema.getQueryType();

    if (!queryType) {
      throw new GraphQLError('Schema does not define the required query root type.', operation);
    }

    return queryType;
  }

  if (operation.operation === 'mutation') {
    const mutationType = schema.getMutationType();

    if (!mutationType) {
      throw new GraphQLError('Schema is not configured for mutations.', operation);
    }

    return mutationType;
  }

  if (operation.operation === 'subscription') {
    const subscriptionType = schema.getSubscriptionType();

    if (!subscriptionType) {
      throw new GraphQLError('Schema is not configured for subscriptions.', operation);
    }

    return subscriptionType;
  }

  throw new GraphQLError('Can only have query, mutation and subscription operations.', operation);
}