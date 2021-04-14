// Loaded from https://deno.land/x/validasaur/src/utils.ts


import type { Rule, MessageFunction, Validity } from "./types.ts";
import type {
  InvalidParams,
  InvalidPayload,
  ValidationErrors,
  FirstMessages,
  FlattenMessages,
  RawValidationResult,
  ValidationOptions,
  ValidationMessages,
  InputData,
  ValidationUtils,
  OptionalValidity,
} from "./interfaces.ts";
import { required } from "./rules/required.ts";
import { nullable } from "./rules/nullable.ts";

export function invalid(
  rule: string,
  params: InvalidParams = {},
  implicit = false,
): InvalidPayload {
  return { rule, params, implicit };
}

export function optionallyValid(
  noContext: boolean,
  rule: string = "",
  params: InvalidParams = {},
  implicit: boolean = false,
): OptionalValidity {
  return { noContext, rule, params, implicit };
}

export function isNullable(rules: Rule[]): boolean {
  return rules.find((rule: Rule) => rule === nullable) ? true : false;
}

export function isOptional(rules: Rule[]): boolean {
  return rules.find((rule: Rule) => rule === required) ? false : true;
}

export function isOptionalValue(value: any): boolean {
  return value === undefined || value === null || value === "";
}

export function firstMessages(messages: ValidationErrors): FirstMessages {
  const results: FirstMessages = {};

  for (let key in messages) {
    const ruleNames = Object.keys(messages[key]);
    const firstRule = ruleNames[0];
    const firstMessage = messages[key][firstRule];

    if (
      (firstRule === "validateObject" || firstRule === "validateArray") &&
      typeof firstMessage !== "string"
    ) {
      results[key] = firstMessages(firstMessage as ValidationErrors);
    } else {
      results[key] = firstMessage;
    }
  }

  return results;
}

export function flattenMessages(
  messages: ValidationErrors,
  firstMessagesOnly: boolean = false,
): FlattenMessages {
  const flatten = (data: any, prefix: string = ""): FlattenMessages => {
    if (typeof data !== "object") {
      return {};
    }

    let results: FlattenMessages = {};
    for (let key in data) {
      const d = data[key];
      const resKey = `${prefix ? prefix + "." : ""}${key}`.replace(
        /\.validate(Array|Object)/g,
        "",
      );
      if (typeof d === "object" && d !== null) {
        results = { ...results, ...flatten(d, resKey) };
      } else {
        results[resKey] = d;
      }
    }
    return results;
  };

  const results: FlattenMessages = {
    ...(firstMessagesOnly ? {} : flatten(messages)),
    ...flatten(firstMessages(messages)),
  };

  return results;
}

export const resolveErrorMessage = (
  msg: string | MessageFunction,
  params: InvalidParams,
  attr: string,
  checkType?: string,
): string => {
  params.attr = attr;

  if (typeof msg === "function") {
    return msg(params, checkType || "");
  } else {
    for (let key in params) {
      msg = msg.replace(`:${key}`, params[key] as string);
    }

    return msg;
  }
};

export const getCheckType = (rule: string): string => {
  const split = rule.split(":");
  split.shift();

  return split.join(":");
};

export const findBestMessage = (
  messages: ValidationMessages,
  key: string,
  ruleName: string,
  ruleKey: string,
  defaultMessage: string | MessageFunction,
): string | MessageFunction => {
  return (
    messages[`${key}.${ruleName}`] ||
    messages[`${key}.${ruleKey}`] ||
    messages[key] ||
    messages[ruleName] ||
    messages[ruleKey] ||
    defaultMessage
  );
};

export const resolveErrorMessages = (
  rawErrors: RawValidationResult,
  { messages, attributes }: ValidationOptions,
): ValidationErrors => {
  const errorMessages: ValidationErrors = {};
  const defaultMessage = (messages || {})["default"] || ":attr is invalid";
  for (let key in rawErrors) {
    const errs = rawErrors[key] as InvalidPayload[];
    const attr = (attributes || {})[key] || key;

    errorMessages[key] = {} as { [k: string]: string };

    for (let err of errs) {
      const checkType = getCheckType(err.rule);

      // Remove checkType from err.rule
      const ruleKey = checkType
        ? err.rule.substr(0, err.rule.length - checkType.length - 1)
        : err.rule;

      if (err.rule === "validateObject" && err.params.errors) {
        errorMessages[key][ruleKey] = resolveErrorMessages(err.params.errors, {
          messages,
          attributes,
        });
      } else if (err.rule === "validateArray" && err.params.errors) {
        errorMessages[key][ruleKey] = resolveErrorMessages(err.params.errors, {
          messages,
          attributes,
        });
      } else {
        const msg = findBestMessage(
          messages || {},
          key,
          err.rule,
          ruleKey,
          defaultMessage,
        );
        errorMessages[key][ruleKey] = resolveErrorMessage(
          msg,
          err.params,
          attr,
          checkType,
        );
      }
    }
  }
  return errorMessages;
};

export const isStringInt = (value: string): boolean => {
  return value.match(/^\d+$/) ? true : false;
};

export const getValue = (input: InputData, key: string): any => {
  if (typeof input[key] !== "undefined") {
    return input[key];
  }

  const paths = key.split(".");
  const value = paths.reduce(
    (data: any, path: string): any => {
      if (data && typeof data === "object") {
        return data[path];
      } else if (data instanceof Array && isStringInt(path)) {
        const index = parseInt(path);
        return data[index];
      }
    },
    { ...input },
  );

  return value;
};

export const hasValue = (input: InputData, key: string): boolean => {
  const value = getValue(input, key);
  return typeof value !== "undefined";
};

export const makeValidationUtils = (input: InputData): ValidationUtils => {
  return {
    getValue: (key: string): any => getValue(input, key),
    hasValue: (key: string): boolean => hasValue(input, key),
  };
};

export const clearTimes = (date: Date): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );
};

export const dateChecks = (
  value: any,
  ruleName: string,
  customParams?: InvalidParams,
  fnValidator?: (date: Date) => boolean,
): Validity => {
  if (typeof value !== "string" && value instanceof Date === false) {
    return invalid(`${ruleName}:typeCheck`, { ...customParams, value });
  }

  if (typeof value === "string" && value.length < 10) {
    return invalid(`${ruleName}:lengthCheck`, { ...customParams, value });
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return invalid(`${ruleName}:dateCheck`, { ...customParams, value });
  }

  if (fnValidator && fnValidator(date) === false) {
    return invalid(`${ruleName}`, { ...customParams, value });
  }
};
