// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/type/schema.js


import find from '../polyfills/find.js';
import arrayFrom from '../polyfills/arrayFrom.js';
import objectValues from '../polyfills/objectValues.js';
import { SYMBOL_TO_STRING_TAG } from '../polyfills/symbols.js';
import inspect from '../jsutils/inspect.js';
import toObjMap from '../jsutils/toObjMap.js';
import devAssert from '../jsutils/devAssert.js';
import instanceOf from '../jsutils/instanceOf.js';
import isObjectLike from '../jsutils/isObjectLike.js';
import { __Schema } from './introspection.js';
import { GraphQLDirective, isDirective, specifiedDirectives } from './directives.js';
import { isObjectType, isInterfaceType, isUnionType, isInputObjectType, getNamedType } from './definition.js';
/**
 * Test if the given value is a GraphQL schema.
 */

// eslint-disable-next-line no-redeclare
export function isSchema(schema) {
  return instanceOf(schema, GraphQLSchema);
}
export function assertSchema(schema) {
  if (!isSchema(schema)) {
    throw new Error(`Expected ${inspect(schema)} to be a GraphQL schema.`);
  }

  return schema;
}
/**
 * Schema Definition
 *
 * A Schema is created by supplying the root types of each type of operation,
 * query and mutation (optional). A schema definition is then supplied to the
 * validator and executor.
 *
 * Example:
 *
 *     const MyAppSchema = new GraphQLSchema({
 *       query: MyAppQueryRootType,
 *       mutation: MyAppMutationRootType,
 *     })
 *
 * Note: When the schema is constructed, by default only the types that are
 * reachable by traversing the root types are included, other types must be
 * explicitly referenced.
 *
 * Example:
 *
 *     const characterInterface = new GraphQLInterfaceType({
 *       name: 'Character',
 *       ...
 *     });
 *
 *     const humanType = new GraphQLObjectType({
 *       name: 'Human',
 *       interfaces: [characterInterface],
 *       ...
 *     });
 *
 *     const droidType = new GraphQLObjectType({
 *       name: 'Droid',
 *       interfaces: [characterInterface],
 *       ...
 *     });
 *
 *     const schema = new GraphQLSchema({
 *       query: new GraphQLObjectType({
 *         name: 'Query',
 *         fields: {
 *           hero: { type: characterInterface, ... },
 *         }
 *       }),
 *       ...
 *       // Since this schema references only the `Character` interface it's
 *       // necessary to explicitly list the types that implement it if
 *       // you want them to be included in the final schema.
 *       types: [humanType, droidType],
 *     })
 *
 * Note: If an array of `directives` are provided to GraphQLSchema, that will be
 * the exact list of directives represented and allowed. If `directives` is not
 * provided then a default set of the specified directives (e.g. @include and
 * @skip) will be used. If you wish to provide *additional* directives to these
 * specified directives, you must explicitly declare them. Example:
 *
 *     const MyAppSchema = new GraphQLSchema({
 *       ...
 *       directives: specifiedDirectives.concat([ myCustomDirective ]),
 *     })
 *
 */

