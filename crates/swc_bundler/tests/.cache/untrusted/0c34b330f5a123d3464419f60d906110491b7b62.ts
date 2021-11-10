// Loaded from https://raw.githubusercontent.com/czabaj/stringify-replacers/main/replacers.ts


import { Replacer } from "./types.d.ts";
import { printType } from "./utils.ts";

export const identityReplacer: Replacer = (k, v) => v;

/**
 * Prints deep objects only to certain depth
 */
export const maxDepthReplacer = (maxDepth: number): Replacer => {
  if (maxDepth === 0) {
    return identityReplacer;
  }
  if (maxDepth === 1) {
    return (k, v) =>
      k !== `` && v && typeof v === `object` ? printType.call(v) : v;
  }
  const depthTrack = new Map<Record<string, unknown>, number>();
  return function (k, v) {
    const currentDepth = depthTrack.get(this) || 0;
    if (v && typeof v === `object`) {
      if (currentDepth >= maxDepth) {
        return printType.call(v);
      }
      depthTrack.set(v, currentDepth + 1);
    }
    return v;
  };
};

/**
 * Add support to serialize ES6 Map
 */
export const serializeMapReplacer: Replacer = (k, v) =>
  v && v instanceof Map ? Object.fromEntries(v.entries()) : v;
