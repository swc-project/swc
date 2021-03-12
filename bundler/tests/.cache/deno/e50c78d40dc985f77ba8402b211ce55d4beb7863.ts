// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/LoneSchemaDefinitionRule.js


import { GraphQLError } from '../../error/GraphQLError.js';

/**
 * Lone Schema definition
 *
 * A GraphQL document is only valid if it contains only one schema definition.
 */
export function LoneSchemaDefinitionRule(context) {
  const oldSchema = context.getSchema();
  const alreadyDefined = oldSchema?.astNode ?? oldSchema?.getQueryType() ?? oldSchema?.getMutationType() ?? oldSchema?.getSubscriptionType();
  let schemaDefinitionsCount = 0;
  return {
    SchemaDefinition(node) {
      if (alreadyDefined) {
        context.reportError(new GraphQLError('Cannot define a new schema within a schema extension.', node));
        return;
      }

      if (schemaDefinitionsCount > 0) {
        context.reportError(new GraphQLError('Must provide only one schema definition.', node));
      }

      ++schemaDefinitionsCount;
    }

  };
}