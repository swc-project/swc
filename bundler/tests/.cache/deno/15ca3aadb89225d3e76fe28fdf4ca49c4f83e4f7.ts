// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/utilities/findDeprecatedUsages.js


import { GraphQLError } from '../error/GraphQLError.js';
import { visit } from '../language/visitor.js';
import { getNamedType } from '../type/definition.js';
import { TypeInfo, visitWithTypeInfo } from './TypeInfo.js';
/**
 * A validation rule which reports deprecated usages.
 *
 * Returns a list of GraphQLError instances describing each deprecated use.
 */

export function findDeprecatedUsages(schema, ast) {
  const errors = [];
  const typeInfo = new TypeInfo(schema);
  visit(ast, visitWithTypeInfo(typeInfo, {
    Field(node) {
      const parentType = typeInfo.getParentType();
      const fieldDef = typeInfo.getFieldDef();

      if (parentType && fieldDef?.deprecationReason != null) {
        errors.push(new GraphQLError(`The field "${parentType.name}.${fieldDef.name}" is deprecated. ` + fieldDef.deprecationReason, node));
      }
    },

    EnumValue(node) {
      const type = getNamedType(typeInfo.getInputType());
      const enumVal = typeInfo.getEnumValue();

      if (type && enumVal?.deprecationReason != null) {
        errors.push(new GraphQLError(`The enum value "${type.name}.${enumVal.name}" is deprecated. ` + enumVal.deprecationReason, node));
      }
    }

  }));
  return errors;
}