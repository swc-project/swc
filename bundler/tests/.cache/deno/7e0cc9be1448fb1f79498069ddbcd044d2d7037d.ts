// Loaded from https://deno.land/x/validasaur/src/rules/validate_object.ts


import type { Validity, Rule } from "../types.ts";
import type {
  ValidationRules,
  InputData,
  ValidationUtils,
} from "../interfaces.ts";
import { invalid, isOptionalValue } from "../utils.ts";
import { required } from "./required.ts";
import { validateData } from "../validate.ts";

export function validateObject(
  isRequired: boolean,
  rules: ValidationRules,
): Rule[] {
  return [
    ...(isRequired ? [required] : []),
    async function ruleObject(
      value: any,
      utils: ValidationUtils,
    ): Promise<Validity> {
      if (isRequired === true && isOptionalValue(value)) {
        return;
      }

      // Make sure value is object and not null
      if (typeof value !== "object" || value === null) {
        return invalid("validateObject", { value }, true);
      }

      const errors = await validateData(value as InputData, rules);

      if (Object.keys(errors).length > 0) {
        return invalid("validateObject", { value, errors }, true);
      }
    },
  ];
}
