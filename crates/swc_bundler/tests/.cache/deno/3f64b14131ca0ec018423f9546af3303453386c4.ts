// Loaded from https://deno.land/x/validasaur/src/rules/match.ts


import type { Validity, Rule } from "../types.ts";
import { invalid } from "../utils.ts";

export function match(regex: RegExp, trim: boolean = false): Rule {
  return function matchRule(value: any): Validity {
    if (typeof value !== "string") {
      return invalid("match", { value, regex }, false);
    }

    if (trim) {
      value = value.trim();
    }

    if (!value.match(regex)) {
      return invalid("match", { value, regex }, false);
    }
  };
}
