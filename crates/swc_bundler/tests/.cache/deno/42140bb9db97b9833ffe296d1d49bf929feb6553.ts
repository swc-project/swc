// Loaded from https://deno.land/x/validasaur/src/rules/is_array.ts


import type { Validity } from "../types.ts";
import { invalid } from "../utils.ts";

export function isArray(value: any): Validity {
  if (false === value instanceof Array) {
    return invalid("isArray", { value });
  }
}
