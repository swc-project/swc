// Loaded from https://deno.land/x/validasaur/src/rules/date_after_or_equal.ts


import type { Validity, Rule } from "../types.ts";
import { clearTimes, dateChecks } from "../utils.ts";

export function dateAfterOrEqual(date: Date): Rule {
  return function dateAfterOrEqualRule(value: any): Validity {
    return dateChecks(
      value,
      "dateAfterOrEqual",
      { date },
      (input: Date): boolean => {
        return clearTimes(input).getTime() >= clearTimes(date).getTime();
      },
    );
  };
}
