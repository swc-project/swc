// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/UniqueDirectiveNamesRule.js


import { GraphQLError } from '../../error/GraphQLError.js';

/**
 * Unique directive names
 *
 * A GraphQL document is only valid if all defined directives have unique names.
 */
export function UniqueDirectiveNamesRule(context) {
  const knownDirectiveNames = Object.create(null);
  const schema = context.getSchema();
  return {
    DirectiveDefinition(node) {
      const directiveName = node.name.value;

      if (schema?.getDirective(directiveName)) {
        context.reportError(new GraphQLError(`Directive "@${directiveName}" already exists in the schema. It cannot be redefined.`, node.name));
        return;
      }

      if (knownDirectiveNames[directiveName]) {
        context.reportError(new GraphQLError(`There can be only one directive named "@${directiveName}".`, [knownDirectiveNames[directiveName], node.name]));
      } else {
        knownDirectiveNames[directiveName] = node.name;
      }

      return false;
    }

  };
}