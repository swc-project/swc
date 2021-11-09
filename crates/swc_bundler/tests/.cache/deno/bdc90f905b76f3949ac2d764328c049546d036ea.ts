// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/type/scalars.js


import isFinite from '../polyfills/isFinite.js';
import isInteger from '../polyfills/isInteger.js';
import inspect from '../jsutils/inspect.js';
import isObjectLike from '../jsutils/isObjectLike.js';
import { Kind } from '../language/kinds.js';
import { print } from '../language/printer.js';
import { GraphQLError } from '../error/GraphQLError.js';
import { GraphQLScalarType } from './definition.js'; // As per the GraphQL Spec, Integers are only treated as valid when a valid
// 32-bit signed integer, providing the broadest support across platforms.
//
// n.b. JavaScript's integers are safe between -(2^53 - 1) and 2^53 - 1 because
// they are internally represented as IEEE 754 doubles.

const MAX_INT = 2147483647;
const MIN_INT = -2147483648;

function serializeInt(outputValue) {
  const coercedValue = serializeObject(outputValue);

  if (typeof coercedValue === 'boolean') {
    return coercedValue ? 1 : 0;
  }

  let num = coercedValue;

  if (typeof coercedValue === 'string' && coercedValue !== '') {
    num = Number(coercedValue);
  }

  if (!isInteger(num)) {
    throw new GraphQLError(`Int cannot represent non-integer value: ${inspect(coercedValue)}`);
  }

  if (num > MAX_INT || num < MIN_INT) {
    throw new GraphQLError('Int cannot represent non 32-bit signed integer value: ' + inspect(coercedValue));
  }

  return num;
}

function coerceInt(inputValue) {
  if (!isInteger(inputValue)) {
    throw new GraphQLError(`Int cannot represent non-integer value: ${inspect(inputValue)}`);
  }

  if (inputValue > MAX_INT || inputValue < MIN_INT) {
    throw new GraphQLError(`Int cannot represent non 32-bit signed integer value: ${inputValue}`);
  }

  return inputValue;
}

export const GraphQLInt = new GraphQLScalarType({
  name: 'Int',
  description: 'The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.',
  serialize: serializeInt,
  parseValue: coerceInt,

  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.INT) {
      throw new GraphQLError(`Int cannot represent non-integer value: ${print(valueNode)}`, valueNode);
    }

    const num = parseInt(valueNode.value, 10);

    if (num > MAX_INT || num < MIN_INT) {
      throw new GraphQLError(`Int cannot represent non 32-bit signed integer value: ${valueNode.value}`, valueNode);
    }

    return num;
  }

});

function serializeFloat(outputValue) {
  const coercedValue = serializeObject(outputValue);

  if (typeof coercedValue === 'boolean') {
    return coercedValue ? 1 : 0;
  }

  let num = coercedValue;

  if (typeof coercedValue === 'string' && coercedValue !== '') {
    num = Number(coercedValue);
  }

  if (!isFinite(num)) {
    throw new GraphQLError(`Float cannot represent non numeric value: ${inspect(coercedValue)}`);
  }

  return num;
}

function coerceFloat(inputValue) {
  if (!isFinite(inputValue)) {
    throw new GraphQLError(`Float cannot represent non numeric value: ${inspect(inputValue)}`);
  }

  return inputValue;
}

export const GraphQLFloat = new GraphQLScalarType({
  name: 'Float',
  description: 'The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).',
  serialize: serializeFloat,
  parseValue: coerceFloat,

  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.FLOAT && valueNode.kind !== Kind.INT) {
      throw new GraphQLError(`Float cannot represent non numeric value: ${print(valueNode)}`, valueNode);
    }

    return parseFloat(valueNode.value);
  }

}); // Support serializing objects with custom valueOf() or toJSON() functions -
// a common way to represent a complex value which can be represented as
// a string (ex: MongoDB id objects).

function serializeObject(outputValue) {
  if (isObjectLike(outputValue)) {
    if (typeof outputValue.valueOf === 'function') {
      const valueOfResult = outputValue.valueOf();

      if (!isObjectLike(valueOfResult)) {
        return valueOfResult;
      }
    }

    if (typeof outputValue.toJSON === 'function') {
      // $FlowFixMe(>=0.90.0)
      return outputValue.toJSON();
    }
  }

  return outputValue;
}

function serializeString(outputValue) {
  const coercedValue = serializeObject(outputValue); // Serialize string, boolean and number values to a string, but do not
  // attempt to coerce object, function, symbol, or other types as strings.

  if (typeof coercedValue === 'string') {
    return coercedValue;
  }

  if (typeof coercedValue === 'boolean') {
    return coercedValue ? 'true' : 'false';
  }

  if (isFinite(coercedValue)) {
    return coercedValue.toString();
  }

  throw new GraphQLError(`String cannot represent value: ${inspect(outputValue)}`);
}

function coerceString(inputValue) {
  if (typeof inputValue !== 'string') {
    throw new GraphQLError(`String cannot represent a non string value: ${inspect(inputValue)}`);
  }

  return inputValue;
}

export const GraphQLString = new GraphQLScalarType({
  name: 'String',
  description: 'The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.',
  serialize: serializeString,
  parseValue: coerceString,

  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.STRING) {
      throw new GraphQLError(`String cannot represent a non string value: ${print(valueNode)}`, valueNode);
    }

    return valueNode.value;
  }

});

function serializeBoolean(outputValue) {
  const coercedValue = serializeObject(outputValue);

  if (typeof coercedValue === 'boolean') {
    return coercedValue;
  }

  if (isFinite(coercedValue)) {
    return coercedValue !== 0;
  }

  throw new GraphQLError(`Boolean cannot represent a non boolean value: ${inspect(coercedValue)}`);
}

function coerceBoolean(inputValue) {
  if (typeof inputValue !== 'boolean') {
    throw new GraphQLError(`Boolean cannot represent a non boolean value: ${inspect(inputValue)}`);
  }

  return inputValue;
}

export const GraphQLBoolean = new GraphQLScalarType({
  name: 'Boolean',
  description: 'The `Boolean` scalar type represents `true` or `false`.',
  serialize: serializeBoolean,
  parseValue: coerceBoolean,

  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.BOOLEAN) {
      throw new GraphQLError(`Boolean cannot represent a non boolean value: ${print(valueNode)}`, valueNode);
    }

    return valueNode.value;
  }

});

function serializeID(outputValue) {
  const coercedValue = serializeObject(outputValue);

  if (typeof coercedValue === 'string') {
    return coercedValue;
  }

  if (isInteger(coercedValue)) {
    return String(coercedValue);
  }

  throw new GraphQLError(`ID cannot represent value: ${inspect(outputValue)}`);
}

function coerceID(inputValue) {
  if (typeof inputValue === 'string') {
    return inputValue;
  }

  if (isInteger(inputValue)) {
    return inputValue.toString();
  }

  throw new GraphQLError(`ID cannot represent value: ${inspect(inputValue)}`);
}

export const GraphQLID = new GraphQLScalarType({
  name: 'ID',
  description: 'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',
  serialize: serializeID,
  parseValue: coerceID,

  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.STRING && valueNode.kind !== Kind.INT) {
      throw new GraphQLError('ID cannot represent a non-string and non-integer value: ' + print(valueNode), valueNode);
    }

    return valueNode.value;
  }

});
export const specifiedScalarTypes = Object.freeze([GraphQLString, GraphQLInt, GraphQLFloat, GraphQLBoolean, GraphQLID]);
export function isSpecifiedScalarType(type) {
  return specifiedScalarTypes.some(({
    name
  }) => type.name === name);
}