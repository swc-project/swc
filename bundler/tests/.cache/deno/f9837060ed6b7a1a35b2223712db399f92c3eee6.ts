// Loaded from https://deno.land/std@0.93.0/_util/assert.ts


// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

export class DenoStdInternalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DenoStdInternalError";
  }
}

/** Make an assertion, if not `true`, then throw. */
export function assert(expr: unknown, msg = ""): asserts expr {
  if (!expr) {
    throw new DenoStdInternalError(msg);
  }
}
