// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/utilities/buildASTSchema.js


import devAssert from '../jsutils/devAssert.js';
import { Kind } from '../language/kinds.js';
import { parse } from '../language/parser.js';
import { assertValidSDL } from '../validation/validate.js';
import { GraphQLSchema } from '../type/schema.js';
import { GraphQLSkipDirective, GraphQLIncludeDirective, GraphQLDeprecatedDirective } from '../type/directives.js';
import { extendSchemaImpl } from './extendSchema.js';

/**
 * This takes the ast of a schema document produced by the parse function in
 * src/language/parser.js.
 *
 * If no schema definition is provided, then it will look for types named Query
 * and Mutation.
 *
 * Given that AST it constructs a GraphQLSchema. The resulting schema
 * has no resolve methods, so execution will use default resolvers.
 *
 * Accepts options as a second argument:
 *
 *    - commentDescriptions:
 *        Provide true to use preceding comments as the description.
 *
 */
export function buildASTSchema(documentAST, options) {
  devAssert(documentAST != null && documentAST.kind === Kind.DOCUMENT, 'Must provide valid Document AST.');

  if (options?.assumeValid !== true && options?.assumeValidSDL !== true) {
    assertValidSDL(documentAST);
  }

  const config = extendSchemaImpl(emptySchemaConfig, documentAST, options);

  if (config.astNode == null) {
    for (const type of config.types) {
      switch (type.name) {
        // Note: While this could make early assertions to get the correctly
        // typed values below, that would throw immediately while type system
        // validation with validateSchema() will produce more actionable results.
        case 'Query':
          config.query = type;
          break;

        case 'Mutation':
          config.mutation = type;
          break;

        case 'Subscription':
          config.subscription = type;
          break;
      }
    }
  }

  const {
    directives
  } = config; // If specified directives were not explicitly declared, add them.

  if (!directives.some(directive => directive.name === 'skip')) {
    directives.push(GraphQLSkipDirective);
  }

  if (!directives.some(directive => directive.name === 'include')) {
    directives.push(GraphQLIncludeDirective);
  }

  if (!directives.some(directive => directive.name === 'deprecated')) {
    directives.push(GraphQLDeprecatedDirective);
  }

  return new GraphQLSchema(config);
}
const emptySchemaConfig = new GraphQLSchema({
  directives: []
}).toConfig();
/**
 * A helper function to build a GraphQLSchema directly from a source
 * document.
 */

export function buildSchema(source, options) {
  const document = parse(source, {
    noLocation: options?.noLocation,
    allowLegacySDLEmptyFields: options?.allowLegacySDLEmptyFields,
    allowLegacySDLImplementsInterfaces: options?.allowLegacySDLImplementsInterfaces,
    experimentalFragmentVariables: options?.experimentalFragmentVariables
  });
  return buildASTSchema(document, {
    commentDescriptions: options?.commentDescriptions,
    assumeValidSDL: options?.assumeValidSDL,
    assumeValid: options?.assumeValid
  });
}