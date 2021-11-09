// Loaded from https://deno.land/x/oak/helpers.ts


// Copyright 2018-2021 the oak authors. All rights reserved. MIT license.

import type { Context } from "./context.ts";
import type { RouterContext } from "./router.ts";

function isRouterContext(value: Context): value is RouterContext {
  return "params" in value;
}

interface GetQueryOptionsBase {
  /** The return value should be a `Map` instead of a record object. */
  asMap?: boolean;

  /** Merge in the context's `.params`.  This only works when a `RouterContext`
   * is passed. */
  mergeParams?: boolean;
}

interface GetQueryOptionsAsMap extends GetQueryOptionsBase {
  /** The return value should be a `Map` instead of a record object. */
  asMap: true;
}

export type GetParamsOptions = GetQueryOptionsBase | GetQueryOptionsAsMap;

/** Given a context, return the `.request.url.searchParams` as a `Map` of keys
 * and values of the params. */
export function getQuery(
  ctx: Context | RouterContext,
  options: GetQueryOptionsAsMap,
): Map<string, string>;
/** Given a context, return the `.request.url.searchParams` as a record object
 * of keys and values of the params. */
export function getQuery(
  ctx: Context | RouterContext,
  options?: GetQueryOptionsBase,
): Record<string, string>;
export function getQuery(
  ctx: Context | RouterContext,
  { mergeParams, asMap }: GetParamsOptions = {},
): Map<string, string> | Record<string, string> {
  const result: Record<string, string> = {};
  if (mergeParams && isRouterContext(ctx)) {
    Object.assign(result, ctx.params);
  }
  for (const [key, value] of ctx.request.url.searchParams) {
    result[key] = value;
  }
  return asMap ? new Map(Object.entries(result)) : result;
}
