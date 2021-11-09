// Loaded from https://deno.land/x/validasaur/src/rules/validate_array.ts


import type { Validity, Rule } from "../types.ts";
import type { RawValidationResult, ValidationUtils } from "../interfaces.ts";
import { invalid, isOptionalValue } from "../utils.ts";
import { required } from "./required.ts";
import { validateValue } from "../validate.ts";

export interface ValidateArrayOptions {
  minLength?: number;
  maxLength?: number;
}

export function validateArray(
  isRequired: boolean,
  rules: Rule[],
  { minLength, maxLength }: ValidateArrayOptions = {
    minLength: 0,
  },
): Rule[] {
  return [
    ...(isRequired ? [required] : []),
    async function ruleArray(
      value: any,
      utils: ValidationUtils,
    ): Promise<Validity> {
      if (isRequired === false && isOptionalValue(value)) {
        return;
      }

      if (!Array.isArray(value)) {
        return invalid("validateArray:arrayCheck", { value }, true);
      }

      if (typeof minLength === "number" && value.length < minLength) {
        return invalid("validateArray:minLengthCheck", {
          value,
          minLength: minLength,
        });
      }

      if (typeof maxLength === "number" && value.length > maxLength) {
        return invalid("validateArray:maxLengthCheck", {
          value,
          maxLength: maxLength,
        });
      }

      const errors: RawValidationResult = {};
      for (let i in value) {
        const errs = await validateValue(value[i], rules, utils);
        if (errs.length) {
          errors[i.toString()] = [...errs];
        }
      }

      if (Object.keys(errors).length > 0) {
        return invalid("validateArray", { value, errors }, true);
      }
    },
  ];
}
