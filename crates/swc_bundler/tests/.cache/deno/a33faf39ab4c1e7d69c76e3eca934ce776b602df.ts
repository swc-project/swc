// Loaded from https://deno.land/x/validasaur/src/rules/is_numeric.ts


import type { Validity } from "../types.ts";
import { invalid } from "../utils.ts";

export function isNumeric(value: any): Validity {
  if (typeof value !== "string" && typeof value !== "number") {
    return invalid("isNumeric", { value });
  }

  if (typeof value === "string" && !(value as string).match(/\d+(\.\d+)?/)) {
    return invalid("isNumeric", { value });
  }
}
