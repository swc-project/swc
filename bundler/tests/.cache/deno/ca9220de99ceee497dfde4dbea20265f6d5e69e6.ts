// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/subscription/subscribe.js


import { SYMBOL_ASYNC_ITERATOR } from '../polyfills/symbols.js';
import inspect from '../jsutils/inspect.js';
import { addPath, pathToArray } from '../jsutils/Path.js';
import { GraphQLError } from '../error/GraphQLError.js';
import { locatedError } from '../error/locatedError.js';
import { assertValidExecutionArguments, buildExecutionContext, buildResolveInfo, collectFields, execute, getFieldDef, resolveFieldValueOrError } from '../execution/execute.js';
import { getOperationRootType } from '../utilities/getOperationRootType.js';
import mapAsyncIterator from './mapAsyncIterator.js';
export function subscribe(argsOrSchema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, subscribeFieldResolver) {
  /* eslint-enable no-redeclare */
  // Extract arguments from object args if provided.
  return arguments.length === 1 ? subscribeImpl(argsOrSchema) : subscribeImpl({
    schema: argsOrSchema,
    document,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    fieldResolver,
    subscribeFieldResolver
  });
}
/**
 * This function checks if the error is a GraphQLError. If it is, report it as
 * an ExecutionResult, containing only errors and no data. Otherwise treat the
 * error as a system-class error and re-throw it.
 */

function reportGraphQLError(error) {
  if (error instanceof GraphQLError) {
    return {
      errors: [error]
    };
  }

  throw error;
}

function subscribeImpl(args) {
  const {
    schema,
    document,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    fieldResolver,
    subscribeFieldResolver
  } = args;
  const sourcePromise = createSourceEventStream(schema, document, rootValue, contextValue, variableValues, operationName, subscribeFieldResolver); // For each payload yielded from a subscription, map it over the normal
  // GraphQL `execute` function, with `payload` as the rootValue.
  // This implements the "MapSourceToResponseEvent" algorithm described in
  // the GraphQL specification. The `execute` function provides the
  // "ExecuteSubscriptionEvent" algorithm, as it is nearly identical to the
  // "ExecuteQuery" algorithm, for which `execute` is also used.

  const mapSourceToResponse = payload => execute({
    schema,
    document,
    rootValue: payload,
    contextValue,
    variableValues,
    operationName,
    fieldResolver
  }); // Resolve the Source Stream, then map every source value to a
  // ExecutionResult value as described above.


  return sourcePromise.then(resultOrStream => // Note: Flow can't refine isAsyncIterable, so explicit casts are used.
  isAsyncIterable(resultOrStream) ? mapAsyncIterator(resultOrStream, mapSourceToResponse, reportGraphQLError) : resultOrStream);
}
/**
 * Implements the "CreateSourceEventStream" algorithm described in the
 * GraphQL specification, resolving the subscription source event stream.
 *
 * Returns a Promise which resolves to either an AsyncIterable (if successful)
 * or an ExecutionResult (error). The promise will be rejected if the schema or
 * other arguments to this function are invalid, or if the resolved event stream
 * is not an async iterable.
 *
 * If the client-provided arguments to this function do not result in a
 * compliant subscription, a GraphQL Response (ExecutionResult) with
 * descriptive errors and no data will be returned.
 *
 * If the the source stream could not be created due to faulty subscription
 * resolver logic or underlying systems, the promise will resolve to a single
 * ExecutionResult containing `errors` and no `data`.
 *
 * If the operation succeeded, the promise resolves to the AsyncIterable for the
 * event stream returned by the resolver.
 *
 * A Source Event Stream represents a sequence of events, each of which triggers
 * a GraphQL execution for that event.
 *
 * This may be useful when hosting the stateful subscription service in a
 * different process or machine than the stateless GraphQL execution engine,
 * or otherwise separating these two steps. For more on this, see the
 * "Supporting Subscriptions at Scale" information in the GraphQL specification.
 */


export function createSourceEventStream(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver) {
  // If arguments are missing or incorrectly typed, this is an internal
  // developer mistake which should throw an early error.
  assertValidExecutionArguments(schema, document, variableValues);

  try {
    // If a valid context cannot be created due to incorrect arguments,
    // this will throw an error.
    const exeContext = buildExecutionContext(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver); // Return early errors if execution context failed.

    if (Array.isArray(exeContext)) {
      return Promise.resolve({
        errors: exeContext
      });
    }

    const type = getOperationRootType(schema, exeContext.operation);
    const fields = collectFields(exeContext, type, exeContext.operation.selectionSet, Object.create(null), Object.create(null));
    const responseNames = Object.keys(fields);
    const responseName = responseNames[0];
    const fieldNodes = fields[responseName];
    const fieldNode = fieldNodes[0];
    const fieldName = fieldNode.name.value;
    const fieldDef = getFieldDef(schema, type, fieldName);

    if (!fieldDef) {
      throw new GraphQLError(`The subscription field "${fieldName}" is not defined.`, fieldNodes);
    } // Call the `subscribe()` resolver or the default resolver to produce an
    // AsyncIterable yielding raw payloads.


    const resolveFn = fieldDef.subscribe ?? exeContext.fieldResolver;
    const path = addPath(undefined, responseName);
    const info = buildResolveInfo(exeContext, fieldDef, fieldNodes, type, path); // resolveFieldValueOrError implements the "ResolveFieldEventStream"
    // algorithm from GraphQL specification. It differs from
    // "ResolveFieldValue" due to providing a different `resolveFn`.

    const result = resolveFieldValueOrError(exeContext, fieldDef, fieldNodes, resolveFn, rootValue, info); // Coerce to Promise for easier error handling and consistent return type.

    return Promise.resolve(result).then(eventStream => {
      // If eventStream is an Error, rethrow a located error.
      if (eventStream instanceof Error) {
        return {
          errors: [locatedError(eventStream, fieldNodes, pathToArray(path))]
        };
      } // Assert field returned an event stream, otherwise yield an error.


      if (isAsyncIterable(eventStream)) {
        // Note: isAsyncIterable above ensures this will be correct.
        return eventStream;
      }

      throw new Error('Subscription field must return Async Iterable. ' + `Received: ${inspect(eventStream)}.`);
    });
  } catch (error) {
    // As with reportGraphQLError above, if the error is a GraphQLError, report
    // it as an ExecutionResult; otherwise treat it as a system-class error and
    // re-throw it.
    return error instanceof GraphQLError ? Promise.resolve({
      errors: [error]
    }) : Promise.reject(error);
  }
}
/**
 * Returns true if the provided object implements the AsyncIterator protocol via
 * either implementing a `Symbol.asyncIterator` or `"@@asyncIterator"` method.
 */

function isAsyncIterable(maybeAsyncIterable) {
  if (maybeAsyncIterable == null || typeof maybeAsyncIterable !== 'object') {
    return false;
  }

  return typeof maybeAsyncIterable[SYMBOL_ASYNC_ITERATOR] === 'function';
}