// Loaded from https://deno.land/x/validasaur/src/rules/max_length.ts


import type { Validity, Rule } from "../types.ts";
import { invalid } from "../utils.ts";

export function maxLength(maxValue: number): Rule {
  return function maxLengthRule(value: any): Validity {
    if (typeof value !== "string") {
      return invalid("maxLength", { value, maxValue }, false);
    }

    if (value.length > maxValue) {
      return invalid("maxLength", { value, maxValue }, false);
    }
  };
}
