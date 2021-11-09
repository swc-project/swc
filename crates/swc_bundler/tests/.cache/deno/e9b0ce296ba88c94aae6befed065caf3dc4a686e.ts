// Loaded from https://deno.land/x/validasaur/src/rules/number_between.ts


import type { Validity, Rule } from "../types.ts";
import { invalid } from "../utils.ts";

export function numberBetween(minValue: number, maxValue: number): Rule {
  return function maxRule(value: any): Validity {
    if (typeof value !== "number" || value < minValue || value > maxValue) {
      return invalid("numberBetween", { value, maxValue, minValue });
    }
  };
}
