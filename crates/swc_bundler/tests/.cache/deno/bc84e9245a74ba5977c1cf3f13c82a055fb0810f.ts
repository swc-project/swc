// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/UniqueOperationTypesRule.js


import { GraphQLError } from '../../error/GraphQLError.js';

/**
 * Unique operation types
 *
 * A GraphQL document is only valid if it has only one type per operation.
 */
export function UniqueOperationTypesRule(context) {
  const schema = context.getSchema();
  const definedOperationTypes = Object.create(null);
  const existingOperationTypes = schema ? {
    query: schema.getQueryType(),
    mutation: schema.getMutationType(),
    subscription: schema.getSubscriptionType()
  } : {};
  return {
    SchemaDefinition: checkOperationTypes,
    SchemaExtension: checkOperationTypes
  };

  function checkOperationTypes(node) {
    /* istanbul ignore next (See https://github.com/graphql/graphql-js/issues/2203) */
    const operationTypesNodes = node.operationTypes ?? [];

    for (const operationType of operationTypesNodes) {
      const operation = operationType.operation;
      const alreadyDefinedOperationType = definedOperationTypes[operation];

      if (existingOperationTypes[operation]) {
        context.reportError(new GraphQLError(`Type for ${operation} already defined in the schema. It cannot be redefined.`, operationType));
      } else if (alreadyDefinedOperationType) {
        context.reportError(new GraphQLError(`There can be only one ${operation} type in schema.`, [alreadyDefinedOperationType, operationType]));
      } else {
        definedOperationTypes[operation] = operationType;
      }
    }

    return false;
  }
}