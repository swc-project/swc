// Loaded from https://deno.land/x/validasaur/src/rules/starts_with.ts


import type { Validity, Rule } from "../types.ts";
import { invalid } from "../utils.ts";

export function startsWith(str: string): Rule {
  return function startsWithRule(value: any): Validity {
    if (typeof value !== "string") {
      return invalid("startsWith", { value, str }, false);
    }

    if (value.startsWith(str) === false) {
      return invalid("startsWith", { value, str }, false);
    }
  };
}
