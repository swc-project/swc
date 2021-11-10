// Loaded from https://deno.land/x/validasaur/src/rules/date_before.ts


import type { Validity, Rule } from "../types.ts";
import { clearTimes, dateChecks } from "../utils.ts";

export function dateBefore(date: Date): Rule {
  return function dateBeforeRule(value: any): Validity {
    return dateChecks(value, "dateBefore", { date }, (input: Date): boolean => {
      return clearTimes(input).getTime() < clearTimes(date).getTime();
    });
  };
}
