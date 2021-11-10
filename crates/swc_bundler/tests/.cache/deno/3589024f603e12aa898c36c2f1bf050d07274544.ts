// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/type/validate.js


import find from '../polyfills/find.js';
import flatMap from '../polyfills/flatMap.js';
import objectValues from '../polyfills/objectValues.js';
import inspect from '../jsutils/inspect.js';
import { GraphQLError } from '../error/GraphQLError.js';
import { locatedError } from '../error/locatedError.js';
import { isValidNameError } from '../utilities/assertValidName.js';
import { isEqualType, isTypeSubTypeOf } from '../utilities/typeComparators.js';
import { isDirective } from './directives.js';
import { isIntrospectionType } from './introspection.js';
import { assertSchema } from './schema.js';
import { isObjectType, isInterfaceType, isUnionType, isEnumType, isInputObjectType, isNamedType, isNonNullType, isInputType, isOutputType, isRequiredArgument } from './definition.js';
/**
 * Implements the "Type Validation" sub-sections of the specification's
 * "Type System" section.
 *
 * Validation runs synchronously, returning an array of encountered errors, or
 * an empty array if no errors were encountered and the Schema is valid.
 */

export function validateSchema(schema) {
  // First check to ensure the provided value is in fact a GraphQLSchema.
  assertSchema(schema); // If this Schema has already been validated, return the previous results.

  if (schema.__validationErrors) {
    return schema.__validationErrors;
  } // Validate the schema, producing a list of errors.


  const context = new SchemaValidationContext(schema);
  validateRootTypes(context);
  validateDirectives(context);
  validateTypes(context); // Persist the results of validation before returning to ensure validation
  // does not run multiple times for this schema.

  const errors = context.getErrors();
  schema.__validationErrors = errors;
  return errors;
}
/**
 * Utility function which asserts a schema is valid by throwing an error if
 * it is invalid.
 */

export function assertValidSchema(schema) {
  const errors = validateSchema(schema);

  if (errors.length !== 0) {
    throw new Error(errors.map(error => error.message).join('\n\n'));
  }
}

class SchemaValidationContext {
  constructor(schema) {
    this._errors = [];
    this.schema = schema;
  }

  reportError(message, nodes) {
    const _nodes = Array.isArray(nodes) ? nodes.filter(Boolean) : nodes;

    this.addError(new GraphQLError(message, _nodes));
  }

  addError(error) {
    this._errors.push(error);
  }

  getErrors() {
    return this._errors;
  }

}

function validateRootTypes(context) {
  const schema = context.schema;
  const queryType = schema.getQueryType();

  if (!queryType) {
    context.reportError('Query root type must be provided.', schema.astNode);
  } else if (!isObjectType(queryType)) {
    context.reportError(`Query root type must be Object type, it cannot be ${inspect(queryType)}.`, getOperationTypeNode(schema, queryType, 'query'));
  }

  const mutationType = schema.getMutationType();

  if (mutationType && !isObjectType(mutationType)) {
    context.reportError('Mutation root type must be Object type if provided, it cannot be ' + `${inspect(mutationType)}.`, getOperationTypeNode(schema, mutationType, 'mutation'));
  }

  const subscriptionType = schema.getSubscriptionType();

  if (subscriptionType && !isObjectType(subscriptionType)) {
    context.reportError('Subscription root type must be Object type if provided, it cannot be ' + `${inspect(subscriptionType)}.`, getOperationTypeNode(schema, subscriptionType, 'subscription'));
  }
}

function getOperationTypeNode(schema, type, operation) {
  const operationNodes = getAllSubNodes(schema, node => node.operationTypes);

  for (const node of operationNodes) {
    if (node.operation === operation) {
      return node.type;
    }
  }

  return type.astNode;
}

