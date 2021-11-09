// Loaded from https://raw.githubusercontent.com/czabaj/stringify-replacers/main/mod.ts


import { maxDepthReplacer, serializeMapReplacer } from "./replacers.ts";
import { Replacer } from "./types.d.ts";
import { isPlainObject, pipeReplacers } from "./utils.ts";

type ReplacerOptions = {
  /** max level of nested objects to print */
  maxDepth?: number;
  /** enables serialization of ES6 Map */
  supportMap?: boolean;
};

const replacerFromOptions = ({
  maxDepth,
  supportMap,
}: ReplacerOptions) =>
  pipeReplacers(
    [supportMap && serializeMapReplacer, maxDepth && maxDepthReplacer(maxDepth)]
      .filter(
        Boolean,
      ) as Replacer[],
  );

/**
 * JSON.stringify on steroids, second argument could be an object with options to create replacers.
 * E.g. `stringify(obj, { maxDepth: 2 })` to print only items no more than 2 levels deep in input object.
 */
export const stringify = (
  value: Parameters<typeof JSON.stringify>[0],
  replacer?:
    | ReplacerOptions
    | Parameters<typeof JSON.stringify>[1]
    | Replacer,
  space?: Parameters<typeof JSON.stringify>[2],
) =>
  JSON.stringify(
    value,
    isPlainObject(replacer)
      ? replacerFromOptions(replacer as ReplacerOptions)
      : // deno-lint-ignore no-explicit-any
        (replacer as any),
    space,
  );
