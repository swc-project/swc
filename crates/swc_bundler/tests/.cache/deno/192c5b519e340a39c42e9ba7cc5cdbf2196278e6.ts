// Loaded from https://deno.land/x/validasaur/src/rules/date_after.ts


import type { Validity, Rule } from "../types.ts";
import { clearTimes, dateChecks } from "../utils.ts";

export function dateAfter(date: Date): Rule {
  return function dateAfterRule(value: any): Validity {
    return dateChecks(value, "dateAfter", { date }, (input: Date): boolean => {
      return clearTimes(input).getTime() > clearTimes(date).getTime();
    });
  };
}
