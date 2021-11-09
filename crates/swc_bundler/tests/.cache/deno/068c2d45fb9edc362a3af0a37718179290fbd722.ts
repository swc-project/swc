// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/utilities/assertValidName.js


import devAssert from '../jsutils/devAssert.js';
import { GraphQLError } from '../error/GraphQLError.js';
const NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
/**
 * Upholds the spec rules about naming.
 */

export function assertValidName(name) {
  const error = isValidNameError(name);

  if (error) {
    throw error;
  }

  return name;
}
/**
 * Returns an Error if a name is invalid.
 */

export function isValidNameError(name) {
  devAssert(typeof name === 'string', 'Expected name to be a string.');

  if (name.length > 1 && name[0] === '_' && name[1] === '_') {
    return new GraphQLError(`Name "${name}" must not begin with "__", which is reserved by GraphQL introspection.`);
  }

  if (!NAME_RX.test(name)) {
    return new GraphQLError(`Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "${name}" does not.`);
  }
}