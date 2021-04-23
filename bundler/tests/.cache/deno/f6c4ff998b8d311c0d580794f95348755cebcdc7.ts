// Loaded from https://deno.land/x/validasaur/src/rules/is_in.ts


import type { Validity, Rule, PrimitiveTypes } from "../types.ts";
import { invalid } from "../utils.ts";

export function isIn(allowedValues: PrimitiveTypes[]): Rule {
  return function isInRule(value: any): Validity {
    if (allowedValues.indexOf(value) < 0) {
      return invalid("isIn", { value, allowedValues });
    }
  };
}
