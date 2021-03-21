// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/jsutils/devAssert.js


export default function devAssert(condition, message) {
  const booleanCondition = Boolean(condition);
  /* istanbul ignore else (see transformation done in './resources/inlineInvariant.js') */

  if (!booleanCondition) {
    throw new Error(message);
  }
}