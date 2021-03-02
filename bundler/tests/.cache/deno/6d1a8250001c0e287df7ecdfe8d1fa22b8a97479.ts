// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/utilities/printSchema.js


import objectValues from '../polyfills/objectValues.js';
import inspect from '../jsutils/inspect.js';
import invariant from '../jsutils/invariant.js';
import { print } from '../language/printer.js';
import { printBlockString } from '../language/blockString.js';
import { isIntrospectionType } from '../type/introspection.js';
import { GraphQLString, isSpecifiedScalarType } from '../type/scalars.js';
import { GraphQLDirective, DEFAULT_DEPRECATION_REASON, isSpecifiedDirective } from '../type/directives.js';
import { isScalarType, isObjectType, isInterfaceType, isUnionType, isEnumType, isInputObjectType } from '../type/definition.js';
import { astFromValue } from './astFromValue.js';

/**
 * Accepts options as a second argument:
 *
 *    - commentDescriptions:
 *        Provide true to use preceding comments as the description.
 *
 */
export function printSchema(schema, options) {
  return printFilteredSchema(schema, n => !isSpecifiedDirective(n), isDefinedType, options);
}
export function printIntrospectionSchema(schema, options) {
  return printFilteredSchema(schema, isSpecifiedDirective, isIntrospectionType, options);
}

function isDefinedType(type) {
  return !isSpecifiedScalarType(type) && !isIntrospectionType(type);
}

function printFilteredSchema(schema, directiveFilter, typeFilter, options) {
  const directives = schema.getDirectives().filter(directiveFilter);
  const types = objectValues(schema.getTypeMap()).filter(typeFilter);
  return [printSchemaDefinition(schema)].concat(directives.map(directive => printDirective(directive, options)), types.map(type => printType(type, options))).filter(Boolean).join('\n\n') + '\n';
}

function printSchemaDefinition(schema) {
  if (schema.description == null && isSchemaOfCommonNames(schema)) {
    return;
  }

  const operationTypes = [];
  const queryType = schema.getQueryType();

  if (queryType) {
    operationTypes.push(`  query: ${queryType.name}`);
  }

  const mutationType = schema.getMutationType();

  if (mutationType) {
    operationTypes.push(`  mutation: ${mutationType.name}`);
  }

  const subscriptionType = schema.getSubscriptionType();

  if (subscriptionType) {
    operationTypes.push(`  subscription: ${subscriptionType.name}`);
  }

  return printDescription({}, schema) + `schema {\n${operationTypes.join('\n')}\n}`;
}
/**
 * GraphQL schema define root types for each type of operation. These types are
 * the same as any other type and can be named in any manner, however there is
 * a common naming convention:
 *
 *   schema {
 *     query: Query
 *     mutation: Mutation
 *   }
 *
 * When using this naming convention, the schema description can be omitted.
 */


function isSchemaOfCommonNames(schema) {
  const queryType = schema.getQueryType();

  if (queryType && queryType.name !== 'Query') {
    return false;
  }

  const mutationType = schema.getMutationType();

  if (mutationType && mutationType.name !== 'Mutation') {
    return false;
  }

  const subscriptionType = schema.getSubscriptionType();

  if (subscriptionType && subscriptionType.name !== 'Subscription') {
    return false;
  }

  return true;
}

export function printType(type, options) {
  if (isScalarType(type)) {
    return printScalar(type, options);
  }

  if (isObjectType(type)) {
    return printObject(type, options);
  }

  if (isInterfaceType(type)) {
    return printInterface(type, options);
  }

  if (isUnionType(type)) {
    return printUnion(type, options);
  }

  if (isEnumType(type)) {
    return printEnum(type, options);
  }

  if (isInputObjectType(type)) {
    return printInputObject(type, options);
  } // Not reachable. All possible types have been considered.


  invariant(false, 'Unexpected type: ' + inspect(type));
}

function printScalar(type, options) {
  return printDescription(options, type) + `scalar ${type.name}`;
}

