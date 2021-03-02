// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/UniqueTypeNamesRule.js


import { GraphQLError } from '../../error/GraphQLError.js';

/**
 * Unique type names
 *
 * A GraphQL document is only valid if all defined types have unique names.
 */
export function UniqueTypeNamesRule(context) {
  const knownTypeNames = Object.create(null);
  const schema = context.getSchema();
  return {
    ScalarTypeDefinition: checkTypeName,
    ObjectTypeDefinition: checkTypeName,
    InterfaceTypeDefinition: checkTypeName,
    UnionTypeDefinition: checkTypeName,
    EnumTypeDefinition: checkTypeName,
    InputObjectTypeDefinition: checkTypeName
  };

  function checkTypeName(node) {
    const typeName = node.name.value;

    if (schema?.getType(typeName)) {
      context.reportError(new GraphQLError(`Type "${typeName}" already exists in the schema. It cannot also be defined in this type definition.`, node.name));
      return;
    }

    if (knownTypeNames[typeName]) {
      context.reportError(new GraphQLError(`There can be only one type named "${typeName}".`, [knownTypeNames[typeName], node.name]));
    } else {
      knownTypeNames[typeName] = node.name;
    }

    return false;
  }
}