function validateDirectives(context) {
  for (const directive of context.schema.getDirectives()) {
    // Ensure all directives are in fact GraphQL directives.
    if (!isDirective(directive)) {
      context.reportError(`Expected directive but got: ${inspect(directive)}.`, directive?.astNode);
      continue;
    } // Ensure they are named correctly.


    validateName(context, directive); // TODO: Ensure proper locations.
    // Ensure the arguments are valid.

    for (const arg of directive.args) {
      // Ensure they are named correctly.
      validateName(context, arg); // Ensure the type is an input type.

      if (!isInputType(arg.type)) {
        context.reportError(`The type of @${directive.name}(${arg.name}:) must be Input Type ` + `but got: ${inspect(arg.type)}.`, arg.astNode);
      }
    }
  }
}

function validateName(context, node) {
  // Ensure names are valid, however introspection types opt out.
  const error = isValidNameError(node.name);

  if (error) {
    context.addError(locatedError(error, node.astNode));
  }
}

function validateTypes(context) {
  const validateInputObjectCircularRefs = createInputObjectCircularRefsValidator(context);
  const typeMap = context.schema.getTypeMap();

  for (const type of objectValues(typeMap)) {
    // Ensure all provided types are in fact GraphQL type.
    if (!isNamedType(type)) {
      context.reportError(`Expected GraphQL named type but got: ${inspect(type)}.`, type.astNode);
      continue;
    } // Ensure it is named correctly (excluding introspection types).


    if (!isIntrospectionType(type)) {
      validateName(context, type);
    }

    if (isObjectType(type)) {
      // Ensure fields are valid
      validateFields(context, type); // Ensure objects implement the interfaces they claim to.

      validateInterfaces(context, type);
    } else if (isInterfaceType(type)) {
      // Ensure fields are valid.
      validateFields(context, type); // Ensure interfaces implement the interfaces they claim to.

      validateInterfaces(context, type);
    } else if (isUnionType(type)) {
      // Ensure Unions include valid member types.
      validateUnionMembers(context, type);
    } else if (isEnumType(type)) {
      // Ensure Enums have valid values.
      validateEnumValues(context, type);
    } else if (isInputObjectType(type)) {
      // Ensure Input Object fields are valid.
      validateInputFields(context, type); // Ensure Input Objects do not contain non-nullable circular references

      validateInputObjectCircularRefs(type);
    }
  }
}

function validateFields(context, type) {
  const fields = objectValues(type.getFields()); // Objects and Interfaces both must define one or more fields.

  if (fields.length === 0) {
    context.reportError(`Type ${type.name} must define one or more fields.`, getAllNodes(type));
  }

  for (const field of fields) {
    // Ensure they are named correctly.
    validateName(context, field); // Ensure the type is an output type

    if (!isOutputType(field.type)) {
      context.reportError(`The type of ${type.name}.${field.name} must be Output Type ` + `but got: ${inspect(field.type)}.`, field.astNode?.type);
    } // Ensure the arguments are valid


    for (const arg of field.args) {
      const argName = arg.name; // Ensure they are named correctly.

      validateName(context, arg); // Ensure the type is an input type

      if (!isInputType(arg.type)) {
        context.reportError(`The type of ${type.name}.${field.name}(${argName}:) must be Input ` + `Type but got: ${inspect(arg.type)}.`, arg.astNode?.type);
      }
    }
  }
}

function validateInterfaces(context, type) {
  const ifaceTypeNames = Object.create(null);

  for (const iface of type.getInterfaces()) {
    if (!isInterfaceType(iface)) {
      context.reportError(`Type ${inspect(type)} must only implement Interface types, ` + `it cannot implement ${inspect(iface)}.`, getAllImplementsInterfaceNodes(type, iface));
      continue;
    }

    if (type === iface) {
      context.reportError(`Type ${type.name} cannot implement itself because it would create a circular reference.`, getAllImplementsInterfaceNodes(type, iface));
      continue;
    }

    if (ifaceTypeNames[iface.name]) {
      context.reportError(`Type ${type.name} can only implement ${iface.name} once.`, getAllImplementsInterfaceNodes(type, iface));
      continue;
    }

    ifaceTypeNames[iface.name] = true;
    validateTypeImplementsAncestors(context, type, iface);
    validateTypeImplementsInterface(context, type, iface);
  }
}

