// Loaded from https://deno.land/x/validasaur/src/validate.ts


import type { ValidationResult, Rule, Validity } from "./types.ts";
import type {
  ValidationRules,
  ValidationOptions,
  RawValidationResult,
  InputData,
  InvalidPayload,
  ValidationUtils,
  OptionalValidity,
} from "./interfaces.ts";
import {
  isOptional,
  isOptionalValue,
  resolveErrorMessages,
  isNullable,
  makeValidationUtils,
} from "./utils.ts";
import { defaultMessages } from "./messages.ts";

const getValue = (input: InputData, key: string): any => {
  return input[key];
};

const optionallyRequired = new Set([
  "requiredWhenRule",
  "requiredIfRule",
  "requiredUnlessRule",
]);

export const validateValue = async (
  value: any,
  rules: Rule[],
  utils: ValidationUtils,
): Promise<InvalidPayload[]> => {
  const results = [];
  if (isOptionalValue(value) && isOptional(rules)) {
    const optionallyRequiredRules = rules.filter((r) =>
      optionallyRequired.has(r.name)
    );
    if (optionallyRequiredRules.length === 0) {
      return [];
    }
    for (let rule of rules.filter((r) => optionallyRequired.has(r.name))) {
      let res = rule(value, utils);
      if (res instanceof Promise) {
        res = await res;
      }
      if (res !== undefined && (res as OptionalValidity).noContext) {
        return [];
      }
      if (res !== undefined) {
        results.push(res);
        if (res.implicit) {
          return results;
        }
      }
    }
    rules = rules.filter((r) => !optionallyRequired.has(r.name));
  }

  if (typeof value === "object" && value === null && isNullable(rules)) {
    return [];
  }

  for (let rule of rules) {
    let res = rule(value, utils);
    if (res instanceof Promise) {
      res = await res;
    }

    if (res !== undefined && !(res as OptionalValidity).noContext) {
      results.push(res);
      if (res.implicit === true) {
        break;
      }
    }
  }
  return results;
};

export const validateData = async (
  input: InputData,
  rules: ValidationRules,
): Promise<RawValidationResult> => {
  const results: RawValidationResult = {};
  const utils: ValidationUtils = makeValidationUtils(input);
  for (let key in rules) {
    const keyRules = (rules[key] instanceof Array
      ? rules[key]
      : [rules[key]]) as Rule[];
    const value: any = getValue(input, key);
    const errors: InvalidPayload[] = await validateValue(
      value,
      keyRules,
      utils,
    );
    if (errors.length) {
      results[key] = errors;
    }
  }
  return results;
};

export const validate = async (
  input: InputData,
  rules: ValidationRules,
  options: ValidationOptions = {
    messages: defaultMessages,
  },
): Promise<ValidationResult> => {
  const rawErrors = await validateData(input, rules);
  const passes = Object.keys(rawErrors).length === 0;

  const errors = passes ? {} : resolveErrorMessages(rawErrors, options);

  return [passes, errors];
};
