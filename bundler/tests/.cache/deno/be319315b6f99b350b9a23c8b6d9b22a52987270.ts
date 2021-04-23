// Loaded from https://deno.land/x/validasaur/src/rules/is_number.ts


import type { Validity } from "../types.ts";
import { invalid } from "../utils.ts";

export function isNumber(value: any): Validity {
  if (typeof value !== "number") {
    return invalid("isNumber", { value });
  }
}
