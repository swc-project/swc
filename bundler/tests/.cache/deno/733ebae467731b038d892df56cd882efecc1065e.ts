// Loaded from https://deno.land/x/validasaur/src/rules/is_bool.ts


import type { Validity } from "../types.ts";
import { invalid } from "../utils.ts";

export function isBool(value: any): Validity {
  if (typeof value !== "boolean") {
    return invalid("isBool", { value });
  }
}
