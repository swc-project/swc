// Loaded from https://deno.land/x/validasaur/src/rules/is_date.ts


import type { Validity } from "../types.ts";
import { dateChecks } from "../utils.ts";

export function isDate(value: any): Validity {
  return dateChecks(value, "isDate");
}
