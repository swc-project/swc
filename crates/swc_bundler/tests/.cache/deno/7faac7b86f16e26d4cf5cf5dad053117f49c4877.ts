// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/VariablesInAllowedPositionRule.js


import inspect from '../../jsutils/inspect.js';
import { GraphQLError } from '../../error/GraphQLError.js';
import { Kind } from '../../language/kinds.js';
import { isNonNullType } from '../../type/definition.js';
import { typeFromAST } from '../../utilities/typeFromAST.js';
import { isTypeSubTypeOf } from '../../utilities/typeComparators.js';

/**
 * Variables passed to field arguments conform to type
 */
export function VariablesInAllowedPositionRule(context) {
  let varDefMap = Object.create(null);
  return {
    OperationDefinition: {
      enter() {
        varDefMap = Object.create(null);
      },

      leave(operation) {
        const usages = context.getRecursiveVariableUsages(operation);

        for (const {
          node,
          type,
          defaultValue
        } of usages) {
          const varName = node.name.value;
          const varDef = varDefMap[varName];

          if (varDef && type) {
            // A var type is allowed if it is the same or more strict (e.g. is
            // a subtype of) than the expected type. It can be more strict if
            // the variable type is non-null when the expected type is nullable.
            // If both are list types, the variable item type can be more strict
            // than the expected item type (contravariant).
            const schema = context.getSchema();
            const varType = typeFromAST(schema, varDef.type);

            if (varType && !allowedVariableUsage(schema, varType, varDef.defaultValue, type, defaultValue)) {
              const varTypeStr = inspect(varType);
              const typeStr = inspect(type);
              context.reportError(new GraphQLError(`Variable "$${varName}" of type "${varTypeStr}" used in position expecting type "${typeStr}".`, [varDef, node]));
            }
          }
        }
      }

    },

    VariableDefinition(node) {
      varDefMap[node.variable.name.value] = node;
    }

  };
}
/**
 * Returns true if the variable is allowed in the location it was found,
 * which includes considering if default values exist for either the variable
 * or the location at which it is located.
 */

function allowedVariableUsage(schema, varType, varDefaultValue, locationType, locationDefaultValue) {
  if (isNonNullType(locationType) && !isNonNullType(varType)) {
    const hasNonNullVariableDefaultValue = varDefaultValue != null && varDefaultValue.kind !== Kind.NULL;
    const hasLocationDefaultValue = locationDefaultValue !== undefined;

    if (!hasNonNullVariableDefaultValue && !hasLocationDefaultValue) {
      return false;
    }

    const nullableLocationType = locationType.ofType;
    return isTypeSubTypeOf(schema, varType, nullableLocationType);
  }

  return isTypeSubTypeOf(schema, varType, locationType);
}