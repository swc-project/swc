// Loaded from https://deno.land/x/validasaur/src/rules/required.ts


import type { Validity } from "../types.ts";
import { invalid, isOptionalValue } from "../utils.ts";

export function required(value: any): Validity {
  return isOptionalValue(value)
    ? invalid("required", { value }, true)
    : undefined;
}
