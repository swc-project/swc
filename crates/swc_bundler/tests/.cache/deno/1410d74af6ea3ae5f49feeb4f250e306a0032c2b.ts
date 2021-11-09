// Loaded from https://deno.land/x/validasaur/src/messages.ts


import type { ValidationMessages } from "./interfaces.ts";

export const defaultMessages: ValidationMessages = {
  "fileExists:pathCheck": "file :value doesn't exists",
  "fileExists:stringCheck": "file path must be a string",
  isArray: ":attr must be an array",
  isBool: ":attr must be a boolean",
  isEmail: ":attr is not a valid email address",
  isFloat: ":attr must be a float number",
  isIn: ":value is not allowed",
  isInt: ":attr must be an integer",
  isNumber: ":attr must be a number",
  isNumeric: ":attr must be numeric",
  isString: ":attr must be a string",
  lengthBetween:
    ":attr characters length must be between :minLength-:maxLength",
  match: ":attr format is incorrect",
  maxLength: ":attr cannot be higher than :maxValue characters",
  maxNumber: ":attr cannot be higher than :maxValue",
  minLength: ":attr cannot be lower than :minValue characters",
  minNumber: ":attr cannot be lower than :minValue",
  notIn: ":value is not allowed",
  notNull: ":value cannot be null",
  numberBetween: ":value must be between :minValue - :maxValue",
  required: ":attr is required",
  default: ":attr is invalid",
};
