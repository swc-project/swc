// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/VariablesAreInputTypesRule.js


import { GraphQLError } from '../../error/GraphQLError.js';
import { print } from '../../language/printer.js';
import { isInputType } from '../../type/definition.js';
import { typeFromAST } from '../../utilities/typeFromAST.js';

/**
 * Variables are input types
 *
 * A GraphQL operation is only valid if all the variables it defines are of
 * input types (scalar, enum, or input object).
 */
export function VariablesAreInputTypesRule(context) {
  return {
    VariableDefinition(node) {
      const type = typeFromAST(context.getSchema(), node.type);

      if (type && !isInputType(type)) {
        const variableName = node.variable.name.value;
        const typeName = print(node.type);
        context.reportError(new GraphQLError(`Variable "$${variableName}" cannot be non-input type "${typeName}".`, node.type));
      }
    }

  };
}