function validateTypeImplementsInterface(context, type, iface) {
  const typeFieldMap = type.getFields(); // Assert each interface field is implemented.

  for (const ifaceField of objectValues(iface.getFields())) {
    const fieldName = ifaceField.name;
    const typeField = typeFieldMap[fieldName]; // Assert interface field exists on type.

    if (!typeField) {
      context.reportError(`Interface field ${iface.name}.${fieldName} expected but ${type.name} does not provide it.`, [ifaceField.astNode, ...getAllNodes(type)]);
      continue;
    } // Assert interface field type is satisfied by type field type, by being
    // a valid subtype. (covariant)


    if (!isTypeSubTypeOf(context.schema, typeField.type, ifaceField.type)) {
      context.reportError(`Interface field ${iface.name}.${fieldName} expects type ` + `${inspect(ifaceField.type)} but ${type.name}.${fieldName} ` + `is type ${inspect(typeField.type)}.`, [ifaceField.astNode.type, typeField.astNode.type]);
    } // Assert each interface field arg is implemented.


    for (const ifaceArg of ifaceField.args) {
      const argName = ifaceArg.name;
      const typeArg = find(typeField.args, arg => arg.name === argName); // Assert interface field arg exists on object field.

      if (!typeArg) {
        context.reportError(`Interface field argument ${iface.name}.${fieldName}(${argName}:) expected but ${type.name}.${fieldName} does not provide it.`, [ifaceArg.astNode, typeField.astNode]);
        continue;
      } // Assert interface field arg type matches object field arg type.
      // (invariant)
      // TODO: change to contravariant?


      if (!isEqualType(ifaceArg.type, typeArg.type)) {
        context.reportError(`Interface field argument ${iface.name}.${fieldName}(${argName}:) ` + `expects type ${inspect(ifaceArg.type)} but ` + `${type.name}.${fieldName}(${argName}:) is type ` + `${inspect(typeArg.type)}.`, [ifaceArg.astNode.type, typeArg.astNode.type]);
      } // TODO: validate default values?

    } // Assert additional arguments must not be required.


    for (const typeArg of typeField.args) {
      const argName = typeArg.name;
      const ifaceArg = find(ifaceField.args, arg => arg.name === argName);

      if (!ifaceArg && isRequiredArgument(typeArg)) {
        context.reportError(`Object field ${type.name}.${fieldName} includes required argument ${argName} that is missing from the Interface field ${iface.name}.${fieldName}.`, [typeArg.astNode, ifaceField.astNode]);
      }
    }
  }
}

function validateTypeImplementsAncestors(context, type, iface) {
  const ifaceInterfaces = type.getInterfaces();

  for (const transitive of iface.getInterfaces()) {
    if (ifaceInterfaces.indexOf(transitive) === -1) {
      context.reportError(transitive === type ? `Type ${type.name} cannot implement ${iface.name} because it would create a circular reference.` : `Type ${type.name} must implement ${transitive.name} because it is implemented by ${iface.name}.`, [...getAllImplementsInterfaceNodes(iface, transitive), ...getAllImplementsInterfaceNodes(type, iface)]);
    }
  }
}

function validateUnionMembers(context, union) {
  const memberTypes = union.getTypes();

  if (memberTypes.length === 0) {
    context.reportError(`Union type ${union.name} must define one or more member types.`, getAllNodes(union));
  }

  const includedTypeNames = Object.create(null);

  for (const memberType of memberTypes) {
    if (includedTypeNames[memberType.name]) {
      context.reportError(`Union type ${union.name} can only include type ${memberType.name} once.`, getUnionMemberTypeNodes(union, memberType.name));
      continue;
    }

    includedTypeNames[memberType.name] = true;

    if (!isObjectType(memberType)) {
      context.reportError(`Union type ${union.name} can only include Object types, ` + `it cannot include ${inspect(memberType)}.`, getUnionMemberTypeNodes(union, String(memberType)));
    }
  }
}