export class GraphQLSchema {
  // Used as a cache for validateSchema().
  constructor(config) {
    // If this schema was built from a source known to be valid, then it may be
    // marked with assumeValid to avoid an additional type system validation.
    this.__validationErrors = config.assumeValid === true ? [] : undefined; // Check for common mistakes during construction to produce early errors.

    devAssert(isObjectLike(config), 'Must provide configuration object.');
    devAssert(!config.types || Array.isArray(config.types), `"types" must be Array if provided but got: ${inspect(config.types)}.`);
    devAssert(!config.directives || Array.isArray(config.directives), '"directives" must be Array if provided but got: ' + `${inspect(config.directives)}.`);
    this.description = config.description;
    this.extensions = config.extensions && toObjMap(config.extensions);
    this.astNode = config.astNode;
    this.extensionASTNodes = config.extensionASTNodes;
    this._queryType = config.query;
    this._mutationType = config.mutation;
    this._subscriptionType = config.subscription; // Provide specified directives (e.g. @include and @skip) by default.

    this._directives = config.directives ?? specifiedDirectives; // To preserve order of user-provided types, we add first to add them to
    // the set of "collected" types, so `collectReferencedTypes` ignore them.

    const allReferencedTypes = new Set(config.types);

    if (config.types != null) {
      for (const type of config.types) {
        // When we ready to process this type, we remove it from "collected" types
        // and then add it together with all dependent types in the correct position.
        allReferencedTypes.delete(type);
        collectReferencedTypes(type, allReferencedTypes);
      }
    }

    if (this._queryType != null) {
      collectReferencedTypes(this._queryType, allReferencedTypes);
    }

    if (this._mutationType != null) {
      collectReferencedTypes(this._mutationType, allReferencedTypes);
    }

    if (this._subscriptionType != null) {
      collectReferencedTypes(this._subscriptionType, allReferencedTypes);
    }

    for (const directive of this._directives) {
      // Directives are not validated until validateSchema() is called.
      if (isDirective(directive)) {
        for (const arg of directive.args) {
          collectReferencedTypes(arg.type, allReferencedTypes);
        }
      }
    }

    collectReferencedTypes(__Schema, allReferencedTypes); // Storing the resulting map for reference by the schema.

    this._typeMap = Object.create(null);
    this._subTypeMap = Object.create(null); // Keep track of all implementations by interface name.

    this._implementationsMap = Object.create(null);

    for (const namedType of arrayFrom(allReferencedTypes)) {
      if (namedType == null) {
        continue;
      }

      const typeName = namedType.name;
      devAssert(typeName, 'One of the provided types for building the Schema is missing a name.');

      if (this._typeMap[typeName] !== undefined) {
        throw new Error(`Schema must contain uniquely named types but contains multiple types named "${typeName}".`);
      }

      this._typeMap[typeName] = namedType;

      if (isInterfaceType(namedType)) {
        // Store implementations by interface.
        for (const iface of namedType.getInterfaces()) {
          if (isInterfaceType(iface)) {
            let implementations = this._implementationsMap[iface.name];

            if (implementations === undefined) {
              implementations = this._implementationsMap[iface.name] = {
                objects: [],
                interfaces: []
              };
            }

            implementations.interfaces.push(namedType);
          }
        }
      } else if (isObjectType(namedType)) {
        // Store implementations by objects.
        for (const iface of namedType.getInterfaces()) {
          if (isInterfaceType(iface)) {
            let implementations = this._implementationsMap[iface.name];

            if (implementations === undefined) {
              implementations = this._implementationsMap[iface.name] = {
                objects: [],
                interfaces: []
              };
            }

            implementations.objects.push(namedType);
          }
        }
      }
    }
  }

  getQueryType() {
    return this._queryType;
  }

  getMutationType() {
    return this._mutationType;
  }

  getSubscriptionType() {
    return this._subscriptionType;
  }

  getTypeMap() {
    return this._typeMap;
  }

  getType(name) {
    return this.getTypeMap()[name];
  }

  getPossibleTypes(abstractType) {
    return isUnionType(abstractType) ? abstractType.getTypes() : this.getImplementations(abstractType).objects;
  }

  getImplementations(interfaceType) {
    const implementations = this._implementationsMap[interfaceType.name];
    return implementations ?? {
      objects: [],
      interfaces: []
    };
  } // @deprecated: use isSubType instead - will be removed in v16.


  isPossibleType(abstractType, possibleType) {
    return this.isSubType(abstractType, possibleType);
  }

  isSubType(abstractType, maybeSubType) {
    let map = this._subTypeMap[abstractType.name];

    if (map === undefined) {
      map = Object.create(null);

      if (isUnionType(abstractType)) {
        for (const type of abstractType.getTypes()) {
          map[type.name] = true;
        }
      } else {
        const implementations = this.getImplementations(abstractType);

        for (const type of implementations.objects) {
          map[type.name] = true;
        }

        for (const type of implementations.interfaces) {
          map[type.name] = true;
        }
      }

      this._subTypeMap[abstractType.name] = map;
    }

    return map[maybeSubType.name] !== undefined;
  }

  getDirectives() {
    return this._directives;
  }

  getDirective(name) {
    return find(this.getDirectives(), directive => directive.name === name);
  }

  toConfig() {
    return {
      description: this.description,
      query: this.getQueryType(),
      mutation: this.getMutationType(),
      subscription: this.getSubscriptionType(),
      types: objectValues(this.getTypeMap()),
      directives: this.getDirectives().slice(),
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes ?? [],
      assumeValid: this.__validationErrors !== undefined
    };
  } // $FlowFixMe Flow doesn't support computed properties yet


  get [SYMBOL_TO_STRING_TAG]() {
    return 'GraphQLSchema';
  }

}

function collectReferencedTypes(type, typeSet) {
  const namedType = getNamedType(type);

  if (!typeSet.has(namedType)) {
    typeSet.add(namedType);

    if (isUnionType(namedType)) {
      for (const memberType of namedType.getTypes()) {
        collectReferencedTypes(memberType, typeSet);
      }
    } else if (isObjectType(namedType) || isInterfaceType(namedType)) {
      for (const interfaceType of namedType.getInterfaces()) {
        collectReferencedTypes(interfaceType, typeSet);
      }

      for (const field of objectValues(namedType.getFields())) {
        collectReferencedTypes(field.type, typeSet);

        for (const arg of field.args) {
          collectReferencedTypes(arg.type, typeSet);
        }
      }
    } else if (isInputObjectType(namedType)) {
      for (const field of objectValues(namedType.getFields())) {
        collectReferencedTypes(field.type, typeSet);
      }
    }
  }

  return typeSet;
}