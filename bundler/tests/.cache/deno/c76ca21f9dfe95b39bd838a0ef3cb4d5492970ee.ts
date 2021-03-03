// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/UniqueOperationNamesRule.js


import { GraphQLError } from '../../error/GraphQLError.js';

/**
 * Unique operation names
 *
 * A GraphQL document is only valid if all defined operations have unique names.
 */
export function UniqueOperationNamesRule(context) {
  const knownOperationNames = Object.create(null);
  return {
    OperationDefinition(node) {
      const operationName = node.name;

      if (operationName) {
        if (knownOperationNames[operationName.value]) {
          context.reportError(new GraphQLError(`There can be only one operation named "${operationName.value}".`, [knownOperationNames[operationName.value], operationName]));
        } else {
          knownOperationNames[operationName.value] = operationName;
        }
      }

      return false;
    },

    FragmentDefinition: () => false
  };
}