function validateEnumValues(context, enumType) {
  const enumValues = enumType.getValues();

  if (enumValues.length === 0) {
    context.reportError(`Enum type ${enumType.name} must define one or more values.`, getAllNodes(enumType));
  }

  for (const enumValue of enumValues) {
    const valueName = enumValue.name; // Ensure valid name.

    validateName(context, enumValue);

    if (valueName === 'true' || valueName === 'false' || valueName === 'null') {
      context.reportError(`Enum type ${enumType.name} cannot include value: ${valueName}.`, enumValue.astNode);
    }
  }
}

function validateInputFields(context, inputObj) {
  const fields = objectValues(inputObj.getFields());

  if (fields.length === 0) {
    context.reportError(`Input Object type ${inputObj.name} must define one or more fields.`, getAllNodes(inputObj));
  } // Ensure the arguments are valid


  for (const field of fields) {
    // Ensure they are named correctly.
    validateName(context, field); // Ensure the type is an input type

    if (!isInputType(field.type)) {
      context.reportError(`The type of ${inputObj.name}.${field.name} must be Input Type ` + `but got: ${inspect(field.type)}.`, field.astNode?.type);
    }
  }
}

function createInputObjectCircularRefsValidator(context) {
  // Modified copy of algorithm from 'src/validation/rules/NoFragmentCycles.js.js'.
  // Tracks already visited types to maintain O(N) and to ensure that cycles
  // are not redundantly reported.
  const visitedTypes = Object.create(null); // Array of types nodes used to produce meaningful errors

  const fieldPath = []; // Position in the type path

  const fieldPathIndexByTypeName = Object.create(null);
  return detectCycleRecursive; // This does a straight-forward DFS to find cycles.
  // It does not terminate when a cycle was found but continues to explore
  // the graph to find all possible cycles.

  function detectCycleRecursive(inputObj) {
    if (visitedTypes[inputObj.name]) {
      return;
    }

    visitedTypes[inputObj.name] = true;
    fieldPathIndexByTypeName[inputObj.name] = fieldPath.length;
    const fields = objectValues(inputObj.getFields());

    for (const field of fields) {
      if (isNonNullType(field.type) && isInputObjectType(field.type.ofType)) {
        const fieldType = field.type.ofType;
        const cycleIndex = fieldPathIndexByTypeName[fieldType.name];
        fieldPath.push(field);

        if (cycleIndex === undefined) {
          detectCycleRecursive(fieldType);
        } else {
          const cyclePath = fieldPath.slice(cycleIndex);
          const pathStr = cyclePath.map(fieldObj => fieldObj.name).join('.');
          context.reportError(`Cannot reference Input Object "${fieldType.name}" within itself through a series of non-null fields: "${pathStr}".`, cyclePath.map(fieldObj => fieldObj.astNode));
        }

        fieldPath.pop();
      }
    }

    fieldPathIndexByTypeName[inputObj.name] = undefined;
  }
}

function getAllNodes(object) {
  const {
    astNode,
    extensionASTNodes
  } = object;
  return astNode ? extensionASTNodes ? [astNode].concat(extensionASTNodes) : [astNode] : extensionASTNodes ?? [];
}

function getAllSubNodes(object, getter) {
  /* istanbul ignore next (See https://github.com/graphql/graphql-js/issues/2203) */
  return flatMap(getAllNodes(object), item => getter(item) ?? []);
}

function getAllImplementsInterfaceNodes(type, iface) {
  return getAllSubNodes(type, typeNode => typeNode.interfaces).filter(ifaceNode => ifaceNode.name.value === iface.name);
}

function getUnionMemberTypeNodes(union, typeName) {
  return getAllSubNodes(union, unionNode => unionNode.types).filter(typeNode => typeNode.name.value === typeName);
}