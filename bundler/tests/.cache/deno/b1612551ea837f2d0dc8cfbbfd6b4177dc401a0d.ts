// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/utilities/typeFromAST.js


import inspect from '../jsutils/inspect.js';
import invariant from '../jsutils/invariant.js';
import { Kind } from '../language/kinds.js';
import { GraphQLList, GraphQLNonNull } from '../type/definition.js';
/**
 * Given a Schema and an AST node describing a type, return a GraphQLType
 * definition which applies to that type. For example, if provided the parsed
 * AST node for `[User]`, a GraphQLList instance will be returned, containing
 * the type called "User" found in the schema. If a type called "User" is not
 * found in the schema, then undefined will be returned.
 */

/* eslint-disable no-redeclare */

export function typeFromAST(schema, typeNode) {
  /* eslint-enable no-redeclare */
  let innerType;

  if (typeNode.kind === Kind.LIST_TYPE) {
    innerType = typeFromAST(schema, typeNode.type);
    return innerType && GraphQLList(innerType);
  }

  if (typeNode.kind === Kind.NON_NULL_TYPE) {
    innerType = typeFromAST(schema, typeNode.type);
    return innerType && GraphQLNonNull(innerType);
  }

  if (typeNode.kind === Kind.NAMED_TYPE) {
    return schema.getType(typeNode.name.value);
  } // Not reachable. All possible type nodes have been considered.


  invariant(false, 'Unexpected type node: ' + inspect(typeNode));
}