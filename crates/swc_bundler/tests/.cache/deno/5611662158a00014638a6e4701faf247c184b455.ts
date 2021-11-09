// Loaded from https://deno.land/x/validasaur/src/rules/ends_with.ts


import type { Validity, Rule } from "../types.ts";
import { invalid } from "../utils.ts";

export function endsWith(str: string): Rule {
  return function endsWithRule(value: any): Validity {
    if (typeof value !== "string") {
      return invalid("endsWith", { value, str }, false);
    }

    if (value.endsWith(str) === false) {
      return invalid("endsWith", { value, str }, false);
    }
  };
}
