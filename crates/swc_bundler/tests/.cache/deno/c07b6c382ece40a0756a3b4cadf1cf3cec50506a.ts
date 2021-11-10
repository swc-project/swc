// Loaded from https://deno.land/x/validasaur/src/types.ts


import type {
  ValidationErrors,
  InvalidPayload,
  ValidationUtils,
  InvalidParams,
} from "./interfaces.ts";

export type OptionalValue = null | undefined | "";

export type Validity = InvalidPayload | undefined;

export type Rule = (
  value: any,
  utils: ValidationUtils,
) => Validity | Promise<Validity>;

export type MessageFunction = (
  params: InvalidParams,
  checkType: string,
) => string;

export type ValidationResult = [boolean, ValidationErrors];

export type PrimitiveTypes =
  | null
  | boolean
  | string
  | number
  | undefined
  | Symbol;
