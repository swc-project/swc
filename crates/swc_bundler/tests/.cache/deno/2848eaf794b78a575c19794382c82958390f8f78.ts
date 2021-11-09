// Loaded from https://deno.land/x/validasaur/src/rules/either.ts


import type { Validity, Rule } from "../types.ts";
import type { ValidationUtils } from "../interfaces.ts";
import { invalid } from "../utils.ts";
import { validateValue } from "../validate.ts";

export function either(
  ruleSets: (Rule | Rule[])[],
  errorCode: string = "either",
): Rule {
  return async function eitherRule(
    value: any,
    utils: ValidationUtils,
  ): Promise<Validity> {
    for (const ruleSet of ruleSets) {
      const errs = await validateValue(
        value,
        ruleSet instanceof Array ? ruleSet : [ruleSet],
        utils,
      );

      if (errs.length === 0) {
        return undefined;
      }
    }

    return invalid(errorCode, { value });
  };
}
