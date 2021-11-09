// Loaded from https://raw.githubusercontent.com/czabaj/stringify-replacers/main/utils.ts


import { Replacer } from "./types.d.ts";

export const { isArray } = Array;

// deno-lint-ignore no-explicit-any
export const isPlainObject = (value: any): value is Record<string, unknown> =>
  value && typeof value === `object` && !isArray(value);

export const pipeSecondArg = (replacers: [Replacer, ...Replacer[]]): Replacer =>
  // deno-lint-ignore no-explicit-any
  function (this: any, k, v) {
    return replacers.reduce(
      (acc, fn) => fn.call(this, k, acc),
      v,
    );
  };

export const pipeReplacers = (replacers: Replacer[]): Replacer | undefined =>
  replacers.length === 0
    ? undefined
    : replacers.length === 1
    ? replacers[0]
    : pipeSecondArg(replacers as [Replacer, ...Replacer[]]);

/**
 * Prints the type of object, must be invoked with Function#call
 * e.g. printType.call([]) // => [object Array]
 */
export const printType = Object.prototype.toString;
