// Loaded from https://deno.land/x/validasaur/src/rules/required_when.ts


import type { Validity, Rule } from "../types.ts";
import type { ValidationUtils } from "../interfaces.ts";
import { required } from "./required.ts";
import { optionallyValid } from "../utils.ts";

export function requiredWhen(
  callback: (
    fieldValue: any,
    validationUtils: ValidationUtils,
  ) => boolean | Promise<boolean>,
): Rule {
  return async function requiredWhenRule(
    value: any,
    utils: ValidationUtils,
  ): Promise<Validity> {
    const result = callback(value, utils);
    const isRequired = result instanceof Promise ? await result : result;
    if (isRequired) {
      return required(value);
    }
    return optionallyValid(true);
  };
}
