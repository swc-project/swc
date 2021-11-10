// Loaded from https://deno.land/x/validasaur/src/rules/date_between.ts


import type { Validity, Rule } from "../types.ts";
import { clearTimes, dateChecks } from "../utils.ts";

export function dateBetween(minDate: Date, maxDate: Date): Rule {
  return function dateBetweenRule(value: any): Validity {
    return dateChecks(
      value,
      "dateBetween",
      { minDate, maxDate },
      (input: Date): boolean => {
        const inputDateTime = clearTimes(input).getTime();
        const minDateTime = clearTimes(minDate).getTime();
        const maxDateTime = clearTimes(maxDate).getTime();

        return inputDateTime >= minDateTime && inputDateTime <= maxDateTime;
      },
    );
  };
}