function printImplementedInterfaces(type) {
  const interfaces = type.getInterfaces();
  return interfaces.length ? ' implements ' + interfaces.map(i => i.name).join(' & ') : '';
}

function printObject(type, options) {
  return printDescription(options, type) + `type ${type.name}` + printImplementedInterfaces(type) + printFields(options, type);
}

function printInterface(type, options) {
  return printDescription(options, type) + `interface ${type.name}` + printImplementedInterfaces(type) + printFields(options, type);
}

function printUnion(type, options) {
  const types = type.getTypes();
  const possibleTypes = types.length ? ' = ' + types.join(' | ') : '';
  return printDescription(options, type) + 'union ' + type.name + possibleTypes;
}

function printEnum(type, options) {
  const values = type.getValues().map((value, i) => printDescription(options, value, '  ', !i) + '  ' + value.name + printDeprecated(value));
  return printDescription(options, type) + `enum ${type.name}` + printBlock(values);
}

function printInputObject(type, options) {
  const fields = objectValues(type.getFields()).map((f, i) => printDescription(options, f, '  ', !i) + '  ' + printInputValue(f));
  return printDescription(options, type) + `input ${type.name}` + printBlock(fields);
}

function printFields(options, type) {
  const fields = objectValues(type.getFields()).map((f, i) => printDescription(options, f, '  ', !i) + '  ' + f.name + printArgs(options, f.args, '  ') + ': ' + String(f.type) + printDeprecated(f));
  return printBlock(fields);
}

function printBlock(items) {
  return items.length !== 0 ? ' {\n' + items.join('\n') + '\n}' : '';
}

function printArgs(options, args, indentation = '') {
  if (args.length === 0) {
    return '';
  } // If every arg does not have a description, print them on one line.


  if (args.every(arg => !arg.description)) {
    return '(' + args.map(printInputValue).join(', ') + ')';
  }

  return '(\n' + args.map((arg, i) => printDescription(options, arg, '  ' + indentation, !i) + '  ' + indentation + printInputValue(arg)).join('\n') + '\n' + indentation + ')';
}

function printInputValue(arg) {
  const defaultAST = astFromValue(arg.defaultValue, arg.type);
  let argDecl = arg.name + ': ' + String(arg.type);

  if (defaultAST) {
    argDecl += ` = ${print(defaultAST)}`;
  }

  return argDecl;
}

function printDirective(directive, options) {
  return printDescription(options, directive) + 'directive @' + directive.name + printArgs(options, directive.args) + (directive.isRepeatable ? ' repeatable' : '') + ' on ' + directive.locations.join(' | ');
}

function printDeprecated(fieldOrEnumVal) {
  if (!fieldOrEnumVal.isDeprecated) {
    return '';
  }

  const reason = fieldOrEnumVal.deprecationReason;
  const reasonAST = astFromValue(reason, GraphQLString);

  if (reasonAST && reason !== DEFAULT_DEPRECATION_REASON) {
    return ' @deprecated(reason: ' + print(reasonAST) + ')';
  }

  return ' @deprecated';
}

function printDescription(options, def, indentation = '', firstInBlock = true) {
  const {
    description
  } = def;

  if (description == null) {
    return '';
  }

  if (options?.commentDescriptions === true) {
    return printDescriptionWithComments(description, indentation, firstInBlock);
  }

  const preferMultipleLines = description.length > 70;
  const blockString = printBlockString(description, '', preferMultipleLines);
  const prefix = indentation && !firstInBlock ? '\n' + indentation : indentation;
  return prefix + blockString.replace(/\n/g, '\n' + indentation) + '\n';
}

function printDescriptionWithComments(description, indentation, firstInBlock) {
  const prefix = indentation && !firstInBlock ? '\n' : '';
  const comment = description.split('\n').map(line => indentation + (line !== '' ? '# ' + line : '#')).join('\n');
  return prefix + comment + '\n';
}