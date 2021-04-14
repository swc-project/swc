// Loaded from https://deno.land/x/validasaur/src/rules/max_number.ts


import type { Validity, Rule } from "../types.ts";
import { invalid } from "../utils.ts";

export function maxNumber(maxValue: number): Rule {
  return function maxRule(value: any): Validity {
    if (typeof value !== "number" || value > maxValue) {
      return invalid("maxNumber", { value, maxValue });
    }
  };
}
