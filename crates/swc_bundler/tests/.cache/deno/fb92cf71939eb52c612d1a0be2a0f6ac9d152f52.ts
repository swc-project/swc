// Loaded from https://deno.land/x/validasaur/src/rules/min_number.ts


import type { Validity, Rule } from "../types.ts";
import { invalid } from "../utils.ts";

export function minNumber(minValue: number): Rule {
  return function minRule(value: any): Validity {
    if (typeof value !== "number" || value < minValue) {
      return invalid("minNumber", { value, minValue });
    }
  };
}
