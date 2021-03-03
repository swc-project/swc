// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/UniqueFragmentNamesRule.js


import { GraphQLError } from '../../error/GraphQLError.js';

/**
 * Unique fragment names
 *
 * A GraphQL document is only valid if all defined fragments have unique names.
 */
export function UniqueFragmentNamesRule(context) {
  const knownFragmentNames = Object.create(null);
  return {
    OperationDefinition: () => false,

    FragmentDefinition(node) {
      const fragmentName = node.name.value;

      if (knownFragmentNames[fragmentName]) {
        context.reportError(new GraphQLError(`There can be only one fragment named "${fragmentName}".`, [knownFragmentNames[fragmentName], node.name]));
      } else {
        knownFragmentNames[fragmentName] = node.name;
      }

      return false;
    }

  };
}