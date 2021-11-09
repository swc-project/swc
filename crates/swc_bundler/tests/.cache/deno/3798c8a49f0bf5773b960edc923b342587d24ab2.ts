// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/FragmentsOnCompositeTypesRule.js


import { GraphQLError } from '../../error/GraphQLError.js';
import { print } from '../../language/printer.js';
import { isCompositeType } from '../../type/definition.js';
import { typeFromAST } from '../../utilities/typeFromAST.js';

/**
 * Fragments on composite type
 *
 * Fragments use a type condition to determine if they apply, since fragments
 * can only be spread into a composite type (object, interface, or union), the
 * type condition must also be a composite type.
 */
export function FragmentsOnCompositeTypesRule(context) {
  return {
    InlineFragment(node) {
      const typeCondition = node.typeCondition;

      if (typeCondition) {
        const type = typeFromAST(context.getSchema(), typeCondition);

        if (type && !isCompositeType(type)) {
          const typeStr = print(typeCondition);
          context.reportError(new GraphQLError(`Fragment cannot condition on non composite type "${typeStr}".`, typeCondition));
        }
      }
    },

    FragmentDefinition(node) {
      const type = typeFromAST(context.getSchema(), node.typeCondition);

      if (type && !isCompositeType(type)) {
        const typeStr = print(node.typeCondition);
        context.reportError(new GraphQLError(`Fragment "${node.name.value}" cannot condition on non composite type "${typeStr}".`, node.typeCondition));
      }
    }

  };
}