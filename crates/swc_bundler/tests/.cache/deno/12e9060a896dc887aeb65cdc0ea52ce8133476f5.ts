// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/KnownFragmentNamesRule.js


import { GraphQLError } from '../../error/GraphQLError.js';

/**
 * Known fragment names
 *
 * A GraphQL document is only valid if all `...Fragment` fragment spreads refer
 * to fragments defined in the same document.
 */
export function KnownFragmentNamesRule(context) {
  return {
    FragmentSpread(node) {
      const fragmentName = node.name.value;
      const fragment = context.getFragment(fragmentName);

      if (!fragment) {
        context.reportError(new GraphQLError(`Unknown fragment "${fragmentName}".`, node.name));
      }
    }

  };
}