// Loaded from https://deno.land/x/validasaur/src/rules/length_between.ts


import type { Validity, Rule } from "../types.ts";
import { invalid } from "../utils.ts";

export function lengthBetween(minLength: number, maxLength: number): Rule {
  return function lengthBetweenRule(value: any): Validity {
    if (typeof value !== "string") {
      return invalid("lengthBetween", { value, minLength, maxLength }, false);
    }

    if (value.length < minLength || value.length > maxLength) {
      return invalid("lengthBetween", { value, minLength, maxLength }, false);
    }
  };
}
