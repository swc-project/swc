// Loaded from https://deno.land/x/validasaur/src/rules/date_before_or_equal.ts


import type { Validity, Rule } from "../types.ts";
import { clearTimes, dateChecks } from "../utils.ts";

export function dateBeforeOrEqual(date: Date): Rule {
  return function dateBeforeOrEqualRule(value: any): Validity {
    return dateChecks(
      value,
      "dateBeforeOrEqual",
      { date },
      (input: Date): boolean => {
        return clearTimes(input).getTime() <= clearTimes(date).getTime();
      },
    );
  };
}
