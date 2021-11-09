// Loaded from https://deno.land/x/validasaur/src/rules/is_int.ts


import type { Validity } from "../types.ts";
import { invalid } from "../utils.ts";
import { isNumber } from "./is_number.ts";

export function isInt(value: any): Validity {
  if (typeof value !== "number" || value % 1 !== 0) {
    return invalid("isInt", { value });
  }
}
