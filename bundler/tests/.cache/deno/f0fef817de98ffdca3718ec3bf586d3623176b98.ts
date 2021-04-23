// Loaded from https://deno.land/x/validasaur/src/rules/not_null.ts


import type { Validity } from "../types.ts";
import { invalid } from "../utils.ts";

export function notNull(value: any): Validity {
  return value === null ? invalid("notNull", { value }, true) : undefined;
}
