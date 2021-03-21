// Loaded from https://deno.land/x/oak@v6.3.1/middleware.ts


// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.

// deno-lint-ignore-file

import type { State } from "./application.ts";
import type { Context } from "./context.ts";

/** Middleware are functions which are chained together to deal with requests. */
export interface Middleware<
  S extends State = Record<string, any>,
  T extends Context = Context<S>,
> {
  (context: T, next: () => Promise<void>): Promise<void> | void;
}

/** Compose multiple middleware functions into a single middleware function. */
export function compose<
  S extends State = Record<string, any>,
  T extends Context = Context<S>,
>(
  middleware: Middleware<S, T>[],
): (context: T, next?: () => Promise<void>) => Promise<void> {
  return function composedMiddleware(
    context: T,
    next?: () => Promise<void>,
  ): Promise<void> {
    let index = -1;

    async function dispatch(i: number): Promise<void> {
      if (i <= index) {
        throw new Error("next() called multiple times.");
      }
      index = i;
      let fn: Middleware<S, T> | undefined = middleware[i];
      if (i === middleware.length) {
        fn = next;
      }
      if (!fn) {
        return;
      }
      await fn(context, dispatch.bind(null, i + 1));
    }

    return dispatch(0);
  };
}
