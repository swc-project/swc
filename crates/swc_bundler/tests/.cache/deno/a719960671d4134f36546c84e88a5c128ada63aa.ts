// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/KnownTypeNamesRule.js


import didYouMean from '../../jsutils/didYouMean.js';
import suggestionList from '../../jsutils/suggestionList.js';
import { GraphQLError } from '../../error/GraphQLError.js';
import { isTypeDefinitionNode, isTypeSystemDefinitionNode, isTypeSystemExtensionNode } from '../../language/predicates.js';
import { specifiedScalarTypes } from '../../type/scalars.js';

/**
 * Known type names
 *
 * A GraphQL document is only valid if referenced types (specifically
 * variable definitions and fragment conditions) are defined by the type schema.
 */
export function KnownTypeNamesRule(context) {
  const schema = context.getSchema();
  const existingTypesMap = schema ? schema.getTypeMap() : Object.create(null);
  const definedTypes = Object.create(null);

  for (const def of context.getDocument().definitions) {
    if (isTypeDefinitionNode(def)) {
      definedTypes[def.name.value] = true;
    }
  }

  const typeNames = Object.keys(existingTypesMap).concat(Object.keys(definedTypes));
  return {
    NamedType(node, _1, parent, _2, ancestors) {
      const typeName = node.name.value;

      if (!existingTypesMap[typeName] && !definedTypes[typeName]) {
        const definitionNode = ancestors[2] ?? parent;
        const isSDL = definitionNode != null && isSDLNode(definitionNode);

        if (isSDL && isSpecifiedScalarName(typeName)) {
          return;
        }

        const suggestedTypes = suggestionList(typeName, isSDL ? specifiedScalarsNames.concat(typeNames) : typeNames);
        context.reportError(new GraphQLError(`Unknown type "${typeName}".` + didYouMean(suggestedTypes), node));
      }
    }

  };
}
const specifiedScalarsNames = specifiedScalarTypes.map(type => type.name);

function isSpecifiedScalarName(typeName) {
  return specifiedScalarsNames.indexOf(typeName) !== -1;
}

function isSDLNode(value) {
  return !Array.isArray(value) && (isTypeSystemDefinitionNode(value) || isTypeSystemExtensionNode(value));
}