// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/utilities/coerceInputValue.js


import arrayFrom from '../polyfills/arrayFrom.js';
import objectValues from '../polyfills/objectValues.js';
import inspect from '../jsutils/inspect.js';
import invariant from '../jsutils/invariant.js';
import didYouMean from '../jsutils/didYouMean.js';
import isObjectLike from '../jsutils/isObjectLike.js';
import isCollection from '../jsutils/isCollection.js';
import suggestionList from '../jsutils/suggestionList.js';
import printPathArray from '../jsutils/printPathArray.js';
import { addPath, pathToArray } from '../jsutils/Path.js';
import { GraphQLError } from '../error/GraphQLError.js';
import { isLeafType, isInputObjectType, isListType, isNonNullType } from '../type/definition.js';

/**
 * Coerces a JavaScript value given a GraphQL Input Type.
 */
export function coerceInputValue(inputValue, type, onError = defaultOnError) {
  return coerceInputValueImpl(inputValue, type, onError);
}

function defaultOnError(path, invalidValue, error) {
  let errorPrefix = 'Invalid value ' + inspect(invalidValue);

  if (path.length > 0) {
    errorPrefix += ` at "value${printPathArray(path)}"`;
  }

  error.message = errorPrefix + ': ' + error.message;
  throw error;
}

function coerceInputValueImpl(inputValue, type, onError, path) {
  if (isNonNullType(type)) {
    if (inputValue != null) {
      return coerceInputValueImpl(inputValue, type.ofType, onError, path);
    }

    onError(pathToArray(path), inputValue, new GraphQLError(`Expected non-nullable type "${inspect(type)}" not to be null.`));
    return;
  }

  if (inputValue == null) {
    // Explicitly return the value null.
    return null;
  }

  if (isListType(type)) {
    const itemType = type.ofType;

    if (isCollection(inputValue)) {
      return arrayFrom(inputValue, (itemValue, index) => {
        const itemPath = addPath(path, index);
        return coerceInputValueImpl(itemValue, itemType, onError, itemPath);
      });
    } // Lists accept a non-list value as a list of one.


    return [coerceInputValueImpl(inputValue, itemType, onError, path)];
  }

  if (isInputObjectType(type)) {
    if (!isObjectLike(inputValue)) {
      onError(pathToArray(path), inputValue, new GraphQLError(`Expected type "${type.name}" to be an object.`));
      return;
    }

    const coercedValue = {};
    const fieldDefs = type.getFields();

    for (const field of objectValues(fieldDefs)) {
      const fieldValue = inputValue[field.name];

      if (fieldValue === undefined) {
        if (field.defaultValue !== undefined) {
          coercedValue[field.name] = field.defaultValue;
        } else if (isNonNullType(field.type)) {
          const typeStr = inspect(field.type);
          onError(pathToArray(path), inputValue, new GraphQLError(`Field "${field.name}" of required type "${typeStr}" was not provided.`));
        }

        continue;
      }

      coercedValue[field.name] = coerceInputValueImpl(fieldValue, field.type, onError, addPath(path, field.name));
    } // Ensure every provided field is defined.


    for (const fieldName of Object.keys(inputValue)) {
      if (!fieldDefs[fieldName]) {
        const suggestions = suggestionList(fieldName, Object.keys(type.getFields()));
        onError(pathToArray(path), inputValue, new GraphQLError(`Field "${fieldName}" is not defined by type "${type.name}".` + didYouMean(suggestions)));
      }
    }

    return coercedValue;
  }

  if (isLeafType(type)) {
    let parseResult; // Scalars and Enums determine if a input value is valid via parseValue(),
    // which can throw to indicate failure. If it throws, maintain a reference
    // to the original error.

    try {
      parseResult = type.parseValue(inputValue);
    } catch (error) {
      if (error instanceof GraphQLError) {
        onError(pathToArray(path), inputValue, error);
      } else {
        onError(pathToArray(path), inputValue, new GraphQLError(`Expected type "${type.name}". ` + error.message, undefined, undefined, undefined, undefined, error));
      }

      return;
    }

    if (parseResult === undefined) {
      onError(pathToArray(path), inputValue, new GraphQLError(`Expected type "${type.name}".`));
    }

    return parseResult;
  } // Not reachable. All possible input types have been considered.


  invariant(false, 'Unexpected input type: ' + inspect(type));
}