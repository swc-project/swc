// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/ExecutableDefinitionsRule.js


import { GraphQLError } from '../../error/GraphQLError.js';
import { Kind } from '../../language/kinds.js';
import { isExecutableDefinitionNode } from '../../language/predicates.js';

/**
 * Executable definitions
 *
 * A GraphQL document is only valid for execution if all definitions are either
 * operation or fragment definitions.
 */
export function ExecutableDefinitionsRule(context) {
  return {
    Document(node) {
      for (const definition of node.definitions) {
        if (!isExecutableDefinitionNode(definition)) {
          const defName = definition.kind === Kind.SCHEMA_DEFINITION || definition.kind === Kind.SCHEMA_EXTENSION ? 'schema' : '"' + definition.name.value + '"';
          context.reportError(new GraphQLError(`The ${defName} definition is not executable.`, definition));
        }
      }

      return false;
    }

  };
}