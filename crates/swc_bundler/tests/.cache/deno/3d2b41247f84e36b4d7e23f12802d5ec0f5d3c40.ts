// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/validate.js


import devAssert from '../jsutils/devAssert.js';
import { GraphQLError } from '../error/GraphQLError.js';
import { visit, visitInParallel } from '../language/visitor.js';
import { assertValidSchema } from '../type/validate.js';
import { TypeInfo, visitWithTypeInfo } from '../utilities/TypeInfo.js';
import { specifiedRules, specifiedSDLRules } from './specifiedRules.js';
import { SDLValidationContext, ValidationContext } from './ValidationContext.js';
/**
 * Implements the "Validation" section of the spec.
 *
 * Validation runs synchronously, returning an array of encountered errors, or
 * an empty array if no errors were encountered and the document is valid.
 *
 * A list of specific validation rules may be provided. If not provided, the
 * default list of rules defined by the GraphQL specification will be used.
 *
 * Each validation rules is a function which returns a visitor
 * (see the language/visitor API). Visitor methods are expected to return
 * GraphQLErrors, or Arrays of GraphQLErrors when invalid.
 *
 * Optionally a custom TypeInfo instance may be provided. If not provided, one
 * will be created from the provided schema.
 */

export function validate(schema, documentAST, rules = specifiedRules, typeInfo = new TypeInfo(schema), options = {
  maxErrors: undefined
}) {
  devAssert(documentAST, 'Must provide document.'); // If the schema used for validation is invalid, throw an error.

  assertValidSchema(schema);
  const abortObj = Object.freeze({});
  const errors = [];
  const context = new ValidationContext(schema, documentAST, typeInfo, error => {
    if (options.maxErrors != null && errors.length >= options.maxErrors) {
      errors.push(new GraphQLError('Too many validation errors, error limit reached. Validation aborted.'));
      throw abortObj;
    }

    errors.push(error);
  }); // This uses a specialized visitor which runs multiple visitors in parallel,
  // while maintaining the visitor skip and break API.

  const visitor = visitInParallel(rules.map(rule => rule(context))); // Visit the whole document with each instance of all provided rules.

  try {
    visit(documentAST, visitWithTypeInfo(typeInfo, visitor));
  } catch (e) {
    if (e !== abortObj) {
      throw e;
    }
  }

  return errors;
}
/**
 * @internal
 */

export function validateSDL(documentAST, schemaToExtend, rules = specifiedSDLRules) {
  const errors = [];
  const context = new SDLValidationContext(documentAST, schemaToExtend, error => {
    errors.push(error);
  });
  const visitors = rules.map(rule => rule(context));
  visit(documentAST, visitInParallel(visitors));
  return errors;
}
/**
 * Utility function which asserts a SDL document is valid by throwing an error
 * if it is invalid.
 *
 * @internal
 */

export function assertValidSDL(documentAST) {
  const errors = validateSDL(documentAST);

  if (errors.length !== 0) {
    throw new Error(errors.map(error => error.message).join('\n\n'));
  }
}
/**
 * Utility function which asserts a SDL document is valid by throwing an error
 * if it is invalid.
 *
 * @internal
 */

export function assertValidSDLExtension(documentAST, schema) {
  const errors = validateSDL(documentAST, schema);

  if (errors.length !== 0) {
    throw new Error(errors.map(error => error.message).join('\n\n'));
  }
}