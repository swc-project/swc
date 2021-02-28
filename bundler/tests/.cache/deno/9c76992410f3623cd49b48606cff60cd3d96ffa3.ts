// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/type/directives.js


import objectEntries from '../polyfills/objectEntries.js';
import { SYMBOL_TO_STRING_TAG } from '../polyfills/symbols.js';
import inspect from '../jsutils/inspect.js';
import toObjMap from '../jsutils/toObjMap.js';
import devAssert from '../jsutils/devAssert.js';
import instanceOf from '../jsutils/instanceOf.js';
import defineToJSON from '../jsutils/defineToJSON.js';
import isObjectLike from '../jsutils/isObjectLike.js';
import { DirectiveLocation } from '../language/directiveLocation.js';
import { GraphQLString, GraphQLBoolean } from './scalars.js';
import { argsToArgsConfig, GraphQLNonNull } from './definition.js';
/**
 * Test if the given value is a GraphQL directive.
 */

// eslint-disable-next-line no-redeclare
export function isDirective(directive) {
  return instanceOf(directive, GraphQLDirective);
}
export function assertDirective(directive) {
  if (!isDirective(directive)) {
    throw new Error(`Expected ${inspect(directive)} to be a GraphQL directive.`);
  }

  return directive;
}
/**
 * Directives are used by the GraphQL runtime as a way of modifying execution
 * behavior. Type system creators will usually not create these directly.
 */

export class GraphQLDirective {
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.locations = config.locations;
    this.isRepeatable = config.isRepeatable ?? false;
    this.extensions = config.extensions && toObjMap(config.extensions);
    this.astNode = config.astNode;
    devAssert(config.name, 'Directive must be named.');
    devAssert(Array.isArray(config.locations), `@${config.name} locations must be an Array.`);
    const args = config.args ?? {};
    devAssert(isObjectLike(args) && !Array.isArray(args), `@${config.name} args must be an object with argument names as keys.`);
    this.args = objectEntries(args).map(([argName, argConfig]) => ({
      name: argName,
      description: argConfig.description,
      type: argConfig.type,
      defaultValue: argConfig.defaultValue,
      extensions: argConfig.extensions && toObjMap(argConfig.extensions),
      astNode: argConfig.astNode
    }));
  }

  toConfig() {
    return {
      name: this.name,
      description: this.description,
      locations: this.locations,
      args: argsToArgsConfig(this.args),
      isRepeatable: this.isRepeatable,
      extensions: this.extensions,
      astNode: this.astNode
    };
  }

  toString() {
    return '@' + this.name;
  } // $FlowFixMe Flow doesn't support computed properties yet


  get [SYMBOL_TO_STRING_TAG]() {
    return 'GraphQLDirective';
  }

}
defineToJSON(GraphQLDirective);

/**
 * Used to conditionally include fields or fragments.
 */
export const GraphQLIncludeDirective = new GraphQLDirective({
  name: 'include',
  description: 'Directs the executor to include this field or fragment only when the `if` argument is true.',
  locations: [DirectiveLocation.FIELD, DirectiveLocation.FRAGMENT_SPREAD, DirectiveLocation.INLINE_FRAGMENT],
  args: {
    if: {
      type: GraphQLNonNull(GraphQLBoolean),
      description: 'Included when true.'
    }
  }
});
/**
 * Used to conditionally skip (exclude) fields or fragments.
 */

export const GraphQLSkipDirective = new GraphQLDirective({
  name: 'skip',
  description: 'Directs the executor to skip this field or fragment when the `if` argument is true.',
  locations: [DirectiveLocation.FIELD, DirectiveLocation.FRAGMENT_SPREAD, DirectiveLocation.INLINE_FRAGMENT],
  args: {
    if: {
      type: GraphQLNonNull(GraphQLBoolean),
      description: 'Skipped when true.'
    }
  }
});
/**
 * Constant string used for default reason for a deprecation.
 */

export const DEFAULT_DEPRECATION_REASON = 'No longer supported';
/**
 * Used to declare element of a GraphQL schema as deprecated.
 */

export const GraphQLDeprecatedDirective = new GraphQLDirective({
  name: 'deprecated',
  description: 'Marks an element of a GraphQL schema as no longer supported.',
  locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.ENUM_VALUE],
  args: {
    reason: {
      type: GraphQLString,
      description: 'Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).',
      defaultValue: DEFAULT_DEPRECATION_REASON
    }
  }
});
/**
 * The full list of specified directives.
 */

export const specifiedDirectives = Object.freeze([GraphQLIncludeDirective, GraphQLSkipDirective, GraphQLDeprecatedDirective]);
export function isSpecifiedDirective(directive) {
  return specifiedDirectives.some(({
    name
  }) => name === directive.name);
}