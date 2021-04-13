// Loaded from https://deno.land/x/validasaur/src/rules/not_in.ts


import type { Validity, Rule, PrimitiveTypes } from "../types.ts";
import { invalid } from "../utils.ts";

export function notIn(disallowedValues: PrimitiveTypes[]): Rule {
  return function notInRule(value: any): Validity {
    return disallowedValues.indexOf(value) > -1
      ? invalid("notIn", { value, disallowedValues })
      : undefined;
  };
}
