// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/utilities/lexicographicSortSchema.js


import objectValues from '../polyfills/objectValues.js';
import inspect from '../jsutils/inspect.js';
import invariant from '../jsutils/invariant.js';
import keyValMap from '../jsutils/keyValMap.js';
import { GraphQLSchema } from '../type/schema.js';
import { GraphQLDirective } from '../type/directives.js';
import { isIntrospectionType } from '../type/introspection.js';
import { GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType, GraphQLEnumType, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, isListType, isNonNullType, isScalarType, isObjectType, isInterfaceType, isUnionType, isEnumType, isInputObjectType } from '../type/definition.js';
/**
 * Sort GraphQLSchema.
 *
 * This function returns a sorted copy of the given GraphQLSchema.
 */

export function lexicographicSortSchema(schema) {
  const schemaConfig = schema.toConfig();
  const typeMap = keyValMap(sortByName(schemaConfig.types), type => type.name, sortNamedType);
  return new GraphQLSchema({ ...schemaConfig,
    types: objectValues(typeMap),
    directives: sortByName(schemaConfig.directives).map(sortDirective),
    query: replaceMaybeType(schemaConfig.query),
    mutation: replaceMaybeType(schemaConfig.mutation),
    subscription: replaceMaybeType(schemaConfig.subscription)
  });

  function replaceType(type) {
    if (isListType(type)) {
      return new GraphQLList(replaceType(type.ofType));
    } else if (isNonNullType(type)) {
      return new GraphQLNonNull(replaceType(type.ofType));
    }

    return replaceNamedType(type);
  }

  function replaceNamedType(type) {
    return typeMap[type.name];
  }

  function replaceMaybeType(maybeType) {
    return maybeType && replaceNamedType(maybeType);
  }

  function sortDirective(directive) {
    const config = directive.toConfig();
    return new GraphQLDirective({ ...config,
      locations: sortBy(config.locations, x => x),
      args: sortArgs(config.args)
    });
  }

  function sortArgs(args) {
    return sortObjMap(args, arg => ({ ...arg,
      type: replaceType(arg.type)
    }));
  }

  function sortFields(fieldsMap) {
    return sortObjMap(fieldsMap, field => ({ ...field,
      type: replaceType(field.type),
      args: sortArgs(field.args)
    }));
  }

  function sortInputFields(fieldsMap) {
    return sortObjMap(fieldsMap, field => ({ ...field,
      type: replaceType(field.type)
    }));
  }

  function sortTypes(arr) {
    return sortByName(arr).map(replaceNamedType);
  }

  function sortNamedType(type) {
    if (isScalarType(type) || isIntrospectionType(type)) {
      return type;
    }

    if (isObjectType(type)) {
      const config = type.toConfig();
      return new GraphQLObjectType({ ...config,
        interfaces: () => sortTypes(config.interfaces),
        fields: () => sortFields(config.fields)
      });
    }

    if (isInterfaceType(type)) {
      const config = type.toConfig();
      return new GraphQLInterfaceType({ ...config,
        interfaces: () => sortTypes(config.interfaces),
        fields: () => sortFields(config.fields)
      });
    }

    if (isUnionType(type)) {
      const config = type.toConfig();
      return new GraphQLUnionType({ ...config,
        types: () => sortTypes(config.types)
      });
    }

    if (isEnumType(type)) {
      const config = type.toConfig();
      return new GraphQLEnumType({ ...config,
        values: sortObjMap(config.values)
      });
    }

    if (isInputObjectType(type)) {
      const config = type.toConfig();
      return new GraphQLInputObjectType({ ...config,
        fields: () => sortInputFields(config.fields)
      });
    } // Not reachable. All possible types have been considered.


    invariant(false, 'Unexpected type: ' + inspect(type));
  }
}

function sortObjMap(map, sortValueFn) {
  const sortedMap = Object.create(null);
  const sortedKeys = sortBy(Object.keys(map), x => x);

  for (const key of sortedKeys) {
    const value = map[key];
    sortedMap[key] = sortValueFn ? sortValueFn(value) : value;
  }

  return sortedMap;
}

function sortByName(array) {
  return sortBy(array, obj => obj.name);
}

function sortBy(array, mapToKey) {
  return array.slice().sort((obj1, obj2) => {
    const key1 = mapToKey(obj1);
    const key2 = mapToKey(obj2);
    return key1.localeCompare(key2);
  });
}